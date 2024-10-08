import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../App.css";
import { clientAPI } from "../api/axios-api.js";
import { LOGIN_ROUTE } from "../api/constants.js";
import { useDispatch } from "react-redux";
import { setUserImage, setVerified } from "../redux/reducerSlice.js";

// Login Component Used in the Welcome page
const Login = () => {
  // To Reset the Form to initial state
  const initialForm = {
    loginEmail: "",
    LoginPassword: "",
  };

  // State to send the payload
  const [formData, setFormData] = useState(initialForm);

  // Error State to show the error message in form submission
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Used Redux Slice and Redux-persist
  const dispatch = useDispatch();

  // Axios API-Call
  const loginFunc = async () => {
    try {
      const response = await clientAPI.post(LOGIN_ROUTE, formData);
      const { status } = response;
      const { emailVerifed, profiling, userID, imageStr } = response.data;

      if (status === 200 && emailVerifed && profiling) {
        sessionStorage.setItem("isAuthenticated", "true");
        navigate(`/chat/${userID}`);
        dispatch(setVerified(emailVerifed));
      } else if (status === 200) {
        sessionStorage.setItem("isAuthenticated", "true");
        // Validate if Email is verified or not
        dispatch(setVerified(emailVerifed));
        // Set the user image (null if not provided)
        dispatch(setUserImage(imageStr || null));
        alert("Buddy Logged in successfully");
        navigate(`/buddy/profile/${userID}`);
      } else if (status === 401) {
        alert("Incorrect Credentials.");
      }
    } catch (error) {
      console.error("Error response:", error.response);
      if (error.response && error.response.status === 401) {
        alert("Invalid Credentials.");
      } else {
        console.error("Login failed:", error.message);
        alert("An error occurred during login.");
      }
    }
  };

  // Form Handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  // Handling Login Submit Button with Handled Form Error
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if formData.loginEmail is defined and is a string before using string methods
    const email = formData.loginEmail || "";
    const validEmailDomains = [".com", ".in", ".org", ".dev"];
    const emailDomainValid = validEmailDomains.some((domain) =>
      email.endsWith(domain)
    );

    if (!email.includes("@") || !emailDomainValid) {
      setError("Enter a valid email");
      return;
    }
    if (email === "" || formData.LoginPassword === "") {
      setError("All Fields must not be empty.");
      return;
    } else {
      loginFunc();
      setFormData(initialForm);
    }
  };

  return (
    <>
      <form>
        <div className="form-group my-5">
          <label htmlFor="loginEmail">
            Email ID <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className="form-control"
            name="loginEmail"
            value={formData.loginEmail}
            onChange={handleChange}
            id="loginEmail"
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="form-group my-5">
          <label htmlFor="LoginPassword">
            Password <span className="text-danger">*</span>
          </label>
          <input
            type="password"
            className="form-control"
            id="LoginPassword"
            name="LoginPassword"
            value={formData.LoginPassword}
            onChange={handleChange}
            placeholder="Your password"
            required
          />
        </div>
        <NavLink to="/forgotpassword" className="forgot-password my-5">
          Forgotten Password?
        </NavLink>
        <div className="d-flex row justify-content-center my-2">
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary bg-gradient p-2 text-white bg-opacity-50 btn-lg mt-3 rounded-5"
          >
            Login
          </button>
        </div>
      </form>
      {error && (
        <div
          className="toast align-items-center text-bg-danger border-0 show position-fixed bottom-0 end-0 p-1 m-1"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{error}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setError("")}
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
