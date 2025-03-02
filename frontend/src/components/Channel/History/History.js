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
      console.error("Error while fetch watch history", error);
      setWatchHistory([]);
    }
  };

  useEffect(() => {
    fetchWatchHistory();
  }, []);

  const removeFromHistory = async (videoId) => {
    const toastId = toast.loading("Removing video. Please wait...");
    try {
      const res = await axios.get(
        BACKEND_VIDEO + `/removeHistory/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
      console.error("Error while removing video from history", error);
      handleError({ error, toastId, message: "Error while removing video" });
    }
  };

  return (
    <div className="px-20 py-5" id="main">
      {user ? (
        <>
          <h1 className="font-semibold text-2xl">Watch History</h1>
          <div className="mt-5 space-y-5">
            {watchHistory?.length > 0 ? (
              watchHistory.map((item) => (
                <div className="flex gap-4 items-start">
                  <Link to={`/watch?v=${item?.video_id}`}>
                    <div className="flex-shrink-0 rounded-md relative">
                      <img
                        className="w-[30rem] h-40 rounded-md object-cover aspect-video object-center flex-shrink-0"
                        src={item?.thumbnail}
                        alt="thumbnail"
                      />
                      <p className="absolute text-[0.8rem] font-medium bg-black opacity-80 rounded-md right-2 bottom-2 px-2 py-0.5">
                        {formatDuration(item?.duration)}
                      </p>
                    </div>
                  </Link>
                  <div className="space-y-2 w-full ">
                    <div>
                      <Link to={`/watch?v=${item?.video_id}`}>
                        <h1 className="line-clamp-2 text-xl font-semibold">
                          {item?.title}
                        </h1>
                      </Link>
                      <div className="flex items-end text-xs mt-1 text-Lightblack font-medium">
                        <Link to={`/watch?v=${item?.video_id}`}>
                          {item?.channelName}
                        </Link>
                        <Dot width={12} height={12} strokeWidth={2} />
                        <p>{formatViewCount(item?.viewsCount)}</p>
                      </div>
                    </div>
                    <p className="line-clamp-4 text-sm leading-5">
                      {item?.description}
                    </p>
                  </div>
                  <button onClick={() => removeFromHistory(item?.video_id)}>
                    <X
                      size={50}
                      strokeWidth={1}
                      className="flex-shrink-0 bg-hover_icon_black cursor-pointer p-2 rounded-full"
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
            <button className="flex gap-2 items-center border mt-5 border-icon_black font-medium rounded-full text-sm px-3 py-1">
              <CircleUserRound size={25} strokeWidth={1} /> Sign in
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default History;
