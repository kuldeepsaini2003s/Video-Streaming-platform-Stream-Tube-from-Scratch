import { Comment } from "../models/commentModel.js";
import { User } from "../models/userModel.js";
import { Video } from "../models/videoModel.js";

const createComment = async (req, res) => {
  try {
    const { comment, videoId } = req.body;

    if (!comment || !videoId) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User not found",
      });
    }

    const video = await Video.findOne({ video_id: videoId });

    if (!video) {
      return res.status(400).json({
        success: false,
        msg: "Video not found",
      });
    }

    const alreadyCommented = await Comment.findOne({ comment });

    if (alreadyCommented) {
      return res.status(400).json({
        success: false,
        msg: "You have already added a comment to this video",
      });
    }

    const commentData = {
      comment,
      video: video._id,
      owner: user._id,
    };

    await Comment.create(commentData);

    return res.status(200).json({
      success: true,
      msg: "Comment added successfully",
    });
  } catch (error) {
    console.log("Error while creating comment", error);
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
    });
  }
};

const comments = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({
        success: false,
        msg: "video id is required",
      });
    }

    const video = await Video.findOne({ video_id: videoId });

    if (!video) {
      return res.status(404).json({
        success: false,
        msg: "Video not found",
      });
    }

    const comments = await Comment.aggregate([
      {
        $match: {
          video: video._id
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          userName:
            "$userDetails.publishedDetails.channelName",
          avatar:
              "$userDetails.publishedDetails.avatar",
        }
      },
      {
        $group: {
          _id: { video: "$video", owner: "$owner" },
          userName: {
            $first: "$userName"
          },
          avatar: {
            $first: "$avatar"
          },
          comments: {
            $push: {
              comment: "$comment",
              createdAt: "$createdAt"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          video: "$video",
          owner: "$owner",
          userName: 1,
          avatar: 1,
          comments: 1
        }
      }
    ]);    

    if (!comments) {
      return res.status(404).json({
        success: false,
        msg: "No comments found yet.",
      });
    }

    return res.status(200).json({
      success: true,
      data: comments,
      msg: "Comments fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting comments by video id", error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

export { createComment, comments };
