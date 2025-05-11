import React, { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { BACKEND_SUBSCRIPTION, BACKEND_USER } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import UseFetchAllVideos from "../../hooks/useFetchAllVideos";
import { GoDotFill } from "react-icons/go";
import Channel_Page_Shimmer from "./Channel_Page_Shimmer";
import { setChannelUser } from "../../utils/Redux/userSlice";
import axios from "axios";
import bell_icon_white from "../../Icons/Bell-icon-white.json";
import Lottie from "lottie-react";

const channelNavigation = [
  {
    name: "Videos",
    path: "videos",
  },
  {
    name: "Playlists",
    path: "playlists",
  },
];

const Channel = () => {
  const { userName } = useParams();
  const location = useLocation();
  if (userName) {
    UseFetchAllVideos(userName && userName);
  }
  const user = useSelector((store) => store.user.user);
  const userVideos = useSelector((store) => store.videos?.allVideos);
  const [channelDetails, setChannelDetails] = useState({});
  const [userVideosCount, setUserVideosCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shimmer, setShimmer] = useState(true);
  const [showLoginPop, setShowLoginPop] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userVideos) {
      setUserVideosCount(userVideos.length);
    }
  }, [userVideos]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(BACKEND_USER + `/channel/${userName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user?._id }),
        });
        const data = await response.json();
        if (response.status === 200) {
          setChannelDetails(data?.data);
          setSubscribed(data?.data?.subscribed);
          setShimmer(false);
          dispatch(setChannelUser(data?.data));
        }
      } catch (error) {
        console.error("error while fetching user channel details", error);
      }
    };
    fetchUserDetails();
  }, [userName]);

  const LoginPop = () => {
    return (
      <div
        onClick={() => setShowLoginPop(false)}
        className="absolute w-dvw h-svh top-0 left-0 remove-scrollbar bg-black/40 flex justify-center items-center"
      >
        <div className="text-medium_gray bg-black flex flex-col justify-between items-center h-36 rounded-md p-5">
          <p>{loginMessage}</p>
          <div className="flex gap-10 items-center justify-between">
            <button
              onClick={() => setShowPop(false)}
              className="px-4 py-1 rounded-full font-medium dark:hover:bg-dark_bg_hover dark:text-white hover:bg-lightGray"
            >
              Cancel
            </button>
            <button
              onClick={() => navigate}
              className="px-4 py-1 rounded-full font-medium text-[#388BD4] hover:bg-[#3ca4ff36]"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  };

  const subscriberHandler = async () => {
    if (!user) {
      setShowLoginPop(true);
      setLoginMessage(
        `Want to subscribe to this channel? Sign in to subscribe to this channel.`
      );
      return;
    }
    if (!subscribed) {
      try {
        await axios.get(
          BACKEND_SUBSCRIPTION + `/subscribe/${channelDetails?.channelName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        console.error("Error while subscribing channel", error);
      }
      setSubscribed(true);
    } else {
      setShowPop(true);
    }
  };

  const handleConfirmation = async () => {
    try {
      await axios.get(
        BACKEND_SUBSCRIPTION + `/unsubscribe/${channelDetails?.channelName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error while subscribing channel", error);
    }
    setSubscribed(false);
  };

  const ConfirmationPop = () => {
    return (
      <div
        onClick={() => setShowPop(false)}
        className="absolute w-dvw h-svh top-0 left-0 remove-scrollbar bg-black/30 flex justify-center items-center"
      >
        <div className="text-medium_gray bg-[#212121] flex flex-col justify-between items-center h-36 rounded-md p-5">
          <p>Unsubscribe from {channelDetails?.channelName}</p>
          <div className="flex gap-4 items-center justify-end">
            <button
              onClick={() => setShowPop(false)}
              className="px-4 py-1 rounded-full font-medium dark:hover:bg-dark_bg_hover dark:text-white hover:bg-lightGray"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmation}
              className="px-4 py-1 rounded-full font-medium text-[#388BD4] hover:bg-[#3ca4ff36]"
            >
              Unsubscribe
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getCurrentTab = () => {
    const currentPath = location.pathname.split("/").pop();
    const activeTab = channelNavigation.find(
      (item) => item.path === currentPath
    );
    return activeTab ? activeTab.name : "Videos";
  };

  const [isActive, setIsActive] = useState(getCurrentTab());

  useEffect(() => {
    setIsActive(getCurrentTab());
  }, [location]);

  return (
    <>
      {shimmer ? (
        <Channel_Page_Shimmer />
      ) : (
        <div id="main" className="p-2 relative">
          <div className="border-b dark:border-gray-700 lg:px-20 sm:px-5">
            {channelDetails?.coverImage && (
              <img
                src={channelDetails?.coverImage}
                className="h-56 max-md:h-28 w-full object-cover aspect-square object-center md:rounded-xl"
                alt=""
              />
            )}
            <div className="flex justify-center gap-5 my-5">
              {channelDetails?.avatar ? (
                <div className="flex-shrink-0">
                  <img
                    src={channelDetails?.avatar}
                    className="w-32 h-32 max-sm:w-14 max-sm:h-14 object-cover aspect-square object-center rounded-full"
                    alt=""
                  />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <FaCircleUser className="sm:w-16 sm:h-20" />
                </div>
              )}
              <div className="flex flex-col flex-grow ms:space-y-1 sm:space-y-1">
                <div className="ms:space-y-1 sm:space-y-2">
                  <h1 className="sm:text-2xl font-bold ">
                    {channelDetails?.channelName || ""}
                  </h1>
                  <div className=" font-semibold sm:text-sm text-xs flex flex-wrap gap-x-2 items-center">
                    <h1>{channelDetails?.userName}</h1>
                    <p className="dark:text-medium_gray flex items-center gap-1">
                      <GoDotFill className="w-2" />{" "}
                      {channelDetails?.subscribersCount} subscribers
                    </p>
                    <p className="dark:text-medium_gray flex items-center gap-1">
                      <GoDotFill className="w-2" /> {userVideosCount} videos
                    </p>
                  </div>
                  <p className="dark:text-medium_gray">
                    {channelDetails?.description}
                  </p>
                </div>
                <div className="flex self-baseline sm:gap-x-5 gap-x-2 ms:text-xs sm:text-sm items-center">
                  {userName === user?.userName ? (
                    <>
                      <Link to={"/customize-channel"}>
                        <button className="flex font-medium items-center gap-2 sm:px-5 px-3 py-2 rounded-full hover:bg-lightGray dark:bg-dark_bg dark:hover:bg-dark_bg_hover">
                          Customize channel
                        </button>
                      </Link>
                      <Link to={"/create-video"}>
                        <button className="flex font-medium items-center gap-2 sm:px-5 px-3 py-2 rounded-full hover:bg-lightGray dark:bg-dark_bg dark:hover:bg-dark_bg_hover">
                          Add Video
                        </button>
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={subscriberHandler}
                      className="watch-btn subscriber px-3 py-2 dark:bg-dark_bg dark:hover:bg-dark_bg_hover flex gap-1 items-center text-sm cursor-pointer rounded-3xl"
                    >
                      {subscribed && (
                        <Lottie
                          animationData={bell_icon_white}
                          play={isPlaying}
                          loop={false}
                          className="w-6"
                        />
                      )}
                      {!subscribed ? "Subscribe" : "Subscribed"}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <nav className="flex overflow-x-scroll remove-scrollbar gap-8 ">
              {channelNavigation.map((item, index) => (
                <Link to={item?.path}>
                  <p
                    key={index}
                    onClick={() => setIsActive(item?.name)}
                    className={`px-4 text-sm font-medium py-2 ${
                      item.name === isActive
                        ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {item?.name}
                  </p>
                </Link>
              ))}
            </nav>
          </div>
          <div className="lg:px-20 sm:px-5 ">
            <Outlet />
          </div>
          {showPop && <ConfirmationPop />}
          {showLoginPop && <LoginPop />}
        </div>
      )}
    </>
  );
};

export default Channel;
