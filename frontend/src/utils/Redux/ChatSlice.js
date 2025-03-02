import { createSlice } from "@reduxjs/toolkit";

const ChatSlice = createSlice({
  name:"chat",
  initialState: {
    message: [],
  },
  reducers: {
    setMessages: (state, action) => {
        state.message.splice(100,1);
      state.message.push(action.payload);
    },
  },
});

export const { setMessages } = ChatSlice.actions;
export default ChatSlice.reducer;
