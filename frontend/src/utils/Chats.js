import React from "react";
import Image from "../Images/user.avif";
const Chats = ({ item }) => {
  return (
    <div className="flex gap-4 items-center text-sm mb-2">
      <div>
        <img
          className="h-8 rounded-full object-cover aspect-square"
          src={Image}
          alt=""
        />
      </div>
      <div>
        <span className="font-medium text-Gray">{item.name}</span>
        <span className="ml-2">{item.message}</span>
      </div>
    </div>
  );
};

export default Chats;
