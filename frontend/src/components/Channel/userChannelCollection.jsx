import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_PLAYLIST } from "../../utils/constants";
import { IoMdGlobe } from "react-icons/io";
import { LockKeyhole } from "lucide-react";
import { IoMdPlay } from "react-icons/io";
import Profile_Video_Card from "./Profile_Video_Card";
import { CgPlayList } from "react-icons/cg";

export const UserAllVideo = () => {
  const [videos, setVideos] = useState([]);
  const userAllVideos = useSelector((store) => store.videos.allVideos);
  const { user } = useSelector((state) => state.user);
  const { userName } = useParams();

  useEffect(() => {
    if (userAllVideos && userAllVideos.length > 0) {
      setVideos(userAllVideos);
    } else {
      setVideos([]);
    }
  }, [userAllVideos]);

  return (
    <div className="grid max-sm:grid-cols-1 gap-3 sm:grid-cols-2 ml:m-2   lg:grid-cols-3 mt-4">
      {videos && videos.length > 0 ? (
        videos.map((item) => (
          <Link
            key={item.id}
            to={
              user?.userName === userName
                ? `/update-video/${item?.video_id}`
                : `/watch?v=${item?.video_id}`
            }
          >
            <Profile_Video_Card
              info={item}
              height="[10rem]"
              min_height="[10rem]"
            />
          </Link>
        ))
      ) : (
        <div className="font-medium">No videos found</div>
      )}
    </div>
  );
};
export const UserPlaylist = () => {
  const [playlist, setPlaylist] = useState([]);
  const channelUser = useSelector((store) => store?.user?.channelUser);
  const user = useSelector((store) => store?.user?.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          BACKEND_PLAYLIST + `/userPlaylist/${channelUser?.userName}`,
          { userId: user?._id }
        );
        if (response.status === 200) {
          setPlaylist(response?.data?.data);
        } else {
          setPlaylist([]);
        }
      } catch (error) {
        console.error("Error while fetching user playlist", error);
        setPlaylist([]);
      }
    };
    if (channelUser?._id) {
      fetchData();
    }
  }, [channelUser?._id]);

  return (
    <div className="grid grid-cols-5 gap-2 my-4">
      {playlist.length > 0 ? (
        playlist?.map((item) => (
          <Link to={`/watch?v=${item?.video_id}&list=${item?._id}&index=1`}>
            <div className="relative cursor-pointer space-y-[2px] group">
              <div className="flex flex-col justify-center items-center">
                <div className="w-[88%] border-b-4 border-l-transparent border-r-transparent border-l-4 border-r-4 mb-[1px] border-[#514842]"></div>
                <div className="w-[93%] border-b-4 border-l-transparent border-r-transparent border-l-4 border-r-4   border-[#938176]"></div>
                <div className="relative w-full ">
                  <img
                    src={item?.thumbnail}
                    className="w-full h-32 object-cover aspect-video object-center rounded-md bg-yellow-500"
                  ></img>
                  <div className="absolute font-medium text-xs flex justify-center right-1 bottom-1 bg-icon_black bg-opacity-70 rounded-md px-2 py-1">
                    <CgPlayList className="text-lg" /> {item?.video?.length}{" "}
                    videos
                  </div>
                  <div className="hidden rounded-md group-hover:block absolute w-full h-full top-0 bg-black bg-opacity-60">
                    <p className="flex justify-center items-center h-full w-full">
                      <IoMdPlay /> Play all
                    </p>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="w-[90%]">
                <h1 className="text-sm line-clamp-2 font-medium mt-2">
                  {item?.title}
                </h1>
                <div className="flex justify-between font-medium items-center text-lightBlack text-xs">
                  <h1>View full playlist</h1>
                  {channelUser?._id === user?._id && (
                    <h1 className="flex gap-1 items-center">
                      {item?.status === "Private" ? (
                        <LockKeyhole strokeWidth={3} size={12} />
                      ) : (
                        <IoMdGlobe />
                      )}
                      {item?.status}
                    </h1>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p className="font-medium">No playlist create yet.</p>
      )}
    </div>
  );
};

const userChannelCollection = {
  UserAllVideo,
  UserPlaylist,
};
export default userChannelCollection;
