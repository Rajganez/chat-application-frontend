import { useEffect, useRef, useState } from "react";
import "../../App.css";
import { IoSendSharp } from "react-icons/io5";
import { CgAttachment } from "react-icons/cg";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { clientAPI } from "../../api/axios-api";
import { UPLOAD_MEDIA } from "../../api/constants.js";

const SendBar = () => {
  //State to ensure the Payload is not empty
  const [message, setMessage] = useState("");
  //State to Open the emojicons
  const [emojiOpen, setEmojiOpen] = useState(false);
  //Redux state variables
  const buddyInfo = useSelector((state) => state.emailverify);
  //Emoji event handlers
  const emojiRef = useRef();
  //To handle file events to download in the browser
  const fileRef = useRef();
  //Socket context hooks
  const socket = useSocket();
  //Onclick send button emits the message to socket.io server
  const handleSend = async () => {
    if (message !== "") {
      socket.emit("sendMessage", {
        content: message,
        sender: buddyInfo.buddyId,
        recipient: buddyInfo.fellowId,
        messageType: "text",
      });
    } else {
      alert("Message is empty");
      return;
    }
    setMessage("");
  };
  //Handling File attachment to Append the files
  const handleFileAttachment = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };
  //Appending media files to the payload
  const handleAttachmentChange = async () => {
    try {
      const file = fileRef.current.files[0];
      if (file) {
        const formData = new FormData();
        const originalFileName = file.name;
        const modifiedFileName = originalFileName.replace(/\s+/g, "_");
        formData.append("file", file, modifiedFileName);
        //Axios API call to send the formData
        const response = await clientAPI.post(UPLOAD_MEDIA, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        //On Reaceiving success the cloudinary url is sent to the socket.io server
        if (response.status === 200 && response.data) {
          socket.emit("sendMessage", {
            content: response.data.file,
            sender: buddyInfo.buddyId,
            recipient: buddyInfo.fellowId,
            messageType: "file",
          });
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  //Function to attach the emoji with the payload message
  const handleEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  //Event handler to close the emoji picker from react
  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  return (
    <>
      <div className="custom-height position-fixed bg-light rounded-4 text-light d-flex justify-content-center align-item-center ms-2 mb-1 g-5">
        <div className="d-flex flex-grow-1 bg-light rounded align-items-center">
          <input
            type="text"
            className="flex-grow-1 bg-light rounded custom-focus"
            placeholder="Enter message"
            style={{ border: "none" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="btn text-secondary transition custom-focus custom-duration "
            onClick={handleFileAttachment}
          >
            <CgAttachment className="fs-5" />
          </button>
          <input
            type="file"
            className="d-none"
            ref={fileRef}
            onChange={handleAttachmentChange}
          />
          <div className="position-relative">
            <button
              className="btn text-secondary transition custom-focus custom-duration "
              onClick={() => setEmojiOpen(true)}
            >
              <RiEmojiStickerLine className="fs-5" />
            </button>
          </div>
          <div className="position-absolute bottom-16 left-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiOpen}
              onEmojiClick={handleEmoji}
              autoFocusSearch={false}
              width={"300px"}
              height={"400px"}
            />
          </div>
        </div>
        <button
          className="btn text-white bg-primary transition custom-focus custom-duration"
          onClick={handleSend}
        >
          <IoSendSharp className="fs-5" />
        </button>
      </div>
    </>
  );
};

export default SendBar;
