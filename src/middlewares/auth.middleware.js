// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Try to get token from cookie first
    let token = req.cookies?.accessToken;

    // Fallback to Authorization header
    if (!token) {
      const authHeader = req.header("Authorization");
      token = authHeader?.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : authHeader;
    }

    if (!token) {
      throw new ApiError(401, "No access token provided. Please login again.");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verify Error:", error.message);
    throw new ApiError(401, "Invalid access token. Please login again.");
  }
});
