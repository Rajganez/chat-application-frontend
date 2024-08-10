import { useParams } from "react-router-dom";
import GroupChatHeader from "./GroupChatHeader";
import GroupMessageBody from "./GroupMessageBody";
import GroupSendBar from "./GroupSendBar";

const GroupChatBody = () => {
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams();
// Container to show the Group
  return (
    <div className="vh-100 message-background d-flex flex-column position-md-static flex-md-grow-1">
      <GroupChatHeader />
      <GroupMessageBody />
      <GroupSendBar />
    </div>
  );
};

export default GroupChatBody;
