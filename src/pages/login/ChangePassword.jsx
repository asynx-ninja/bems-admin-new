import React from "react";
import login from "../../assets/login/login.png";
import montalban_logo from "../../assets/login/montalban-logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import API_LINK from "../../config/API";
import axios from "axios";
const ChangePassword = () => {
  const [eye1, isEye1] = useState(true);
  const [eye2, isEye2] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  
  const client_email = atob(location.pathname.split("/")[2]);
  const [password, setPassword] = useState({
    enter: "",
    reenter: "",
  });
  const [response, setResponse] = useState({
    success: false,
    error: false,
    message: "",
  });
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });

  const [passwordShown, setPasswordShown] = useState(false);
  const [repasswordShown, setRePasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const RetogglePassword = () => {
    setRePasswordShown(!repasswordShown);
  };

  const handleOnChange = (e) => {
    setPassword((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setCredential({
      email: client_email,
      password: password.enter,
    });
  };

  const handleOnSubmit = async () => {
    try {
      if (password.enter !== password.reenter) {
        setResponse({
          success: false,
          error: true,
          message: "Password does not Match! Please Try Again",
        });
      } else {
        await axios.patch(`${API_LINK}/auth/pass/`, credential, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setResponse({
          success: true,
          error: false,
          message: "Password Change Successfully!",
        });

        setTimeout(navigate("/"), 3000);
      }
    } catch (error) {
      setResponse({
        success: false,
        error: true,
        message: "Error: Please Try Again",
      });
      console.log(error);
    }
  };

  return (
    <div className='bg-[url("/imgs/login-bg.jpg")] bg-cover bg-center bg-no-repeat md:px-[3rem] md:py-[3rem] lg:px-[7rem] lg:py-[4rem] h-screen flex sm:flex-col md:flex-row sm:space-y-5 md:space-y-0'>
      <div className="sm:block md:hidden h-[320px] border-[5px] border-t-0 border-[#1C8058] bg-[url('/imgs/login.png)] flex flex-col w-full rounded-b-full overflow-hidden shadow-[0px_4px_4px_rgba(0,0,0,0.51)]">
        <img
          src={login}
          className="p-[0.05rem] w-full h-full object-cover"
          alt=""
        />
      </div>
      <div className="flex flex-row bg-white justify-center items-center w-full sm:h-full sm:rounded-t-3xl md:rounded-3xl overflow-hidden sm:shadow-[0px_-3px_4px_rgba(0,0,0,0.51)] md:shadow-[4px_4px_4px_rgba(0,0,0,0.51)]">
        <div className="sm:hidden md:block w-9/12 h-full relative">
          <img
            src={login}
            className="p-[0.05rem] w-full h-full object-cover"
            alt=""
          />
          <div>
            <img
              src={montalban_logo}
              className="absolute bottom-4 left-5 z-50 w-8/12"
              alt=""
              srcSet=""
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-[0.05rem] left-[0.05rem]"
              viewBox="0 0 567 270"
              fill="none"
            >
              <path
                d="M196.173 98.5207C83.9074 113.814 18.5163 38.3432 0 0V270H567C535.305 227.396 442.39 137.396 393.347 114.497L392.208 113.965C343.971 91.4376 322.337 81.334 196.173 98.5207Z"
                fill="#017446"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -bottom-[0.05rem] "
              viewBox="0 0 558 254"
              fill="none"
            >
              <path
                d="M192.938 92.5C82.5235 106.859 18.2109 36 0 0V253.5H557.648C526.477 213.5 435.094 129 386.859 107.5L385.739 107.001C338.298 85.8498 317.02 76.3636 192.938 92.5Z"
                fill="url(#paint0_linear_596_573)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_596_573"
                  x1="278.824"
                  y1="0"
                  x2="278.824"
                  y2="253.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="#DCDCDC" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center md:h-full relative">
          <div className="sm:w-10/12 lg:w-8/12 sm:space-y-3 md:space-y-4">
            <div className="space-y-2">
              <h1 className="font-heavy text-xl md:text-2xl lg:text-3xl text-center">
                Change Password
              </h1>
              <p className="sm:text-xs md:text-sm lg:text-base text-center font-regular">
                You’re almost done please try to remember.
              </p>
            </div>
            <div>
              {response.success ? (
                <div className="w-[100%] bg-green-400 rounded-md mt-[10px] flex">
                  <p className="py-[10px] text-[12px] px-[20px] text-white font-medium">
                    {response.message}
                  </p>
                </div>
              ) : null}
              {response.error ? (
                <div className="w-[100%] bg-red-500 rounded-md mt-[10px] flex">
                  <p className="py-[10px] text-[12px] px-[20px] text-white font-medium">
                    {response.message}
                  </p>
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="input-label-with-helper-text"
                className="block sm:text-xs md:text-sm font-medium mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  name="enter"
                  onChange={handleOnChange}
                  type={eye1 ? "password" : "text"}
                  className="sm:py-2 sm:px-3 lg:py-3 lg:px-4 block w-full border-2 border-solid border-[#C7D1DD] rounded-[12px] text-sm shadow-[0px_0px_12px_rgba(142,142,142,0.25)] focus:border-green-500 focus:ring-green-500"
                  aria-describedby="hs-input-helper-text"
                />
                <button
                  onClick={() => isEye1(!eye1)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {eye1 ? (
                    <AiOutlineEyeInvisible size={16} />
                  ) : (
                    <AiOutlineEye size={16} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="input-label-with-helper-text"
                className="block sm:text-xs md:text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="reenter"
                  onChange={handleOnChange}
                  type={eye2 ? "password" : "text"}
                  className="sm:py-2 sm:px-3 lg:py-3 lg:px-4 block w-full border-2 border-solid border-[#C7D1DD] rounded-[12px] text-sm shadow-[0px_0px_12px_rgba(142,142,142,0.25)] focus:border-green-500 focus:ring-green-500"
                  aria-describedby="hs-input-helper-text"
                />
                <button
                  onClick={() => isEye2(!eye2)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {eye2 ? (
                    <AiOutlineEyeInvisible size={16} />
                  ) : (
                    <AiOutlineEye size={16} />
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col w-full space-y-3">
              <button
                type="button"
                onClick={handleOnSubmit}
                className="w-full rounded-[12px] bg-gradient-to-r from-[#295141] to-[#408D51] sm:py-1.5 lg:py-2.5 text-white font-medium text-base"
              >
                Save Password
              </button>
            </div>
          </div>
          <div className="hs-tooltip sm:hidden md:inline-block">
          <Link
            to="/tooltip"
              type="button"
              class="hs-tooltip-toggle w-10 h-10 absolute md:bottom-3 right-[1rem] bg-gradient-to-r from-[#408D51] to-[#295141] inline-flex justify-center items-center gap-2 rounded-full border border-gray-200 text-white font-bold "
            >
              ?
              <span
                class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                role="tooltip"
              >
                Bagong Montalban Barangay Application
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
