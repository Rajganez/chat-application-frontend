import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const usePrompt = (message, when) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (when) {
      const unblock = history.block((tx) => {
        if (window.confirm(message)) {
          unblock();
          navigate(tx.location.pathname);
        }
      });

      return () => {
        unblock();
      };
    }
  }, [message, when, navigate]);
};

export default usePrompt;
