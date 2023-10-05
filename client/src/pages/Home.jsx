// eslint-disable-next-line
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
   // eslint-disable-next-line
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
     // eslint-disable-next-line
  const [cookies, removeCookie] = useCookies([]);
     // eslint-disable-next-line
  const [username, setUsername] = useState("");

  const Login = () => {
    removeCookie("token");
    navigate("/signup");
  };
  return (
    <>
      <div className="home_page">
      <img src='logo192.png'className='logo' alt="logo"></img>
        <h4>
          {" "}
          TASKTRACK
        </h4>
        <button className="blinking-button" onClick={Login}>WELCOME</button>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;