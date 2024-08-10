import axios from "axios";
import { HOST } from "./constants.js";

//Axios configuration for API requests
export const clientAPI = axios.create({
  baseURL: HOST,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//To Add Header-Authorisation to Verify the User using Email

clientAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("isVerifyToken");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
