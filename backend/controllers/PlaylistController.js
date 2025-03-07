import mongoose from "mongoose";
import { Playlist } from "../models/playlistModel.js";
import { User } from "../models/userModel.js";
import { Video } from "../models/videoModel.js";

const createPlaylist = async (req, res) => {
  try {
    const { title, status, videoId } = req.body;

    if (!title || !status || !videoId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const video = await Video.findOne({ video_id: videoId });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const existingPlaylist = await Playlist.findOne({
      title,
      owner: user._id,
    });

    if (existingPlaylist) {
      return res.status(201).json({
        success: false,
        message: "Playlist already exist",
      });
    }

    await Playlist.create({
      title,
      video: [video._id],
      status,
      owner: user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Playlist created successfully",
    });
  } catch (error) {
    console.log("Error while creating playlist", error);

    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const addVideo = async (req, res) => {
  try {
    const { selectedItem, videoId } = req.body;

    if (selectedItem.length === 0 || !videoId) {
      return res.status(402).json({
        success: false,
        message: "Please provide selectedItem and videoId",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const video = await Video.findOne({ video_id: videoId });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const playlist = await Playlist.updateMany(
      { _id: { $in: selectedItem } },
      {
        $addToSet: { video: video._id },
      }
    );

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: playlist,
      message: "Video added to playlist successfully",
    });
  } catch (error) {
    console.error("Error while updating all the playlist", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { playlistId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { title, description },
      { new: true }
    );

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    return res.status(200).json({
      success: true,
      data: playlist,
      message: "Playlist updated successfully",
    });
  } catch (error) {
    console.log("Error while updating playlist", error);

    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const userPlaylist = async (req, res) => {
  try {
    const { userName } = req.params;
    const { userId } = req.body;

    const user = await User.findOne({ "publishedDetails.userName": userName });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const matchCondition = {
      owner: user._id,
      ...(userId !== String(user?._id) && { status: "Public" }),
    };

    const playlists = await Playlist.aggregate([
      {
        $match: matchCondition,
      },
      {
        $addFields: {
          reversedVideos: {
            $reverseArray: "$video",
          },
        },
      },
      {
        $addFields: {
          firstVideo: {
            $arrayElemAt: ["$reversedVideos", 0],
          },
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "firstVideo",
          foreignField: "_id",
          as: "videoDetails",
        },
      },
      {
        $addFields: {
          thumbnail: {
            $arrayElemAt: ["$videoDetails.thumbnail", 0],
          },
          video_id: {
            $arrayElemAt: ["$videoDetails.video_id", 0],
          },
        },
      },
      {
        $project: {
          title: 1,
          video: 1,
          status: 1,
          owner: 1,
          thumbnail: 1,
          video_id: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    if (!playlists || playlists.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User does not have any playlists" });
    }

    return res.status(200).json({
      success: true,
      data: playlists,
      message: "User's playlists fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting user playlist", error);

    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};

const playlistById = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(playlistId),
        },
      },
      {
        $addFields: {
          reversedVideos: {
            $reverseArray: "$video",
          },
        },
      },
      {
        $unwind: {
          path: "$reversedVideos",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "reversedVideos",
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
          as: "userDetails",
        },
      },
      {
        $addFields: {
          channelName: {
            $arrayElemAt: ["$userDetails.publishedDetails.channelName", 0],
          },
          thumbnail: "$videoDetails.thumbnail",
          video_id: "$videoDetails.video_id",
          video_title: "$videoDetails.title",
          duration: "$videoDetails.duration",
        },
      },
      {
        $project: {
          title: 1,
          channelName: 1,
          thumbnail: 1,
          video_id: 1,
          video_title: 1,
          duration: 1,
        },
      },
    ]);

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    return res.status(200).json({
      success: true,
      data: playlist,
      message: "Playlist fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting playlist", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const removeVideo = async (req, res) => {
  try {
    const { selectedItem, videoId } = req.body;

    if (selectedItem.length === 0 || !videoId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const video = await Video.findOne({ video_id: videoId });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const playlist = await Playlist.updateMany(
      { _id: { $in: selectedItem } },
      { $pull: { video: video._id } },
      { new: true }
    );

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    return res.status(200).json({
      success: false,
      message: "Video removed from playlist successfully",
    });
  } catch (error) {
    console.log("Error while removing video from playlist", error);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findOneAndDelete({ _id: playlistId });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting playlist", error);

    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export {
  createPlaylist,
  userPlaylist,
  updatePlaylist,
  deletePlaylist,
  playlistById,
  addVideo,
  removeVideo,
};
