import React, { useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import {
  IoEyeOffOutline,
  IoEyeOutline,
  IoImageOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_VIDEO, categories } from "../../utils/constants";

const CreateVideo = () => {
  const [formInput, setFormInput] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    thumbnail: null,
    video: null,
    videoName: "",
    status: true,
  });

  const [preview, setPreview] = useState(null);
  const [disable, setDisable] = useState(false);
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleKeyDownImport = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      const input = e.target.value.trim();
      if (input) {
        // Split input by comma, space, or both
        const newTags = input
          .split(/[\s,]+/) // Split by spaces or commas
          .map((tag) => tag.replace(/^#/, "").trim()) // Remove leading '#' and trim spaces
          .filter((tag) => tag); // Remove empty strings

        // Add new tags to the list, avoiding duplicates
        const uniqueTags = [...new Set([...tags, ...newTags])];
        setTags(uniqueTags);
      }

      setFormInput({ ...formInput, tags: "" }); // Clear the input field
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // if (file) {
    //   const img = new Image();
    //   const imageURL = URL.createObjectURL(file);
    //   img.onload = () => {
    //     const requiredWidth = 1280;
    //     const requiredHeight = 720;
    //     if (img.width === requiredWidth && img.height === requiredHeight) {
    //       setPreview(imageURL);
    //       setFormInput({ ...formInput, thumbnail: file });
    //     } else {
    //       toast.error(`Image must be ${requiredWidth}x${requiredHeight}px`);
    //       setPreview(null);
    //       setFormInput({ ...formInput, thumbnail: null });
    //     }
    //     URL.revokeObjectURL(imageURL);
    //   };
    //   img.onerror = () => {
    //     toast.error("Invalid image file");
    //     URL.revokeObjectURL(imageURL);
    //     setPreview(null);
    //   };
    //   img.src = imageURL;
    //   console.log(img);
    // }
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFormInput({ ...formInput, thumbnail: file });
    }
  };

  const handleVideoFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check if the file size is greater than 100MB (104857600 bytes)
      if (file.size > 104857600) {
        toast.error(
          "The video is too large. Please upload a file less than 100MB."
        );
        return;
      }

      setFormInput((prev) => ({
        ...prev,
        video: file,
        videoName: file.name,
      }));
    }
  };

  const removeVideo = () => {
    setFormInput({ ...formInput, video: null, videoName: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, category, thumbnail, video, status } =
      formInput;

    if (!title || !description || !category || !thumbnail || !video || !tags) {
      toast.error("Please fill all required fields");
      return;
    }

    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
    const totalChunks = Math.ceil(video.size / CHUNK_SIZE);
    const uploadingId = toast.info("Uploading:");
    setDisable(true);
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `${BACKEND_VIDEO}/progress?fileName=${video?.name}`
        );
        const data = await response.json();

        // Update the toast with progress
        toast.update(uploadingId, {
          render: `Uploading: ${data.progress}%`,
          progress: data.progress / 100,
        });
        if (data?.progress === 100) {
          toast.update(uploadingId, {
            render: "Wrapping up... Thanks for your patience!",
            type: "info",
            progress: false,
          });
          clearInterval(interval);
        } else if (data.status === "error") {
          clearInterval(interval);
          toast.update(uploadingId, {
            render: "Upload failed. Please try again",
            type: "error",
            progress: false,
            autoClose: 3000,
            closeOnClick: true,
          });
          setDisable(false);
        }
      } catch (error) {
        clearInterval(interval);
      }
    }, 1000); // Poll every 1 second

    for (let i = 0; i < totalChunks; i++) {
      const chunk = video.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      tags.map((tag) => {
        formData.append("tags", tag);
      });
      formData.append("status", status);
      if (i === 0) {
        formData.append("thumbnail", thumbnail);
      }
      formData.append("chunk", chunk);
      formData.append("chunkIndex", i);
      formData.append("totalChunks", totalChunks);
      formData.append("fileName", video.name);

      try {
        const response = await fetch(BACKEND_VIDEO + "/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });
        const data = await response.json();
        if (data?.success) {
          toast.update(uploadingId, {
            render: data.message,
            type: "success",
            progress: false,
            autoClose: 3000,
            closeOnClick: true,
          });
          setDisable(false);
          clearInterval(interval);
          navigate("/");
        }
      } catch (error) {
        console.error("error while uploading video", error);
        toast.update(uploadingId, {
          render: "video uploading failed please try again.",
          type: "error",
          progress: false,
          autoClose: 3000,
          closeOnClick: true,
        });
        clearInterval(interval);
        setDisable(false);
      }
    }
  };

  return (
    <div id="main" className="rounded-lg shadow-md px-6 pb-5">
      <h1 className="mb-3 text-2xl font-bold">Create New Video</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Video File</label>
          <div className="relative">
            {formInput.video ? (
              <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
                <div className="flex items-center gap-3">
                  <IoVideocamOutline className="w-5 h-5 text-blue-600" />
                  <span className="text-sm dark:text-blue-600">
                    {formInput.videoName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeVideo}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                <IoVideocamOutline className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">MP4 (max. 100mb)</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoFile}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Video Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formInput.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border dark:bg-black rounded-md outline-none"
            placeholder="Enter your video title"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formInput.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md dark:bg-black outline-none"
            placeholder="Enter your video description"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            value={formInput.category}
            name="category"
            onChange={handleInputChange}
            required
            className="w-full px-3 dark:bg-black py-2 border rounded-md outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {tags &&
                tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-blue-600"
                    >
                      <RxCross2 />
                    </button>
                  </span>
                ))}
            </div>
            <input
              type="text"
              name="tags"
              value={formInput.tags}
              onChange={handleInputChange}
              onKeyDown={handleKeyDownImport}
              placeholder="Add tags (press Enter, Space or comma to add)"
              className="w-full px-3 dark:bg-black py-2 border rounded-md outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail</label>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Thumbnail preview"
                    className="max-h-48 mx-auto rounded object-cover aspect-video"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setFormInput({ ...formInput, thumbnail: null });
                    }}
                    className="absolute top-2 right-2 bg-red-500 p-1 rounded-full hover:bg-red-600"
                  >
                    <RxCross2 />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="flex flex-col items-center gap-2">
                    <IoImageOutline className="w-10 h-10 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Click to upload thumbnail
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Visibility</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={formInput.status === true}
                onChange={() =>
                  setFormInput((prev) => ({ ...prev, status: true }))
                }
                className="w-4 h-4 text-blue-600"
              />
              <IoEyeOutline className="w-5 h-5" />
              <span>Public</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={formInput.status === false}
                onChange={() =>
                  setFormInput((prev) => ({ ...prev, status: false }))
                }
                className="w-4 h-4 text-blue-600"
              />
              <IoEyeOffOutline className="w-5 h-5" />
              <span>Private</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-5">
          <Link to={"/"}>
            <button className="border px-6 py-2 rounded-md hover:bg-[#E3E3E3] dark:hover:bg-icon_black">
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={disable}
            className="bg-red-600 px-6 py-2 rounded-md hover:bg-red-700"
          >
            Create Video
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateVideo;
