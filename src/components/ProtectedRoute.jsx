import { Navigate, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import PromptContext from "../context/PromptProvider";
import { useSelector } from "react-redux";

const isAuthenticated = () => {
  return sessionStorage.getItem("isAuthenticated") === "true";
};

const ProtectedRoute = ({ children }) => {
  const buddyInfo = useSelector((state) => state.emailverify);
  const { activatePrompt } = useContext(PromptContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      isAuthenticated() &&
      (location.pathname === "/" || location.pathname === "/buddy")
    ) {
      navigate(`/chat/${buddyInfo.buddyId}`);
      activatePrompt("Are you sure you want to leave this page?", {
        retry: () => {},
      });
    }
  }, [location.pathname, activatePrompt, buddyInfo, navigate]);

  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
