import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/header/montalban-logo.png";
import { useSearchParams, useParams } from "react-router-dom";
import API_LINK from "../config/API";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import AddBarangay from "../components/addbarangay/addBarangayModal"
function BarangayMenu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [information, setInformation] = useState({});
  const id = searchParams.get("id");
  // const { id } = useParams();
  console.log("ssdsds", id);
  const [barangays, setBarangays] = useState([]);

  useEffect(() => {
    document.title = "Barangay Information | Barangay E-Services Management";
    const fetchBarangays = async () => {
      try {

        const response = await axios.get(`${API_LINK}/brgyinfo/allinfo`);
        setBarangays(response.data);

      } catch (error) {
        console.error("Error fetching barangays:", error);
      }
    };

    fetchBarangays();
  }, []);

  console.log(barangays)
  return (
    <div className="mx-4 mt-4">
      <div className="flex flex-col justify-center items-center mx-auto mt-4 mb-2">
        <div className="py-2 text-center font-bold text-3xl">
          <h1>SELECT A BARANGAY</h1>
        </div>
        <div className="w-6/12 mx-auto rounded-lg flex">
          <div className="hs-tooltip inline-block w-full">
            <button
              type="button"
              data-hs-overlay="#hs-modal-addbarangay"
              className="hs-tooltip-toggle justify-center sm:px-2 sm:p-2 md:px-5 md:p-3 rounded-lg bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] w-full text-white font-medium text-sm text-center inline-flex items-center"
            >
              <FaPlus size={24} style={{ color: "#ffffff" }} />
              <span className="sm:block md:block text-lg font-bold uppercase sm:pl-5">
                Add Barangay
              </span>
              <span
                className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm"
                role="tooltip"
              >
                Add Barangay
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 lg:w-full gap-4 sm:gap-6 p-6  overflow-y-auto   lg:overflow-x-hidden h-[calc(100vh_-_220px)] xxl:h-[calc(100vh_-_275px)] xxxl:h-[calc(100vh_-_300px)]">

        {barangays.map((barangay, idx) => (
          <Link
            key={idx}
            to={`/barangayinformation/?id=${id}&brgy=${barangay.brgy}`}
            className="h-[12rem] bg-[#295141] shadow-lg rounded-2xl flex justify-center items-center text-white font-bold text-lg flex-col hover:bg-[#2b6950] transition duration-300"
          >
            <img src={barangay.logo} alt={barangay.brgy} className="h-[8rem]" />
            <h1 className="mt-1 px-4 text-md uppercase text-center md:text-sm xl:text-lg">
              Barangay {barangay.brgy}
            </h1>
          </Link>
        ))}
      </div>

      <AddBarangay />
    </div>
  );
}

export default BarangayMenu;
