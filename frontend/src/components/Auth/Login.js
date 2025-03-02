import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { BACKEND_USER } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { setUser } from "../../utils/Redux/userSlice";
import useResponseHandler from "../../hooks/UseResponseHandler";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { handleResponse, handleError } = useResponseHandler();
  const [submissionDisable, setSubmissionDisable] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
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
    const toastId = toast.loading("Logging in...");
    try {
      const response = await fetch(BACKEND_USER + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
      handleError({ error, toastId, message: "Error while login" });
    }
  };
  return (
    <div
      id="main"
      className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center ms:text-2xl sm:text-3xl font-extrabold">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px w-full">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full ms:px-2 sm:px-3 ms:py-1.5 sm:py-2 pl-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full ms:px-2 ms:py-1.5 sm:px-3 sm:py-2 pl-10 border border-gray-300 dark:border-gray-700 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleSubmit}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate("/signup")}
            disabled={submissionDisable}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            Don't have an account?{" "}
            <span
              disabled={submissionDisable}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
