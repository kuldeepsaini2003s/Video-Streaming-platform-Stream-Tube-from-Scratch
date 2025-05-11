import React, { useEffect, useRef, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { LuSave } from "react-icons/lu";
import { BsSend } from "react-icons/bs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BACKEND_USER } from "../../utils/constants";
import useResponseHandler from "../../hooks/UseResponseHandler";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../utils/Redux/userSlice";

const CustomizeChannel = () => {
  const user = useSelector((store) => store.user.channelUser);
  const [formInput, setFormInput] = useState({
    username: "",
    channelName: "",
    description: "",
    coverImage:
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80",
    avatar:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80",
    status: "",
  });
  const [currentData, setCurrentData] = useState({});
  const coverImageRef = useRef();
  const avatarImageRef = useRef();
  const [imageFiles, setImageFiles] = useState({
    coverImageFile: null,
    avatarImageFile: null,
  });
  const [submissionDisable, setSubmissionDisable] = useState(false);
  const navigate = useNavigate();
  const { handleResponse, handleError } = useResponseHandler();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const data = {
        username: user?.userName,
        channelName: user?.channelName,
        description: user?.description,
        coverImage:
          user?.coverImage ||
          "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80",
        avatar:
          user?.avatar ||
          "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80",
      };
      setFormInput(data);
      setCurrentData(data);
      setImageFiles({
        coverImageFile: data?.coverImage,
        avatarImageFile: data?.avatar,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file) {
      const url = URL.createObjectURL(file);
      setFormInput({ ...formInput, [name]: url });
      if (name === "coverImage") {
        setImageFiles({ ...imageFiles, coverImageFile: file });
      } else if (name === "avatar") {
        setImageFiles({ ...imageFiles, avatarImageFile: file });
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionDisable(true);
    const { username, channelName, description, status } = formInput;
    const { coverImageFile, avatarImageFile } = imageFiles;
    if (currentData !== formInput) {
      const formData = new FormData();
      formData.append("userName", username);
      formData.append("channelName", channelName);
      formData.append("description", description);
      formData.append("coverImage", coverImageFile);
      formData.append("avatar", avatarImageFile);
      formData.append("status", status);

      const toastId = toast.loading("Updating channel information...");
      try {
        const response = await fetch(BACKEND_USER + "/updateUser", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        handleResponse({
          status: response.status,
          message: data?.message,
          onSuccess: () => {
            navigate("/");
            dispatch(setUser(data?.data));
          },
          toastId,
        });
        setSubmissionDisable(false);
      } catch (error) {
        setSubmissionDisable(false);
        handleError({
          error,
          toastId,
          message: "Error while updating channel information",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} id="main" className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Customize Channel</h1>

      {/* Cover Image Section */}
      <div
        onClick={() => coverImageRef?.current?.click()}
        className="relative h-60 group border rounded-md"
      >
        <img
          src={formInput?.coverImage}
          alt="Channel Cover"
          className="w-full h-full object-cover aspect-square rounded-md"
        />
        <input
          ref={coverImageRef}
          name="coverImage"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
          <button className="bg-white p-3 rounded-full">
            <IoCameraOutline className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="flex items-end -mt-20 ml-8 relative z-10">
        <div
          onClick={() => avatarImageRef?.current?.click()}
          className="relative group"
        >
          <img
            src={formInput?.avatar}
            alt="Channel Avatar"
            className="w-32 h-32 rounded-full border-4 border-white object-cover aspect-square"
          />
          <input
            ref={avatarImageRef}
            name="avatar"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
            <FiUpload className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 mt-8">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formInput?.username}
            onChange={handleChange}
            className="dark:bg-black mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2 border"
            placeholder="@username"
          />
        </div>

        <div>
          <label htmlFor="channelName" className="block text-sm font-medium">
            Channel Name
          </label>
          <input
            type="text"
            id="channelName"
            name="channelName"
            value={formInput?.channelName}
            onChange={handleChange}
            className=" dark:bg-black mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2 border"
            placeholder="Your Channel Name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formInput?.description}
            onChange={handleChange}
            rows={4}
            className="resize-none dark:bg-black mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none p-2 border"
            placeholder="Tell viewers about your channel..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setFormInput({ ...formInput, status: "save" })}
            type="submit"
            disabled={submissionDisable}
            className="inline-flex text-black items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 outline-none"
          >
            <LuSave className="w-4 h-4 mr-2" />
            Save
          </button>
          <button
            onClick={() => setFormInput({ ...formInput, status: "publish" })}
            type="submit"
            disabled={submissionDisable}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 outline-none"
          >
            <BsSend className="w-4 h-4 mr-2" />
            Publish
          </button>
        </div>
      </div>
    </form>
  );
};

export default CustomizeChannel;
