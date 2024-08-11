import { useState } from "react";
import { clientAPI } from "../../api/axios-api.js";
import { FORGOT_ROUTE } from "../../api/constants.js";
import background from "../../assets/sidebarimage.jpg";

const ForgotPassword = () => {
  //Intial form validation
  const intialForm = {
    forgotEmail: "",
  };
  //State that sends the payload data
  const [formData, setFormData] = useState(intialForm);
  //Error handling in case of email address validation
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };
  //API call done to send the mail for the password reset
  const sendMail = async () => {
    try {
      const response = await clientAPI.post(FORGOT_ROUTE, formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        alert("Password reset link has been sent to your registered email.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  //Submitted after the validation of the users input field
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.forgotEmail.includes("@") ||
      !formData.forgotEmail.endsWith(".com")
    ) {
      setError("Enter Valid Email");
      return;
    } else {
      sendMail();
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
                      Enter your registered Email and Reset the Password with
                      the link
                    </div>
                  </div>
                  <div className="p-4 register-form form-container">
                    <form>
                      <div className="form-group mt-3">
                        <label htmlFor="forgotEmail">
                          Email ID <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="forgotEmail"
                          value={formData.loginEmail}
                          onChange={handleChange}
                          id="forgotEmail"
                          required
                        />
                      </div>
                      <div className="d-flex row justify-content-center mt-5">
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          className="btn btn-secondary btn-lg mt-3"
                        >
                          Send E-Mail
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

export default ForgotPassword;
