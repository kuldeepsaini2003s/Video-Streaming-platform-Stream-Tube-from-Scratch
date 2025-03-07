import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [],
  allVideos: [],
  singleVideo: [],
  youtubeLogo: [],
  youtubeComments: [],
  fetchedCategoriesVideo: [],
  category: "All",
};
const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    setVideosList: (state, action) => {
      state.videos = action.payload;
    },
    setAllVideos: (state, action) => {
      state.allVideos = action.payload;
    },
    setSingleVideo: (state, action) => {
      state.singleVideo = action.payload;
    },
    setYoutubeLogo: (state, action) => {
      state.youtubeLogo = action.payload;
    },
    setYoutubeComments: (state, action) => {
      state.youtubeComments = action.payload;
    },
    setFetchedCategoriesVideo: (state, action) => {
      state.fetchedCategoriesVideo = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
});

export const {
  setVideosList,
  setAllVideos,
  setSingleVideo,
  setYoutubeLogo,
  setYoutubeComments,
  setFetchedCategoriesVideo,
  setCategory,
} = videoSlice.actions;

export default videoSlice.reducer;
