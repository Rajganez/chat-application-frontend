import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";
const Chat = lazy(() => import("./pages/chats/Chat"));
const Welcome = lazy(() => import("./pages/users/Welcome"));
const ForgotPassword = lazy(() => import("./pages/users/ForgotPassword"));
const PasswordReset = lazy(() => import("./pages/users/PasswordReset"));
const VerifyBuddy = lazy(() => import("./pages/users/VerifyBuddy"));
const Profile = lazy(() => import("./pages/users/Profile"));
const ChatBody = lazy(() => import("./pages/chats/ChatBody"));
const Contacts = lazy(() => import("./components/Contacts"));
const GroupChatBody = lazy(() => import("./pages/groupchats/GroupChatBody"));
import WebDisplay from "./pages/groupchats/WebDisplay";
import Loader from "./components/Loader";

function App() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
          <Routes>
            <Route>
              <Route path="/" element={<Welcome />} />
              <Route path="/buddy" element={<Welcome />} />
              <Route path="/buddy/buddyverify/:id" element={<VerifyBuddy />} />
              <Route path="/buddy/profile/:userId" element={<Profile />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/resetpassword/:id" element={<PasswordReset />} />
              <Route path="/chat/:userid" element={<Chat />} />
              <Route path="/chat/fellowbuddy/:id" element={<ChatBody />} />
              <Route path="/contacts/:id" element={<Contacts />} />
              <Route path="/groupchat/:id" element={<GroupChatBody />} />
              <Route path="/group" element={<WebDisplay />} />
            </Route>
            <Route path="*" element={<h1>Page not Found</h1>} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  );
}

export default App;
