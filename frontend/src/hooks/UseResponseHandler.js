import { toast } from "react-toastify";
import useRefreshToken from "./useRefreshToken";

const useResponseHandler = () => {
  const { refreshAccessToken } = useRefreshToken();
  const handleResponse = ({
    status,
    message,
    onSuccess = () => {},
    toastId,
  }) => {
    const errorStatusCodes = [400, 401, 402, 403, 404, 409, 500];

    if (status === 200 || status === 201) {
      toast.update(toastId, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
      onSuccess();
    } else if (errorStatusCodes.includes(status)) {
      toast.update(toastId, {
        render: message || "An error occurred",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
    }
  };

  const handleError = ({
    error,
    toastId,
    message = "Something went wrong!",
  }) => {
    console.error("Error:", error);
    if (error?.response?.status === 401) {
      refreshAccessToken();
    }
    if (showToast) {
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        pauseOnFocusLoss: false,
        closeOnClick: true,
      });
    }
  };

  return { handleResponse, handleError };
};

export default useResponseHandler;
