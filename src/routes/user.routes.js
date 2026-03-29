// import { Router } from "express";
// import { loginUser, registerUser, logoutUser, getCurrentUser,
//      changeCurrentPassword, updateAccountDetails, updateUserAvatar,
//       updateUserCoverImage, getUserChannelProfile, getWatchHistory, clearWatchHistory } from "../controllers/user.controller.js";
// import { upload } from "../middlewares/multer.middleware.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { refreshAccessToken } from "../controllers/user.controller.js";
// import multer from "multer";
// import {uploadVideo, getAllVideos, getVideoById, publishAVideo, updateVideo,
//      deleteVideo,togglePublishStatus} from "../controllers/video.controller.js";

// import {getVideoComments, addComment, updateComment, deleteComment} from "../controllers/comment.controller.js"
// import {toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos} from "../controllers/like.controller.js"
// import {createTweet, getUserTweets, updateTweet, deleteTweet} from "../controllers/tweet.controller.js"
// import {toggleSubscription, getUserChannelSubscribers, getSubscribedChannels} from "../controllers/subscription.controller.js"
// import {createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist,
//     removeVideoFromPlaylist, deletePlaylist, updatePlaylist} from "../controllers/playlist.controller.js"
// import {getChannelStats, getChannelVideos, getDashboardOverview, getChannelAnalytics} from "../controllers/dashboard.controller.js"
// import { healthcheck } from "../controllers/healthcheck.controller.js";

// const router = Router();

// router.route("/register").post(
//     upload.fields(
//         [
//             {name : "avatar", maxCount : 1},
//             {name : "coverImage", maxCount : 1}
//         ]
//     ),
//     registerUser)

// router.route("/login").post(loginUser)

// //secured routes
// router.route("/logout").post(verifyJWT, logoutUser)

// router.route("/refresh-token").post(refreshAccessToken)

// router.route("/change-password").post(verifyJWT, changeCurrentPassword)

// router.route("/current-user").get(verifyJWT, getCurrentUser)
// router.route("/update-account").patch(verifyJWT, updateAccountDetails)
// router.route("/avatar-update").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
// router.route("/coverImage-update").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

// router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
// router.route("/history").get(verifyJWT, getWatchHistory)
// router.route("/clear-history").get(verifyJWT, clearWatchHistory)

// // video controllers route

// router.route("/").get(verifyJWT, getAllVideos)

// router.route("/publish-video").post(verifyJWT, upload.fields([
//         { name: "videoFile", maxCount: 1 },
//         { name: "thumbnail", maxCount: 1 }
//     ]),publishAVideo)

// router.route("/get-Video-By-Id").get(verifyJWT,getVideoById)

// router.route("/update-video").post(verifyJWT,upload.single("thumbnail"), updateVideo )

// router.route("/delete-video").post(verifyJWT, deleteVideo)

// router.route("/toggle-publish-video").post(verifyJWT, togglePublishStatus)

// //comment controllers routes

// router.route("/get-Video-Comments").get(getVideoComments)

// router.route("/add-Comment").post(verifyJWT, addComment)

// router.route("/update-comment").post(verifyJWT, updateComment)

// router.route("/delete-comment").post(verifyJWT, deleteComment)

// //like contorllers route

// router.route("/toggle-Video-Like").post(verifyJWT, toggleVideoLike)
// router.route("/toggle-Comment-Like").post(verifyJWT, toggleCommentLike)
// router.route("/toggle-Tweet-Like").post(verifyJWT, toggleTweetLike)
// router.route("/get-liked-videos").get(verifyJWT, getLikedVideos)

// //tweet controllers route
// router.route("/create-Tweet").post(verifyJWT, createTweet)
// router.route("/update-Tweet").post(verifyJWT, updateTweet)
// router.route("/deleteTweet").post(verifyJWT, deleteTweet)
// router.route("/get-user-tweet").get(verifyJWT, getUserTweets)

// // subscription controllers routes
// router.route("/toggle-Subscription").post(verifyJWT, toggleSubscription)
// router.route("/get-User-Channel-Subscribers").get(verifyJWT, getUserChannelSubscribers)
// router.route("/get-Subscribed-Channels").get(verifyJWT, getSubscribedChannels)

// // playlist Controller routes

// router.route("/create-playlist").post(verifyJWT,createPlaylist)
// router.route("/get-user-playlist").get(verifyJWT,getUserPlaylists)
// router.route("/get-playlist-By-Id").post(verifyJWT,getPlaylistById)
// router.route("/add-video-to-playlisty").post(verifyJWT,addVideoToPlaylist)
// router.route("/remove-video-from-playlist").post(verifyJWT,removeVideoFromPlaylist)
// router.route("/delete-playlist").post(verifyJWT,deletePlaylist)
// router.route("/update-playlist").post(verifyJWT,updatePlaylist)

// // dashboard controller routes

// router.route("/get-channel-stats").get(verifyJWT, getChannelStats)
// router.route("/get-channel-video").get(verifyJWT, getChannelVideos)
// router.route("/get-dashboard-overview").get(verifyJWT, getDashboardOverview)
// router.route("/get-channel-Analytics").get(verifyJWT, getChannelAnalytics)

// //healthcheck controller route

// router.route("/health-check").get(healthcheck);

// export default router;

import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  updateAccountDetails,
  addToWatchHistory,
  clearWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);
router.route("/history/:videoId").post(verifyJWT, addToWatchHistory);
router.route("/history/clear").delete(verifyJWT, clearWatchHistory);

export default router;
