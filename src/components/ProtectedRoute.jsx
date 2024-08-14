import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
// import { useSelector } from "react-redux";

// Function to check authentication status
const isAuthenticated = () => {
  return sessionStorage.getItem("isAuthenticated") === "true";
};
//isAuthenticated is set to true in Login Component
const ProtectedRoute = ({ children }) => {
  // const buddyInfo = useSelector((state) => state.emailverify);
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
