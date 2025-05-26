import axios from "axios";
import { BACKEND_USER } from "../utils/constants";

const useRefreshToken = () => {
  const refreshAccessToken = async () => {
    try {
      const response = await axios.get(BACKEND_USER + "/refreshToken", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        },
      });
      if (response.status === 200) {
        localStorage.setItem("token", response?.data?.accessToken);
        localStorage.setItem("refreshToken", response?.data?.refreshToken);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error while refreshing the user token", error);
    }
  };

  return { refreshAccessToken };
};

export default useRefreshToken;
