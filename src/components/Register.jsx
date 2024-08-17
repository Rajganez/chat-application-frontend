import { useState } from "react";
import { clientAPI } from "../api/axios-api.js";
import { useNavigate } from "react-router-dom";
import { SIGNUP_ROUTE } from "../api/constants.js";

//SignUp component used the Welcome Page
const Register = () => {
  //To Reset the Form to intialstate
  const intialForm = {
    signUpEmail: "",
    signUpPassword: "",
    confirmSignUpPassword: "",
  };
  //State to send the payload
  const [formData, setFormData] = useState(intialForm);
  //Error State to show the error message in form submission
  const [error, setError] = useState("");

  const navigate = useNavigate();

  //Form Value Change function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  //Axios API-Call
  const registeredData = async () => {
    try {
      const response = await clientAPI.post(SIGNUP_ROUTE, formData);
      if (response.status === 201) {
        alert("Buddy registered successfully! Please proceed to login.");
        localStorage.setItem("isVerifyToken", response.data.userToken);
        navigate("/buddy");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        alert("Buddy already registered! Please login.");
      } else {
        console.error("Error during registration: ", error.message);
        alert("An error occurred during registration. Please try again.");
      }
    }
  };

  //Submit Function verifies all parameters and handle Error and execute the API
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.signUpPassword !== formData.confirmSignUpPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }
    if (formData.signUpPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    const validEmailDomains = [".com", ".in", ".org", ".dev"];
    const emailDomainValid = validEmailDomains.some((domain) =>
      formData.signUpEmail.endsWith(domain)
    );
    if (!formData.signUpEmail.includes("@") || !emailDomainValid) {
      setError("Enter a valid email");
      return;
    }
    if (formData.signUpEmail === "" || formData.signUpPassword === "") {
      setError("All Fields must not be empty.");
      return;
    } else {
      registeredData();
      setFormData(intialForm);
    }
  };

  return (
    <>
      <div>
        <form>
          <div className="form-group mt-3">
            <label htmlFor="signUpEmail">
              Email ID <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              name="signUpEmail"
              value={formData.signUpEmail}
              onChange={handleChange}
              id="signUpEmail"
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="signUpPassword">
              Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              id="signUpPassword"
              name="signUpPassword"
              value={formData.signUpPassword}
              onChange={handleChange}
              placeholder="Must have at least 6 characters"
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="confirmSignUpPassword">
              Confirm Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmSignUpPassword"
              name="confirmSignUpPassword"
              value={formData.confirmSignUpPassword}
              onChange={handleChange}
              placeholder="Must have at least 6 characters"
              required
            />
          </div>
          <div className="d-flex row justify-content-center mt-3">
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary bg-gradient p-2 text-white bg-opacity-50 btn-lg mt-5 rounded-5"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      {/* Error toast Message at bottom of the screen */}
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

export default Register;
