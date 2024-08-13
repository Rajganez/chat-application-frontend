import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import { PromptProvider } from './context/PromptProvider.jsx';

const Chat = lazy(() => import('./pages/chats/Chat'));
const Welcome = lazy(() => import('./pages/users/Welcome'));
const ForgotPassword = lazy(() => import('./pages/users/ForgotPassword'));
const PasswordReset = lazy(() => import('./pages/users/PasswordReset'));
const VerifyBuddy = lazy(() => import('./pages/users/VerifyBuddy'));
const Profile = lazy(() => import('./pages/users/Profile'));
const ChatBody = lazy(() => import('./pages/chats/ChatBody'));
const Contacts = lazy(() => import('./components/Contacts'));
const GroupChatBody = lazy(() => import('./pages/groupchats/GroupChatBody'));
import WebDisplay from './pages/groupchats/WebDisplay';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
  },
  {
    path: '/buddy',
    element: <Welcome />,
  },
  {
    path: '/buddy/buddyverify/:id',
    element: <VerifyBuddy />,
  },
  {
    path: '/forgotpassword',
    element: <ForgotPassword />,
  },
  {
    path: '/resetpassword/:id',
    element: <PasswordReset />,
  },
  {
    path: '/buddy/profile/:userId',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chat/:userid',
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chat/fellowbuddy/:id',
    element: (
      <ProtectedRoute>
        <ChatBody />
      </ProtectedRoute>
    ),
  },
  {
    path: '/contacts/:id',
    element: (
      <ProtectedRoute>
        <Contacts />
      </ProtectedRoute>
    ),
  },
  {
    path: '/groupchat/:id',
    element: (
      <ProtectedRoute>
        <GroupChatBody />
      </ProtectedRoute>
    ),
  },
  {
    path: '/group',
    element: (
      <ProtectedRoute>
        <WebDisplay />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <h1>Page not Found</h1>,
  },
]);

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router}>
        <PromptProvider>
          {/* Your other components */}
        </PromptProvider>
      </RouterProvider>
    </Suspense>
  );
}

export default App;
