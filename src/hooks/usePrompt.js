import { useEffect } from "react";
import { useNavigate, useLocation, useBlocker } from "react-router-dom";

const usePrompt = (message, when) => {
  const navigate = useNavigate();
  const location = useLocation();
  const blocker = useBlocker();

  useEffect(() => {
    if (!when) return;

    // eslint-disable-next-line no-unused-vars
    const handleBlock = (tx) => {
      if (blocker.block(tx.location.pathname)) {
        if (window.confirm(message)) {
          blocker.unblock();
          navigate(tx.location.pathname);
        }
      }
    };

    const handlePopState = (e) => {
      if (blocker.block(location.pathname)) {
        if (!window.confirm(message)) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [blocker, location, message, navigate, when]);
};

export default usePrompt;
