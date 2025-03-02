import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { BACKEND_USER } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { setUser } from "../../utils/Redux/userSlice";
import useResponseHandler from "../../hooks/UseResponseHandler";

const SignUp = () => {
  const [formInput, setFormInput] = useState({
    userName: "",
    channelName: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [submissionDisable, setSubmissionDisable] = useState(false);
  const { handleResponse, handleError } = useResponseHandler();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
    if (name === "name") {
      setFormInput({ ...formInput, name: value });
    }
  };

  const handleFile = ({ target: { files } }) => {
    if (files.length > 0 && files[0]) {
      const newImage = URL.createObjectURL(files[0]);
      setFormInput({ ...formInput, avatar: newImage });
      setImageFile(files[0]);
    } else {
      setFormInput({ ...formInput, avatar: "" });
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userName, channelName, email, password } = formInput;
    if (!userName) {
      toast.error("Please enter your user name");
      setSubmissionDisable(true);
      return;
    }
    if (!channelName) {
      toast.error("Please enter your channel name");
      setSubmissionDisable(true);
      return;
    }
    if (!email) {
      toast.error("Please enter your email");
      setSubmissionDisable(true);
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      setSubmissionDisable(true);
      return;
    }
    if (!imageFile) {
      toast.error("Please upload your avatar");
      setSubmissionDisable(true);
      return;
    }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("channelName", channelName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", imageFile);
    const toastId = toast.loading("Signing up...");
    try {
      const response = await fetch(BACKEND_USER + "/register", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      handleResponse({
        status: response.status,
        message: data.message,
        toastId,
        onSuccess: () => {
          localStorage.setItem("token", data?.accessToken);
          localStorage.setItem("refreshToken", data?.refreshToken);
          navigate("/");
          dispatch(setUser(data.data));
          setSubmissionDisable(false);
        },
      });
    } catch (error) {
      handleError({ error, toastId, message: "Error while register" });
    }
  };

  return (
    <div
      id="main"
      className="flex items-center justify-center bg-gray-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              id="userName"
              name="userName"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
              placeholder="@username"
              value={formInput.userName}
              onChange={(e) => {
                let value = e.target.value;
                if (!value.startsWith("@")) {
                  value = "@" + value;
                }
                setFormInput({ ...formInput, userName: value });
              }}
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
            />
            <input
              id="channelName"
              name="channelName"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
              placeholder="Channel Name"
              value={formInput.channelName}
              onChange={handleChange}
            />
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
              placeholder="Email address"
              value={formInput.email}
              onChange={handleChange}
            />
            <input
              id="password"
              name="password"
              type="text"
              autoComplete="new-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
              placeholder="Password"
              value={formInput.password}
              onChange={handleChange}
            />
            <div className="flex justify-between items-center appearance-none rounded-t-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800">
              <input
                name="avatar"
                onChange={handleFile}
                id="avatar"
                className="rounded-md"
                type="file"
              />
              {formInput.avatar && (
                <img
                  className="w-10 h-10 object-cover aspect-square object-center rounded-full"
                  src={formInput.avatar}
                  alt=""
                />
              )}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign up
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate("/login")}
            disabled={submissionDisable}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            Already have an account?{" "}
            <span
              disabled={submissionDisable}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
