import { Navigate, useLocation, useBlocker } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext, useEffect, useState, useCallback } from "react";
import PromptContext from "../context/PromptProvider";
import CustomModal from "../components/CustomModal";

// Function to check authentication status
const isAuthenticated = () => {
  return sessionStorage.getItem("isAuthenticated") === "true";
};

const ProtectedRoute = ({ children }) => {
  const { activatePrompt } = useContext(PromptContext);
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [pendingTx, setPendingTx] = useState(null);

  const routesToPrompt = ["/", "/buddy"];

  const handleConfirm = () => {
    setShowModal(false);
    setPendingTx(null);
    pendingTx.retry();
  };

  const handleCancel = () => {
    setShowModal(false);
    setPendingTx(null);
  };

  const activatePromptLocal = useCallback((message, tx) => {
    setModalMessage(message);
    setShowModal(true);
    setPendingTx(tx);
  }, []);

  useBlocker(
    (tx) => {
      if (isAuthenticated() && routesToPrompt.includes(tx.location.pathname)) {
        activatePromptLocal("Are you sure you want to leave this page?", tx);
      } else {
        tx.retry();
      }
    },
    [location.pathname, routesToPrompt, activatePromptLocal]
  );

  useEffect(() => {
    if (showModal && pendingTx) {
      pendingTx.block();
    }
  }, [showModal, pendingTx]);

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
