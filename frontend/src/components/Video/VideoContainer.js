import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import ShimmerCard from "../Main/ShimmerCard";
import { useSelector } from "react-redux";

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchedCategoriesVideo } = useSelector((store) => store.videos);

  useEffect(() => {
    if (fetchedCategoriesVideo?.length > 0) {
      setVideos(fetchedCategoriesVideo);
      setIsLoading(false);
    }
  }, [fetchedCategoriesVideo]);

  return (
    <>
      {isLoading ? (
        <ShimmerCard />
      ) : (
        <div
          id="main"
          className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 max-sm:gap-0 px-4 max-sm:px-0"
        >
          {" "}
          {videos?.length > 0 ? (
            videos?.map((video) => (
              <Link key={video.id} to={"/watch?v=" + video?.video_id}>
                <VideoCard info={video} />
              </Link>
            ))
          ) : (
            <p className="font-medium">No videos uploaded yet</p>
          )}
        </div>
      )}
    </>
  );
};

export default VideoContainer;
