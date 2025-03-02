import { useDispatch } from "react-redux";
import { setAllVideos } from "../utils/Redux/VideoSlice";
import { BACKEND_VIDEO } from "../utils/constants";
import { useEffect } from "react";

const UseFetchAllVideos = (userName) => {
  const dispatch = useDispatch();
  const fetchUserVideos = async () => {
    try {
      const response = await fetch(BACKEND_VIDEO + `/getAllVideo`, {
        method: "POST",
        body: JSON.stringify({ userName }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        dispatch(setAllVideos(data?.data));
      } else {
        dispatch(setAllVideos([]));
      }
    } catch (error) {
      console.error("Error while fetching user videos", error);
      dispatch(setAllVideos([]));
    }
  };
  useEffect(() => {
    fetchUserVideos();
  }, [userName]);
};

export default UseFetchAllVideos;
