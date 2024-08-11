import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../App.css";
import { clientAPI } from "../api/axios-api.js";
import { LOGIN_ROUTE } from "../api/constants.js";
import { useDispatch } from "react-redux";
import { setUserImage, setVerified } from "../redux/reducerSlice.js";

// Login Component Used in the Welcome page
const Login = () => {
  //To Reset the Form to intialstate
  const intialForm = {
    loginEmail: "",
    LoginPassword: "",
    confirmLoginPassword: "",
  };

  //State to send the payload
  const [formData, setFormData] = useState(intialForm);

  //Error State to show the error message in form submission
  const [error, setError] = useState("");

  const navigate = useNavigate();

  //Used Redux Slice and Redux-persist
  const dispatch = useDispatch();

  //Axios API-Call
  const loginFunc = async () => {
    try {
      const response = await clientAPI.post(LOGIN_ROUTE, formData, {
        withCredentials: true,
      });
      const { status } = response;
      const { emailVerifed, profiling, userID, imageStr } = response.data;

      if (status === 200 && emailVerifed && profiling) {
        navigate(`/chat/${userID}`);
        dispatch(setVerified(emailVerifed));
      } else if (status === 200) {
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
  //Form Handling
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
    if (formData.LoginPassword !== formData.confirmLoginPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }
    if (
      !formData.loginEmail.includes("@") ||
      !formData.loginEmail.endsWith(".com")
    ) {
      setError("Enter Valid Email.");
      return;
    }
    if (formData.loginEmail === "" || formData.LoginPassword === "") {
      setError("All Fields must not be empty.");
      return;
    } else {
      loginFunc();
      setFormData(intialForm);
    }
  };

  return (
    <>
      <form>
        <div className="form-group mt-3">
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
            required
          />
        </div>
        <div className="form-group mt-3">
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
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="confirmLoginPassword">
            Confirm Password <span className="text-danger">*</span>
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmLoginPassword"
            name="confirmLoginPassword"
            value={formData.confirmLoginPassword}
            onChange={handleChange}
            required
          />
        </div>
        <NavLink to="/forgotpassword" className="forgot-password">
          Forgotten Password?
        </NavLink>
        <div className="d-flex row justify-content-center mt-5">
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
