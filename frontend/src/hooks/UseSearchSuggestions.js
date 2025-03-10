import { BACKEND_VIDEO } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setSearchSuggestion } from "../utils/Redux/SearchSlice";

const UseSearchSuggestions = () => {
  const dispatch = useDispatch();

  const getSearchSuggestion = async (searchQuery) => {
    try {
      const data = await fetch(
        BACKEND_VIDEO + `/searchSuggestion?searchQuery=${searchQuery}`
      );
      const json = await data.json();      
      dispatch(setSearchSuggestion(json?.data));
    } catch (error) {
      console.error("Error fetch search suggestion", error);
    }
  };

  return { getSearchSuggestion };
};

export default UseSearchSuggestions;
