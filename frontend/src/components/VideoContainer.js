import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import ShimmerCard from "./ShimmerCard";
import { useSelector } from "react-redux";
import UseFetchAllVideos from "../hooks/useFetchAllVideos";

const VideoContainer = () => {
  UseFetchAllVideos();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { allVideos, categories, fetchCategories } = useSelector(
    (store) => store.videos
  );

  useEffect(() => {
    if (fetchCategories === "") {
      setVideos(allVideos);
      setIsLoading(false);
    } else {
      setVideos(categories);
      setIsLoading(false);
    }
  }, [categories, allVideos, fetchCategories]);

  return (
    <>
      {isLoading ? (
        <ShimmerCard />
      ) : (
        <div
          id="main"
          // className="p-2 grid max-md:grid-cols-1 ml:grid-cols-2 gap-3 sm:grid-cols-3 max-md:p-0 lg:grid-cols-3"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"
        >
          {" "}
          {videos?.map((video) => (
            <Link key={video.id} to={"/watch?v=" + video?.video_id}>
              <VideoCard info={video} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default VideoContainer;
