import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import UseSingleVideo from "../../hooks/UseSingleVideo";
import { useSelector } from "react-redux";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import { RiShareForwardLine } from "react-icons/ri";
import {
  BACKEND_COMMENT,
  BACKEND_PLAYLIST,
  BACKEND_SUBSCRIPTION,
  BACKEND_VIDEO,
  formatDuration,
  formatViewCount,
} from "../../utils/constants";
import axios from "axios";
import UseLikeHandler from "../../hooks/UseLikeHandler";
import Lottie from "lottie-react";
import bell_icon_white from "../../Icons/Bell-icon-white.json";
import { CreatePlaylist, SavePlaylist } from "../Channel/Playlist";
import { UserCircleIcon, X } from "lucide-react";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { timeAgo } from "../../utils/CustomFunctions/TimeCalculation";
import { toast } from "react-toastify";
import Recommendation from "./Recommendation";
import Shimmer from "./Shimmer";

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const videoId = searchParams.get("v");
  const playlistId = searchParams.get("list");
  const userToken = localStorage.getItem("token");
  const [video, setVideo] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [shimmer, setShimmer] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showLoginPop, setShowLoginPop] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [comment, setComment] = useState("");
  const [disableInput, setDisableInput] = useState(false);
  const [disable, setDisable] = useState(false);
  const [openPlaylist, setOpenPlaylist] = useState(true);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const currentUser = useSelector((store) => store.user.user);
  const getVideo = useSelector((store) => store.videos.singleVideo);

  useEffect(() => {
    if (getVideo?._id) {
      const { subscribersCount, subscribed } = getVideo;
      setVideo(getVideo);
      setSubscribersCount(subscribersCount);
      setSubscribed(subscribed);
      setShimmer(false);
    }
  }, [getVideo]);

  const {
    channelName,
    description,
    createdAt,
    tags,
    title,
    userAvatar,
    userName,
    videoUrl,
    videoViewed,
    viewsCount,
    videoSaved,
    category,
    user,
  } = video;

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const { data } = await axios.get(
          BACKEND_PLAYLIST + `/playlist/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (data) {
          setPlaylist(data?.data);
        }
      } catch (error) {
        handleError({ error, message: "Error while fetching playlist" });
      }
    };
    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId]);

  useEffect(() => {
    const addVideoToWatched = async () => {
      try {
        await axios.get(BACKEND_VIDEO + `/add_To_Watched/${videoId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
      } catch (error) {
        handleError({
          error,
          message: "Error while adding video to watch history",
        });
      }
    };
    if (!videoViewed) {
      addVideoToWatched();
    }
  }, [videoViewed]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const video = videoRef.current;

      if (!video) return;

      switch (event.key) {
        case " ": // Spacebar for play/pause
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
          break;

        case "f": // 'f' key to toggle fullscreen
          if (document.fullscreenElement) {
            // If already in fullscreen, exit fullscreen
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
              // Firefox
              document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
              // Chrome, Safari, and Opera
              document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
              // IE/Edge
              document.msExitFullscreen();
            }
          } else {
            // If not in fullscreen, enter fullscreen
            if (video.requestFullscreen) {
              video.requestFullscreen();
            } else if (video.mozRequestFullScreen) {
              // Firefox
              video.mozRequestFullScreen();
            } else if (video.webkitRequestFullscreen) {
              // Chrome, Safari, and Opera
              video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
              // IE/Edge
              video.msRequestFullscreen();
            }
          }
          break;

        case "m": // 'm' key for mute/unmute
          video.muted = !video.muted;
          break;

        case "ArrowRight": // Right arrow key to skip forward by 5 seconds
          video.currentTime += 5;
          break;

        case "ArrowLeft": // Left arrow key to skip backward by 5 seconds
          video.currentTime -= 5;
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const { liked, disliked, likesCount, likeHandler, dislikeHandler } =
    UseLikeHandler(videoId);
  UseSingleVideo(videoId);

  useEffect(() => {
    const updateViews = async () => {
      try {
        await axios.get(BACKEND_VIDEO + `/updateViews/${videoId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
      } catch (error) {
        handleError({ error, message: "Error while updating views" });
      }
    };
    if (!videoViewed) {
      const timeout = setTimeout(() => {
        updateViews();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [videoViewed, videoId]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const subscriberHandler = async () => {
    if (!currentUser) {
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
            Authorization: `Bearer ${userToken}`,
          },
        });
      } catch (error) {
        handleError({ error, message: "Error while subscribing channel" });
      }
      setSubscribed(true);
    } else {
      setShowPop(true);
    }
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    alert("URL copied to clipboard!");
  };

  const handleLike = () => {
    if (!currentUser) {
      setShowLoginPop(true);
      setLoginMessage(`Like this video? Sign in to make your opinion count.`);
      return;
    }
    likeHandler();
  };

  const handleDisLike = () => {
    if (!currentUser) {
      setShowLoginPop(true);
      setLoginMessage(
        `Don't like this video? Sign in to make your opinion count.`
      );
      return;
    }
    dislikeHandler();
  };

  const handlePlaylist = () => {
    if (!currentUser) {
      setShowLoginPop(true);
      setLoginMessage(
        `Want to watch this again later? Sign in to add this video to a playlist.`
      );
      return;
    }
    setShowPlaylist(true);
  };

  const handleCommentInput = () => {
    if (!currentUser) {
      setShowLoginPop(true);
      setLoginMessage(`Want to add a comment? Sign in to add a comment.`);
      setDisableInput(true);
      return;
    }
  };

  const handleConfirmation = async () => {
    try {
      await axios.get(BACKEND_SUBSCRIPTION + `/unsubscribe/${channelName}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
    } catch (error) {
      handleError({ error, message: "Error while subscribing" });
    }
    setSubscribed(false);
  };

  const ConfirmationPop = () => {
    return (
      <div
        onClick={() => setShowPop(false)}
        className="absolute w-dvw h-svh top-0 left-0 remove-scrollbar bg-black/30 flex justify-center items-center"
      >
        <div className="text-medium_gray bg-[#212121] flex flex-col justify-between items-center h-36 rounded-md p-5">
          <p>Unsubscribe from {channelName}</p>
          <div className="flex gap-4 items-center justify-end">
            <button
              onClick={() => setShowPop(false)}
              className="px-4 py-1 rounded-full font-medium dark:hover:bg-dark_bg_hover dark:text-white hover:bg-darkGray"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmation}
              className="px-4 py-1 rounded-full font-medium text-[#388BD4] hover:bg-[#3ca4ff36]"
            >
              Unsubscribe
            </button>
          </div>
        </div>
      </div>
    );
  };

  const LoginPop = () => {
    return (
      <div
        onClick={() => setShowLoginPop(false)}
        className="absolute w-dvw h-svh top-0 left-0 remove-scrollbar bg-black/30 flex justify-center items-center"
      >
        <div className="text-medium_gray bg-[#212121] flex flex-col justify-between items-center h-36 rounded-md p-5">
          <p>{loginMessage}</p>
          <div className="flex gap-10 items-center justify-between">
            <button
              onClick={() => setShowPop(false)}
              className="px-4 py-1 rounded-full font-medium dark:hover:bg-dark_bg_hover dark:text-white hover:bg-darkGray"
            >
              Cancel
            </button>
            <button
              onClick={() => navigate}
              className="px-4 py-1 rounded-full font-medium text-[#388BD4] hover:bg-[#3ca4ff36]"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getAllComments = async () => {
    try {
      const res = await axios.get(BACKEND_COMMENT + `/comments/${videoId}`);
      if (res.status === 200) {
        setCommentsList(res?.data?.data);
      }
    } catch (error) {
      handleError({ error, message: "Error while getting comments" });
    }
  };

  const createComment = async () => {
    setDisable(true);
    try {
      const res = await axios.post(
        BACKEND_COMMENT + "/create",
        {
          comment,
          videoId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success(res?.data?.msg);
        getAllComments();
        setComment("");
        setDisable(false);
      }
    } catch (error) {
      handleError({ error, message: "Error while creating video" });
      setDisable(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      getAllComments();
    }
  }, [videoId]);

  const handlePlaylistClose = () => {
    setOpenPlaylist(!openPlaylist);
  };

  return (
    <>
      {shimmer ? (
        <Shimmer />
      ) : (
        <div
          id="main"
          className="lg:px-14 max-lg:px-5 max-sm:px-0 py-5 max-sm:mt-2 max-lg:py-0 max-lg:pb-5 flex max-lg:flex-col sm:gap-5 w-full"
        >
          {/* left  */}
          <div className="w-[62%] max-lg:w-full h-fit">
            {/* video */}
            <video
              ref={videoRef}
              className="sm:rounded-xl -z-40 w-full sm:h-[27.5rem] object-cover aspect-video"
              src={videoUrl}
              controls
              autoPlay
            ></video>
            {/* channel-info */}
            <div className="flex flex-col gap-2 sm:my-2 max-sm:p-2 justify-center">
              {/* Channel titile */}
              <h1 className="sm:text-xl font-semibold w-[95%] overflow-hidden text-sm">
                {title}
              </h1>
              <div className="flex max-sm:flex-col sm:items-center sm:justify-between">
                <div className="flex max-sm:justify-between items-center max-sm:gap-3 gap-5">
                  {/* user-profile */}
                  <Link to={`/${userName}`}>
                    <div className="flex gap-5 items-center">
                      <img
                        className="sm:h-12 h-10 w-10 sm:w-12 rounded-full object-cover aspect-square object-center"
                        src={userAvatar}
                        alt=""
                      />
                      <div>
                        <p className="font-medium max-sm:text-sm">
                          {channelName}
                        </p>
                        <p className="text-xs text-darkGray font-medium">
                          {subscribersCount} subscribers
                        </p>
                      </div>
                    </div>
                  </Link>
                  {/* subscribe-btn */}
                  {currentUser?._id !== user ? (
                    <button
                      onClick={subscriberHandler}
                      className="watch-btn subscriber bg-lightGray hover:bg-medium_gray  px-3 py-2 dark:bg-dark_bg dark:hover:bg-dark_bg_hover flex gap-1 items-center text-sm cursor-pointer rounded-3xl"
                    >
                      {subscribed && (
                        <Lottie
                          animationData={bell_icon_white}
                          play={isPlaying}
                          loop={false}
                          className="w-6"
                        />
                      )}
                      {!subscribed ? "Subscribe" : "Subscribed"}
                    </button>
                  ) : (
                    <Link to={`/${userName}`}>
                      <button className="watch-btn subscriber px-3 py-2 dark:bg-dark_bg dark:hover:bg-dark_bg_hover flex gap-1 items-center text-sm cursor-pointer rounded-3xl">
                        View Channel
                      </button>
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium max-sm:text-xs max-sm:pt-4">
                  {/* like-btn */}
                  <div className="user-info flex items-center bg-lightGray dark:bg-dark_bg rounded-full ">
                    <div
                      onClick={handleLike}
                      className="watch-btn rounded-l-full flex gap-1 items-center px-4 py-2 select-none dark:hover:bg-dark_bg_hover  cursor-pointer"
                    >
                      {!liked ? (
                        <BiLike className="text-[1.3rem] max-sm:text-[1.2rem]" />
                      ) : (
                        <BiSolidLike className="text-[1.3rem] max-sm:text-[1.2rem]" />
                      )}
                      <p>{likesCount}</p>
                    </div>
                    <span className="border-l-2 py-3"></span>
                    <div
                      onClick={handleDisLike}
                      className="cursor-pointer px-4 rounded-r-full py-2 dark:hover:bg-dark_bg_hover "
                    >
                      {!disliked ? (
                        <BiDislike className="text-[1.3rem] max-sm:text-[1.2rem]" />
                      ) : (
                        <BiSolidDislike className="text-[1.3rem] max-sm:text-[1.2rem]" />
                      )}
                    </div>
                  </div>
                  {/* share-btn */}
                  <div
                    className="watch-btn user-info flex items-center gap-1 bg-lightGray dark:bg-dark_bg dark:hover:bg-dark_bg_hover rounded-3xl px-4 py-2 cursor-pointer "
                    onClick={handleShare}
                  >
                    <RiShareForwardLine className="text-[1.3rem] max-sm:text-[1.2rem]" />
                    <p>Share</p>
                  </div>
                  {/* option-btn */}
                  {videoSaved ? (
                    <button className="watch-btn user-info flex items-center gap-2 bg-lightGray dark:bg-dark_bg dark:hover:bg-dark_bg_hover rounded-3xl px-4 py-2 cursor-pointer ">
                      <FaBookmark className="text-[1rem] text-[0.91rem]" />{" "}
                      Saved
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaylist}
                      className="watch-btn user-info flex items-center gap-2 bg-lightGray dark:bg-dark_bg dark:hover:bg-dark_bg_hover rounded-3xl px-4 py-2 cursor-pointer "
                    >
                      <FaRegBookmark className="max-sm:text-[0.91rem] text-[1rem]" />{" "}
                      Save
                    </button>
                  )}
                </div>
              </div>

              <div className="gap-2 flex flex-col sm:mt-2 sm:m-0 text-sm font-medium bg-lightGray dark:bg-dark_bg rounded-2xl p-3">
                {/* views */}
                <div className="flex items-center gap-x-2 font-semibold flex-wrap ">
                  <p className="p-0 m-0">
                    {viewsCount && formatViewCount(viewsCount)} views
                  </p>
                  <p className="p-0 m-0">{createdAt && timeAgo(createdAt)} </p>
                  <div
                    className={`${
                      showFullDescription ? "" : "line-clamp-1"
                    } flex flex-wrap gap-1`}
                  >
                    {tags?.length > 0 &&
                      tags?.map((tag, index) => (
                        <p
                          key={index}
                          className="text-darkGray p-0 m-0 max-sm:text-xs"
                        >
                          {tag}
                        </p>
                      ))}
                  </div>
                </div>
                {/* description */}
                <div className={`${showFullDescription ? "" : "line-clamp-2"}`}>
                  <p>{description}</p>
                </div>
                {!showFullDescription ? (
                  <p
                    onClick={toggleDescription}
                    className="cursor-pointer font-semibold text-blue-500"
                  >
                    ...more
                  </p>
                ) : (
                  <p
                    onClick={toggleDescription}
                    className="cursor-pointer font-semibold text-blue-500"
                  >
                    ...Show less
                  </p>
                )}
              </div>
              {/* comments-container */}
              <div>
                <h1 className="text-xl sm:my-5 max-sm:text-base max-sm:px-2 max-sm:py-1 font-semibold">
                  {commentsList?.length > 0
                    ? `${commentsList.length} comments`
                    : "Be the first to comment"}
                </h1>
                <div className="flex gap-3 items-center mt-2">
                  {currentUser ? (
                    <img
                      src={currentUser?.avatar}
                      className="rounded-full sm:w-14 sm:h-14 h-10 w-10 object-cover object-center"
                      alt="user-avatar"
                    />
                  ) : (
                    <UserCircleIcon size={40} strokeWidth={1} />
                  )}
                  <div className="w-full">
                    <input
                      className="border-b pb-1 px-2 w-full placeholder:text-darkGray text-sm placeholder:text-sm border-dark_bg bg-transparent outline-none"
                      type="text"
                      onFocus={handleCommentInput}
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                      placeholder="Add a comment..."
                      required
                      readOnly={disableInput}
                    />
                    {comment && (
                      <div className="flex text-sm mt-2 justify-end items-center gap-5">
                        <button
                          className="hover:bg-dark_bg px-4 py-1 rounded-full"
                          onClick={() => setComment("")}
                        >
                          Cancel
                        </button>
                        <button
                          disabled={disable}
                          onClick={createComment}
                          className="bg-[#4ca7f7] font-medium text-black px-4 py-1 rounded-full"
                        >
                          Comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {commentsList.length > 0 && (
                  <div className="sm:mt-10 max-sm:mt-4">
                    {commentsList.map((items, index) => (
                      <div
                        key={index}
                        className="flex gap-4 text-wrap items-start my-3"
                      >
                        <img
                          className="rounded-full w-10 h-10 object-cover object-center"
                          src={items?.avatar}
                          alt=""
                        />
                        <div>
                          <div className="flex text-sm font-medium gap-1  items-center">
                            <h1 className="">{items?.userName}</h1>
                            <h1 className="text-medium_gray">
                              {timeAgo(items?.comments[0]?.createdAt)}
                            </h1>
                          </div>
                          {items?.comments.map((item) => {
                            return <p className="text-sm">{item.comment}</p>;
                          })}
                          {/* <div className="flex items-center mt-2 gap-5">
                          <div className="flex items-center gap-2">
                            <BiLike className="text-[1.3rem]" />
                            {
                              items?.snippet?.topLevelComment?.snippet
                                ?.likeCount
                            }
                          </div>
                          <BiDislike className="text-[1.3rem]" />
                        </div> */}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* right */}
          <div className="h-fit w-[38%] max-lg:w-full">
            {playlistId && (
              <div className="border mb-5 sm:flex flex-col dark:bg-dark_bg justify-between min-w-[35%] hidden h-fit rounded-lg">
                <div className="flex justify-between items-center border-b p-2">
                  <div>
                    <p className="font-bold text-lg">{playlist[0]?.title}</p>
                    <p className="text-xs text-medium_gray">
                      <span className="text-white font-medium">
                        {playlist[0]?.channelName}
                      </span>{" "}
                      - {playlist?.length}
                    </p>
                  </div>
                  <X
                    size={40}
                    strokeWidth={1}
                    onClick={handlePlaylistClose}
                    className="p-2 rounded-full dark:bg-dark_bg dark:hover:bg-dark_bg_hover"
                  />
                </div>
                <div
                  className={`${
                    openPlaylist ? "max-h-[19rem]" : "h-0"
                  } no-scrollbar dark:bg-black rounded-b-xl flex flex-col-reverse overflow-y-auto px-4 py-2`}
                >
                  <div className="flex flex-col gap-2">
                    {playlist &&
                      playlist?.map((item, index) => (
                        <Link
                          to={`/watch?v=${item.video_id}&list=${
                            item._id
                          }&index=${index + 1}`}
                        >
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-medium_gray">
                              {index + 1}
                            </p>
                            <div className="relative">
                              <img
                                className="w-24 h-14 rounded-md object-cover aspect-video object-center"
                                src={item?.thumbnail}
                                alt=""
                              />
                              <p className="absolute right-1 bottom-1 rounded-sm text-xs px-1 bg-black/80 ">
                                {formatDuration(item?.duration)}
                              </p>
                            </div>
                            <div className="flex flex-col justify-between text-sm">
                              <h1 className="line-clamp-2 font-medium">
                                {item?.video_title}
                              </h1>
                              <h1 className="text-medium_gray text-xs">
                                {item?.channelName}
                              </h1>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            )}
            <Recommendation category={category} videoId={videoId} />
          </div>

          {showLoginPop && <LoginPop />}
          {showPop && <ConfirmationPop />}
          {showCreatePlaylist && (
            <CreatePlaylist
              setShowCreatePlaylist={setShowCreatePlaylist}
              setShowPlaylist={setShowPlaylist}
            />
          )}
          {showPlaylist && (
            <SavePlaylist
              setShowPlaylist={setShowPlaylist}
              setShowCreatePlaylist={setShowCreatePlaylist}
              videoId={video._id}
            />
          )}
        </div>
      )}
    </>
  );
};

export default WatchPage;
