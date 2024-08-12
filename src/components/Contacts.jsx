import { useNavigate } from "react-router-dom";
import { Avatar, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { BiLogOut } from "react-icons/bi";
import { TbUserSearch } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import {
  FELLOW_BUDDY,
  LOGOUT_ROUTE,
  NEW_NOTIFICATION,
  SEARCH_BUDDY,
} from "../api/constants.js";
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
} from "../redux/reducerSlice.js";
import { clientAPI } from "../api/axios-api.js";
import Channels from "../pages/groupchats/Channels.jsx";
import { addMessage } from "../redux/socketSlice.js";
import { useSocket } from "../context/SocketContext.jsx";
import { GoMail } from "react-icons/go";

const Contacts = () => {
  //Redux state object to get the actions
  const buddyDetails = useSelector((state) => state.emailverify);

  //Custom hook object to handle the socket events
  const socket = useSocket();

  //State to Close and Open the search Modal
  const [showModal, setShowModal] = useState(false);
  //State to Iterate the fellow buddies for sending messages
  const [fellowContacts, setFellowContacts] = useState([]);
  //State to hold the search results for getting notification messages
  const [searchResults, setSearchResults] = useState(new Set());
  //State to show the modal for new message when user log's in
  const [showNewMsgModal, setShowNewMsgModal] = useState(false);
  //State to render the new message in log in
  const [newMsg, setNewMsg] = useState([]);

  // Modal Function
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  //To navigate the user
  const navigate = useNavigate();
  //Dispath the action to the Redux state
  const dispatch = useDispatch();

  //Search Fellow on typing in the modal search bar
  const searchFellow = async (searchBuddy) => {
    if (searchBuddy.length > 0) {
      try {
        const response = await clientAPI.post(
          `${SEARCH_BUDDY}/${buddyDetails.buddyId}`,
          {
            searchBuddy,
          },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setFellowContacts(response.data);
        } else if (response.status === 404) {
          throw new Error("notfound");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setFellowContacts([]);
        } else {
          console.log(error);
        }
      }
    }
  };

  //Onclicking the contacts from searching in the modal
  const handleSearchClick = async (id) => {
    if (buddyDetails.alertDetails.length > 0) {
      setSearchResults((prevSearchResults) => {
        const newSearchResults = new Set(prevSearchResults);
        newSearchResults.delete(id);
        return newSearchResults;
      });
      dispatch(showMsg(true));
    }
    dispatch(setFellowId(id));
    const response = await clientAPI.get(`${FELLOW_BUDDY}/${id}`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      dispatch(setFellowNick(response.data.nickname));
      dispatch(setFellowImage(response.data.image));
      //If it is a mobile device then navigation done
      if (window.matchMedia("(max-width: 427px)").matches) {
        navigate(`/chat/fellowbuddy/${id}`);
      } else {
        navigate(`/chat/${buddyDetails.buddyId}`);
        dispatch(setScreen(true));
      }
    } else {
      console.log("Error fetching fellow buddy details");
    }
    setShowModal(false);
  };

  //Onclicking the Edit button then redirects to the profile page
  const handleEdit = async () => {
    try {
      navigate(`/buddy/profile/${buddyDetails.buddyId}`);
    } catch (error) {
      console.log(error);
    }
  };

  //useEffect for notification of the received messages
  useEffect(() => {
    if (socket) {
      socket.on("notification", (notification) => {
        setSearchResults((prevSearchResults) => {
          const newSearchResults = new Set(prevSearchResults);
          newSearchResults.add(notification.sender);
          return newSearchResults;
        });
        dispatch(showMsg(false));
      });
    }
  }, [dispatch, socket]);

  //Show Notification when user log's in
  useEffect(() => {
    try {
      const newNotification = async () => {
        const response = await clientAPI.post(
          NEW_NOTIFICATION,
          {
            id: buddyDetails.buddyId,
          },
          { withCredentials: true }
        );
        if (response.status === 201) {
          console.log(response);
          setShowNewMsgModal(true);
          setNewMsg(response.data.sender);
        }
      };
      newNotification();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("User not found");
        setShowNewMsgModal(false);
      }
    }
  }, []);

  //Logout function and cleared all the persist values from the Redux store
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
        alert("Logged out successfully");
        navigate("/buddy");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="position-relative vh-100 w-100 contact-background rounded-4 border shadow 
        p-2 "
      >
        <div className="row">
          <h4 className="col d-flex justify-content-center">
            <div className="slackey-regular text-dark"> Hi! Buddy</div>
          </h4>
        </div>

        <div
          className="bg-light custom-height mt-3 shadow border-top border-bottom
        border-secondary"
        >
          <span className="row d-flex align-items-center my-1 ms-1">
            <Stack className="col-2">
              <Avatar
                alt={buddyDetails.nickname}
                sx={{ width: 45, height: 45 }}
                style={{
                  objectFit: "contain",
                  color: "beige",
                  backgroundColor: "violet",
                }}
                src={`${buddyDetails.image}`}
              />
            </Stack>
            <span className="col-6 fs-4 text-primary">
              {buddyDetails.nickname}
            </span>
            <CiEdit
              className="col-2 text-dark fs-4"
              type="button"
              onClick={handleEdit}
            />
            <BiLogOut
              className="col-2 text-danger fs-4"
              type="button"
              onClick={handleLogout}
            />
          </span>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <h6 className="text-dark"> Contacts</h6>
          <TbUserSearch
            className="fs-5 text-dark"
            type="button"
            onClick={handleShowModal}
          />
        </div>

        <div className="results-container mt-3">
          {buddyDetails.alertDetails.length > 0 ? (
            <div className="lh-1">
              {buddyDetails.alertDetails.map((alert) => {
                const [key, result] = Object.entries(alert)[0];
                const { nick, img } = result;
                return (
                  <span key={key} className="d-flex mt-2">
                    <Avatar alt={nick} src={`${img}`} className="ms-2" />
                    <span
                      className="list-group-item fs-5 mt-2 ms-2 text-primary"
                      type="button"
                      onClick={() => handleSearchClick(key)}
                    >
                      {nick}
                      {!searchResults.has(key) &&
                        buddyDetails.showMsgAlert === false && (
                          <p className="fs-6 text-warning fw-lighter fst-italic blink-animation">
                            New Message
                          </p>
                        )}
                    </span>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-center">No New Messages</p>
          )}
        </div>
        {/* Default Groups Component */}
        <Channels />
        {showNewMsgModal && (
          <div
            className="modal-custom show bg-light text-dark border"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex mx-4 justify-content-between">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                  <GoMail className="fs-4"/> New Messages when you are Offline
                  </h1>
                  <button
                    type="button"
                    className="btn-close ms-5"
                    aria-label="Close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  {newMsg.map((val) => {
                    return (
                      <div key={val.id} className="d-flex align-items-center">
                        <Avatar
                          alt={val.nickname}
                          src={`${val.image}`}
                          className="ms-2"
                        />
                        <span className="fs-5 text-primary">{val.nickname}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Condition to show the modal on searching the buddies in the Application */}
        {showModal && (
          <div
            className="modal-custom show bg-light text-dark border"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex mx-4 justify-content-between">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Search Buddies
                  </h1>
                  <button
                    type="button"
                    className="btn-close ms-5"
                    aria-label="Close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-control mb-3">
                    <input
                      type="text"
                      className="form-control mt-2"
                      placeholder="Find Buddies..."
                      style={{ width: "75%" }}
                      onChange={(e) => searchFellow(e.target.value)}
                    />
                  </div>
                  {fellowContacts.length > 0 ? (
                    fellowContacts.map((user, ind) => (
                      <div key={ind} className="my-2 col d-flex">
                        <span className="flex row ms-1">
                          <Stack className="col">
                            <Avatar src={`${user.image}`} />
                          </Stack>
                          <span
                            className="col"
                            type="button"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleSearchClick(user._id)}
                          >
                            {user.nickName}
                          </span>
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="my-2 col d-flex">
                      <span>No Buddies...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Contacts;
