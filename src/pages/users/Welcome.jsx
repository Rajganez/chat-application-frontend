import { useState } from "react";
import Login from "./../../components/Login.jsx";
import Register from "./../../components/Register.jsx";
import "../../App.css";
import background from "../../assets/sidebarimage.jpg";

const Welcome = () => {
  //State to navigate to Login and Register pages
  const [activeTab, setActiveTab] = useState("login");
  // Both Login and Register Component used in the Page
  return (
    <div className="container">
      <div className="d-flex justify-content-center align-items-center vh-100 rounded-4">
        <div className="card shadow-lg bg-body-tertiary">
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
                  <div className="caveat text-center">
                    Get Verified your E-mail and
                    Chat with your Buddies Online
                  </div>
                </div>
                <div className="p-4 register-form form-container">
                  <ul
                    className="nav justify-content-between"
                    id="tablist"
                    role="tablist"
                  >
                    <li
                      className="nav-item d-flex justify-content-center flex-fill"
                      role="presentation"
                    >
                      <button
                        className={`nav-link text-white w-100 ${
                          activeTab === "login"
                            ? "active bg-primary bg-gradient text-white rounded-pill "
                            : "bg-dark-subtle text-dark-emphasis border rounded-pill "
                        }`}
                        id="login-tab"
                        data-bs-toggle="tab"
                        role="tab"
                        aria-controls="login"
                        aria-selected={activeTab === "login"}
                        onClick={() => setActiveTab("login")}
                      >
                        Log In
                      </button>
                    </li>
                    <li
                      className="nav-item d-flex justify-content-center flex-fill"
                      role="presentation"
                    >
                      <button
                        className={`nav-link text-white w-100 ${
                          activeTab === "signup"
                            ? "active bg-primary bg-gradient text-white rounded-pill "
                            : "bg-dark-subtle text-dark-emphasis border rounded-pill "
                        }`}
                        id="signup-tab"
                        data-bs-toggle="tab"
                        role="tab"
                        aria-controls="signup"
                        aria-selected={activeTab === "signup"}
                        onClick={() => setActiveTab("signup")}
                      >
                        Sign Up
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content" id="tabContent">
                    <div
                      className={`tab-pane fade ${
                        activeTab === "login" ? "show active" : ""
                      }`}
                      id="login"
                      role="tabpanel"
                      aria-labelledby="login-tab"
                    >
                      <Login />
                    </div>
                    <div
                      className={`tab-pane fade ${
                        activeTab === "signup" ? "show active" : ""
                      }`}
                      id="signup"
                      role="tabpanel"
                      aria-labelledby="signup-tab"
                    >
                      <Register />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
