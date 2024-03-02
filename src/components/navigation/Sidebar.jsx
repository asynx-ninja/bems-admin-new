import React from "react";
import logo from "../../assets/header/montalban-logo.png";
import { Link } from "react-router-dom";
import { FaCalendarDays } from "react-icons/fa6";
import { BiSolidDashboard } from "react-icons/bi";
import { TfiAnnouncement } from "react-icons/tfi";
import { SiGoogleforms } from "react-icons/si";
import { BsCalendar2Event } from "react-icons/bs";
import { ImBullhorn } from "react-icons/im";
import { FaRegNoteSticky } from "react-icons/fa6";
import { BsPeopleFill } from "react-icons/bs";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { HiMiniInformationCircle } from "react-icons/hi2";
import { ImStatsBars } from "react-icons/im";
import { FaServicestack, FaChalkboardTeacher } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GoGitPullRequest } from "react-icons/go";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { RiAdminFill } from "react-icons/ri";
import { useLocation, useNavigate, matchRoutes } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API_LINK from "../../config/API";
import axios from "axios";
import defaultPFP from "../../assets/sample-image/default-pfp.png";
import { RxActivityLog } from "react-icons/rx";
import { BsInfoCircleFill } from "react-icons/bs";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaCity } from "react-icons/fa";
const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [userData, setUserData] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const id = searchParams.get("id");
  const brgy = "MUNISIPYO";
  const [servicesReq, setServicesreq] = useState([]);
  const [application, setApplication] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [isClickedServices, setIsClickedServices] = useState(false);
  const to = "Admin";
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_LINK}/users/specific/${id}`);
        if (res.status === 200) {
          setUserData(res.data[0]);
          var pfpSrc = document.getElementById("sidepfp");
          pfpSrc.src =
            res.data[0].profile.link !== ""
              ? res.data[0].profile.link
              : defaultPFP;
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [id]);
  const [isClicked, setIsClicked] = useState(false);
  const handleCollapseToggle = () => {
    setIsClicked(!isClicked);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResponse = await axios.get(
          `${API_LINK}/services/pendingservices/?archived=false&status=Pending`
        );
        setServicesreq(servicesResponse.data.result);
        setTotalServices(servicesResponse.data.total);

        const eventsResponse = await axios.get(
          `${API_LINK}/application/?brgy=${brgy}&archived=false&status=Pending`
        );

        setApplication(eventsResponse.data.result);
        setTotalEvents(eventsResponse.data.total);

        console.log("zzz", eventsResponse.data.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [brgy]);

  useEffect(() => {
    const total = (totalEvents || 0) + (totalServices || 0);
    setTotal(total);
    console.log("d", totalEvents);
  }, [totalEvents, totalServices]);

  const [residentResponseCount, setResidentInquiriesLength] = useState(0);
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/inquiries/admininquiries/?to=${to}&archived=false`
        );

        if (response.status === 200) {
          const inquiries = response.data.result;
          setInquiries(inquiries); // Update the state variable with the fetched inquiries

          // Filter inquiries for latest response type "Resident"
          const residentInquiries = inquiries.filter((inquiry) => {
            // Get the last response of each inquiry
            const latestResponse =
              inquiry.response[inquiry.response.length - 1];

            // Check if the type of the latest response is "Resident"
            return (
              latestResponse &&
              latestResponse.type === "Resident" &&
              (inquiry.isApproved === "Pending" ||
                inquiry.isApproved === "In Progress")
            );
          });

          // Get the length of the filtered array
          const residentInquiriesLength = residentInquiries.length;
          console.log("par", residentInquiriesLength);
          setResidentInquiriesLength(residentInquiriesLength); // Update the state variable with the length
        } else {
          // Handle error here
          console.error("Error fetching inquiries:", response.error);
        }
      } catch (err) {
        // Handle uncaught error here
        console.error("Uncaught error:", err.message);
      }
    };

    fetchInquiries();
  }, []);
  const handleCollapseToggleServices = () => {
    setIsClickedServices(!isClickedServices);
  };
  return (
    <>
      <div
        id="hs-overlay-basic"
        className="sm:fixed lg:relative overflow-y-auto lg:block lg:end-auto lg:bottom-0 sm:block flex items-center justify-center hs-overlay-basic h-full overflow-hidden hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden top-0 z-[60] lg:z-0 lg:translate-x-0 w-[17rem]"
      >
        <div className="h-screen bg-[#295141] ">
          <div className="max-h-screen flex flex-col ">
            <div className='bg-[url("/src/assets/image/bg-sidebar.jpg")] w-full shrink-0 flex flex-col items-center justify-center py-5 px-2 space-y-3 object-cover'>
              {/* <img src={logo} alt="" className="" width={80} /> */}
              <img
                src={logo}
                className="w-[100px] h-[100px] rounded-full object-contain"
              />
              <div>
                <h1 className="uppercase font-bold text-white text-lg text-center">
                  MUNICIPALITY OF MONTALBAN
                </h1>
              </div>
            </div>
            <div className="w-full shrink-0 flex flex-row items-center justify-between px-2 border-0 py-2 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] border-y-[1px] space-y-3">
              {/* <img src={logo} alt="" className="" width={80} /> */}
              <div className="flex flex-row items-center justify-between w-full">
                <div className="w-4/12">
                  <img
                    id="sidepfp"
                    className=" w-[60px] h-[60px]  mx-auto rounded-full border-[2px] border-[#295141] object-cover"
                  />
                </div>
                <div className="w-9/12 ">
                  <h1 className="uppercase font-bold text-white text-sm">
                    {userData.lastName}, {userData.firstName}
                  </h1>
                  <p className="text-white text-xs">{userData.email}</p>
                </div>
              </div>
            </div>
            <nav className="px-6 pt-6 pb-10 flex flex-col relative overflow-y-auto">
              <ul className="space-y-1.5 text-white font-bold uppercase">
                <li>
                  <Link
                    to={`/dashboard/?id=${id}`}
                    onClick={() => {
                      window.innerWidth >= 320 && window.innerWidth <= 1023
                        ? document
                            .querySelector(
                              "[data-hs-overlay-backdrop-template]"
                            )
                            .remove()
                        : null;
                    }}
                    className={`${
                      currentPath === "/dashboard/"
                        ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                        : "focus:outline-none"
                    } flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                  >
                    <BiSolidDashboard size={15} />
                    Dashboard
                    {total > 0 && (
                      <span className="flex relative ">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 dark:bg-red-600" />
                        <span className="relative inline-flex text-xs bg-red-500 text-white rounded-full py-0.5 px-1.5">
                          {total}
                        </span>
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <button
                    id="hs-events-collapse"
                    data-hs-collapse="#hs-events-collapse-heading"
                    className="hs-collapse-toggle justify-between flex items-center w-full  gap-x-3 py-2 px-2.5  text-sm rounded-md uppercase  hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]"
                  >
                    <div className="flex items-center gap-x-3">
                      <ImBullhorn size={15} />
                      EVENTS
                    </div>
                    <div className="flex">
                      <svg
                        className="hs-collapse-open:rotate-180  w-2.5 h-2.5"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>
                  <div
                    id="hs-events-collapse-heading"
                    className="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300"
                    aria-labelledby="hs-events-collapse"
                    // style={{ paddingLeft: "20px" }}
                  >
                    <Link
                      to={`/announcements/?id=${id}`}
                      onClick={() => {
                        window.innerWidth >= 320 && window.innerWidth <= 1023
                          ? document
                              .getQuerySelector(
                                "[data-hs-overlay-backdrop-template]"
                              )
                              .remove()
                          : null;
                      }}
                      className={`${
                        currentPath === "/announcements/" ||
                        currentPath === "/archivedannoucements/"
                          ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                          : null
                      } flex items-center gap-x-3 py-2 px-2.5 ml-3 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                    >
                      <FaCalendarDays size={15} />
                      Events Management
                    </Link>
                    <Link
                      to={`/events_registration/?id=${id}`}
                      onClick={() => {
                        window.innerWidth >= 320 && window.innerWidth <= 1023
                          ? document
                              .getQuerySelector(
                                "[data-hs-overlay-backdrop-template]"
                              )
                              .remove()
                          : null;
                      }}
                      className={`${
                        currentPath === "/events_registration/" ||
                        currentPath === "/archived_registrations/"
                          ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                          : null
                      } flex items-center gap-x-3 py-2 px-2.5 ml-3 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                    >
                      <SiGoogleforms size={15} />
                      Events Application
                    </Link>
                  </div>
                </li>
                <li>
                  <Link
                    to={`/inquiries/?id=${id}`}
                    onClick={() => {
                      window.innerWidth >= 320 && window.innerWidth <= 1023
                        ? document
                            .getQuerySelector(
                              "[data-hs-overlay-backdrop-template]"
                            )
                            .remove()
                        : null;
                    }}
                    className={`${
                      currentPath === "/inquiries/" ||
                      currentPath === "/archivedinquiries/"
                        ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                        : null
                    } flex items-center gap-x-3 py-2 px-2.5  text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                  >
                    <FaRegNoteSticky size={15} />
                    Inquiries
                    <span className="flex relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 dark:bg-red-600" />
                      {residentResponseCount > 0 && (
                        <span className="relative inline-flex text-xs bg-red-500 text-white rounded-full py-0.5 px-1.5">
                          {residentResponseCount}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/barangaymenu/?id=${id}`}
                    onClick={() => {
                      window.innerWidth >= 320 && window.innerWidth <= 1023
                        ? document
                            .getQuerySelector(
                              "[data-hs-overlay-backdrop-template]"
                            )
                            .remove()
                        : null;
                    }}
                    className={`${
                      currentPath === "/barangaymenu/" ||
                      currentPath === "/barangayinformation/" ||
                      currentPath === "/brgyarchivedofficials/" ||
                      currentPath === "/brgyarchivedservices/" ||
                      currentPath === "/brgyarchivedservicesreq/" ||
                      currentPath === "/brgyarchivedresidents/" ||
                      currentPath === "/brgyarchivedannoucements/" ||
                      currentPath === "/brgyarchivedinquiries/" ||
                      currentPath === "/brgyarchivedapplication/"
                        ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                        : null
                    } flex items-center gap-x-3 py-2 px-2.5  text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                  >
                    <FaCity size={15} />
                    Barangay Management
                  </Link>
                </li>
                <li>
                  <button
                    id="hs-unstyled-collapse"
                    data-hs-collapse="#hs-unstyled-collapse-heading"
                    className={`hs-collapse-toggle justify-between flex items-center w-full  gap-x-3 py-2 px-2.5  text-sm rounded-md uppercase  hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]${
                      isClicked ? "text-[#EFC586]" : ""
                    }`}
                    onClick={handleCollapseToggle}
                  >
                    <div className="flex items-center gap-x-3">
                      <BsInfoCircleFill size={15} />
                      Municipality Info
                    </div>
                    <div className="flex">
                      <svg
                        className="hs-collapse-open:rotate-180  w-2.5 h-2.5"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>
                  <div
                    id="hs-unstyled-collapse-heading"
                    className="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300"
                    aria-labelledby="hs-unstyled-collapse"
                  >
                    <Link
                      to={`/aboutus_info/?id=${id}`}
                      onClick={() => {
                        window.innerWidth >= 320 && window.innerWidth <= 1023
                          ? document
                              .getQuerySelector(
                                "[data-hs-overlay-backdrop-template]"
                              )
                              .remove()
                          : null;
                      }}
                      className={`${
                        currentPath === "/aboutus_info/" ||
                        currentPath === "/archived_aboutus_info/"
                          ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                          : null
                      } flex items-center gap-x-3 py-2 px-2.5 ml-3 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                    >
                      <GoGitPullRequest size={15} />
                      Manage AboutUs
                    </Link>
                    <Link
                      to={`/services_info/?id=${id}`}
                      onClick={() => {
                        window.innerWidth >= 320 && window.innerWidth <= 1023
                          ? document
                              .getQuerySelector(
                                "[data-hs-overlay-backdrop-template]"
                              )
                              .remove()
                          : null;
                      }}
                      className={`${
                        currentPath === "/services_info/" ||
                        currentPath === "/archived_services_info/"
                          ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                          : null
                      } flex items-center gap-x-3 py-2 px-2.5 ml-3 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                    >
                      <GoGitPullRequest size={15} />
                      Manage Services
                    </Link>
                    <Link
                      to={`/tourist_spot/?id=${id}`}
                      onClick={() => {
                        window.innerWidth >= 320 && window.innerWidth <= 1023
                          ? document
                              .getQuerySelector(
                                "[data-hs-overlay-backdrop-template]"
                              )
                              .remove()
                          : null;
                      }}
                      className={`${
                        currentPath === "/tourist_spot/" ||
                        currentPath === "/archived_tourist_spot/"
                          ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                          : null
                      } flex items-center gap-x-3 py-2 px-2.5 ml-3 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                    >
                      <GoGitPullRequest size={15} />
                      Manage tourist spot
                    </Link>
                    <Link
                      to={`/municipalityofficials/?id=${id}`}
                      onClick={() => {
                        window.innerWidth >= 320 && window.innerWidth <= 1023
                          ? document
                              .getQuerySelector(
                                "[data-hs-overlay-backdrop-template]"
                              )
                              .remove()
                          : null;
                      }}
                      className={`${
                        currentPath === "/municipalityofficials/" ||
                        currentPath === "/archivedmunicipalityofficials/"
                          ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                          : null
                      } flex items-center gap-x-3 py-2 px-2.5 ml-3 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                    >
                      <GoGitPullRequest size={15} />
                      Manage Officials
                    </Link>
                  </div>
                </li>
                <li>
                  <Link
                    to={`/reports/?id=${id}`}
                    onClick={() => {
                      window.innerWidth >= 320 && window.innerWidth <= 1023
                        ? document
                            .querySelector(
                              "[data-hs-overlay-backdrop-template]"
                            )
                            .remove()
                        : null;
                    }}
                    className={`${
                      currentPath === "/reports/"
                        ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                        : "focus:outline-none"
                    } flex items-center gap-x-3 py-2 px-2.5 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                  >
                    <ImStatsBars size={15} />
                    Reports
                  </Link>
                </li>
        
                {/* <li>
                  <button
                    id="hs-unstyled-collapse1"
                    data-hs-collapse="#hs-unstyled-collapse-heading1"
                    className={`hs-collapse-toggle justify-between flex items-center w-full gap-x-3 py-2 px-2.5 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51] ${
                      isClickedServices &&
                      (currentPath === "services" || currentPath === "requests")
                        ? "text-[#EFC586]"
                        : ""
                    }`}
                    onClick={handleCollapseToggleServices}
                  >
                    <div className="flex items-center gap-x-3">
                      <RxActivityLog size={15} />
                      SERVICES
                    </div>
                    <div className="flex">
                      <svg
                        className="hs-collapse-open:rotate-180  w-2.5 h-2.5"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>
                  <div
                    id="hs-unstyled-collapse-heading1"
                    className="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300"
                    aria-labelledby="hs-unstyled-collapse1"
                  >
                    <Link
                      to={`/services/?id=${id}`}
                      onClick={() => {
                        window.innerWidth >= 320 && window.innerWidth <= 1023
                          ? document
                              .getQuerySelector(
                                "[data-hs-overlay-backdrop-template]"
                              )
                              .remove()
                          : null;
                      }}
                      className={`${
                        currentPath === "/services/" ||
                        currentPath === "/archive_serivces/"
                          ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                          : null
                      } flex items-center gap-x-3 py-2 px-2.5 ml-3 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51] `}
                    >
                      <FaServicestack size={15} />
                      Manage Services
                    </Link>
                    <Link
                      to={`/request/?id=${id}`}
                      onClick={() => {
                        window.innerWidth >= 320 && window.innerWidth <= 1023
                          ? document
                              .getQuerySelector(
                                "[data-hs-overlay-backdrop-template]"
                              )
                              .remove()
                          : null;
                      }}
                      className={`${
                        currentPath === "/request/" ||
                        currentPath === "/archive_request/"
                          ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                          : null
                      } flex items-center gap-x-3 py-2 px-2.5 ml-3 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51] `}
                    >
                      <GoGitPullRequest size={15} />
                      Service Requests
                      <span className="flex relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 dark:bg-red-600" />
                        {pendingRequestsCount > 0 && (
                          <span className="relative inline-flex text-xs bg-red-500 text-white rounded-full py-0.5 px-1.5">
                            <text className="mr-[2 px]">
                              {pendingRequestsCount}
                            </text>
                          </span>
                        )}
                      </span>
                    </Link>
                  </div>
                </li> */}
              
                {userData.type === "Head Admin" && (
                  <>
                    <li>
                      <button
                        id="hs-accounts-collapse"
                        data-hs-collapse="#hs-accounts-collapse-heading"
                        className="hs-collapse-toggle justify-between flex items-center w-full  gap-x-3 py-2 px-2.5  text-sm rounded-md uppercase  hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]"
                      >
                        <div className="flex items-center text-left gap-x-3">
                          <FaChalkboardTeacher size={15} />
                          ACCOUNT MANAGEMENT
                        </div>
                        <div className="flex">
                          <svg
                            className="hs-collapse-open:rotate-180  w-2.5 h-2.5"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </button>
                      <div
                        id="hs-accounts-collapse-heading"
                        className="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300"
                        aria-labelledby="hs-accounts-collapse"
                        // style={{ paddingLeft: "20px" }}
                      >
                        <Link
                          to={`/brgy_account/?id=${id}`}
                          onClick={() => {
                            if (
                              window.innerWidth >= 320 &&
                              window.innerWidth <= 1023
                            ) {
                              document
                                .querySelector(
                                  "[data-hs-overlay-backdrop-template]"
                                )
                                .remove();
                            }
                          }}
                          className={`${
                            currentPath === "/brgy_account/" ||
                            currentPath === "/archive_brgy_account/"
                              ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                              : ""
                          } flex items-center gap-x-3 py-2 px-2.5 ml-3 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                        >
                          <RiAdminFill size={15} />
                          Barangay Admin
                        </Link>
                        <Link
                          to={`/municipal_account/?id=${id}`}
                          onClick={() => {
                            if (
                              window.innerWidth >= 320 &&
                              window.innerWidth <= 1023
                            ) {
                              document
                                .querySelector(
                                  "[data-hs-overlay-backdrop-template]"
                                )
                                .remove();
                            }
                          }}
                          className={`${
                            currentPath === "/municipal_account/" ||
                            currentPath === "/archive_municipal_account/"
                              ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                              : ""
                          } flex items-center gap-x-3 py-2 px-2.5 ml-3 text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                        >
                          <RiAdminFill size={15} />
                          Municipal Admin
                        </Link>
                      </div>
                    </li>
                  </>
                )}

              

                <li>
                  <Link
                    to={`/settings/?id=${id}`}
                    onClick={() => {
                      window.innerWidth >= 320 && window.innerWidth <= 1023
                        ? document
                            .getQuerySelector(
                              "[data-hs-overlay-backdrop-template]"
                            )
                            .remove()
                        : null;
                    }}
                    className={`${
                      currentPath === "/settings/"
                        ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                        : null
                    } flex items-center gap-x-3 py-2 px-2.5  text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                  >
                    <MdOutlineMiscellaneousServices size={15} />
                    Profile Settings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    replace
                    onClick={() => {
                      window.innerWidth >= 320 && window.innerWidth <= 1023
                        ? document
                            .getQuerySelector(
                              "[data-hs-overlay-backdrop-template]"
                            )
                            .remove()
                        : null;
                    }}
                    className={`${
                      currentPath === "/"
                        ? "bg-gradient-to-r from-[#295141] to-[#408D51] text-[#EFC586]"
                        : null
                    } flex items-center gap-x-3 py-2 px-2.5  text-sm rounded-md hover:text-[#EFC586] hover:bg-gradient-to-r from-[#295141] to-[#408D51]`}
                  >
                    <HiMiniInformationCircle size={15} />
                    Sign-Out
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
