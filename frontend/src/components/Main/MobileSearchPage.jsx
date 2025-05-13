import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UseSearchSuggestions from "../../hooks/UseSearchSuggestions";
import { IoArrowBackOutline, IoSearchOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

const MobileSearchPage = () => {
  const { getSearchSuggestion } = UseSearchSuggestions();
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { searchSuggestion } = useSelector((store) => store.searchSuggestion);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(searchSuggestion)) return;

    // ...new Set used to remove duplicate values
    const searchResult = [
      ...new Set(
        searchSuggestion.flatMap((item) => {
          const tags = item?.tags?.map((tag) => tag.toLowerCase()) || [];
          const title = item?.title ? [item?.title] : [];
          const channelName = item?.channelName ? [item?.channelName] : [];
          const userName = item?.userName ? [item?.userName] : [];
          return [...channelName, ...userName, ...title, ...tags];
        })
      ),
    ];

    setSuggestions(searchResult);
  }, [searchSuggestion]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue) {
        getSearchSuggestion(inputValue);
      }
    }, 500);
    return () => clearInterval(timer);
  }, [inputValue]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const clearInput = () => {
    setInputValue("");
    setSuggestions([]);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth > 640) {
        navigate("/");
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [navigate]);

  return (
    <div className="p-2 sm:hidden">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <IoArrowBackOutline size={22} />
        </button>
        <div className="relative h-10 flex gap-2 w-full dark:bg-black bg-white border border-Gray dark:border-dark_bg_hover rounded-full  px-4">
          <input
            autoComplete="off"
            placeholder="Search"
            value={inputValue}
            onChange={handleChange}
            className="group w-full h-full focus:outline-none"
          />
          {inputValue && (
            <button
              onClick={clearInput}
              className="absolute right-3 top-0 flex items-center hover:bg-Gray hover:bg-dark_bg_hover rounded-full p-1 my-1"
            >
              <RxCross2 size={20} />
            </button>
          )}
        </div>
      </div>
      <div className="mt-2">
        {inputValue &&
          suggestions?.length > 0 &&
          suggestions?.map((item, index) => (
            <Link to={`/results?search_query=${item}`}>
              <div
                key={index}
                className="flex text-sm gap-4 items-center rounded-md font-medium  gap-2 py-2 dark:hover:bg-dark_bg_hover"
              >
                <IoSearchOutline size={20} className="flex-shrink-0" />
                <p className="line-clamp-2">{item}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default MobileSearchPage;
