import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "suggestion",
  initialState: {
    searchSuggestion: [],
  },
  reducers: {
    setSearchSuggestion: (state, action) => {
      state.searchSuggestion = action.payload;
    },
  },
});

export const { setSearchSuggestion } = searchSlice.actions;
export default searchSlice.reducer;
