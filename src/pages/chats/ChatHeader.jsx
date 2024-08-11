import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import Contacts from "../../components/Contacts.jsx";
import { useSelector } from "react-redux";
import WelcomeComponent from "../../components/EmptyChat.jsx";
import "../../App.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ChatHeader = () => {
  //Redux State
  const fellowDetails = useSelector((state) => state.emailverify);
  //Show Canvas for mobile devices
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const navigate = useNavigate();

  const handleToggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
    navigate(`/contacts/${fellowDetails.buddyId}`);
  };

  return (
    <>
      {/* Show Empty Container if Chat contact not selected */}
      {!fellowDetails &&
        fellowDetails.fellowNick === fellowDetails.nickname && (
          <WelcomeComponent />
        )}
      <div
        className="d-flex position-fixed align-items-center bg-light rounded-top border border-dark 
        custom-height custom-border p-2"
      >
        <button className="flex btn d-md-none" onClick={handleToggleOffcanvas}>
          <ArrowBackIcon className="text-dark" sx={{ width: 30, height: 30 }} />
        </button>
        <Avatar className="ms-2" src={`${fellowDetails.fellowImage}`} />
        {fellowDetails.fellowNick !== null ? (
          <span className="ms-2 text-primary">{fellowDetails.fellowNick}</span>
        ) : (
          <span className="ms-2 text-primary">{fellowDetails.groupName}</span>
        )}
        <div className="d-flex g-5 align-items-center">
          <div className="flex align-items-center justify-content-center g-5"></div>
          <div
            className={`offcanvas offcanvas-start ${
              showOffcanvas ? "show" : ""
            } bg-dark`}
            tabIndex="-1"
          >
            {/* OnClick Canvas Contacts container is loaded */}
            {showOffcanvas && <Contacts />}
          </div>
        </div>
      </div>
    </>
  );
};
export default ChatHeader;
