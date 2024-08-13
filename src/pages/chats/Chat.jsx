import { clientAPI } from "../../api/axios-api.js";
import { GET_BUDDY, LOGOUT_ROUTE } from "../../api/constants.js";
import { useDispatch, useSelector } from "react-redux";
import {
  loggedBuddy,
  setFirst,
  setLast,
  setNick,
  setUserImage,
  setFellowNick,
  setScreen,
  setFellowImage,
  setFellowId,
  setGroupAuth,
  setGroupId,
  setGroupName,
  setNotification,
  showMsg,
} from "../../redux/reducerSlice.js";
import { addMessage } from "../../redux/socketSlice.js";
import { useBlocker, useParams } from "react-router-dom";
import { lazy, Suspense, useEffect, useMemo } from "react";
import Loader from "../../components/Loader.jsx";
import sessionStorage from "redux-persist/es/storage/session";
import CustomModal from "../../components/CustomModal.jsx";
const ChatBody = lazy(() => import("./ChatBody.jsx"));
const Contacts = lazy(() => import("../../components/Contacts.jsx"));
const EmptyChat = lazy(() => import("../../components/EmptyChat.jsx"));

const Chat = () => {
  //Get Redux action instance
  const showSplit = useSelector((state) => state.emailverify);
  const dispatch = useDispatch();
  //Use params
  const { userid } = useParams();

  const routesToPrompt = useMemo(() => ["/", "/buddy"], []);

  let blocker = useBlocker(
    ({ nextLocation }) =>
      routesToPrompt.includes(nextLocation.pathname) &&
      sessionStorage.getItem("isAuthenticated") === "true"
  );

  const handleConfirm = async () => {
    try {
      const response = await clientAPI.post(
        LOGOUT_ROUTE,
        { id: showSplit.buddyId },
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

  const handleCancel = () => {
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
      <Suspense fallback={<Loader />}>
        {blocker.state === "blocked" ? (
          <CustomModal
            message={"Do you want to leave this page"}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        ) : null}
        <div className="container">
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
      </Suspense>
    </>
  );
};

export default Chat;
