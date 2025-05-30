import React, { useEffect, useState } from "react";
import { CircleUserRound, Dot, X } from "lucide-react";
import axios from "axios";
import {
  BACKEND_VIDEO,
  formatDuration,
  formatViewCount,
} from "../../../utils/constants";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useResponseHandler from "../../../hooks/UseResponseHandler";

const History = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const user = useSelector((store) => store?.user?.user);
  const { handleResponse, handleError } = useResponseHandler();

  const fetchWatchHistory = async () => {
    try {
      const response = await axios.get(BACKEND_VIDEO + "/watchHistory", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setWatchHistory(response?.data?.data);
      }
    } catch (error) {
      handleError({
        error,
        message: "Error while fetching watchHistory video",
      });
      setWatchHistory([]);
    }
  };

  useEffect(() => {
    fetchWatchHistory();
  }, []);

  const removeFromHistory = async (videoId) => {
    const toastId = toast.loading("Removing video. Please wait...");
    try {
      const res = await axios.get(BACKEND_VIDEO + `/removeHistory/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        handleResponse({
          status: res.status,
          message: res?.data?.msg,
          toastId,
          onSuccess: () => {
            fetchWatchHistory();
          },
        });
      }
    } catch (error) {
      handleError({
        error,
        toastId,
        message: "Error while removing video from history",
      });
    }
  };

  return (
    <div className="lg:px-20 sm:px-5 px-2 sm:py-5" id="main">
      {user ? (
        <>
          <h1 className="font-semibold lg:text-2xl">Watch History</h1>
          <div className="sm:mt-5 mt-2 sm:space-y-5 space-y-2">
            {watchHistory?.length > 0 ? (
              watchHistory.map((item) => (
                <div className="flex gap-2 items-start">
                  <Link to={`/watch?v=${item?.video_id}`}>
                    <div className="flex-shrink-0 rounded-md relative">
                      <img
                        className="lg:w-[30rem] lg:h-40 w-72 rounded-md object-cover aspect-video object-center flex-shrink-0"
                        src={item?.thumbnail}
                        alt="thumbnail"
                      />
                      <p className="absolute text-[0.8rem] font-medium bg-medium_gray/80 dark:bg-black/80 rounded-md right-2 bottom-2 px-2 py-0.5">
                        {formatDuration(item?.duration)}
                      </p>
                    </div>
                  </Link>
                  <div className="space-y-2 w-full ">
                    <div>
                      <Link to={`/watch?v=${item?.video_id}`}>
                        <h1 className="line-clamp-2 lg:text-xl sm:text-sm text-xs font-semibold">
                          {item?.title}
                        </h1>
                      </Link>
                      <div className="flex items-end text-xs mt-1 text-darkGray font-medium">
                        <Link to={`/watch?v=${item?.video_id}`}>
                          {item?.channelName}
                        </Link>
                        <Dot width={12} height={12} strokeWidth={2} />
                        <p>{formatViewCount(item?.viewsCount)} views</p>
                      </div>
                    </div>
                    <p className="line-clamp-4 max-lg:hidden lg:text-sm text-xs leading-5">
                      {item?.description}
                    </p>
                  </div>
                  <button onClick={() => removeFromHistory(item?.video_id)}>
                    <X
                      size={50}
                      strokeWidth={1}
                      className="flex-shrink-0 bg-medium_gray bg-dark_bg_hover max-sm:hidden cursor-pointer p-2 rounded-full"
                    />
                  </button>
                </div>
              ))
            ) : (
              <p>No watch history</p>
            )}
          </div>
        </>
      ) : (
        <div id="main" className="flex flex-col items-center pt-40">
          <p>Watch history isn't viewable when signed out.</p>
          <Link to={"/login"}>
            <button className="flex gap-2 items-center border mt-5 border-dark_bg font-medium rounded-full text-sm px-3 py-1">
              <CircleUserRound size={25} strokeWidth={1} /> Sign in
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default History;
