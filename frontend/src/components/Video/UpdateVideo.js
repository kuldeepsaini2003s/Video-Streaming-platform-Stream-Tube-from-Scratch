import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { IoEyeOffOutline, IoEyeOutline, IoImageOutline } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BACKEND_VIDEO,
  categories,  
} from "../../utils/constants";
import axios from "axios";
import useResponseHandler from "../../hooks/UseResponseHandler";

const UpdateVideo = () => {
  const { handleResponse, handleError } = useResponseHandler();
  const { videoId } = useParams();
  const [formInput, setFormInput] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    thumbnail: null,
    videoName: "",
    status: true,
  });
  const [initialData, setInitialData] = useState();
  const [preview, setPreview] = useState(null);
  const [submissionDisable, setSubmissionDisable] = useState(false);
  const [tags, setTags] = useState([]);
  const [initialTags, setInitialTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(BACKEND_VIDEO + `/video/${videoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.status === 200) {
          const videoDetails = res?.data?.data;
          const videoData = {
            title: videoDetails?.title,
            description: videoDetails?.description,
            category: videoDetails?.category,
            thumbnail: videoDetails?.thumbnail,
            videoName: videoDetails?.videoName,
            status: videoDetails?.published,
          };
          setTags(videoDetails?.tags);
          setInitialTags(videoDetails?.tags);
          setPreview(videoData?.thumbnail);
          setFormInput(videoData);
          setInitialData(videoData);
        }
      } catch (error) {
        console.error("Error while getting video details", error);
      }
    };
    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  const handleKeyDownImport = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (tag) {
        const newTag = tag.replace(/^#/, "");
        if (!tags.includes(newTag)) {
          setTags([...tags, `#${newTag}`]);
        }
      }
      setFormInput({ ...formInput, tags: "" });
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
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFormInput({ ...formInput, thumbnail: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, category, thumbnail, status } = formInput;

    if (!title) {
      toast.error("Please enter a title");
      setSubmissionDisable(true);
      return;
    }
    if (!description) {
      toast.error("Please enter a description");
      setSubmissionDisable(true);
      return;
    }
    if (!category) {
      toast.error("Please enter a category");
      setSubmissionDisable(true);
      return;
    }
    if (!thumbnail) {
      toast.error("Please upload a thumbnail");
      setSubmissionDisable(true);
      return;
    }
    if (!tags) {
      toast.error("Please enter tags");
      setSubmissionDisable(true);
      return;
    }

    if (formInput !== initialData || tags !== initialTags) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("thumbnail", thumbnail);
      tags.map((tag) => {
        formData.append("tags", tag);
      });
      formData.append("status", status);

      const toastId = toast.loading("Updating video...");

      try {
        const response = await fetch(
          BACKEND_VIDEO + `/updateVideo/${videoId}`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        handleResponse({
          status: response.status,
          message: data?.message,
          toastId,
          onSuccess: () => {
            navigate(-1);
            setSubmissionDisable(false);
          },
        });
      } catch (error) {
        console.error("Error while creating video", error);
        handleError({ error, toastId, message: "Error while updating video" });
        setSubmissionDisable(false);
      }
    }
  };

  return (
    <div id="main" className="rounded-lg shadow-md px-6 pb-5">
      <h1 className="mb-3 text-2xl font-bold">Update Video</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={submissionDisable}
            className="bg-red-600 px-6 py-2 rounded-md hover:bg-red-700"
          >
            Update Video
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateVideo;
