import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { GET_NOTIFIED, HOST } from "../api/constants.js";
import PropTypes from "prop-types";
import { addMessage, setRoomMsg } from "../redux/socketSlice.js";
import { setNotification } from "../redux/reducerSlice.js";
import { clientAPI } from "../api/axios-api.js";

//Using the useSocket custom Hook ClientSocket Connection Done
const SocketContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const buddyInfo = useSelector((state) => state.emailverify);

  const dispatch = useDispatch();
  const socket = useRef();
  // eslint-disable-next-line no-unused-vars
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (buddyInfo && buddyInfo.buddyId !== null) {
      console.log(`connected buddy - ${buddyInfo.buddyId}`);
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: buddyInfo.buddyId },
      });

      // Socket Connection
      socket.current.on("connect", () => {
        console.log("Connected to the server");
        setIsConnected(true);
      });

      // Function to receive Direct messages
      const handleReceive = async (message) => {
        if (
          message.sender === buddyInfo.buddyId ||
          message.recipient === buddyInfo.buddyId
        ) {
          dispatch(addMessage(message));
        }
      };

      // Function to receive Group Message filtered in server socket connection members in group will receive messages
      const handleReceiveGroup = async (message) => {
        if (message || message.groupID) {
          dispatch(setRoomMsg(message));
        }
      };

      //Function to send the DM notification
      const handleNotification = async (notification) => {
        if (notification.senderID) {
          const response = await clientAPI.post(
            GET_NOTIFIED,
            { id: notification.senderID },
            { withCredentials: true }
          );
          dispatch(setNotification(response.data));
        }
      };

      // Socket Connection Error Handling
      socket.current.on("connect_error", (err) => {
        console.error("Connection error:", err);
      });
      //Socket Connection Event Handling
      socket.current.on("receiveMessage", handleReceive);
      socket.current.on("receiveGroupMessage", handleReceiveGroup);
      socket.current.on("notification", handleNotification);
      // socket.current.on("groupNotification", handleGroupNotification);
      // socket.current.on("loggedUsers", handleLoggedUser);

      // Socket Disconnection in Unmount
      return () => {
        socket.current.disconnect();
        console.log("Disconnected from the server");
        setIsConnected(false);
      };
    }
  }, [buddyInfo, dispatch]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node,
};
