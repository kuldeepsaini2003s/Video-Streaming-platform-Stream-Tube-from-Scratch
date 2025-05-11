import React, { useEffect, useState } from "react";
import bell_icon_white from "../../Icons/Bell-icon-white.json";
import Lottie from "lottie-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BACKEND_SUBSCRIPTION } from "../../utils/constants";
import { Link } from "react-router-dom";
import { CircleUserRound } from "lucide-react";

const Subscriptions = () => {
  const [showPop, setShowPop] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [channelName, setChannelName] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  const user = useSelector((store) => store?.user?.user);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(
        BACKEND_SUBSCRIPTION + "/subscribedChannels",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setSubscriptions(response?.data?.data);
      }
    } catch (error) {
      console.error("Error while fetching subscriptions");
      setSubscriptions([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const handleConfirmation = async () => {
    try {
      const response = await axios.get(
        BACKEND_SUBSCRIPTION + `/unsubscribe/${channelName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        fetchSubscriptions();
      }
    } catch (error) {
      console.error("Error while subscribing channel", error);
    }
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
              onClick={() => {
                setShowPop(false);
                setChannelName("");
              }}
              className="px-4 py-1 rounded-full font-medium dark:hover:bg-dark_bg_hover dark:text-white hover:bg-lightGray"
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

  return (
    <>
      {user ? (
        <div className="relative px-20 py-2" id="main">
          <h1 className="font-bold text-xl">All Subscriptions</h1>
          <div>
            {subscriptions.length > 0 ? (
              subscriptions.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center w-full my-4"
                >
                  <Link
                    to={`/${item?.userName}`}
                    className="flex w-full gap-10"
                  >
                    <img
                      src={item?.avatar}
                      className="w-32 h-32 object-cover aspect-square object-center rounded-full flex-shrink-0"
                      alt="Avatar"
                    />
                    <div className="space-y-1 text-medium_gray text-sm w-full">
                      <h1 className="text-xl text-white font-bold">
                        {item?.channelName}
                      </h1>
                      <p>
                        {item?.userName}. {item?.subscribers} Subscribers
                      </p>
                      <p className="leading-5">{item?.description}</p>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChannelName(item?.channelName);
                      setShowPop(true);
                    }}
                    className="watch-btn subscriber px-3 py-2 dark:bg-dark_bg dark:hover:bg-dark_bg_hover flex gap-1 items-center text-sm cursor-pointer rounded-3xl"
                  >
                    <Lottie
                      animationData={bell_icon_white}
                      play={isPlaying}
                      loop={false}
                      className="w-6"
                    />
                    Subscribed
                  </button>
                </div>
              ))
            ) : (
              <p className="font-medium">You have not subscribed anyone</p>
            )}
          </div>
          {showPop && <ConfirmationPop />}
        </div>
      ) : (
        <div id="main" className="flex flex-col items-center pt-40">
          <p>Sign in to see updates from your favorite YouTube channels</p>
          <Link to={"/login"}>
            <button className="flex gap-2 items-center border mt-5 border-dark_bg font-medium rounded-full text-sm px-3 py-1">
              <CircleUserRound size={25} strokeWidth={1} /> Sign in
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Subscriptions;
