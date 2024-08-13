import { Navigate, useLocation, useBlocker } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
import CustomModal from "../components/CustomModal";

// Function to check authentication status
const isAuthenticated = () => {
  return sessionStorage.getItem("isAuthenticated") === "true";
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [pendingTx, setPendingTx] = useState(null);

  const routesToPrompt = ["/", "/buddy"];

  const handleConfirm = () => {
    console.log("Confirm clicked, retrying navigation");
    if (pendingTx) {
      setShowModal(false);
      pendingTx.retry();
      setPendingTx(null);
    }
  };

  const handleCancel = () => {
    console.log("Cancel clicked, blocking navigation");
    setShowModal(false);
    if (pendingTx) {
      pendingTx.block();
      setPendingTx(null);
    }
  };

  const activatePromptLocal = useCallback((message, tx) => {
    console.log("Prompt activated", message, tx);
    setModalMessage(message);
    setShowModal(true);
    setPendingTx(tx);
  }, []);

  const blocker = useBlocker(() => {
    console.log("Blocking navigation attempt");
    if (isAuthenticated() && routesToPrompt.includes(location.pathname)) {
      activatePromptLocal("Are you sure you want to leave this page?");
    }
  }, [location.pathname, routesToPrompt, activatePromptLocal]);

  useEffect(() => {
    console.log("Pending transaction:");
    blocker();
  }, [blocker]);

  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {children}
      {showModal && (
        <CustomModal
          message={modalMessage}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
