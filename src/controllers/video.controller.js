import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import fs from "fs";
import {ApiError} from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const getAllVideos = asyncHandler(async (req, res) => {

    // Get query params from URL
    const {
        page = 1,          // current page (default 1)
        limit = 10,        // number of videos per page
        query,             // search text
        sortBy = "createdAt", // field to sort
        sortType = "desc", // asc / desc
        userId             // filter by specific user (channel)
    } = req.query;

    // Convert page & limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Build filter object
    const filter = {
        isPublished: true   // only public videos
    };

    // If search query exists (search by title)
    if (query) {
        filter.title = { $regex: query, $options: "i" }; // case-insensitive
    }

    // If userId exists (channel videos)
    if (userId) {
        filter.owner = userId;
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

    // Fetch videos from DB
    const videos = await Video.find(filter)
        .populate("owner", "username avatar fullName") // get channel info
        .sort(sortOptions)
        .skip((pageNumber - 1) * limitNumber) // pagination skip
        .limit(limitNumber);                  // pagination limit

    // Total count (for pagination info)
    const totalVideos = await Video.countDocuments(filter);

    // Send response
    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            pagination: {
                totalVideos,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalVideos / limitNumber)
            }
        }, "Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res)=>{
    const {title, description }= req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if(!videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(400, "Video and thumbnail are required")
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!video?.url || !thumbnail?.url) {
        throw new ApiError(500, "Error uploading files");
    }

    const newVideo = await Video.create({
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        owner: req.user._id,
        isPublished: true
    });

    if (fs.existsSync(thumbnailLocalPath)) {
        fs.unlinkSync(thumbnailLocalPath);
    }
    
    console.log(req.files);
    console.log(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            newVideo,
            "Video published successfully"
        )
    );

})

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "videoId is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (
    !video.isPublished &&
    (!req.user || video.owner.toString() !== req.user._id.toString())
  ) {
    throw new ApiError(403, "This video is private");
  }

  video.views += 1;
  await video.save();

  return res.status(200).json(
    new ApiResponse(200, video, "Video fetched successfully")
  );
});

const updateVideo = asyncHandler(async(req, res)=>{
    const {videoId} = req.pramas

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const {title, description } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    if (title) video.title = title;
    if (description) video.description = description;

    const thumbnailLocalPath = req.file?.path;

    if (thumbnailLocalPath) {

        // Upload new thumbnail
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnail?.url) {
            throw new ApiError(500, "Thumbnail upload failed");
        }

        video.thumbnail = thumbnail.url;

        if (fs.existsSync(thumbnailLocalPath)) {
            fs.unlinkSync(thumbnailLocalPath);
        }
    }

    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!videoId){
        throw new ApiError(404, "Video-ID is required to delete video")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if(!video.owner.toString() === req.user._id.toString()){
        throw new ApiError(403, "Unauthorized to delete this video");
    }

    if (video.videoPublicId) {
        await cloudinary.uploader.destroy(video.videoPublicId, {
            resource_type: "video"
        });
    }

    if (video.thumbnailPublicId) {
        await cloudinary.uploader.destroy(video.thumbnailPublicId);
    }

    await video.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    );

})

const togglePublishStatus = asyncHandler(async (req, res) => {

    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    video.isPublished = !video.isPublished;

    await video.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            `Video is now ${video.isPublished ? "Public" : "Private"}`
        )
    );
});

export {getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo,togglePublishStatus }