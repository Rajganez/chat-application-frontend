import { lazy, Suspense } from "react";
const Contacts = lazy(() => import("../../components/Contacts.jsx"));
const WelcomeComponent = lazy(() => import("../../components/EmptyChat.jsx"));
const GroupChatBody = lazy(() => import("./GroupChatBody.jsx"));
import { useSelector } from "react-redux";
import Loader from "../../components/Loader.jsx";

const Chat = () => {
  const showSplit = useSelector((state) => state.emailverify);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className="showWebView container">
          <div className="contacts">
            <Contacts />
          </div>
          {showSplit.screen === false ? (
            <WelcomeComponent />
          ) : (
            <div className="chatBody">
              <GroupChatBody />
            </div>
          )}
        </div>
      </Suspense>
    </>
  );
};

export default Chat;
