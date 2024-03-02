import React from "react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaArchive, FaPlus, FaTrash, FaUserCircle } from "react-icons/fa";
import { BsPrinter } from "react-icons/bs";
import { AiOutlineEye, AiOutlineStop } from "react-icons/ai";
import { FiEdit, FiMail } from "react-icons/fi";
import ReactPaginate from "react-paginate";
import GenerateReportsModal from "../../components/barangaytabs/brgyarchivedResidents/GenerateReportsModal";
import axios from "axios";
import API_LINK from "../../config/API";
import { useSearchParams } from "react-router-dom";
import PrintPDF from "../../components/barangaytabs/brgyResidents/form/PrintPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import noData from "../../assets/image/no-data.png";
import AddResidentsModal from "../../components/barangaytabs/brgyResidents/AddResidentModal";
import StatusResident from "../../components/barangaytabs/brgyResidents/StatusResident";
import ManageResidentModal from "../../components/barangaytabs/brgyResidents/ManageResidentsModal";
import MessageResidentModal from "../../components/barangaytabs/brgyResidents/messageResident";
import GetBrgy from "../../components/GETBrgy/getbrgy";
const Residents = () => {
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const brgy = searchParams.get("brgy");
  const type = "Resident";
  const [user, setUser] = useState({});
  const [status, setStatus] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [filteredResident, setFilteredResidents] = useState([]);
  const information = GetBrgy(brgy);
  const sortedAndFilteredUsers = useMemo(() => {
    let filteredUsers = [...users];

    // Filter by status
    if (statusFilter !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) => user.isApproved === statusFilter
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const searchLowerCase = searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter((user) =>
        `${user.firstName} ${user.middleName} ${user.lastName}`
          .toLowerCase()
          .includes(searchLowerCase)
      );
    }

    // Sort
    filteredUsers.sort((a, b) => {
      const nameA =
        `${a.firstName} ${a.middleName} ${a.lastName}`.toUpperCase();
      const nameB =
        `${b.firstName} ${b.middleName} ${b.lastName}`.toUpperCase();

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return filteredUsers;
  }, [users, sortOrder, statusFilter, searchQuery]);

  const handleSort = (sortByValue) => {
    setSortBy(sortByValue);
    // If you want to reset the status filter when sorting, uncomment the line below
    setStatusFilter("all");
  };

  const handleStatusFilter = (selectedStatus) => {
    setStatusFilter(selectedStatus);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `${API_LINK}/users/?brgy=${brgy}&type=Resident&page=${currentPage}`
      );
      if (response.status === 200) {
        setPageCount(response.data.pageCount);
        setUsers(response.data.result);
        setFilteredResidents(response.data.result);
      } else setUsers([]);

      console.log(response);
    };

    fetch();
  }, [currentPage]);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const tableHeader = [
    "PROFILE",
    "NAME",
    "AGE",
    "GENDER",
    "ACCOUNT STATUS",
    "ACTIONS",
  ];

  useEffect(() => {
    document.title = "Residents | Barangay E-Services Management";
  }, []);

  const handleView = (item) => {
    setUser(item);
  };

  const handleResetFilter = () => {
    setStatusFilter("all");
    setSearchQuery("");
  };
  const handleCombinedActions = (item) => {
    handleView({ ...item });
    handleStatus({
      id: item._id,
      status: item.isApproved,
    });
  };
  return (
    <div className="">
      <div className="flex flex-col ">
        <div className="flex flex-row sm:flex-col-reverse lg:flex-row w-full ">
          <div
            className="sm:mt-5 md:mt-4 lg:mt-0  py-2 lg:py-4 px-5 md:px-10 lg:px-0 xl:px-10 sm:rounded-t-lg lg:rounded-t-[1.75rem]  w-full lg:w-2/5 xxl:h-[4rem] xxxl:h-[5rem] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
            style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}
          >
            <h1
              className="text-center sm:text-[15px] mx-auto font-bold md:text-xl lg:text-[15px] xl:text-xl xxl:text-2xl xxxl:text-4xl xxxl:mt-1 text-white"
              style={{ letterSpacing: "0.2em" }}
            >
              MANAGE RESIDENTS
            </h1>
          </div>
          <div className="lg:w-3/5 flex flex-row justify-end items-center ">
            <div className="sm:w-full md:w-full lg:w-2/5 flex sm:flex-col md:flex-row md:justify-center md:items-center sm:space-y-2 md:space-y-0 md:space-x-2 ">
              <div className="w-full rounded-lg flex justify-center">
                <div className="hs-tooltip inline-block w-full">
                  <button
                    type="button"
                    data-hs-overlay="#hs-modal-addResident"
                    className="hs-tooltip-toggle justify-center sm:px-2 sm:p-2 md:px-5 md:p-3 rounded-lg  w-full text-white font-medium text-sm text-center inline-flex items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
                    style={{
                      background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
                    }}
                  >
                    <FaPlus size={24} style={{ color: "#ffffff" }} />
                    <span className="sm:block md:hidden sm:pl-5">
                      Add Residents
                    </span>

                    <span
                      className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                      role="tooltip"
                    >
                      Add Residents
                    </span>
                  </button>
                </div>
              </div>
              <div className="w-full rounded-lg ">
                <Link to={`/brgyarchivedresidents/?id=${id}&brgy=${brgy}`}>
                  <div className="hs-tooltip inline-block w-full">
                    <button
                      type="button"
                      data-hs-overlay="#hs-modal-add"
                      className="hs-tooltip-toggle justify-center sm:px-2 sm:p-2 md:px-5 md:p-3 rounded-lg  w-full text-white font-medium text-sm text-center inline-flex items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
                      style={{
                        background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
                      }}
                    >
                      <FaArchive size={24} style={{ color: "#ffffff" }} />
                      <span className="sm:block md:hidden sm:pl-5">
                        Archived Residents
                      </span>
                      <span
                        className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                        role="tooltip"
                      >
                        Archived Residents
                      </span>
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="py-2 px-2 bg-gray-400 border-0 border-t-2 border-white">
          <div className="sm:flex-col-reverse md:flex-row flex justify-between w-full">
            <div className="flex flex-col lg:flex-row lg:space-x-2 md:mt-2 lg:mt-0 md:space-y-2 lg:space-y-0">
              {/* Status Sort */}
              <div className="hs-dropdown relative inline-flex sm:[--placement:bottom] md:[--placement:bottom-left]">
                <button
                  id="hs-dropdown"
                  type="button"
                  className=" sm:w-full md:w-full sm:mt-2 md:mt-0 text-white hs-dropdown-toggle py-1 px-5 inline-flex justify-center items-center gap-2 rounded-md  font-medium shadow-sm align-middle transition-all text-sm bg-[#295141] "
                  style={{ backgroundColor: information?.theme?.primary }}
                >
                  STATUS
                  <svg
                    className={`hs-dropdown-open:rotate-${
                      sortOrder === "asc" ? "180" : "0"
                    } w-2.5 h-2.5 text-white`}
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
                </button>
                <ul
                  className="bg-[#f8f8f8] border-2 border-[#ffb13c] hs-dropdown-menu w-72 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10  shadow-xl rounded-xl p-2 "
                  aria-labelledby="hs-dropdown"
                >
                  <a
                    onClick={handleResetFilter}
                    className="flex items-center font-medium uppercase gap-x-3.5 py-2 px-2 text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 hover:rounded-[12px] focus:ring-2 focus:ring-blue-500"
                    href="#"
                  >
                    RESET FILTERS
                  </a>
                  <hr className="border-[#4e4e4e] my-1" />
                  <li
                    onClick={() => handleStatusFilter("Registered")}
                    className={`flex items-center font-medium uppercase my-1 gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500 ${
                      statusFilter === "Registered" && "bg-[#b3c5cc]"
                    }`}
                  >
                    REGISTERED
                  </li>
                  <li
                    onClick={() => handleStatusFilter("Pending")}
                    className={`flex items-center font-medium uppercase my-1 gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500 ${
                      statusFilter === "Pending" && "bg-[#b3c5cc]"
                    }`}
                  >
                    PENDING
                  </li>
                  <li
                    onClick={() => handleStatusFilter("Denied")}
                    className={`flex items-center font-medium uppercase my-1 gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500 ${
                      statusFilter === "Denied" && "bg-[#b3c5cc]"
                    }`}
                  >
                    DENIED
                  </li>
                </ul>
              </div>
            </div>

            <div className="sm:flex-col md:flex-row flex sm:w-full md:w-4/12">
              <div className="flex flex-row w-full md:mr-2">
                <button
                  className=" p-3 rounded-l-md bg-[#295141]"
                  style={{ backgroundColor: information?.theme?.primary }}
                >
                  <div className="w-full overflow-hidden">
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </div>
                </button>
                <label
                  htmlFor="hs-table-with-pagination-search"
                  className="sr-only"
                >
                  Search
                </label>
                <input
                  type="text"
                  name="hs-table-with-pagination-search"
                  id="hs-table-with-pagination-search"
                  className="sm:px-3 sm:py-1 md:px-3 md:py-1 block w-full text-black border-gray-200 rounded-r-md text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Search for items"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);

                    if (e.target.value.trim() === "") {
                      // If the search input is empty, fetch all data
                      setUsers(users);
                    } else {
                      // If the search input is not empty, filter the data
                      const User = users.filter(
                        (item) =>
                          item.firstName
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase()) ||
                          item.lastName
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase())
                      );
                      setFilteredResidents(User);
                    }

                    console.log("Officials Fetched", officials);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb overflow-y-scroll lg:overflow-x-hidden h-[calc(100vh_-_275px)] xxl:h-[calc(100vh_-_275px)] xxxl:h-[calc(100vh_-_300px)]">
          <table className="relative table-auto w-full">
            <thead
              className=" sticky top-0 bg-[#295141]"
              style={{ backgroundColor: information?.theme?.primary }}
            >
              <tr className="">
                {tableHeader.map((item, idx) => (
                  <th
                    scope="col"
                    key={idx}
                    className="px-6 py-3 text-center text-xs font-bold text-white uppercase"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="odd:bg-slate-100">
              {sortedAndFilteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableHeader.length + 1}
                    className="text-center  overflow-y-hidden h-[calc(100vh_-_400px)] xxxl:h-[calc(100vh_-_326px)]"
                  >
                    <img
                      src={noData}
                      alt=""
                      className="w-[150px] h-[100px] md:w-[270px] md:h-[200px] lg:w-[250px] lg:h-[180px] xl:h-72 xl:w-96 mx-auto"
                    />
                    <strong className="text-[#535353]">NO DATA FOUND</strong>
                  </td>
                </tr>
              ) : (
                sortedAndFilteredUsers.map((item, index) => (
                  <tr key={index} className="odd:bg-slate-100 text-center">
                    <td className="px-6 py-3">
                      <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                        <div className="px-2 sm:px-6 py-2">
                          {item.profile && item.profile.link ? (
                            <img
                              src={item.profile.link}
                              alt="Profile"
                              className="lg:w-20 lg:h-20 w-16 h-16 object-cover border border-4  rounded-full mx-auto border-[#295141]"
                              style={{
                                borderColor: information?.theme?.primary,
                              }}
                            />
                          ) : (
                            <FaUserCircle
                              className="lg:w-20 lg:h-20 w-16 h-16 object-cover border border-4  rounded-full text-gray-500 mx-auto border-[#295141]"
                              style={{
                                borderColor: information?.theme?.primary,
                              }}
                            />
                          )}
                        </div>
                      </span>
                    </td>

                    <td className="px-6 py-3">
                      <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2 ">
                        {item.lastName +
                          " " +
                          item.firstName +
                          "," +
                          item.middleName}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black  line-clamp-2 ">
                          {item.age}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                          {item.sex}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      {item.isApproved === "Verified" && (
                        <div className="flex w-full items-center justify-center bg-[#6f75c2] xl:m-2 rounded-lg">
                          <span className="text-xs sm:text-sm font-bold text-white p-3 lg:mx-0 xl:mx-5">
                            VERIFIED
                          </span>
                        </div>
                      )}
                      {item.isApproved === "Verification Approval" && (
                        <div className="flex w-full items-center justify-center bg-[#5586cf] xl:m-2 rounded-lg">
                          <span className="text-xs sm:text-sm font-bold text-white p-3 lg:mx-0 xl:mx-5">
                            VERIFICATION APPROVAL
                          </span>
                        </div>
                      )}
                      {item.isApproved === "Registered" && (
                        <div className="flex w-full items-center justify-center bg-custom-green-button3 xl:m-2 rounded-lg">
                          <span className="text-xs sm:text-sm font-bold text-white p-3 lg:mx-0 xl:mx-5">
                            REGISTERED
                          </span>
                        </div>
                      )}
                      {item.isApproved === "Denied" && (
                        <div className="flex w-full items-center justify-center bg-custom-red-button xl:m-2 rounded-lg">
                          <span className="text-xs sm:text-sm font-bold text-white p-3 lg:mx-0 xl:mx-5">
                            DENIED
                          </span>
                        </div>
                      )}
                      {item.isApproved === "Pending" && (
                        <div className="flex w-full items-center justify-center bg-custom-amber xl:m-2 rounded-lg">
                          <span className="text-xs sm:text-sm font-bold text-white p-3 lg:mx-0 xl:mx-5">
                            PENDING
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="xl:px-6 py-3">
                      <div className="flex justify-center space-x-1 sm:space-x-none">
                        <div className="hs-tooltip inline-block">
                          <button
                            type="button"
                            data-hs-overlay="#hs-modal-editResident"
                            onClick={() => handleView({ ...item })}
                            className="hs-tooltip-toggle text-white bg-teal-800 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                          >
                            <AiOutlineEye
                              size={24}
                              style={{ color: "#ffffff" }}
                            />
                          </button>
                          <span
                            className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                            role="tooltip"
                          >
                            View Resident
                          </span>
                        </div>
                        <div className="hs-tooltip inline-block">
                          <button
                            type="button"
                            data-hs-overlay="#hs-modal-statusResident"
                            onClick={() => handleCombinedActions(item)}
                            className="hs-tooltip-toggle text-white bg-yellow-600 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                          >
                            <FiEdit size={24} style={{ color: "#ffffff" }} />
                          </button>
                          <span
                            className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                            role="tooltip"
                          >
                            Change Status
                          </span>
                        </div>
                        <div className="hs-tooltip inline-block">
                          <button
                            type="button"
                            data-hs-overlay="#hs-modal-messageResident"
                            onClick={() => handleCombinedActions(item)}
                            className="hs-tooltip-toggle text-white bg-red-800 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                          >
                            <FiMail size={24} style={{ color: "#ffffff" }} />
                          </button>
                          <span
                            className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                            role="tooltip"
                          >
                            Send Message
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="md:py-4 md:px-4  flex items-center justify-between sm:flex-col-reverse md:flex-row sm:py-3 bg-[#295141]"
        style={{ backgroundColor: information?.theme?.primary }}
      >
        <span className="font-medium text-white sm:text-xs text-sm">
          Showing {currentPage + 1} out of {pageCount} pages
        </span>
        <ReactPaginate
          breakLabel="..."
          nextLabel={
            pageCount > currentPage + 1 ? (
              <span className="text-white">&gt;&gt;</span>
            ) : (
              <span className="text-gray-300 cursor-not-allowed">&gt;&gt;</span>
            )
          }
          onPageChange={handlePageChange}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel={
            currentPage > 0 ? (
              <span className="text-white"> &lt;&lt;</span>
            ) : (
              <span className="text-gray-300 cursor-not-allowed">&lt;&lt;</span>
            )
          }
          className="flex space-x-3 text-white font-bold"
          activeClassName="text-yellow-500"
          disabledLinkClassName="text-gray-300"
          renderOnZeroPageCount={null}
        />
      </div>
      <AddResidentsModal brgy={brgy} />
      <GenerateReportsModal />

      <StatusResident
        user={user}
        setUser={setUser}
        brgy={brgy}
        status={status}
        setStatus={setStatus}
      />
         <MessageResidentModal 
         user={user}
         setUser={setUser}
         brgy={brgy}
         />
      <ManageResidentModal user={user} brgy={brgy} setUser={setUser} />
    </div>
  );
};

export default Residents;
