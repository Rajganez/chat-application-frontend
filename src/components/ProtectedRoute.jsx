import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import PromptContext from "../context/PromptProvider";

const isAuthenticated = () => {
  return sessionStorage.getItem("isAuthenticated") === "true";
};

const ProtectedRoute = ({ children }) => {
  const { activatePrompt } = useContext(PromptContext);
  const location = useLocation();

  useEffect(() => {
    if (
      isAuthenticated() &&
      (location.pathname === "/" || location.pathname === "/buddy")
    ) {
      activatePrompt("Are you sure you want to leave this page?", {
        retry: () => {
        },
      });
    }
  }, [location.pathname, activatePrompt]);

  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
