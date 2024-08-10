import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    messages: [],
    rooms: [],
    imageUrl: "",
  },
  reducers: {
    addMessage: (state, action) => {
      if (Array.isArray(action.payload) && action.payload.length === 0) {
        // Handle the case where payload is an empty array
        state.messages = [];
      } else if (Array.isArray(action.payload)) {
        // Push each element of the payload array into alertDetails
        state.messages.push(...action.payload);
      } else {
        // Append if payload is a single notification
        state.messages.push(action.payload);
      }
    },
    setRoomMsg: (state, action) => {
      state.rooms.push(action.payload);
    },
    addImage: (state, action) => {
      state.image = action.payload;
    },
  },
});

export const { addMessage, setRoomMsg, addImage } = socketSlice.actions;

export default socketSlice.reducer;
