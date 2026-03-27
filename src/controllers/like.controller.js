import {Like} from "../models/like.model.js"
import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    // Check if already liked
    const existingLike = await Like.findOne({
        likedBy: req.user._id,
        video: videoId
    });

    if (existingLike) {
        // Unlike
        await existingLike.deleteOne();

        return res.status(200).json(
            new ApiResponse(200, {}, "Video unliked")
        );
    }

    // Like
    await Like.create({
        likedBy: req.user._id,
        video: videoId
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Video liked")
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    const existingLike = await Like.findOne({
        likedBy: req.user._id,
        comment: commentId
    });

    if (existingLike) {
        await existingLike.deleteOne();

        return res.status(200).json(
            new ApiResponse(200, {}, "Comment unliked")
        );
    }

    await Like.create({
        likedBy: req.user._id,
        comment: commentId
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment liked")
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {

    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "Tweet ID is required");
    }

    const existingLike = await Like.findOne({
        likedBy: req.user._id,
        tweet: tweetId
    });

    if (existingLike) {
        await existingLike.deleteOne();

        return res.status(200).json(
            new ApiResponse(200, {}, "Tweet unliked")
        );
    }

    await Like.create({
        likedBy: req.user._id,
        tweet: tweetId
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Tweet liked")
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {

    const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: { $ne: null }
    })
    .populate({
        path: "video",
        populate: {
            path: "owner",
            select: "username avatar"
        }
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            likedVideos,
            "Liked videos fetched successfully"
        )
    );
});

export {toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos}