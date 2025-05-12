import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  BACKEND_SUBSCRIPTION,
  BACKEND_VIDEO,
  formatDuration,
  formatViewCount,
} from "../../utils/constants";
import { useSelector } from "react-redux";
import { GoDotFill } from "react-icons/go";
import { timeAgo } from "../../utils/CustomFunctions/TimeCalculation";
import Lottie from "lottie-react";
import bell_icon_white from "../../Icons/Bell-icon-white.json";
import { PiDotsThreeVerticalBold } from "react-icons/pi";

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const search_query = searchParams.get("search_query");
  const { user } = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showLoginPop, setShowLoginPop] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [showPop, setShowPop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getVideos = async () => {
      try {
        const res = await axios.get(
          BACKEND_VIDEO + `/search?query=${search_query}&userId=${user?._id}`
        );

        if (res.status === 200) {
          setVideos(res?.data?.data);
        }
      } catch (error) {
        console.error("Error while searching video", error);
      }
    };
    if (search_query) {
      getVideos();
    }
  }, [search_query]);

  const subscriberHandler = async (channelName, subscribed) => {
    if (!user) {
      setShowLoginPop(true);
      setLoginMessage(
        `Want to subscribe to this channel? Sign in to subscribe to this channel.`
      );
      return;
    }
    if (!subscribed) {
      try {
        await axios.get(BACKEND_SUBSCRIPTION + `/subscribe/${channelName}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Error while subscribing channel", error);
      }
      setSubscribed(true);
    } else {
      setShowPop(true);
    }
  };

  const handleNavigate = (e) => {
    if (e.target.closest("a")) return;
    navigate(`/watch?v=${video_id}`);
  };

  return (
    <div id="main" className="lg:px-10 sm:px-5 px-2 lg:py-2 relative">
      {videos?.length > 0 ? (
        videos.map((item) =>
          item.type === "user" ? (
            <div className="flex gap-5 items-center w-full">
              <Link
                to={`/${item.userName}`}
                className="flex flex-shrink-0 items-center w-[90%] gap-5"
              >
                <div className="w-[46%] flex justify-center items-center">
                  <img
                    src={item.avatar}
                    className="flex-shrink-0 rounded-full w-32 h-32 object-cover object-center aspect-square"
                    alt=""
                  />
                </div>
                <div className="w-[50%] space-y-2 text-xs text-medium_gray font-medium">
                  <h1 className="text-lg text-white">{item.channelName}</h1>
                  <div className="flex gap-2 items-center">
                    <h1>{item.userName}</h1>
                    <GoDotFill size={8} />
                    <h1>
                      {formatViewCount(item.subscribersCount)} subscribers
                    </h1>
                  </div>
                  <p className="line-clamp-2">{item.description}</p>
                </div>
              </Link>
              <button
                onClick={subscriberHandler}
                className={`watch-btn subscriber px-3 py-2 ${
                  item?.subscribed
                    ? "dark:bg-dark_bg dark:hover:bg-dark_bg_hover"
                    : "bg-white text-black"
                } flex gap-1 items-center text-sm cursor-pointer rounded-3xl`}
              >
                {item?.subscribed && (
                  <Lottie
                    animationData={bell_icon_white}
                    play={isPlaying}
                    loop={false}
                    className="w-6"
                  />
                )}
                {!item?.subscribed ? "Subscribe" : "Subscribed"}
              </button>
            </div>
          ) : (
            <>
              <div
                onClick={handleNavigate}
                className="flex max-sm:flex-col sm:gap-3 shadow-md rounded-md sm:my-4"
              >
                <div className="relative rounded-md flex-shrink-0 sm:w-[37%]">
                  <img
                    className={`ml:rounded-md sm:h-[13rem] sm:w-full ms:h-[12rem] object-cover aspect-video object-center w-full`}
                    alt="Thumbnails"
                    src={item?.thumbnail}
                  />
                  <p className="absolute text-[0.8rem] font-medium text-white bg-black opacity-80 rounded-md right-2 bottom-2 px-2 py-0.5">
                    {formatDuration(item?.duration)}
                  </p>
                </div>
                <div className="yt-details sm:w-full px-2 max-sm:py-3 flex gap-2 sm:flex-col-reverse sm:justify-end gap-x-3">
                  <Link to={`/${item?.userName}`} className="flex-shrink-0">
                    {item?.avatar ? (
                      <img
                        className="rounded-full sm:h-10 sm:w-10 ms:h-8 ms:w-8 object-cover aspect-square flex-shrink-0 object-center"
                        alt="Avatar"
                        src={item?.avatar}
                      />
                    ) : (
                      <FaCircleUser className="sm:w-12 sm:h-14" />
                    )}
                  </Link>
                  <div className="w-full">
                    <div className="flex gap-5 justify-between w-full">
                      <p className="line-clamp-2 font-semibold max-sm:text-sm ">
                        {item?.title}
                      </p>
                      <p className="three-dots-container ">
                        <PiDotsThreeVerticalBold size={22} />
                      </p>
                    </div>
                    <Link to={`/${item?.userName}`}>
                      <p className="text-darkGray text-sm max-sm:text-xs">
                        {item?.channelName}
                      </p>
                    </Link>
                    <div className="flex gap-1 items-center text-darkGray text-sm max-sm:text-xs">
                      <p>{formatViewCount(item?.viewsCount)} views</p>
                      <GoDotFill size={8} />
                      <p>{timeAgo(item?.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResultPage;
