import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import WatchPage from "./components/WatchPag/WatchPage";
import React, { useEffect, useState } from "react";
import VideoContainer from "./components/Video/VideoContainer";
import { useDispatch } from "react-redux";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import { BACKEND_USER } from "./utils/constants";
import { setUser } from "./utils/Redux/userSlice";
import CreateVideo from "./components/Video/CreateVideo";
import Channel from "./components/Channel/Channel";
import MainLayout from "./components/Main/MainLayout";
import CustomizeChannel from "./components/Channel/CustomizeChannel";
import {
  UserAllVideo,
  UserPlaylist,
} from "./components/Channel/userChannelCollection";
import UpdateVideo from "./components/Video/UpdateVideo";
import LoginBlocker from "./utils/ProtectionLayout/LoginBlocker";
import Subscriptions from "./components/Channel/Subscriptions";
import History from "./components/Channel/History/History";
import UserChannel from "./components/Channel/UserChannel";
import SearchResultPage from "./components/Main/SearchResultPage";
import MobileSearchPage from "./components/Main/MobileSearchPage";
import useRefreshToken from "./hooks/useRefreshToken";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <LoginBlocker />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/signup",
            element: <SignUp />,
          },
        ],
      },
      {
        path: "/",
        element: <VideoContainer />,
      },
      {
        path: "/create-video",
        element: <CreateVideo />,
      },
      {
        path: "/update-video/:videoId",
        element: <UpdateVideo />,
      },
      {
        path: "/subscriptions",
        element: <Subscriptions />,
      },
      {
        path: "/history",
        element: <History />,
      },
      { path: "/feed/you", element: <UserChannel /> },
      {
        path: "/:userName",
        element: <Channel />,
        children: [
          {
            index: true,
            element: <UserAllVideo />,
          },
          {
            path: "videos",
            element: <UserAllVideo />,
          },
          {
            path: "playlists",
            element: <UserPlaylist />,
          },
        ],
      },
      {
        path: "/customize-channel",
        element: <CustomizeChannel />,
      },
      {
        path: "/watch",
        element: <WatchPage />,
      },
      {
        path: "/results",
        element: <SearchResultPage />,
      },
      {
        path: "/search",
        element: <MobileSearchPage />,
      },
    ],
  },
]);

function App() {
  const userToken = localStorage.getItem("token");
  const { refreshAccessToken } = useRefreshToken();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(BACKEND_USER + "/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
        const data = await response.json();
        if (response.status === 401) {
          refreshAccessToken();
        }
        if (response.status === 200) {
          dispatch(setUser(data.data));
        }
      } catch (error) {
        console.error("error while checking token", error);
      }
    };
    if (userToken) {
      fetchUser();
    }
  }, [userToken]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add("className", savedTheme);
  }, []);

  return (
    <>
      <RouterProvider router={AppRouter} />
    </>
  );
}

export default App;
