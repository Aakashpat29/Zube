// import { Router } from 'express';
// import {
//     getSubscribedChannels,
//     getUserChannelSubscribers,
//     toggleSubscription,
//     getChannelStats
// } from "../controllers/subscription.controller.js"
// import {verifyJWT} from "../middlewares/auth.middleware.js"

// const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router
//     .route("/c/:channelId")
//     .get(getSubscribedChannels)
//     .post(toggleSubscription)

// router.route("/u/:subscriberId").get(getUserChannelSubscribers);
// router.get("/stats/:channelId", getChannelStats);

// export default router

import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
  getChannelStats,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// ✅ Toggle subscribe/unsubscribe
router.post("/toggle/:channelId", toggleSubscription);

// ✅ Get logged-in user's subscribed channels
router.get("/my", getSubscribedChannels);

// ✅ Get subscribers of a channel
router.get("/channel/:channelId", getUserChannelSubscribers);

// ✅ Channel stats (subs count + isSubscribed)
router.get("/stats/:channelId", getChannelStats);

export default router;
