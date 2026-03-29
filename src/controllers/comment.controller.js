import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const comments = await Comment.aggregate([

        // 🎯 Match comments
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
                parentComment: null
            }
        },

        // 🔽 Latest first
        {
            $sort: { createdAt: -1 }
        },

        // 📄 Pagination
        {
            $skip: (pageNumber - 1) * limitNumber
        },
        {
            $limit: limitNumber
        },

        // 👤 Owner details
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },

        {
            $addFields: {
                owner: { $first: "$owner" }
            }
        },

        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "parentComment",
                as: "replies"
            }
            },
            {
            $addFields: {
                repliesCount: { $size: "$replies" }
            }
            },
            {
            $project: {
                replies: 0
            }
        },

        // ❤️ JOIN LIKES
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },

        // 🔢 Likes count
        {
            $addFields: {
                likesCount: { $size: "$likes" }
            }
        },

        // 👍 Check if user liked
        {
            $addFields: {
                isLiked: {
                    $in: [
                        new mongoose.Types.ObjectId(req.user._id),
                        {
                            $map: {
                                input: "$likes",
                                as: "like",
                                in: "$$like.likedBy"
                            }
                        }
                    ]
                }
            }
        },

        // 🧹 Clean response
        {
            $project: {
                likes: 0
            }
        }

    ]);

    const totalComments = await Comment.countDocuments({
        video: videoId,
        parentComment: null
    });

    return res.status(200).json(
        new ApiResponse(200, {
            comments,
            pagination: {
                totalComments,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalComments / limitNumber)
            }
        }, "Comments fetched successfully")
    );
});

const addComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params;
    const { content, parentComment } = req.body;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    if (!content || !content.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
        parentComment: parentComment || null // ✅ THIS IS KEY
    });

    const populatedComment = await Comment.findById(comment._id)
        .populate("owner", "username avatar");

    return res.status(201).json(
        new ApiResponse(
            201,
            populatedComment,
            "Comment added successfully"
        )
    );
});

const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    const { content } = req.body;

    if (!content || !content.trim()) {
        throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    comment.content = content;
    await comment.save();

    const updatedComment = await Comment.findById(commentId)
        .populate("owner", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await comment.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
});

const getReplies = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const replies = await Comment.find({
        parentComment: commentId
    }).populate("owner", "username avatar");

    return res.status(200).json(
        new ApiResponse(200, replies, "Replies fetched")
    );
});



export { getVideoComments, addComment, updateComment, deleteComment, getReplies };