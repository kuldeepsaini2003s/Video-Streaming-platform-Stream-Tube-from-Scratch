import React, { useEffect } from "react";
import { YOUTUBE_API_KEY } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../utils/Redux/VideoSlice";

const UseVideoCategories = () => {
  const getFetchCategory = useSelector((store) => store.videos.fetchcategories);
  const dispatch = useDispatch();

  const getVideoCategories = async () => {
    try {
      const data = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${getFetchCategory}&key=${YOUTUBE_API_KEY}`
      );
      const json = await data.json();
      dispatch(setCategories(json.items));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (getFetchCategory) {
      getVideoCategories();
    }
  }, [getFetchCategory]);
};

export default UseVideoCategories;
