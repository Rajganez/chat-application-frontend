import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RESET_ROUTE } from "../../api/constants.js";
import { clientAPI } from "../../api/axios-api.js";
import background from "../../assets/sidebarimage.jpg";

const PasswordReset = () => {
  //With params password reset link is created
  const { id } = useParams();
  //Navigate to Login page after password reset done successfully
  const navigate = useNavigate();
  //Intial formdata
  const intialForm = {
    newPassword: "",
    confirmNewPassword: "",
  };
  //State for form data and error message
  const [formData, setFormData] = useState(intialForm);
  const [error, setError] = useState("");
  //Handle input change functionality
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };
  //Password reset function which sets the new password and the API call done
  const resetPassword = async () => {
    try {
      const response = await clientAPI.post(`${RESET_ROUTE}/${id}`, formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        alert(
          "Password reset successfully! Please login with your new password."
        );
        setTimeout(() => {
          navigate("/buddy");
        }, 1000);
      } else if (response.status === 401) {
        alert("Token Expired! Please try resetting your password again.");
        setTimeout(() => {
          navigate("/forgotpassword");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong, Try Resetting again.");
      setTimeout(() => {
        navigate("/forgotpassword");
      }, 1000);
    }
  };
  //After the validations submitted and the API is called
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Password and Confirm Password do not match");
      return;
    } else {
      resetPassword();
      setFormData(intialForm);
    }
  };

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="card shadow-lg bg-body-tertiary rounded">
            <div className="row g-0">
              <div className="col-md-6">
                <img
                  src={background}
                  className="img-fluid float-start"
                  alt="Sample image"
                  style={{ height: "100%" }}
                />
              </div>
              <div className="col-md-6">
                <div className="card-body">
                  <div>
                    <h2 className="d-flex justify-content-center">
                      <div className="slackey-regular"> Hi! Buddy</div>
                    </h2>
                    <div className="playwrite-ar text-center">
                      Set your New Password Here!
                    </div>
                  </div>
                  <div className="p-4 register-form form-container">
                    <form>
                      <div className="form-group mt-3">
                        <label htmlFor="newPassword">
                          New Password <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group mt-3">
                        <label htmlFor="confirmNewPassword">
                          Confirm New Password{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmNewPassword"
                          name="confirmNewPassword"
                          value={formData.confirmNewPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {/* <NavLink to="/PasswordReset" className="forgot-password">
        Forgotten Password?
      </NavLink> */}
                      <div className="d-flex row justify-content-center mt-5">
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          className="btn btn-secondary btn-lg mt-3"
                        >
                          Reset
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
