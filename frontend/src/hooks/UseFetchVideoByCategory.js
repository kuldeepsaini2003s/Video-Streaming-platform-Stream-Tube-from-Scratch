import { useEffect } from "react";
import { BACKEND_VIDEO } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setFetchedCategoriesVideo } from "../utils/Redux/VideoSlice";

const UseFetchVideoByCategory = () => {
  const { category } = useSelector((store) => store.videos);
  const dispatch = useDispatch();

  const getVideoCategories = async () => {
    try {
      const data = await fetch(
        BACKEND_VIDEO + `/video?category=${category}`
      );
      const json = await data.json();
      dispatch(setFetchedCategoriesVideo(json?.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (category) {
      getVideoCategories();
    }
  }, [category]);
};

export default UseFetchVideoByCategory;
