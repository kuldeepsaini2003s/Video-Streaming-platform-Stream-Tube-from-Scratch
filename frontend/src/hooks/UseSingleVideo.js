import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSingleVideo } from "../utils/Redux/VideoSlice";
import { BACKEND_VIDEO } from "../utils/constants";
import axios from "axios";

const UseSingleVideo = (videoId) => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const getSingleVideo = async () => {
    try {
      const res = await axios.post(BACKEND_VIDEO + `/getVideo/${videoId}`, {
        userId: user && user?._id,
      });
      if (res.status === 200) {
        dispatch(setSingleVideo(res?.data?.data));
      }
    } catch (error) {
      handleError({
        error,
        message: "Error while getting video by id",
      });
    }
  };
  useEffect(() => {
    getSingleVideo();
  }, [videoId, user]);
};

export default UseSingleVideo;
