import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/userModel.js";
import { Video } from "../models/videoModel.js";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.js";
import fs from "fs";
import path from "path";

function generateWatchId(length = 11) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let watchId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    watchId += characters[randomIndex];
  }
  return watchId;
}

export const extractPublicId = (url) => {
  const parts = url.split("/");
  const publicIdWithExtension = parts.slice(-2).join("/").split(".")[0];
  return publicIdWithExtension;
};

const uploadProgress = {};

const createVideo = async (req, res) => {
  const {
    chunkIndex,
    totalChunks,
    fileName,
    title,
    description,
    tags,
    status,
    category,
  } = req.body;  

  // console.log(
  //   `Received chunk ${chunkIndex + 1} of ${totalChunks} for file: ${fileName}`
  // );

  if (
    (!chunkIndex && chunkIndex !== 0) ||
    !totalChunks ||
    !fileName ||
    !title ||
    !description ||
    !tags ||
    !status ||
    !category
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Track progress
  if (!uploadProgress[fileName]) {
    uploadProgress[fileName] = {
      progress: 0,
      status: "uploading",
      thumbnailUrl: "",
    };
  }

  let thumbnailUrl;
  if (chunkIndex == 0) {
    try {
      uploadProgress[fileName].progress = 10;
      const onProgress = (progress) => {
        uploadProgress[fileName].progress = Math.min(
          25,
          10 + (progress / 100) * 15
        );
      };
      thumbnailUrl = await uploadOnCloudinary(
        req?.files?.thumbnail[0].path,
        onProgress
      );
      uploadProgress[fileName].progress = 25;
      uploadProgress[fileName].thumbnailUrl = thumbnailUrl.secure_url;
      uploadProgress[fileName].status = "uploading";      
    } catch (err) {
      console.error("Error uploading thumbnail:", err);
      uploadProgress[fileName].status = "error";
      cleanupUploadedFiles(req.files);
      return res
        .status(500)
        .json({ success: false, message: "Thumbnail upload failed" });
    }
  } else {
    thumbnailUrl = uploadProgress[fileName]?.thumbnailUrl;
  }

  // Handle chunk storage
  const tempDir = `temp/${path.parse(fileName).name}_chunks`;
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  try {
    const chunkPath = `${tempDir}/chunk_${chunkIndex}`;
    fs.renameSync(req?.files?.chunk[0]?.path, chunkPath);

    const files = fs.readdirSync(tempDir);
    uploadProgress[fileName].progress =
      25 + Math.round((files.length / totalChunks) * 25); // Max 50%

    if (files.length === Number(totalChunks)) {
      const combinedPath = `temp/${
        path.parse(fileName).name
      }_combined_${Date.now()}${path.extname(fileName)}`;
      const writeStream = fs.createWriteStream(combinedPath);

      for (let i = 0; i < totalChunks; i++) {
        const chunkFile = `${tempDir}/chunk_${i}`;
        const data = fs.readFileSync(chunkFile);
        writeStream.write(data);
        fs.unlinkSync(chunkFile);

        uploadProgress[fileName].progress =
          50 + Math.round(((i + 1) / totalChunks) * 25); // Max 75%
      }

      writeStream.end();

      writeStream.on("finish", async () => {
        try {
          if (!fs.existsSync(combinedPath)) {
            throw new Error("Combined file does not exist");
          }
          fs.rmSync(tempDir, { recursive: true });

          uploadProgress[fileName].progress = 80; // Start video upload
          const videoUrl = await uploadOnCloudinary(
            combinedPath,
            (progress) => {
              uploadProgress[fileName].progress =
                80 + Math.round((progress / 100) * 20); // Max 100%
            }
          );
          uploadProgress[fileName].progress = 100;
          uploadProgress[fileName].status = "completed";

          const videoData = {
            title,
            description,
            category,
            tags,
            video_id: generateWatchId(),
            duration: videoUrl.duration,
            user: user._id,
            published: status,
            thumbnail: uploadProgress[fileName]?.thumbnailUrl,
            videoUrl: videoUrl.secure_url,
          };
          await Video.create(videoData);          
          return res.status(200).json({
            success: true,
            message: "Video created successfully",
            data: videoData,
          });
        } catch (err) {
          console.error("Error uploading video:", err);
          uploadProgress[fileName].status = "error";
          cleanupUploadedFiles(req.files, combinedPath, tempDir);
          return res
            .status(500)
            .json({ success: false, message: "Error uploading video" });
        }
      });

      writeStream.on("error", (err) => {
        console.error("Error writing combined file:", err);
        uploadProgress[fileName].status = "error";
        cleanupUploadedFiles(req.files, combinedPath, tempDir);
        return res
          .status(500)
          .json({ success: false, message: "Error processing file" });
      });
    } else {
      return res.status(200).json({
        progress: uploadProgress[fileName].progress,
      });
    }
  } catch (err) {
    console.error("Error processing chunks:", err);
    uploadProgress[fileName].status = "error";
    cleanupUploadedFiles(req.files);
    return res
      .status(500)
      .json({ success: false, message: "Error processing chunks" });
  }
};

const cleanupUploadedFiles = (
  files,  
  combinedPath = null,
  tempDir = null
) => {
  try {
    if (files?.thumbnail?.[0]?.path && fs.existsSync(files.thumbnail[0].path)) {
      fs.unlinkSync(files.thumbnail[0].path);
    }
    if (files?.chunk?.[0]?.path && fs.existsSync(files.chunk[0].path)) {
      fs.unlinkSync(files.chunk[0].path);
    }
    if (combinedPath && fs.existsSync(combinedPath)) {
      fs.unlinkSync(combinedPath);
    }
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  } catch (err) {
    console.error("Error during cleanup:", err);
  }
};

const getUploadProgress = (req, res) => {
  const { fileName } = req.query;
  if (!fileName) {
    return res.status(400).json({ message: "File name is required" });
  }
  if (uploadProgress[fileName] && uploadProgress[fileName].progress === 100) {
    return res.status(200).json({ status: "completed" });
  } else {
    res.status(200).json(uploadProgress[fileName]);
  }
};

const getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId } = req.body;

    let user = null;
    if (userId) {
      user = await User.findById(userId);
    }

    const video = await Video.aggregate([
      {
        $match: {
          video_id: videoId,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "user",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "playlists",
          let: { videoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$videoId", "$video"] },
              },
            },
          ],
          as: "playlistDetails",
        },
      },
      {
        $addFields: {
          videoSaved: {
            $cond: {
              if: { $gt: [{ $size: "$playlistDetails" }, 0] },
              then: true,
              else: false,
            },
          },
          likesCount: {
            $size: { $ifNull: ["$likes.likeBy", []] },
          },
          subscribersCount: {
            $size: { $ifNull: ["$subscribers", []] },
          },
          channelName: {
            $arrayElemAt: ["$userDetails.publishedDetails.channelName", 0],
          },
          userAvatar: {
            $arrayElemAt: ["$userDetails.publishedDetails.avatar", 0],
          },
          userName: {
            $arrayElemAt: ["$userDetails.publishedDetails.userName", 0],
          },
          viewsCount: {
            $size: { $ifNull: ["$views", []] },
          },
          // Check user-specific fields only if user exists
          ...(user && {
            subscribed: {
              $cond: {
                if: {
                  $in: [user._id, { $ifNull: ["$subscribers.subscriber", []] }],
                },
                then: true,
                else: false,
              },
            },
            videoViewed: {
              $cond: [
                {
                  $in: [user._id, { $ifNull: ["$views", []] }],
                },
                true,
                false,
              ],
            },
            isLiked: {
              $cond: [
                {
                  $in: [user._id, { $ifNull: ["$likes.likeBy", []] }],
                },
                true,
                false,
              ],
            },
            isDisliked: {
              $cond: [
                {
                  $in: [user._id, { $ifNull: ["$likes.dislikeBy", []] }],
                },
                true,
                false,
              ],
            },
          }),
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          tags: 1,
          video_id: 1,
          duration: 1,
          user: 1,
          videoUrl: 1,
          viewsCount: 1,
          channelName: 1,
          userName: 1,
          userAvatar: 1,
          subscribersCount: 1,
          likesCount: 1,
          videoSaved: 1,
          createdAt: 1,
          updatedAt: 1,
          ...(user && {
            subscribed: 1,
            videoViewed: 1,
            isLiked: 1,
            isDisliked: 1,
          }),
        },
      },
    ]);

    if (!video || video.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: video[0],
      message: "Video fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting video by id", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateVideo = async (req, res) => {
  const { title, description, category, tags, status } = req.body;

  if (!title || !description || !category || !tags || !status) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const { id } = req.params;
    const video = await Video.findOne({ video_id: id });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const { thumbnail } = req.body;

    if (thumbnail !== video.thumbnail) {
      const public_id = extractPublicId(video.thumbnail);
      await cloudinary.uploader.destroy(public_id);
      const thumbnailUrl = await uploadOnCloudinary(req.file.thumbnail.path);
      video.thumbnail = thumbnailUrl.secure_url;
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
    video.tags = tags || video.tags;
    video.published = status || video.published;

    await video.save({ validateBeforeSave: false }, { new: true });

    return res.status(200).json({
      success: true,
      data: video,
      message: "Video updated successfully",
    });
  } catch (error) {
    console.log("Error while updating video", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllVideo = async (req, res) => {
  try {
    const { userName } = req.body;
    let user;
    let videos;

    if (userName) {
      user = await User.findOne({
        "publishedDetails.userName": userName,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      videos = await Video.find({ user: user._id, published: true })
        .select(
          "title thumbnail views duration likesCount video_id videoUrl category createdAt updatedAt"
        )
        .populate(
          "user",
          "publishedDetails.channelName publishedDetails.avatar publishedDetails.userName"
        );
    } else {
      videos = await Video.find({ published: true })
        .select(
          "title thumbnail views duration likesCount video_id videoUrl category createdAt updatedAt"
        )
        .populate(
          "user",
          "publishedDetails.channelName publishedDetails.avatar publishedDetails.userName"
        );
    }

    if (!videos || videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No videos found",
      });
    }

    const filteredVideos = videos.map((video) => ({
      title: video.title,
      thumbnail: video.thumbnail,
      viewsCount: video?.views?.length || 0,
      duration: video.duration,
      video_id: video.video_id,
      videoUrl: video.videoUrl,
      category: video.category,
      channelName: video.user?.publishedDetails?.channelName || "",
      userName: video.user?.publishedDetails?.userName || "",
      avatar: video.user?.publishedDetails?.avatar || "",
      createdAt: video.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: filteredVideos,
      message: "Videos fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting all video", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateViews = async (req, res) => {
  const { videoId } = req.params;
  try {
    const video = await Video.findOne({ video_id: videoId });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!video.views.includes(user._id)) {
      video.views.push(user._id);
      await video.save();

      return res.status(200).json({
        success: true,
        message: "Views updated successfully",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "You have already viewed this video",
      });
    }
  } catch (error) {
    console.error("Error while updating views", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};
const addVideoToWatched = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findOne({ video_id: videoId });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { watchHistory: video._id },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Video added to watch history successfully",
    });
  } catch (error) {
    console.log("Error while adding video to watched", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const getWatchHistory = async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: req.user._id,
      },
    },
    {
      $unwind: {
        path: "$watchHistory",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $unwind: {
        path: "$videoDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "videoDetails.user",
        foreignField: "_id",
        as: "videoOwner",
      },
    },
    {
      $addFields: {
        title: "$videoDetails.title",
        description: "$videoDetails.description",
        thumbnail: "$videoDetails.thumbnail",
        video_id: "$videoDetails.video_id",
        duration: "$videoDetails.duration",
        viewsCount: { $size: "$videoDetails.views" },
        createdAt: "$videoDetails.createdAt",
        channelName: {
          $arrayElemAt: ["$videoOwner.publishedDetails.channelName", 0],
        },
        avatar: {
          $arrayElemAt: ["$videoOwner.publishedDetails.avatar", 0],
        },
        userName: {
          $arrayElemAt: ["$videoOwner.publishedDetails.userName", 0],
        },
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        thumbnail: 1,
        avatar: 1,
        video_id: 1,
        duration: 1,
        viewsCount: 1,
        createdAt: 1,
        channelName: 1,
        userName: 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    data: user,
    message: "watch history fetched successfully",
  });
};

const removeFromHistory = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findOne({ video_id: videoId });

    if (!video) {
      return res.status(404).json({
        success: false,
        msg: "Video not found",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const watchHistory = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { watchHistory: video._id } },
      { new: true }
    );

    if (!watchHistory) {
      return res.status(400).json({
        success: false,
        msg: "Video not found in watch history",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Video removed from history successfully",
    });
  } catch (error) {
    console.log("Error while removing video from history", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOneAndDelete({ video_id: id });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const thumbnail_public_id = extractPublicId(video.thumbnail);
    await cloudinary.uploader.destroy(thumbnail_public_id);

    const video_public_id = extractPublicId(video.videoUrl);
    await cloudinary.uploader.destroy(video_public_id);

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting video", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const videoById = async (req, res) => {
  try {
    const { videoId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const video = await Video.findOne({ video_id: videoId })
      .select(
        "title thumbnail views duration likesCount description published tags video_id videoUrl category createdAt updatedAt"
      )
      .populate(
        "user",
        "publishedDetails.channelName publishedDetails.avatar publishedDetails.userName"
      );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: video,
      message: "Videos fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting video", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

const videoByCategory = async (req, res) => {
  const { category, videoId, searchQuery } = req.query;

  if (!category) {
    return res.status(400).json({
      success: false,
      msg: "Category is required",
    });
  }

  // Preprocess the search query to remove common stop words
  const stopWords = ["is", "was", "has", "the", "and", "or", "a", "an"];
  const queryWords = searchQuery ? searchQuery.split(" ") : [];
  const filteredQuery = queryWords
    .filter((word) => !stopWords.includes(word.toLowerCase()))
    .join(" ");

  // Build the query object
  const query = {
    category,
    video_id: { $ne: videoId },
    published: true,
  };

  // Add text search to the query if searchQuery is provided
  if (filteredQuery) {
    query.$text = { $search: filteredQuery };
  }

  // Fetch videos based on the query
  const videos = await Video.find(query)
    .select(
      "title thumbnail views duration video_id category createdAt updatedAt"
    )
    .populate("user", "publishedDetails.channelName");

  if (!videos || videos.length === 0) {
    return res.status(404).json({
      success: false,
      msg: "No videos found with this category and search query",
    });
  }

  return res.status(200).json({
    success: true,
    data: videos,
    msg: "Category videos fetched successfully",
  });
};

export {
  createVideo,
  getVideoById,
  getAllVideo,
  updateVideo,
  updateViews,
  addVideoToWatched,
  getUploadProgress,
  deleteVideo,
  videoById,
  getWatchHistory,
  removeFromHistory,
  videoByCategory,
};
