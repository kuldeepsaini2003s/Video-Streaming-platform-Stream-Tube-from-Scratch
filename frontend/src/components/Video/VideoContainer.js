import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import ShimmerCard from "../Main/ShimmerCard";
import { useSelector } from "react-redux";
import UseFetchAllVideos from "../../hooks/useFetchAllVideos";

const VideoContainer = () => {
  UseFetchAllVideos();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { allVideos } = useSelector((store) => store.videos);

  useEffect(() => {
    if (allVideos?.length > 0) {
      setVideos(allVideos);
      setIsLoading(false);
    }
  }, [allVideos]);

  return (
    <>
      {isLoading ? (
        <ShimmerCard />
      ) : (
        <div
          id="main"
          className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 px-4"
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
