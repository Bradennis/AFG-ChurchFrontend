import React, { useContext, useState } from "react";
import "./LoginPage.css";
import { ClipLoader } from "react-spinners";
import { GlobalContext } from "../Context/ContextApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [details, setDetails] = useState({ username: "", password: "" });

  const { isAuthenticated, setIsAuthenticated } = useContext(GlobalContext);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url = `${import.meta.env.VITE_API_URL}/churchapp/login`;

    try {
      const response = await axios.post(url, details);
      console.log(response.data);

      if (response.data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data.id);

        setIsLoading(false);
        navigate("/");

        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        setIsLoading(false);
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error(error);
    }
  };

  return (
    <div className='login-page'>
      <div className='register-page'>
        <div className='title'>
          <h5
            className='title-name'
            style={{ fontSize: "1.4rem", color: "#243247" }}
          >
            faith<span className='care'>FLOW</span> app
          </h5>
        </div>
        <div className='content-body'>
          <div className='img-content'>
            <p className='img-welcome-txt'>welcome to your portal</p>
            <p className='img-sign-txt'>Sign in to get started</p>
          </div>
          <div className='forms-content'>
            <div className='input-btn name-input'>
              <label htmlFor='username'>Username </label>
              <input
                className='inputs inputs-1'
                type='text'
                id='username'
                name='username'
                value={details.username}
                onChange={handleChange}
                required
                placeholder='your name here'
              />
            </div>

            <div className='input-btn name-input'>
              <label htmlFor='password'>Password </label>
              <input
                className='inputs inputs-1'
                type='text'
                id='password'
                name='password'
                value={details.password}
                onChange={handleChange}
                required
                placeholder='input your password here'
              />
            </div>

            {isLoading ? (
              <ClipLoader color='#243247' className='clipLoader' />
            ) : (
              <div>
                {/* <p>forgot password</p> */}
                <button
                  className='btn-first'
                  type='submit'
                  onClick={handleSubmit}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='footer'>
          <p>Amazing Full Gospel Church, Adjumani-Kopey Branch &copy;2024</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
