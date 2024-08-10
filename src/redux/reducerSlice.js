import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
  image: null,
  firstname: null,
  lastname: null,
  nickname: null,
  buddyId: null,
  fellowNick: null,
  fellowImage: null,
  screen: false,
  fellowId: null,
  groupId: null,
  groupName: null,
  groupAuth: false,
  alertDetails: [],
  showMsgAlert: false,
};

export const emailVerifySlice = createSlice({
  name: "emailverify",
  initialState,
  reducers: {
    setVerified: (state, action) => {
      state.value = action.payload;
    },
    setUserImage: (state, action) => {
      state.image = action.payload;
    },
    setFirst: (state, action) => {
      state.firstname = action.payload;
    },
    setLast: (state, action) => {
      state.lastname = action.payload;
    },
    setNick: (state, action) => {
      state.nickname = action.payload;
    },
    setFellowNick: (state, action) => {
      state.fellowNick = action.payload;
    },
    setFellowImage: (state, action) => {
      state.fellowImage = action.payload;
    },
    loggedBuddy: (state, action) => {
      state.buddyId = action.payload;
    },
    setScreen: (state, action) => {
      state.screen = action.payload;
    },
    setFellowId: (state, action) => {
      state.fellowId = action.payload;
    },
    setGroupId: (state, action) => {
      state.groupId = action.payload;
    },
    setGroupName: (state, action) => {
      state.groupName = action.payload;
    },
    setGroupAuth: (state, action) => {
      state.groupAuth = action.payload;
    },
    setNotification: (state, action) => {
      if (Array.isArray(action.payload) && action.payload.length === 0) {
        // Handle the case where payload is an empty array
        state.alertDetails = [];
      } else if (Array.isArray(action.payload)) {
        // Handle the case where payload is an array
        action.payload.forEach((newAlert) => {
          const newAlertKey = Object.keys(newAlert)[0];
          if (
            !state.alertDetails.some(
              (alert) => Object.keys(alert)[0] === newAlertKey
            )
          ) {
            state.alertDetails.push(newAlert);
          }
        });
      } else {
        // Handle the case where payload is a single notification
        const newAlertKey = Object.keys(action.payload)[0];
        if (
          !state.alertDetails.some(
            (alert) => Object.keys(alert)[0] === newAlertKey
          )
        ) {
          state.alertDetails.push(action.payload);
        }
      }
    },
    showMsg: (state, action) => {
      state.showMsgAlert = action.payload;
    },
  },
});

// Action creators for each case reducer function
export const {
  setVerified,
  setUserImage,
  setFirst,
  setLast,
  setNick,
  setFellowNick,
  setFellowImage,
  loggedBuddy,
  setScreen,
  setFellowId,
  setGroupId,
  setGroupName,
  setGroupAuth,
  setNotification,
  showMsg,
} = emailVerifySlice.actions;

export default emailVerifySlice.reducer;
