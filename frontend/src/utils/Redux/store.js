import { configureStore } from "@reduxjs/toolkit";
import videoSlice from "./VideoSlice";
import ChatSlice from "./ChatSlice";
import SearchSlice from "./SearchSlice";
import appSlice from "./appSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    app: appSlice,
    videos: videoSlice,
    chat: ChatSlice,
    searchSuggestion: SearchSlice,
  },
});

export default store;
