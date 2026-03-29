import {Subscription} from "../models/subscription.model.js"
import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {

    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    // Prevent self-subscription
    if (channelId === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    // Check if already subscribed
    const existingSub = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    });

    if (existingSub) {
        // Unsubscribe
        await existingSub.deleteOne();

        return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed successfully")
        );
    }

    // Subscribe
    await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Subscribed successfully")
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    const subscribers = await Subscription.find({
        channel: channelId
    })
    .populate("subscriber", "username avatar");

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribers,
            "Subscribers fetched successfully"
        )
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {

    const subscribedChannels = await Subscription.find({
        subscriber: req.user._id
    })
    .populate("channel", "username avatar");

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribedChannels,
            "Subscribed channels fetched successfully"
        )
    );
});

const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    // count subscribers
    const subscribersCount = await Subscription.countDocuments({
        channel: new mongoose.Types.ObjectId(channelId)
    });

    // check if current user subscribed
    const isSubscribed = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, {
            subscribersCount,
            isSubscribed: !!isSubscribed
        }, "Channel stats fetched")
    );
});

export{toggleSubscription, getUserChannelSubscribers, getSubscribedChannels, getChannelStats}