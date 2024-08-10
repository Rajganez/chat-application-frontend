import { clientAPI } from "../../api/axios-api.js";
import { GET_BUDDY } from "../../api/constants.js";
import { useDispatch, useSelector } from "react-redux";
import {
  loggedBuddy,
  setFirst,
  setLast,
  setNick,
  setUserImage,
} from "../../redux/reducerSlice.js";
import { useParams } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Loader from "../../components/Loader.jsx";
const ChatBody = lazy(() => import("./ChatBody.jsx"));
const Contacts = lazy(() => import("../../components/Contacts.jsx"));
const EmptyChat = lazy(() => import("../../components/EmptyChat.jsx"));

const Chat = () => {
  //Get Redux action instance
  const showSplit = useSelector((state) => state.emailverify);
  const dispatch = useDispatch();
  //Use params
  const { userid } = useParams();

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
