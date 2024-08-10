import '../App.css';

//Emptychat Container to show when the user have not selected any chats
const WelcomeComponent = () => {
  return (
    <div className="flex-grow-1 transition d-none d-md-flex flex-column 
    justify-content-center align-items-center border custom-duration">
      <div className="align-items-center mt-5 transition 
      custom-transition custom-text-lg custom-text">
        <span className="text-primary">Hi! Buddy Welcome Back</span>
      </div>
    </div>
  );
};

export default WelcomeComponent;
