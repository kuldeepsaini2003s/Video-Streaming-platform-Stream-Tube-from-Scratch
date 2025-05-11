import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BACKEND_VIDEO,
  formatDuration,
  formatViewCount,
} from "../../utils/constants";
import { timeAgo } from "../../utils/CustomFunctions/TimeCalculation";
import { GoDotFill } from "react-icons/go";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { Link } from "react-router-dom";

const Recommendation = ({ category, videoId }) => {
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  useEffect(() => {
    const fetchRecommendedVideos = async () => {
      try {
        const res = await axios.get(
          BACKEND_VIDEO + `/video?category=${category}&videoId=${videoId}`
        );
        if (res.status === 200) {
          setRecommendedVideos(res?.data?.data);
        }
      } catch (error) {
        console.error("Error while getting recommended videos", error);
      }
    };
    if (category) {
      fetchRecommendedVideos();
    }
  }, [category]);

  return (
    <div className="flex flex-col gap-3 max-sm:px-2">
      {recommendedVideos?.length > 0 && (
        <>
          <h1 className="font-medium text-lg">Related Videos</h1>
          {recommendedVideos.map((item) => (
            <Link to={`/watch?v=${item.video_id}`} key={item._id}>
              <div className="flex gap-2 rounded-md">
                <div className="relative min-w-40 h-24 rounded-md">
                  <img
                    src={item?.thumbnail}
                    className="w-full h-full rounded-md object-cover object-center aspect-square"
                    alt="thumbnail"
                  />
                  <span className="absolute bottom-2 right-1 font-medium text-xs px-1 py-0.5 rounded-md text-white bg-black">
                    {formatDuration(item?.duration)}
                  </span>
                </div>
                <div className="flex gap-2 w-full justify-between">
                  <div className="flex flex-col text-xs dark:text-medium_gray font-medium">
                    <h1 className="line-clamp-2 mb-3 dark:text-white text-sm font-medium leading-tight">
                      {item?.title}
                    </h1>
                    <div>
                      <h1>{item?.user?.publishedDetails.channelName}</h1>
                      <h1 className="flex items-center gap-x-1">
                        {formatViewCount(item?.views.length)} views
                        <GoDotFill size={6} /> {timeAgo(item?.createdAt)}
                      </h1>
                    </div>
                  </div>
                  <PiDotsThreeVerticalBold
                    className="flex-shrink-0"
                    size={20}
                  />
                </div>
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

export default Recommendation;
