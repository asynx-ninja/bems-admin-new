import React, { useState, useEffect, useMediaQuery } from "react";
import logo from "../../assets/header/montalban-logo.png";
import { FaBars } from "react-icons/fa";
import API_LINK from "../../config/API";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
const Header = () => {
  const [screen, isScreen] = useState(true);
  const [userData, setUserData] = useState({})
  const [searchParams, setSearchParams] = useSearchParams()
  const id = searchParams.get("id")
  
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_LINK}/users/specific/${id}`);
        if (res.status === 200) {
          setUserData(res.data[0]);
          
        } else {
          setError("Invalid username or password");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetch()
  }, [id])

  useEffect(() => {
    return window.innerWidth >= 320 && window.innerWidth <= 1023
      ? isScreen(true)
      : isScreen(false);
  }, []);

  return (
    <div className='bg-[url("/imgs/HEADER2.jpg")] object-cover relative flex items-center justify-between md:justify-normal space-x-5 py-3 pr-5 md:pr-0 pl-5 md:py-4 md:pl-5 lg:pl-[19rem] '>
      <button
        type="button"
        className="lg:hidden block"
        data-hs-overlay="#hs-overlay-basic"
        aria-controls="hs-overlay-basic"
        aria-label="Toggle navigation"
      >
        <FaBars size={window.innerWidth <= 640 ? 20 : 30} />
      </button>
      <img src={logo} alt="" className="h-[40px] md:h-[55px] lg:h-[100px]" />
        <h1 className="sm:hidden md:block tracking-[0.3rem] md:tracking-[0.4rem] lg:tracking-[0.7rem] font-heavy text-sm md:text-xl lg:text-3xl">
          <span className="text-xs md:text-base lg:text-lg">
            WELCOME ADMIN!
          </span>{" "}
          <br />
          {userData.firstName} {userData.lastName}
        </h1>
    </div>
  );
};

export default Header;
