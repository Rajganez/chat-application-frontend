import { clientAPI } from "../../api/axios-api.js";
import { GET_BUDDY, LOGOUT_ROUTE } from "../../api/constants.js";
import { useDispatch, useSelector } from "react-redux";
import {
  loggedBuddy,
  setFellowId,
  setFellowImage,
  setFellowNick,
  setFirst,
  setGroupAuth,
  setGroupId,
  setGroupName,
  setLast,
  setNick,
  setNotification,
  setScreen,
  setUserImage,
  showMsg,
} from "../../redux/reducerSlice.js";
import { useBlocker, useParams } from "react-router-dom";
import { useEffect } from "react";
// import Loader from "../../components/Loader.jsx";
import ChatBody from "./ChatBody.jsx";
// const ChatBody = lazy(() => import("./ChatBody.jsx"));
import Contacts from "../../components/Contacts.jsx";
// const Contacts = lazy(() => import("../../components/Contacts.jsx"));
// const EmptyChat = lazy(() => import("../../components/EmptyChat.jsx"));
import EmptyChat from "../../components/EmptyChat.jsx";
import CustomModal from "../../components/CustomModal.jsx";
import { addMessage } from "../../redux/socketSlice.js";

const Chat = () => {
  //Get Redux action instance
  const showSplit = useSelector((state) => state.emailverify);
  const dispatch = useDispatch();
  //Use params
  const { userid } = useParams();

  const buddyDetails = useSelector((state) => state.emailverify);

  const isAuthenticated = () => {
    return sessionStorage.getItem("isAuthenticated") === "true";
  };

  //To prevent the user to return to the login without closing the session
  let blocker = useBlocker(
    ({ nextLocation }) =>
      isAuthenticated() &&
      (nextLocation.pathname === "/" || nextLocation.pathname === "/buddy")
  );
  //Used handle out to Logout the user
  const handleLogout = async () => {
    try {
      const response = await clientAPI.post(
        LOGOUT_ROUTE,
        { id: buddyDetails.buddyId },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch(setNick(null));
        dispatch(setFellowNick(null));
        dispatch(loggedBuddy(null));
        dispatch(setUserImage(null));
        dispatch(setFirst(null));
        dispatch(setLast(null));
        dispatch(setScreen(false));
        dispatch(setFellowImage(null));
        dispatch(setFellowId(null));
        dispatch(setGroupAuth(false));
        dispatch(setGroupId(null));
        dispatch(setGroupName(null));
        dispatch(setNotification([]));
        dispatch(addMessage([]));
        dispatch(showMsg(false));
        sessionStorage.setItem("isAuthenticated", "false");
        sessionStorage.setItem("isFirstLoad", "false");
        alert("Logged out successfully");
      }
    } catch (error) {
      console.log(error);
    }
    blocker.proceed();
  };

  const handleStay = () => {
    blocker.reset();
  };

  //Onmounting get all the details of the logged user from the API call
  useEffect(() => {
    const getBuddy = async () => {
      const response = await clientAPI.get(`${GET_BUDDY}/${userid}`, {
        withCredentials: true,
      });
      //On success response Redux state is updated with the intial values of the user
      if (response.status === 201) {
        const { imgStr, first, last, nick } = response.data;
        dispatch(setUserImage(imgStr));
        dispatch(setFirst(first));
        dispatch(setLast(last));
        dispatch(setNick(nick));
        dispatch(loggedBuddy(userid));
      }
    };
    getBuddy();
  }, [dispatch, userid]);
  // Main Container that shows the below components
  return (
    <>
      {/* <Suspense fallback={<Loader />}> */}
      <div className="container">
        {blocker.state === "blocked" ? (
          <CustomModal
            message={"Do You want to Leave this Page"}
            onConfirm={handleLogout}
            onCancel={handleStay}
          />
        ) : null}
        <div className="showWebView">
          <div className="contacts">
            <Contacts />
          </div>
          {showSplit.screen === false ? (
            <EmptyChat />
          ) : (
            <div className="chatBody">
              <ChatBody />
            </div>
          )}
        </div>
      </div>
      {/* </Suspense> */}
    </>
  );
};

export default Chat;
