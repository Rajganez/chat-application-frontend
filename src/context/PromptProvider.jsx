import { createContext, useState, useMemo, useEffect } from "react";
import CustomModal from "../components/CustomModal";
import PropTypes from "prop-types";
import { clientAPI } from "../api/axios-api";
import { LOGOUT_ROUTE } from "../api/constants";
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
} from "../redux/reducerSlice";
import { addMessage } from "../redux/socketSlice";
import { useNavigate, useLocation } from "react-router-dom";

const PromptContext = createContext();

export const PromptProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const buddyDetails = useSelector((state) => state.emailverify);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize routesToPrompt to prevent unnecessary effect re-runs
  const routesToPrompt = useMemo(() => ["/", "/buddy"], []);

  const handleConfirm = async () => {
    try {
      const response = await clientAPI.post(
        LOGOUT_ROUTE,
        { id: buddyDetails.buddyId },
        { withCredentials: true }
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
        navigate("/buddy");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const activatePrompt = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  // Hook to listen to route changes
  useEffect(() => {
    const unblock = navigate.block((nextLocation) => {
      if (routesToPrompt.includes(nextLocation.pathname)) {
        activatePrompt("Are you sure you want to leave this page?");
        return false; // Prevent navigation
      }
      return true; // Allow navigation
    });

    // Cleanup the blocker on unmount
    return () => {
      unblock();
    };
  }, [navigate, location, routesToPrompt]);

  return (
    <PromptContext.Provider
      value={{
        showModal,
        modalMessage,
        activatePrompt,
        handleConfirm,
        handleCancel,
      }}
    >
      {children}
      {showModal && (
        <CustomModal
          message={modalMessage}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </PromptContext.Provider>
  );
};

export default PromptContext;

PromptProvider.propTypes = {
  children: PropTypes.node,
};
