import React from "react";
import { BsMegaphone } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API_LINK from "../../config/API";
import { Link } from "react-router-dom";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { FaRegNoteSticky } from "react-icons/fa6";
import { BsPeopleFill } from "react-icons/bs";
import { FaServicestack } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GoGitPullRequest } from "react-icons/go";

const StatisticsDashboard = () => {
  const [announcements, setAnnouncements] = useState(0);
  const [archivedAnnouncements, setArchivedAnnouncements] = useState([]);
  const [application, setApplication] = useState(0);
  const [archiveapplication, setArchiveApplication] = useState(0);
  const [users, setUsers] = useState(0);
  const [admin, setAdmin] = useState(0);
  const [archiveadmin, setArchiveAdmin] = useState(0);
  const [headAdmin, setHeadAdmin] = useState(0);
  const [archiveheadAdmin, setArchiveHeadAdmin] = useState(0);
  const [brgyAdmin, setBrgyAdmin] = useState(0);
  const [archivebrgyAdmin, setArchiveBrgyAdmin] = useState(0);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [archivedServices, setArchivedServices] = useState([]);
  const [officials, setOfficials] = useState([]);
  const [inquiries, setInquiries] = useState(0);
  const [archivedinquiries, setArchivedInquiries] = useState([]);
  const [archivedOfficials, setArchivedOfficials] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [userData, setUserData] = useState({});
  const id = searchParams.get("id");
  const brgy = "MUNISIPYO";
  const to = "Admin";
  console.log(id);
  useEffect(() => {
    const fetchData = async () => {
      try {
        //EVENTS
        try {
          const announcementsResponse = await axios.get(
            `${API_LINK}/announcement/?brgy=${brgy}&archived=false`
          );
          setAnnouncements(
            announcementsResponse.status === 200
              ? announcementsResponse.data.total
              : 0
          );
          const archivedAnnouncementsResponse = await axios.get(
            `${API_LINK}/announcement/?brgy=${brgy}&archived=true`
          );
          setArchivedAnnouncements(
            archivedAnnouncementsResponse.status === 200
              ? archivedAnnouncementsResponse.data.total
              : 0
          );
        } catch (err) {
          console.log(err);
        }

        //APPLICATION
        try {
          const response = await axios.get(
            `${API_LINK}/application/?brgy=${brgy}&archived=false`
          );
          setApplication(response.status === 200 ? response.data.total : 0);
          const response1 = await axios.get(
            `${API_LINK}/application/?brgy=${brgy}&archived=true`
          );
          setArchiveApplication(
            response1.status === 200 ? response1.data.total : 0
          );
        } catch (err) {
          console.log(err);
        }

        //INQUIRIES
        try {
          const inquiryresponse = await axios.get(
            `${API_LINK}/inquiries/admininquiries/?to=${to}&archived=false`
          );
          setInquiries(
            inquiryresponse.status === 200 ? inquiryresponse.data.total : 0
          );
          const archivedinquiryresponse = await axios.get(
            `${API_LINK}/inquiries/admininquiries/?to=${to}&archived=true`
          );
          setArchivedInquiries(
            archivedinquiryresponse.status === 200
              ? archivedinquiryresponse.data.total
              : 0
          );
        } catch (err) {
          console.log(err);
        }

        try {
          const servicesResponse = await axios.get(
            `${API_LINK}/services/allservices/?archived=false`
          );
          setServices(
            servicesResponse.status === 200 ? servicesResponse.data : []
          );
          const archivedServicesResponse = await axios.get(
            `${API_LINK}/services/allservices/?archived=true`
          );
          setArchivedServices(
            archivedServicesResponse.status === 200
              ? archivedServicesResponse.data
              : []
          );
        } catch (err) {
          console.log(err);
        }
        try {
          const admin = await axios.get(
            `${API_LINK}/users/?brgy=${brgy}&type=Admin`
          );

          setAdmin(admin.status === 200 ? admin.data.total : 0);

          const archivedUsersResponse = await axios.get(
            `${API_LINK}/users/showArchived/?brgy=${brgy}&type=Admin`
          );
          setArchiveAdmin(
            archivedUsersResponse.status === 200
              ? archivedUsersResponse.data.total
              : 0
          );
        } catch (err) {
          console.log(err);
        }
        try {
          const headadmin = await axios.get(
            `${API_LINK}/users/?brgy=${brgy}&type=Head Admin`
          );

          setHeadAdmin(headadmin.status === 200 ? headadmin.data.total : 0);

          const archivedUsersResponse = await axios.get(
            `${API_LINK}/users/showArchived/?brgy=${brgy}&type=Head Admin`
          );
          setArchiveHeadAdmin(
            archivedUsersResponse.status === 200
              ? archivedUsersResponse.data.total
              : 0
          );
        } catch (err) {
          console.log(err);
        }
        try {
          const brgyadmin = await axios.get(
            `${API_LINK}/staffs/head_admin/get`
          );

          setBrgyAdmin(brgyadmin.status === 200 ? brgyadmin.data.total : 0);

          const archivedUsersResponse = await axios.get(
            `${API_LINK}/staffs/archive_head_admin/get`
          );
          setArchiveBrgyAdmin(
            archivedUsersResponse.status === 200
              ? archivedUsersResponse.data.total
              : 0
          );
        } catch (err) {
          console.log(err);
        }
        try {
          const getUser = await axios.get(`${API_LINK}/municipal_admin/specific/${id}`);
          setUserData(getUser.status === 200 ? getUser.data[0] : []);
        } catch (err) {
          console.log("err", err.message);
        }

        try {
          const officialsResponse = await axios.get(
            `${API_LINK}/mofficials/?brgy=${brgy}&archived=false`
          );
          setOfficials(
            officialsResponse.status === 200
              ? officialsResponse.data.result
              : []
          );
        } catch (err) {
          console.log("err", err.message);
        }
        try {
          const response = await axios.get(`${API_LINK}/brgyinfo/allinfo`);
          setBarangays(response.data);
        } catch (error) {
          console.error("Error fetching barangays:", error);
        }

        try {
          const archivedOfficialsResponse = await axios.get(
            `${API_LINK}/mofficials/?brgy=${brgy}&archived=true`
          );
          setArchivedOfficials(
            archivedOfficialsResponse.status === 200
              ? archivedOfficialsResponse.data.result
              : []
          );
        } catch (err) {
          setArchivedOfficials([]);
          console.log("err", err.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [brgy]);

  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       const res = await axios.get(`${API_LINK}/admin/specific/${id}`);
  //       if (res.status === 200) {
  //         setUserData(res.data[0]);

  //       } else {
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetch();
  // }, [id]);

  const gradients = [
    { gradient1: "from-[#2E3192]", gradient2: "to-[#2CAFFF]" },
    { gradient1: "from-[#E65758]", gradient2: "to-[#771D32]" },
    { gradient1: "from-[#067D68]", gradient2: "to-[#147a63]" },
    { gradient1: "from-[#662D8C]", gradient2: "to-[#ED1E79]" },
    { gradient1: "from-[#614385]", gradient2: "to-[#516395]" },
    { gradient1: "from-[#02AABD]", gradient2: "to-[#00CDAC]" },
    { gradient1: "from-[#009933]", gradient2: "to-[#003399]" },
    { gradient1: "from-[#147a63]", gradient2: "to-[#003399]" },
    { gradient1: "from-[#9333EA]", gradient2: "to-[#9333EA]" },
  ];

  const titles = [
    {
      title: "Events",
      active: announcements,
      archived: archivedAnnouncements,
      activeLink: `/announcements/?id=${id}`,
      archivedLink: `/archivedannoucements/?id=${id}&brgy=${brgy}&archived=true`,
      icon: <BsMegaphone size={15} className="sm:block md:hidden" />,
    },
    {
      title: "Events Application",
      active: application,
      archived: archiveapplication,
      activeLink: `/events_registration/?id=${id}`,
      archivedLink: `/archived_registrations/?id=${id}&brgy=${brgy}&archived=true`,
      icon: <BsMegaphone size={15} className="sm:block md:hidden" />,
    },
    {
      title: "Inquiries",
      active: inquiries,
      archived: archivedinquiries, // Ensure archivedinquiries is defined
      activeLink: `/inquiries/?id=${id}&brgy=${brgy}`,
      archivedLink: `/archivedinquiries/?id=${id}&brgy=${brgy}`,
      icon: <FaRegNoteSticky size={15} className="sm:block md:hidden" />,
    },
    {
      title: "Barangay Services",
      active: services.length,
      archived: archivedServices.length,
      activeLink: `/barangaymenu/?id=${id}`,
      archivedLink: `/barangaymenu/?id=${id}`,
      icon: <GoGitPullRequest size={15} className="sm:block md:hidden" />,
    },
    userData.type === "Head Admin"
      ? {
          title: "Admin Accounts",
          active: admin,
          archived: archiveadmin,
          activeLink: `/municipal_account/?id=${id}`,
          archivedLink: `/archive_municipal_account/?id=${id}&brgy=${brgy}&archived=true`,
          icon: <BsPeopleFill size={15} className="sm:block md:hidden" />,
        }
      : null,
    userData.type === "Head Admin"
      ? {
          title: "Head Admin Accounts",
          active: headAdmin,
          archived: archiveheadAdmin,
          activeLink: `/municipal_account/?id=${id}`,
          archivedLink: `/archive_municipal_account/?id=${id}&brgy=${brgy}&archived=true`,
          icon: <BsPeopleFill size={15} className="sm:block md:hidden" />,
        }
      : null,

    userData.type === "Head Admin"
      ? {
          title: "Barangay Admin",
          active: brgyAdmin,
          archived: archivebrgyAdmin,
          activeLink: `/brgy_account/?id=${id}`,
          archivedLink: `/archive_brgy_account/?id=${id}&brgy=${brgy}&archived=true`,
          icon: <FaPeopleGroup size={15} className="sm:block md:hidden" />,
        }
      : null,

    userData.type === "Head Admin"
      ? {
          title: "Officials",
          active: officials.length,
          archived: archivedOfficials.length,
          activeLink: `/municipalityofficials/?id=${id}`,
          archivedLink: `/archivedmunicipalityofficials/?id=${id}&brgy=${brgy}&archived=true`,
          icon: <FaPeopleGroup size={15} className="sm:block md:hidden" />,
        }
      : null,

    {
      title: "Barangays",
      active: barangays.length, // Check if officials is defined before using it
      activeLink: `/barangaymenu/?id=${id}`,
      archivedLink: `/archived_officials/?id=${id}&brgy=${brgy}`,
      icon: <FaPeopleGroup size={15} className="sm:block md:hidden" />,
    },
  ];
  console.log("a", userData.name);
  return (
    <div className="flex flex-col w-full">
      <b className="border-solid border-0 border-black border-b-2 pb-2 uppercase font-heavy text-lg md:text-xl">
        Dashboard
      </b>
      <div className="w-full grid sm:grid-cols-1 md:grid-cols-3 2xl:grid-cols-3 gap-3 py-4">
        {gradients.map((item, idx) => {
          const titleItem = titles[idx];

          const shouldDisplayGradient = titleItem && titleItem.title.length > 0;

          return shouldDisplayGradient ? (
            <div className="flex flex-col">
              <div
                className={`hs-dropdown relative bg-gradient-to-r ${item.gradient1} ${item.gradient2} text-white flex flex-col justify-between items-center p-3 text-sm md:text-base lg:text-lg rounded-lg`}
              >
                <button
                  id="hs-unstyled-collapse"
                  data-hs-collapse={`#hs-statistics-dashboard-${idx}`}
                  className="hs-collapse-toggle justify-between flex items-center w-full  gap-x-3  text-[12px] xl:text-base rounded-md"
                >
                  <div className="flex items-center gap-x-3 p-0.5 w-full inline-flex font-heavy rounded-lg line-clamp-1">
                    {titleItem ? titleItem.icon : ""}
                    <span className="flex uppercase block justify-end item-end ">
                      {titleItem ? titleItem.title : ""}
                    </span>
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
                  id={`hs-statistics-dashboard-${idx}`}
                  className="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300"
                  aria-labelledby="hs-unstyled-collapse"
                >
                  <Link to={titleItem ? titleItem.activeLink : ""}>
                    <a
                      className={`flex items-center p-1 gap-x-3.5 rounded-lg font-heavy text-[12px] xl:text-[14px] text-white hover:bg-gradient-to-r ${item.gradient1} hover:border hover:border-gray-300`}
                    >
                      Active:
                      <strong className="ml-auto">
                        {titleItem ? titleItem.active : ""}
                      </strong>
                    </a>
                  </Link>
                  {titleItem.title !== "Barangays" && (
                    <Link to={titleItem ? titleItem.archivedLink : ""}>
                      <a
                        className={`flex items-center p-1 gap-x-3.5 rounded-lg font-heavy text-[12px] xl:text-[14px] text-white hover:bg-gradient-to-r ${item.gradient1} hover:border hover:border-gray-300`}
                      >
                        Archived:
                        <strong className="ml-auto">
                          {titleItem ? titleItem.archived : ""}
                        </strong>
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default StatisticsDashboard;
