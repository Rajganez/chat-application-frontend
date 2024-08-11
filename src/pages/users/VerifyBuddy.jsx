import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientAPI } from "../../api/axios-api.js"; 
import { VERIFY_ROUTE } from "../../api/constants.js"; 
import { useDispatch } from "react-redux";
import { setVerified } from "../../redux/reducerSlice.js";

const VerifyBuddy = () => {
  const { id } = useParams(); // Extracts the verification ID from the URL
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //On mouting Phase the verifcation API is triggerd and changes done in DB
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await clientAPI.get(`${VERIFY_ROUTE}/${id}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setStatus("Your email has been successfully verified!");
          dispatch(setVerified(response.data.emailVerifed));
          setTimeout(() => navigate("/buddy"), 3000); // Redirect after 3 seconds
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setStatus("Expired verification link.");
        } else {
          setStatus("An error occurred. Please try again.");
        }
        console.log(error);
      }
    };
    verifyEmail();
  }, [id, navigate, dispatch]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg bg-body-tertiary rounded">
          <div className="row g-0">
            <div className="col-md-6">
              <div className="card-body">
                <div>
                  <h2 className="d-flex justify-content-center">
                    <div className="slackey-regular"> Hi! Buddy</div>
                  </h2>
                  <div className="playwrite-ar text-center m-2 p-2">{status}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyBuddy;
