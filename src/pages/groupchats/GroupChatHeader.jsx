import "../../App.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import Contacts from "../../components/Contacts.jsx";
import WelcomeComponent from "../../components/EmptyChat.jsx";
import { useState } from "react";
import { IoMdExit } from "react-icons/io";
import { clientAPI } from "../../api/axios-api.js";
import { EXIT_GROUP } from "../../api/constants.js";
import { useSelector } from "react-redux";
import {GroupIcon} from "../../assets/groupIcon.png";

const GroupChatHeader = () => {
  // Redux state variable
  const groupInfo = useSelector((state) => state.emailverify);
  //State to show the canvas
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const navigate = useNavigate();
  //Function to navigate on click as a canvas for mobile devices
  const handleToggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
    navigate(`/contacts/${groupInfo.buddyId}`);
  };
  //Buddy is removed from the Group by this API call
  const handleExitGoup = async () => {
    try {
      const response = await clientAPI.post(
        EXIT_GROUP,
        { id: groupInfo.buddyId },
        { withCredentials: true }
      );
      if(response.status === 200){
        alert("Exited successfully. You No longer can sent messages")
      }

    } catch (error) {
      console.log("Error Exiting group or Not in Group");
      alert("Failed to exit group.");
    }
  };

  return (
    <>
    {/* Buddy is not the member of the group then Empty container is shown */}
      {!groupInfo.groupAuth && <WelcomeComponent />}
      <div
        className="d-flex align-items-center bg-light rounded-top border border-dark 
        custom-height custom-border p-2"
      >
        <button className="flex btn d-md-none" onClick={handleToggleOffcanvas}>
          <ArrowBackIcon className="text-dark" sx={{ width: 30, height: 30 }} />
        </button>
        <Avatar className="ms-2" src={GroupIcon} />
        <span className="ms-2 text-dark">{groupInfo.groupName}</span>
        <div className="d-flex ms-5 align-items-end">
          <div
            className="flex ms-4 align-items-end fs-5 text-danger"
            type="button"
            style={{ cursor: "pointer" }}
            onClick={handleExitGoup}
          >
            <IoMdExit />
          </div>
          <div
            className={`offcanvas offcanvas-start ${
              showOffcanvas ? "show" : ""
            } bg-dark`}
            tabIndex="-1"
          >
            {showOffcanvas && <Contacts />}
          </div>
        </div>
      </div>
    </>
  );
};
export default GroupChatHeader;
