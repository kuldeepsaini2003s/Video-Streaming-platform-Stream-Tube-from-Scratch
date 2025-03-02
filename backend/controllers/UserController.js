import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateAccessAndRefreshToken = (user) => {
  const accessToken = generateToken(user, "10d");
  const refreshToken = generateToken(user, "30d");
  return { accessToken, refreshToken };
};

export const extractPublicId = (url) => {
  const parts = url.split("/");
  const publicIdWithExtension = parts.slice(-2).join("/").split(".")[0];
  return publicIdWithExtension;
};

const handleImageUpload = async (user, file, type) => {
  let updatedImage = user[type];
  if (!file) {
    if (user[type]) {
      const public_id = extractPublicId(user[type]);
      await cloudinary.uploader.destroy(public_id);
    }
    updatedImage = null;
  } else {
    if (user[type]) {
      const public_id = extractPublicId(user[type]);
      await cloudinary.uploader.destroy(public_id);
    }
    updatedImage = await uploadOnCloudinary(file.path);
  }
  return updatedImage.secure_url;
};

const option = {
  httpOnly: true,
  // secure: true,
  path: "/",
};

const registerUser = async (req, res) => {
  const { userName, channelName, email, password } = req.body;

  if (!userName || !channelName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({
      success: false,
      message: "Email is not valid",
    });
  }

  try {
    const existingEmail = await User.findOne({ email });
    const existingUserName = await User.findOne({
      "publishedDetails.userName": userName,
    });
    const existingChannelName = await User.findOne({
      "publishedDetails.channelName": channelName,
    });

    if (existingEmail) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    if (existingUserName) {
      return res.status(409).json({
        success: false,
        message: "User name already exists",
      });
    }
    if (existingChannelName) {
      return res.status(409).json({
        success: false,
        message: "Channel name already exists",
      });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a avatar image" });
    }

    const avatarFile = req.file;

    let avatarURL = "";
    if (avatarFile.path) {
      avatarURL = await uploadOnCloudinary(avatarFile.path);
    }

    const userData = {
      publishedDetails: {
        userName: userName.toLowerCase(),
        channelName,
        avatar: avatarURL.secure_url,
      },
      draftDetails: {
        userName: userName.toLowerCase(),
        channelName,
      },
    };

    const bcryptPassword = await bcrypt.hash(password, 10);    

    const user = await User.create({
      ...userData,
      email,
      password: bcryptPassword,
    });

    if (user) {
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user
      );
      const _user = await User.findByIdAndUpdate(
        user._id,
        {
          refreshToken: refreshToken,
          publishedDetails: {
            ...user.publishedDetails,
            _id: user._id,
          },
        },
        { new: true }
      );

      return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json({
          success: true,
          data: _user.publishedDetails,
          accessToken,
          refreshToken,
          message: "User registered successfully",
        });
    }
  } catch (error) {
    console.error("Error creating user", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found with this email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userData = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json({
        success: true,
        data: userData.publishedDetails,
        accessToken,
        refreshToken,
        message: "User logged in successfully",
      });
  } catch (error) {
    console.log("Error logging in user", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { refreshToken: undefined },
    { new: true }
  );
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json({ success: true, message: "User logged out successfully" });
};

const refreshAccessToken = async (req, res) => {
  try {
    const token =
      req.cookies.refreshToken || req.header("authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized request" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (token !== user.refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "refresh token is not valid" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.log("Error refreshing access token", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid current password" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as old password",
      });
    }

    user.password = bcrypt.hashSync(newPassword, 10);

    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log("Error updating password", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const updateUser = async (req, res) => {
  const { userName, channelName, description, status } = req.body;

  if (!userName || !channelName) {
    return res.status(400).json({
      success: false,
      message: "Please provide user and channel name",
    });
  }

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Please provide status",
    });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const files = req.files;

    if (status === "save") {
      user.draftDetails.userName = userName;
      user.draftDetails.channelName = channelName;
      user.draftDetails.description = description;
      if (files?.avatar) {
        user.draftDetails.avatar = await handleImageUpload(
          user.draftDetails,
          files?.avatar[0],
          "avatar"
        );
      }
      if (files?.coverImage) {
        user.draftDetails.coverImage = await handleImageUpload(
          user.draftDetails,
          files?.coverImage[0],
          "coverImage"
        );
      }
    } else {
      user.publishedDetails.userName = userName;
      user.publishedDetails.channelName = channelName;
      user.publishedDetails.description =
        description || user?.draftDetails?.description;
      if (files?.avatar) {
        user.publishedDetails.avatar = await handleImageUpload(
          user.publishedDetails,
          files?.avatar[0],
          "avatar"
        );
        user.draftDetails.avatar = null;
      } else {
        user.publishedDetails.avatar = user?.draftDetails?.avatar;
      }
      if (files?.coverImage) {
        user.publishedDetails.coverImage = await handleImageUpload(
          user.publishedDetails,
          files?.coverImage[0],
          "coverImage"
        );
      } else {
        user.publishedDetails.coverImage = user?.draftDetails?.coverImage;
      }
    }

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      data: user?.publishedDetails,
      message: "User details updated successfully",
    });
  } catch (error) {
    console.log("Error while updating user details", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const userDetails = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: user.publishedDetails,
    message: "user data fetched successfully",
  });
};

const channelDetails = async (req, res) => {
  const { userName } = req.params;
  const { userId } = req.body;

  if (!userName) {
    return res
      .status(400)
      .json({ success: false, message: "User name is required" });
  }

  const user = await User.aggregate([
    {
      $match: {
        "publishedDetails.userName": userName,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedTo: {
          $size: "$subscribedTo",
        },
        subscribed: {
          $cond: {
            if: {
              $and: [
                { $gt: [{ $type: userId }, "null"] },
                {
                  $in: [
                    new mongoose.Types.ObjectId(userId),
                    "$subscribers.subscriber",
                  ],
                },
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: "$_id",
        userName: "$publishedDetails.userName",
        channelName: "$publishedDetails.channelName",
        description: "$publishedDetails.description",
        avatar: "$publishedDetails.avatar",
        coverImage: "$publishedDetails.coverImage",
        subscribersCount: 1,
        channelsSubscribedTo: 1,
        subscribed: 1,
      },
    },
  ]);

  if (user.length === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: user[0],
    message: "Channel data fetched successfully",
  });
};




export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  userDetails,
  channelDetails,  
  updateUser,
};
