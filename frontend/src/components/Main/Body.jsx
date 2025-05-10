import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import Menu from "./Menu";
import Categories from "./Categories";
import Slider from "./Slider";
import Navbar from "./Navbar";

const Body = () => {
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setCategoryVisible(pathname === "/");
    setMenuVisible(pathname === "/watch");
  }, [pathname]);

  return (
    <div className="main-container">
      <Navbar />
      {!menuVisible && <Menu />}
      {categoryVisible && <Categories />}
      <Slider />
      <Outlet />
    </div>
  );
};

export default Body;
