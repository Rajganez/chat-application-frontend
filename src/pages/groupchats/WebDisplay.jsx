import { Suspense } from "react";
import Contacts from "../../components/Contacts.jsx";
import EmptyChat from "../../components/EmptyChat.jsx";
import GroupChatBody from "./GroupChatBody.jsx";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader.jsx";

const WebDisplay = () => {
  //Components show the web display of the application
  const showSplit = useSelector((state) => state.emailverify);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className="container">
          <div className="d-flex ">
            <div className="col-5">
              <Contacts />
            </div>
            {showSplit.groupAuth === false ? (
              <EmptyChat />
            ) : (
              <div className="col-6">
                <GroupChatBody />
              </div>
            )}
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default WebDisplay;
