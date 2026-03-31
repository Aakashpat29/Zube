import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// Add this near the top (after app = express())
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 YouTube Clone Backend is Running!</h1>
    <p>Go to <a href="/api/v1/healthcheck">/api/v1/healthcheck</a></p>
  `);
});

//routes import

import userRouter from "./src/routes/user.routes.js";
import healthcheckRouter from "./src/routes/healthcheck.routes.js";
import tweetRouter from "./src/routes/tweet.routes.js";
import subscriptionRouter from "./src/routes/subscription.routes.js";
import videoRouter from "./src/routes/video.routes.js";
import commentRouter from "./src/routes/comment.routes.js";
import likeRouter from "./src/routes/like.routes.js";
import playlistRouter from "./src/routes/playlist.routes.js";
import dashboardRouter from "./src/routes/dashboard.routes.js";

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// Ignore favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

export default app ;
