import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BACKEND_SUBSCRIPTION,
  BACKEND_VIDEO,
  formatViewCount,
} from "../../utils/constants";
import { useSelector } from "react-redux";
import { GoDotFill } from "react-icons/go";
import { timeAgo } from "../../utils/CustomFunctions/TimeCalculation";
import Lottie from "lottie-react";
import bell_icon_white from "../../Icons/Bell-icon-white.json";
import { PiDotsThreeVerticalBold } from "react-icons/pi";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const { user } = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showLoginPop, setShowLoginPop] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [showPop, setShowPop] = useState(false);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const res = await axios.get(
          BACKEND_VIDEO + `/search?query=${query}&userId=${user?._id}`
        );

        if (res.status === 200) {
          setVideos(res?.data?.data);
        }
      } catch (error) {
        console.error("Error while searching video", error);
      }
    };
    if (query) {
      getVideos();
    }
  }, [query]);

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

  return (
    <div id="main" className="px-10 py-2 relative">
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
            <div className="flex my-4">
              <Link to={`/watch?v=${item?.video_id}`}>
                <div className="flex gap-5">
                  <img
                    src={item.thumbnail}
                    className="flex-shrink-0 w-[42%] rounded-md object-cover object-center aspect-video"
                    alt="thumbnail"
                  />
                  <div className="w-[50%] rounded-md text-xs font-medium text-medium_gray">
                    <h1 className="text-white text-lg line-clamp-2">
                      {item.title}
                    </h1>
                    <p className="flex items-center gap-2">
                      {formatViewCount(item.viewsCount)} views{" "}
                      <GoDotFill size={8} /> {timeAgo(item.createdAt)}
                    </p>
                    <Link to={`/${item.userName}`}>
                      <div className="flex gap-2 my-2 items-center">
                        <img
                          src={item.avatar}
                          className="w-8 h-8 object-cover aspect-square object-center rounded-full"
                          alt=""
                        />
                        <h1>{item.channelName}</h1>
                      </div>
                    </Link>
                    <p className="line-clamp-2">{item.description}</p>
                  </div>
                </div>
              </Link>
              <button className="flex-shrink-0 self-start">
                <PiDotsThreeVerticalBold size={20} />
              </button>
            </div>
          )
        )
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchPage;
