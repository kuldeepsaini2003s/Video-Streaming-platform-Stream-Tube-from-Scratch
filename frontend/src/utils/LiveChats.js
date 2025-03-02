import React, { useEffect } from "react";
import Chats from "./Chats";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "./Redux/ChatSlice";
import { generateRandomName, generateRandomText } from "./Helper";

const LiveChats = () => {
  const message = useSelector((store) => store.chat.message);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(
        setMessages({
          name: generateRandomName(),
          message: generateRandomText(16),
        })
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div>
      {message.map((item, index) => {
        return <Chats key={index} item={item} />;
      })}
    </div>
  );
};

export default LiveChats;
