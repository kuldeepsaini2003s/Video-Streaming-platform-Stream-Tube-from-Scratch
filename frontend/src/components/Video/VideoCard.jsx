import React from "react";
import { GoDotFill } from "react-icons/go";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { formatDuration, formatViewCount } from "../../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { timeAgo } from "../../utils/CustomFunctions/TimeCalculation";

const VideoCard = ({ info }) => {
  const { title, duration, thumbnail, views, user, video_id, createdAt } = info;

  const { avatar, channelName, userName } = user?.publishedDetails;
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    if (e.target.closest("a")) return;
    navigate(`/watch?v=${video_id}`);
  };

  return (
    <div onClick={handleNavigate} className="shadow-md rounded-md">
      <div className="relative rounded-md">
        <img
          className={`ml:rounded-md sm:h-[13rem] ms:h-[12rem] object-cover aspect-video object-center w-full`}
          alt="Thumbnails"
          src={thumbnail}
        />
        <p className="absolute text-[0.8rem] font-medium text-white bg-black opacity-80 rounded-md right-2 bottom-2 px-2 py-0.5">
          {formatDuration(duration)}
        </p>
      </div>
      <div className="yt-details py-2 sm:px-0 ms:px-4 ms:py-3 flex gap-x-3">
        <Link to={`/${userName}`} className="flex-shrink-0">
          {avatar ? (
            <img
              className="rounded-full sm:h-10 sm:w-10 ms:h-8 ms:w-8 object-cover aspect-square flex-shrink-0 object-center"
              alt="Avatar"
              src={avatar}
            />
          ) : (
            <FaCircleUser className="sm:w-12 sm:h-14" />
          )}
        </Link>
        <div className="w-full">
          <div className="flex gap-5 justify-between w-full">
            <p className="line-clamp-2 font-semibold sm:text-base ms:text-sm ">
              {title}
            </p>
            <p className="three-dots-container ">
              <PiDotsThreeVerticalBold size={22} />
            </p>
          </div>
          <Link to={`/${userName}`}>
            <p className="text-lightBlack text-sm">{channelName}</p>
          </Link>
          <div className="flex gap-1 items-center text-lightBlack text-sm">
            <p>{formatViewCount(views.length)} views</p>
            <GoDotFill size={8} />
            <p>{timeAgo(createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
