import { useNavigate } from "react-router-dom";
import { clientAPI } from "../../api/axios-api";
import { useEffect, useState } from "react";
import { ADD_GROUP_MEMBER, GET_GROUPS, GROUP_ID } from "../../api/constants.js";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  setFellowId,
  setFellowImage,
  setFellowNick,
  setGroupAuth,
  setGroupId,
  setGroupName,
  setScreen,
} from "../../redux/reducerSlice.js";
import GroupIcon from "../../assets/groupIcon.png";
import { Avatar } from "@mui/material";

const Channels = () => {
  //Redux State variable
  const buddyInfo = useSelector((state) => state.emailverify);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  //State to render the Group messages
  const [groupChats, setGroupChats] = useState([]);
  //State to show the modal action for user to join the group
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const getGroupChats = async () => {
      try {
        const response = await clientAPI.get(GET_GROUPS, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setGroupChats(response.data.groups);
        }
      } catch (error) {
        console.log("Error fetching", error);
      }
    };
    getGroupChats();
  }, [buddyInfo.groupName]);
  //Onclick the Group name the desired functions are lined up with conditions
  const handleClick = async (id, members, groupName) => {
    try {
      const response = await clientAPI.get(`${GROUP_ID}/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const isMobile = window.matchMedia("(max-width: 427px)").matches;
        const isMember = members.includes(buddyInfo.buddyId);
        dispatch(setGroupId(id));
        dispatch(setGroupName(groupName));
        dispatch(setScreen(true));
        //If mobile then navigation happens
        if (isMobile) {
          if (isMember) {
            navigate(`/groupchat/${id}`);
          } else {
            setShowModal(true);
            dispatch(setGroupAuth(true));
          }
        } else {
          navigate(`/group`);
          if (!isMember) {
            navigate(`/group`);
            setShowModal(true);
            dispatch(setGroupAuth(false));
          } else {
            dispatch(setGroupAuth(true));
            dispatch(setFellowNick(null));
            dispatch(setFellowId(null));
            dispatch(setFellowImage(null));
          }
        }
      } else {
        console.log("Error fetching Group.");
      }
    } catch (error) {
      console.log("Error fetching Group:", error);
    }
  };

  //Joining Group Function
  const handlejoinGroup = async () => {
    try {
      const response = await clientAPI.post(
        ADD_GROUP_MEMBER,
        { recipientId: buddyInfo.buddyId, groupid: buddyInfo.groupId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setShowModal(false);
        if (window.matchMedia("(max-width: 427px)").matches) {
          navigate(`/groupchat/${buddyInfo.groupId}`);
        }
        dispatch(setGroupAuth(true));
      }
    } catch (error) {
      console.log("Error joining group", error);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-start mt-4">
        <div className="d-flex flex-column">
          <div>
            <h6 className=" text-dark"> Groups</h6>
          </div>
          {groupChats.map((group) => (
            <div key={group.groupId} className="d-flex align-items-center mb-2">
              <Avatar className="ms-2" src={GroupIcon} />
              <div
                className="ms-2 mt-1 text-secondary"
                type="button"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleClick(group.groupId, group.members, group.groupName)
                }
              >
                {group.groupName}
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div
            className="modal modal-custom text-dark"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-center">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Do You want to join the Group
                  </h1>
                </div>
                <div className="modal-body d-flex justify-content-center">
                  <button
                    className="btn btn-danger ms-2"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary ms-2"
                    onClick={handlejoinGroup}
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Channels;

Channels.propTypes = {
  group: PropTypes.shape({
    groupId: PropTypes.string,
    groupName: PropTypes.string,
  }),
};
