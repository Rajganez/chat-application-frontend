//Backend Server URL
export const HOST = import.meta.env.VITE_SERVER_URL;

// API routes for Authentications/Authorization
export const USER_ROUTE = "/buddy";
export const SIGNUP_ROUTE = `${USER_ROUTE}/signup`;
export const FORGOT_ROUTE = `${USER_ROUTE}/forgotpassword`;
export const RESET_ROUTE = `${USER_ROUTE}/resetpassword`;
export const VERIFY_ROUTE = `${USER_ROUTE}/buddyverify`;
export const LOGIN_ROUTE = `${USER_ROUTE}/login`;
export const PROFILE_ROUTE = `${USER_ROUTE}/profile`;
export const SEND_MAIL = `${USER_ROUTE}/profile`;
export const REMOVE_PROFILE = `${USER_ROUTE}/remove`;
export const UPLOAD_PROFILE = `${USER_ROUTE}/upload`;
export const LOGOUT_ROUTE = `${USER_ROUTE}/logout`;

//API Routes to access the user chat data 
export const CHAT_ROUTE = "/chat";
export const GET_BUDDY = `${CHAT_ROUTE}`;
export const SEARCH_BUDDY = `${CHAT_ROUTE}/search`;
export const FELLOW_BUDDY = `${CHAT_ROUTE}/fellow`;
export const GET_DM = `${CHAT_ROUTE}/directmessages`;
export const UPLOAD_FILE = `${CHAT_ROUTE}/uploadfile`;
// export const GET_CHAT_CONTACT = `${CHAT_ROUTE}/getchatcontacts`;
export const GET_NOTIFIED = `${CHAT_ROUTE}/getbuddies`;
export const UPLOAD_MEDIA = `${CHAT_ROUTE}/uploadmedia`;

//API Routes to access the Group chat data 
export const GROUP_ROUTE = "/groups";
export const GET_GROUPS = `${GROUP_ROUTE}`;
export const GROUP_ID = `${GROUP_ROUTE}`;
export const ADD_GROUP_MEMBER = `${GROUP_ROUTE}/addrecipient`;
export const GET_GROUP_CHAT = `${GROUP_ROUTE}/getgroupchat`;
export const EXIT_GROUP = `${GROUP_ROUTE}/exitgroup`;
// export const KNOW_SENDER = `${GROUP_ROUTE}/displaysender`;
