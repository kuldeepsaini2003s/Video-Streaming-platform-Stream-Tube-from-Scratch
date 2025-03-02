import { createSlice } from "@reduxjs/toolkit";

const AppSlice = createSlice({
  name: "app",
  initialState: {
    open: false,
  },
  reducers: {
    toggleSlider: (state) => {
      state.open = !state.open;
    },
  },
});

export const {toggleSlider} = AppSlice.actions

export default AppSlice.reducer;
