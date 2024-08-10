import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { clientAPI } from "../../api/axios-api.js";
import { GET_GROUP_CHAT, HOST } from "../../api/constants.js";
import "../../App.css";
import { IoDownload } from "react-icons/io5";
import { FaFolder } from "react-icons/fa";

//The Group chats are handled differently from the DM and mongoDB storage is in different method
const GroupMessageBody = () => {
  //Page Scrolling behaviour handled by this event
  const scrollRef = useRef();
  //Fetching the messages Redux stateto render the Page
  const message = useSelector((state) => state.socket.rooms);
  //User Redux State variable
  const buddyiesInfo = useSelector((state) => state.emailverify);
  //Render the Group Message from the DB
  const [messagesfromDB, setMessage] = useState([]);
  //Error handling for member not in group
  const [error, setError] = useState(false);

  //API call to show the Group Message done using the callBack Hook
  const getGroupMsgfromDB = useCallback(() => {
    if (buddyiesInfo.groupId || buddyiesInfo.groupId !== null) {
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
            console.log("Error fetching messages");
          }
        } catch (error) {
          if (error.response.status === 404 && error.response.status) {
            setError(false);
          }
        }
      };
      getGroupChat();
    }
  }, [buddyiesInfo]);

  //On Each message in the Room then the API is triggered
  useEffect(() => {
    getGroupMsgfromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buddyiesInfo.groupId, message]);
  //useeffect for scrolling the page on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesfromDB]);

  //Render messages from the DB, sent in functions (senderId, message, nickname, index)
  const renderMsg = () => {
    return messagesfromDB.map((msgObj, ind) => {
      return renderDM(msgObj.senderId, msgObj.message, msgObj.nickname, ind);
    });
  };
  //To handle the Documents this uses only the render server and saved in the /tmp
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(`${HOST}/${fileUrl}`, {
        withCredentials: true,
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

  const renderDM = (sender, msg, nick, key) =>
    sender === buddyiesInfo.buddyId ? (
      <div key={key}>
        <div className="d-flex justify-content-end mb-2">
          <div
            className="d-inline-block text-dark text-end bg-primary-subtle border
            rounded-start border-info text-break p-2 mt-1"
          >
            {(msg.includes("uploads/files") &&
              (/\.(jpg|png|jpeg|gif|bmp|tiff|webp|svg|ico|heic|heif)$/i.test(
                msg
              ) ? (
                <div style={{ cursor: "pointer" }}>
                  <img src={`${HOST}/${msg}`} width="200px" height="200px" />
                </div>
              ) : /\.(mp4)$/i.test(msg) ? (
                <div style={{ cursor: "pointer" }}>
                  <video
                    src={`${HOST}/${msg}`}
                    width="200px"
                    height="200px"
                    controls
                  />
                </div>
              ) : /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i.test(msg) ? (
                <div style={{ cursor: "pointer" }}>
                  <span
                    onClick={() => handleDownload(msg, extractFileName(msg))}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <FaFolder className="fs-5" style={{ marginRight: "8px" }} />
                    {extractFileName(msg)}
                    <IoDownload
                      className="fs-5"
                      style={{ marginLeft: "8px" }}
                    />
                  </span>
                </div>
              ) : (
                msg
              ))) ||
              msg}
          </div>
        </div>
      </div>
    ) : (
      <div key={key}>
        {/* Nick name is set to the message sender in the group */}
        <div className="text-secondary d-flex justify-content-start fw-lighter fs-6">
          {nick}
        </div>
        <div className="d-flex justify-content-start mb-2">
          <div
            className="d-inline-block text-dark text-start bg-light border
            rounded-end border border-secondary text-break p-2 mt-1"
          >
            {(msg.includes("uploads/files") &&
              (/\.(jpg|png|jpeg|gif|bmp|tiff|webp|svg|ico|heic|heif)$/i.test(
                msg
              ) ? (
                <div style={{ cursor: "pointer" }}>
                  <img src={`${HOST}/${msg}`} width="200px" height="200px" />
                </div>
              ) : /\.(mp4)$/i.test(msg) ? (
                <div style={{ cursor: "pointer" }}>
                  <video
                    src={`${HOST}/${msg}`}
                    width="200px"
                    height="200px"
                    controls
                  />
                </div>
              ) : /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i.test(msg) ? (
                <div style={{ cursor: "pointer" }}>
                  <span
                    onClick={() => handleDownload(msg, extractFileName(msg))}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <FaFolder className="fs-5" style={{ marginRight: "8px" }} />
                    {extractFileName(msg)}
                    <IoDownload
                      className="fs-5"
                      style={{ marginLeft: "8px" }}
                    />
                  </span>
                </div>
              ) : (
                msg
              ))) ||
              msg}
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex-grow-1 overflow-auto p-4 px-4 custom-width scrollbar-hidden text-white">
      {error === true ? renderMsg() : <h6>Start New Chat</h6>}
      <div ref={scrollRef} />
    </div>
  );
};

export default GroupMessageBody;
