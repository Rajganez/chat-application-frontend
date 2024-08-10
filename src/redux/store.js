import { configureStore, combineReducers } from "@reduxjs/toolkit";
import emailVerifySlice from "./reducerSlice.js";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import socketSlice from "./socketSlice.js";

const setUp = {
  key: "store",
  version: 1,
  storage,
};

//emailverify slice is used to persist the data
const persistedReducer = combineReducers({
  emailverify: persistReducer(setUp, emailVerifySlice),
  socket: socketSlice,
});

const store = configureStore({
  reducer: persistedReducer,
  devtools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
