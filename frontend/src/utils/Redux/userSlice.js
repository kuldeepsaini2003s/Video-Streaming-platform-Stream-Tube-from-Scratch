import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    channelUser: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setChannelUser: (state, action) => {
      state.channelUser = action.payload;
    },
  },
});

export const { setUser, setChannelUser } = userSlice.actions;
export default userSlice.reducer;
