import { useRef, useState, useEffect } from "react";
import "../../App.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clientAPI } from "../../api/axios-api.js";
import {
  SEND_MAIL,
  PROFILE_ROUTE,
  UPLOAD_PROFILE,
  REMOVE_PROFILE,
} from "../../api/constants.js";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import {
  setFirst,
  setLast,
  setNick,
  setUserImage,
} from "../../redux/reducerSlice.js";

const Profile = () => {
  //Redux state variable is utilized
  const verification = useSelector((state) => state.emailverify);

  const dispatch = useDispatch();
  //Initial form state
  const intialState = {
    firstName: "",
    lastName: "",
    nickName: "",
  };
  //State to send the payload data and image added on hovered, Error set for unique nickname creation
  const [formData, setFormData] = useState(intialState);
  const [hovered, setHovered] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  //Used params and navigation done using params
  const { userId } = useParams();
  //To attach the profile picture of the user eventhandling done
  const fileRef = useRef(null);
  //To append the profile picture
  const handleFileInput = () => {
    fileRef.current.click();
  };
  //Handle input change for the image file
  const handleImageChange = async () => {
    const file = fileRef.current.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await clientAPI.post(
        `${UPLOAD_PROFILE}/${userId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && response.data) {
        alert("Image was added successfully");
        dispatch(setUserImage(`${response.data.file}`));
      }
    }
  };
  //Remove profile picture from the DB and Cloudinary API call done
  const removeProfileImage = async () => {
    const response = await clientAPI.delete(`${REMOVE_PROFILE}/${userId}`);
    if (response.status === 200) {
      dispatch(setUserImage(null));
      alert("Image removed successfully");
    } else {
      alert("Failed to remove image");
    }
  };
  //To set the first,last and nick name of the user
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  //API call function to send the payload data and navigation done on success
  const userProfileForm = async () => {
    try {
      const response = await clientAPI.post(
        `${PROFILE_ROUTE}/${userId}`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        if (response.data.verified === true) {
          alert("Profile updated successfully.");
          dispatch(
            setFirst(response.data.firstname),
            setLast(response.data.lastname),
            setNick(response.data.nick)
          );
          navigate(`/chat/${userId}`);
        } else if (response.data.verified === false) {
          alert("Please Verify Your EmailID.");
        }
      }
    } catch (error) {
      if (error.response.status === 409 && error.response.status) {
        setError("Nickname is available. Please select different nickname");
      }
    }
  };
  //On Submit button removeProfile function called
  const handleDeleteImage = () => {
    removeProfileImage();
  };
  //On Submit button API called
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.firstName === "" ||
      formData.lastName === "" ||
      formData.nickName === ""
    ) {
      setError("First Name and Last Name are required");
      return;
    }
    userProfileForm();
  };
  //To validate the user email verify link is provided in the profile page
  const handleMailingSubmit = async (e) => {
    e.preventDefault();
    const response = await clientAPI.get(`${SEND_MAIL}/${userId}/sendmail`, {
      withCredentials: true,
    });
    if (response.status === 201) {
      localStorage.removeItem("isVerifyToken");
      localStorage.setItem("isVerifyToken", response.data.userToken);
      alert("Email Verification Link Sent");
    }
  };

  useEffect(() => {
    // dispatch(setUserImage(`${HOST}/${verification.image}`));
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center mt-4">
        <div
          className="col-12 col-md-10 col-lg-7 d-flex flex-column 
        justify-content-center align-items-center shadow border bg-body-tertiary 
        rounded p-4"
        >
          <h1 className="slackey-regular text-center">Hi! Buddy</h1>
          {verification.value === true ? (
            <div className="playwrite-ar text-center mb-4">
              Show Who You are! To your Fellow buddies
            </div>
          ) : (
            <NavLink
              className="playwrite-ar text-center mb-4"
              onClick={handleMailingSubmit}
            >
              Buddy please verify your Email
            </NavLink>
          )}
          <div
            className="d-flex justify-content-center align-items-center position-relative"
            style={{ width: "120px", height: "120px" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <img
              src={`${verification.image}`}
              alt="#"
              className="rounded-circle p-2"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            {hovered && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded-circle"
                onClick={
                  verification.image ? handleDeleteImage : handleFileInput
                }
                style={{ cursor: "pointer" }}
              >
                {verification.image ? (
                  <FaTrashAlt
                    className="text-white opacity-50"
                    style={{ fontSize: "30px" }}
                  />
                ) : (
                  <FaPlus
                    className="text-white opacity-50"
                    style={{ fontSize: "30px" }}
                  />
                )}
                <input
                  type="file"
                  ref={fileRef}
                  className="d-none"
                  onChange={handleImageChange}
                  accept=".png, .jpg, .svg, .webp"
                />
              </div>
            )}
          </div>
          <form className="w-75">
            <div className="form-group mt-3">
              <label htmlFor="firstName">
                Buddy First Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                id="firstName"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="lastName">
                Buddy Last Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                id="lastName"
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mt-3 mb-4">
              <label htmlFor="nickName">
                Buddy Nick Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="nickName"
                id="nickName"
                onChange={handleChange}
                required
              />
            </div>
            {verification.value === false ? (
              <button type="submit" className="btn btn-primary w-100" disabled>
                Verify
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary w-100"
                onClick={handleSubmit}
              >
                Start Chat
              </button>
            )}
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
  );
};

export default Profile;
