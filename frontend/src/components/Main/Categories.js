import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../utils/Redux/VideoSlice";
import { BACKEND_VIDEO } from "../../utils/constants";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const { category, fetchedCategoriesVideo } = useSelector(
    (store) => store.videos
  );
  const [active, setActive] = useState(category);
  const [toggleShimmer, setToggleShimmer] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchedCategoriesVideo?.length > 0) {
      setToggleShimmer(false);
    }
  }, [fetchedCategoriesVideo]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const res = await axios.get(BACKEND_VIDEO + "/categoryList");
        if (res.status === 200) {
          setCategories(res?.data?.data);
        }
      } catch (error) {
        console.error("Error while fetching all category", error);
      }
    };
    fetchAllCategories();
  }, []);

  const videoTag = (tag) => {
    if (active !== tag) {
      setActive(tag);
      dispatch(setCategory(tag));
    }
  };

  return (
    <>
      {!toggleShimmer && (
        <div id="category" className="no-scrollbar overflow-x-auto px-4">
          <div className="flex sm:gap-3 ms:gap-2 ms:my-2 ms:mx-1 items-center">
            <div
              onClick={() => videoTag("All")}
              className={`rounded-md bg-Gray hover:bg-Gray dark:bg-icon_black dark:hover:bg-hover_icon_black px-3 py-1 min-w-fit cursor-pointer text-sm font-semibold transition duration-200
              ${
                active === "All"
                  ? "bg-[#000] text-white hover:bg-black dark:bg-white dark:hover:bg-white dark:text-black"
                  : ""
              }`}
            >
              All
            </div>
            {categories.map((item, index) => (
              <div
                key={index}
                onClick={() => videoTag(item)}
                className={`rounded-md bg-Gray hover:bg-Gray dark:bg-icon_black dark:hover:bg-hover_icon_black px-3 py-1 min-w-fit cursor-pointer text-sm font-semibold transition duration-200
              ${
                active === item
                  ? "bg-[#000] text-white hover:bg-black dark:bg-white dark:hover:bg-white dark:text-black"
                  : ""
              }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;
