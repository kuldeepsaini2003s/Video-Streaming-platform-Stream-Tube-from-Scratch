import React, { useEffect } from "react";
import { IoMdHome } from "react-icons/io";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { GrHistory } from "react-icons/gr";

const Menu = () => {
  const user = useSelector((store) => store.user.user);
  const menu = [
    {
      name: "Home",
      icon: <IoMdHome className="text-[1.4rem]" />,
      path: "/",
    },
    {
      name: "Subscribers",
      icon: <MdOutlineSubscriptions className="text-[1.3rem]" />,
      path: "/subscriptions",
    },
    {
      name: "History",
      icon: <GrHistory className="text-[1.1rem]" />,
      path: `/history`,
    },
    {
      name: "You",
      icon: <MdOutlineVideoLibrary className="text-[1.3rem]" />,
      path: "/feed/you",
    },
  ];

  const location = useLocation();

  const isMobile = window.innerWidth < 640;
  const filteredMenu =
    user && isMobile ? menu.filter((item) => item.name !== "You") : menu;

  return (
    <div
      className={`${
        location.pathname === "/watch" && "hidden"
      } max-sm:flex justify-around max-sm:py-1 max-sm:dark:bg-black`}
      id="sidebar"
    >
      {/* home-btn */}
      {filteredMenu.map((item, index) => {
        return (
          <Link key={index} to={item?.path}>
            <div
              id="HomeBtn menu-items"
              className={`flex flex-col items-center rounded-md hover:bg-Gray dark:hover:bg-icon_black ms:m-0 sm:py-3 ms:p-1 sm:w-full ms:w-fit`}
            >
              {item?.icon}
              <p className="sm:text-xs ms:text-[12px] pt-1">{item?.name}</p>
            </div>
          </Link>
        );
      })}
      {/* user-icon */}
      {user && (
        <Link to={`/${user?.userName}`}>
          <div
            id="user-icon"
            className="flex flex-col justify-center items-center rounded-3xl sm:hidden ms:p-1"
          >
            <img
              src={user?.avatar}
              className="w-8 h-8 rounded-full object-cover aspect-square object-center"
              alt=""
            />
            <p className="sm:text-xs ms:text-[12px]">You</p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Menu;
