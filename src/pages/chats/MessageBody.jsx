import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { clientAPI } from "../../api/axios-api.js";
import { GET_DM } from "../../api/constants.js";
import moment from "moment";
import "../../App.css";
import { IoDownload } from "react-icons/io5";
import { FaFolder } from "react-icons/fa";

const MessageBody = () => {
  // Event handling for scrolling to the bottom of the page when new messages are received
  const scrollRef = useRef();
  
  // Redux state variables to get the actions
  const message = useSelector((state) => state.socket.messages);
  const buddyiesInfo = useSelector((state) => state.emailverify);
  
  // State to Render messages from the DB
  const [messagesfromDB, setMessage] = useState([]);
  
  // Error to handle new user sends messages
  const [error, setError] = useState(false);
  
  // State to show the Shared Image in Zoom-in mode
  const [imageView, setImage] = useState(null);

  // Function to handle the Image properties
  const hideImage = () => setImage(null);
  const showImage = (img) => setImage(img);

  // Using Callback to Render the Message from the DB
  const getMsgfromDB = useCallback(async () => {
    if (buddyiesInfo.buddyId && buddyiesInfo.fellowId) {
      try {
        const response = await clientAPI.post(
          GET_DM,
          {
            buddyId: buddyiesInfo.buddyId,
            fellowId: buddyiesInfo.fellowId,
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setError(true);
          setMessage(response.data.messages);
        } else {
          console.log("Error fetching messages");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError(false);
          alert("Start new chat");
        } else {
          alert("Start new chat by sending a Hi message");
          console.log(error);
        }
      }
    }
  }, [buddyiesInfo]);

  // To Call the API on each message received
  useEffect(() => {
    getMsgfromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buddyiesInfo.fellowId, message]);

  // Scrolling on end of the page
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesfromDB]);

  // Function to set the date using moment.js using the timestamp of the message from the DB
  const renderMsg = () => {
    let lastDate = null;
    return messagesfromDB.map((msg) => {
      const messageData = moment(msg.timestamp).format("YYYY-MM-DD");
      const showDate = messageData !== lastDate;
      lastDate = messageData;
      return (
        <div key={msg.timestamp}>
          {showDate && (
            <div className="d-flex justify-content-center">
              <div className="badge text-center fw-light text-bg-light my-1">
                {moment(msg.timestamp).format("LL")}
              </div>
            </div>
          )}
          {renderDM(msg)}
        </div>
      );
    });
  };

  // For the Sent and Received Documents, Download Function
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Open the file in a new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const extractFileName = (filePath) => {
    return filePath.split("/").pop();
  };

  // Function to Separate the Sender and Recipient and different action for the different fileTypes
  const renderDM = (msg) => (
    <div key={msg.timestamp}>
      <div
        className={`d-flex ${msg.senderId === buddyiesInfo.buddyId ? 'justify-content-end' : 'justify-content-start'} mb-2`}
      >
        <div
          className={`d-inline-block text-dark ${msg.senderId === buddyiesInfo.buddyId ? 'text-end bg-primary-subtle border rounded-start border-info' : 'text-start bg-light border rounded-end border border-secondary'} text-break p-2 mt-1`}
        >
          {msg.messageType === "file" ? (
            (/\.(jpg|png|jpeg|gif|bmp|tiff|webp|svg|ico|heic|heif)$/i.test(msg.content) ? (
              <div style={{ cursor: "pointer" }}>
                <img
                  src={msg.content}
                  width="200px"
                  height="200px"
                  onClick={() => showImage(msg.content)}
                  alt="Preview"
                />
              </div>
            ) : /\.(mp4)$/i.test(msg.content) ? (
              <div style={{ cursor: "pointer" }}>
                <video
                  src={msg.content}
                  width="200px"
                  height="200px"
                  controls
                />
              </div>
            ) : /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i.test(msg.content) ? (
              <div style={{ cursor: "pointer" }}>
                <span
                  onClick={() => handleDownload(msg.content, extractFileName(msg.content))}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <FaFolder className="fs-5" style={{ marginRight: "8px" }} />
                  {extractFileName(msg.content)}
                  <IoDownload className="fs-5" style={{ marginLeft: "8px" }} />
                </span>
              </div>
            ) : (
              msg.content
            ))
          ) : (
            msg.content
          )}
        </div>
      </div>
      <div
        className={`d-flex ${msg.senderId === buddyiesInfo.buddyId ? 'justify-content-end' : 'justify-content-start'} text-secondary font-size-timestamp`}
      >
        {moment(msg.timestamp).format("LT")}
      </div>
      {imageView !== null && (
        <div
          className="position-fixed start-0 d-flex align-items-center 
          justify-content-center custom-z-index start-50-above-425px"
        >
          {/* To show the image view in the interface */}
          <div className="position-relative">
            <img src={imageView} className="img-fluid" alt="Full Size" />
            <button
              className="btn btn-close position-absolute top-0 end-0 m-3"
              onClick={hideImage}
              aria-label="Close"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="flex-grow-1 overflow-auto p-4 px-4 custom-width 
    scrollbar-hidden text-white"
    >
      {/* If the sender chats for the first time then condition is rendered */}
      {error ? renderMsg() : <h6>Start New Chat</h6>}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageBody;
