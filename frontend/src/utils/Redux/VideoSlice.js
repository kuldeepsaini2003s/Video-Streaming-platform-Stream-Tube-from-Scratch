import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: null,
  allVideos: null,
  singleVideo: null,
  youtubeLogo: null,
  youtubeComments: null,
  fetchCategories: "",
  categories: null,
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
    setFetchCategories: (state, action) => {
      state.fetchCategories = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const {
  setVideosList,
  setAllVideos,
  setSingleVideo,
  setYoutubeLogo,
  setYoutubeComments,
  setFetchCategories,
  setCategories,
} = videoSlice.actions;

export default videoSlice.reducer;
