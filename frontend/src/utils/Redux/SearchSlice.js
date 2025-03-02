import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "suggestion",
  initialState: {
    searchQuery: "",    
  },
  reducers: {
    setSearchQuary: (state, action) => {
      state.searchQuery = action.payload;
    },    
  },
});

export const { setSearchQuary } = searchSlice.actions;
export default searchSlice.reducer;
