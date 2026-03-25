import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    // 🔹 Total videos
    const totalVideos = await Video.countDocuments({ owner: userId });

    // 🔹 Total views
    const viewsData = await Video.aggregate([
        { $match: { owner: userId } },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ]);

    const totalViews = viewsData[0]?.totalViews || 0;

    // 🔹 Total subscribers
    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    });

    // 🔹 Total likes (on user's videos)
    const likesData = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video"
            }
        },
        { $unwind: "$video" },
        {
            $match: {
                "video.owner": userId
            }
        },
        {
            $count: "totalLikes"
        }
    ]);

    const totalLikes = likesData[0]?.totalLikes || 0;

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalViews,
            totalSubscribers,
            totalLikes
        }, "Channel stats fetched")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const videos = await Video.find({
        owner: req.user._id
    })
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

    const totalVideos = await Video.countDocuments({
        owner: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            pagination: {
                totalVideos,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalVideos / limitNumber)
            }
        }, "Channel videos fetched")
    );
});

const getDashboardOverview = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const [totalVideos, totalSubscribers] = await Promise.all([
        Video.countDocuments({ owner: userId }),
        Subscription.countDocuments({ channel: userId })
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalSubscribers
        }, "Dashboard overview fetched")
    );
});

const getChannelAnalytics = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const analytics = await Video.aggregate([

        {
            $match: {
                owner: userId
            }
        },

        {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$createdAt" },
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                },
                totalViews: { $sum: "$views" },
                totalVideos: { $sum: 1 }
            }
        },

        {
            $sort: {
                "_id.year": -1,
                "_id.month": -1,
                "_id.day": -1
            }
        },

        {
            $limit: 7
        }

    ]);

    return res.status(200).json(
        new ApiResponse(200, analytics, "Channel analytics fetched")
    );
});

export{getChannelStats, getChannelVideos, getDashboardOverview, getChannelAnalytics}