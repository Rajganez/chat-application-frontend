import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { clientAPI } from "../../api/axios-api.js";
import { GET_GROUP_CHAT, HOST } from "../../api/constants.js";
import "../../App.css";
import { IoDownload } from "react-icons/io5";
import { FaFolder } from "react-icons/fa";

// The GroupMessageBody component handles group chat messages and displays them
const GroupMessageBody = () => {
  //Page Scrolling behaviour handled by this event
  const scrollRef = useRef();
  //Fetching the messages Redux state to render the Page
  const message = useSelector((state) => state.socket.rooms);
  const buddyiesInfo = useSelector((state) => state.emailverify);
  //State to Render the Group Message from the DB
  const [messagesfromDB, setMessage] = useState([]);
  //Error handling for member not in group
  const [error, setError] = useState(false);
  //Function to handle the Image properties
  //State to show the Image in Zoom in mode
  const [imageView, setImage] = useState(null);

  const hideImage = () => setImage(null);
  const showImage = (img) => setImage(img);

  // Fetch messages from the server
  const getGroupMsgfromDB = useCallback(() => {
    if (buddyiesInfo.groupId) {
      const getGroupChat = async () => {
        try {
          const response = await clientAPI.post(
            GET_GROUP_CHAT,
            {
              buddyId: buddyiesInfo.buddyId,
              groupid: buddyiesInfo.groupId,
            },
            { withCredentials: true }
          );
          if (response.status === 200) {
            setMessage(response.data.nickName);
            setError(true);
          } else {
            console.error("Error fetching messages");
          }
        } catch (error) {
          if (error.response?.status === 404) {
            setError(false);
          }
        }
      };
      getGroupChat();
    }
  }, [buddyiesInfo]);

  useEffect(() => {
    getGroupMsgfromDB();
  }, [buddyiesInfo.groupId, message, getGroupMsgfromDB]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesfromDB]);

  const renderMsg = () =>
    messagesfromDB.map((msgObj, ind) =>
      renderDM(msgObj.senderId, msgObj.message, msgObj.nickname, ind)
    );

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(`${HOST}/${fileUrl}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const extractFileName = (filePath) => filePath.split("/").pop();

  const renderDM = (sender, msg, nick, key) => {
    const isSender = sender === buddyiesInfo.buddyId;
    const messageContent = msg.includes("uploads/files") ? (
      /\.(jpg|png|jpeg|gif|bmp|tiff|webp|svg|ico|heic|heif)$/i.test(msg) ? (
        <img
          src={`${HOST}/${msg}`}
          width="200px"
          height="200px"
          alt=""
          onClick={() => showImage(`${HOST}/${msg}`)}
        />
      ) : /\.(mp4)$/i.test(msg) ? (
        <video src={`${HOST}/${msg}`} width="200px" height="200px" controls />
      ) : /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i.test(msg) ? (
        <span
          onClick={() => handleDownload(msg, extractFileName(msg))}
          style={{ display: "flex", alignItems: "center" }}
        >
          <FaFolder className="fs-5" style={{ marginRight: "8px" }} />
          {extractFileName(msg)}
          <IoDownload className="fs-5" style={{ marginLeft: "8px" }} />
        </span>
      ) : (
        msg
      )
    ) : (
      msg
    );

    return (
      <div key={key}>
        <div
          className={`d-flex ${
            isSender ? "justify-content-end" : "justify-content-start"
          } mb-2`}
        >
          <div
            className={`d-inline-block text-dark ${
              isSender
                ? "text-end bg-primary-subtle border rounded-start border-info"
                : "text-start bg-light border rounded-end border border-secondary"
            } text-break p-2 mt-1`}
          >
            {isSender ? (
              messageContent
            ) : (
              <>
                <div className="text-secondary d-flex justify-content-start fw-lighter group-notification-font">
                  ~{" "}
                  <span role="img" aria-label="smiling face with horns">
                    😈
                  </span>{" "}
                  {nick}
                </div>
                {messageContent}
              </>
            )}
          </div>
        </div>
        {imageView !== null && (
          <div className="position-fixed start-0 d-flex align-items-center justify-content-center custom-z-index start-50-above-425px">
            <div className="position-relative">
              <img src={imageView} className="img-fluid" alt="Full Size" />
              <button
                className="btn btn-close position-absolute top-0 end-0 m-3"
                onClick={hideImage}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-grow-1 overflow-auto p-4 px-4 custom-width scrollbar-hidden text-white">
      {error ? renderMsg() : <h6>Start New Chat</h6>}
      <div ref={scrollRef} />
    </div>
  );
};

export default GroupMessageBody;
