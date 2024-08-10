import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
const ChatHeader = lazy(() => import("./ChatHeader"));
const MessageBody = lazy(() => import("./MessageBody"));
const SendBar = lazy(() => import("./SendBar"));

const ChatBody = () => {
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams();
  // Container that shows the below pages, which is rendereds to send messages
  return (
    <Suspense fallback={<Loader />}>
      <div className="vh-100 message-background rounded-4 d-flex flex-column position-md-static flex-md-grow-1">
        <ChatHeader />
        <MessageBody />
        <SendBar />
      </div>
    </Suspense>
  );
};

export default ChatBody;
