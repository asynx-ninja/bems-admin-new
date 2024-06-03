import React from "react";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import ViewResidentModal from "../../components/barangaytabs/brgyarchivedResidents/ViewArchivedResident";
import Breadcrumbs from "../../components/barangaytabs/brgyarchivedResidents/Breadcrumb";
import axios from "axios";
import API_LINK from "../../config/API";
import { useSearchParams } from "react-router-dom";
import noData from "../../assets/image/no-data.png";
import GetBrgy from "../../components/GETBrgy/getbrgy";
const Residents = () => {
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const brgy = searchParams.get("brgy");
  const [user, setUser] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const information = GetBrgy(brgy);
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `${API_LINK}/users/showArchived/?brgy=${brgy}&type=Resident&status=${statusFilter}`
      );

      if (response.status === 200) {
        setPageCount(response.data.pageCount);
        setUsers(response.data.result);
        setFilteredResidents(response.data.result.slice(0, 10));
      } else setUsers([]);
    };

    fetch();
  }, [currentPage, statusFilter]);
  useEffect(() => {
    const filteredData = users.filter((item) => {
      const fullName = item.lastName.toLowerCase() +
        ", " +
        item.firstName.toLowerCase() +
        (item.middleName !== undefined ? " " + item.middleName.toLowerCase() : "");

      return (
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fullName.includes(searchQuery.toLowerCase())
      );
    });

    const startIndex = currentPage * 10;
    const endIndex = startIndex + 10;
    setFilteredResidents(filteredData.slice(startIndex, endIndex));
    setPageCount(Math.ceil(filteredData.length / 10));
  }, [users, searchQuery, currentPage]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset current page when search query changes
  };


  const handleStatusFilter = (selectedStatus) => {
    setStatusFilter(selectedStatus);
  };

  const tableHeader = [
    "PROFILE",
    "NAME",
    "AGE",
    "GENDER",
    "CONTACT",
    "ACCOUNT STATUS",
    "ACTIONS",
  ];

  useEffect(() => {
    document.title = "Archived Residents | Barangay E-Services Management";
  }, []);

  const handleView = (item) => {
    setUser(item);
  };

  const handleResetFilter = () => {
    setStatusFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="mx-4 mt-8 overflow-y-auto lg:h-[calc(100vh_-_110px)]">
      <div className="w-full flex items-center justify-center  rounded-t-lg bg-[#295141]" style={{ backgroundColor: information?.theme?.primary }}>
        <h1 className="text-white text-3xl py-2 px-5 font-heavy " >
          BARANGAY {brgy ? brgy.toUpperCase() : ""} INFORMATION
        </h1>
      </div>
      <div className="flex items-center justify-start bg-gray-100">
        <Breadcrumbs brgy={brgy} id={id} />
      </div>
      <div className="py-4 px-4">
        <div>
          {/* Header */}
          <div className="flex flex-row  sm:flex-col-reverse lg:flex-row w-full">
          <div
            className="sm:mt-5 md:mt-4 lg:mt-0  py-2 lg:py-4 px-5 md:px-10 lg:px-0 xl:px-10 sm:rounded-t-lg lg:rounded-t-[1.75rem]  w-full lg:w-2/5 xxl:h-[4rem] xxxl:h-[5rem] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
            style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}
          >
        <h1
              className="text-center sm:text-[15px] mx-auto font-bold md:text-xl lg:text-[15px] xl:text-xl xxl:text-2xl xxxl:text-3xl xxxl:mt-1 text-white"
              style={{ letterSpacing: "0.2em" }}
              >
                ARCHIVED RESIDENTS
              </h1>
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
                    className=" sm:w-full md:w-full sm:mt-2 md:mt-0 text-white hs-dropdown-toggle py-1 px-5 inline-flex justify-center items-center gap-2 rounded-md  font-medium shadow-sm align-middle transition-all text-sm bg-[#295141] " style={{ backgroundColor: information?.theme?.primary }}
                  >
                    STATUS
                    <svg
                      className="w-2.5 h-2.5 text-white"
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
                    onClick={() => handleStatusFilter("For Review")}
                    className={`flex items-center font-medium uppercase my-1 gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500 ${
                      statusFilter === "Pending" && "bg-[#b3c5cc]"
                    }`}
                  >
                    FOR REVIEW
                  </li>
                  <li
                    onClick={() => handleStatusFilter("Partially Verified")}
                    className={`flex items-center font-medium uppercase my-1 gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500 ${
                      statusFilter === "Registered" && "bg-[#b3c5cc]"
                    }`}
                  >
                    PARTIALLY VERIFIED
                  </li>
                  <li
                    onClick={() => handleStatusFilter("Fully Verified")}
                    className={`flex items-center font-medium uppercase my-1 gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500 ${
                      statusFilter === "Denied" && "bg-[#b3c5cc]"
                    }`}
                  >
                    FULLY VERIFIED
                  </li>
                  <li
                    onClick={() => handleStatusFilter("Rejected")}
                    className={`flex items-center font-medium uppercase my-1 gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500 ${
                      statusFilter === "Denied" && "bg-[#b3c5cc]"
                    }`}
                  >
                    REJECTED
                  </li>
                  </ul>
                </div>
              </div>
              <div className="sm:flex-col md:flex-row flex sm:w-full md:w-4/12">
                <div className="flex flex-row w-full md:mr-2">
                  <button className=" p-3 rounded-l-md bg-[#295141]" style={{ backgroundColor: information?.theme?.primary }}>
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
                    className="sm:px-3 sm:py-1 md:px-3 md:py-1 block w-full text-black border-gray-200 rounded-r-md text-sm focus:border-blue-500 focus:ring-blue-500 "
                    placeholder="Search for items"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb overflow-y-scroll lg:overflow-x-hidden h-[calc(100vh_-_320px)] xxxl:h-[calc(100vh_-_340px)]">
            <table className="relative table-auto w-full">
              <thead className=" sticky top-0 bg-[#295141]" style={{ backgroundColor: information?.theme?.primary }}>
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
                {filteredResidents.length === 0 ? (
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
                  filteredResidents.map((item, index) => (
                    <tr key={index} className="odd:bg-slate-100 text-center">
                      <td className="px-6 py-3">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                          <div className="px-2 sm:px-6 py-2">
                            {item.profile && item.profile.link ? (
                              <img
                                src={item.profile.link}
                                alt="Profile"
                                className="lg:w-20 lg:h-20 w-16 h-16 object-cover border border-4 border-[#013D74] rounded-full mx-auto"
                              />
                            ) : (
                              <FaUserCircle className="lg:w-20 lg:h-20 w-16 h-16 object-cover border border-4 border-[#013D74] rounded-full text-gray-500 mx-auto" />
                            )}
                          </div>
                        </span>
                      </td>

                      <td className="px-6 py-3 w-2/12">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2 ">
                          {item.firstName +
                            " " +
                            item.middleName +
                            " " +
                            item.lastName}
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
                        <div className="flex justify-center items-center">
                          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                            {item.contact}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                      {item.isApproved === "Fully Verified" && (
                        <div className="flex w-full items-center justify-center bg-[#6f75c2] xl:m-2 rounded-lg">
                          <span className="text-xs sm:text-sm font-bold text-white p-3 lg:mx-0 xl:mx-5">
                            FULLY VERIFIED
                          </span>
                        </div>
                      )}
                      {item.isApproved === "For Review" && (
                        <div className="flex w-full items-center justify-center bg-[#cf8455] xl:m-2 rounded-lg">
                          <span className="text-xs sm:text-sm font-bold text-white p-3 lg:mx-0 xl:mx-5">
                            FOR REVIEW
                          </span>
                        </div>
                      )}
                      {item.isApproved === "Partially Verified" && (
                        <div className="flex w-full items-center justify-center bg-custom-green-button3 xl:m-2 rounded-lg">
                          <span className="text-xs sm:text-sm font-bold text-white p-3 lg:mx-0 xl:mx-5">
                            PARTIALLY VERIFIED
                          </span>
                        </div>
                      )}
                      {item.isApproved === "Rejected" && (
                        <div className="flex w-full items-center justify-center bg-custom-red-button xl:m-2 rounded-lg">
                          <span className="text-xs sm:text-sm font-bold text-white p-3 lg:mx-0 xl:mx-5">
                            REJECTED
                          </span>
                        </div>
                      )}         
                    </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-center space-x-1 sm:space-x-none">
                          <button
                            type="button"
                            data-hs-overlay="#hs-modal-viewResident"
                            onClick={() => handleView({ ...item })}
                            className="text-white bg-yellow-800 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                          >
                            <AiOutlineEye
                              size={24}
                              style={{ color: "#ffffff" }}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="md:py-4 md:px-4  flex items-center justify-between sm:flex-col-reverse md:flex-row sm:py-3 bg-[#295141]" style={{ backgroundColor: information?.theme?.primary }}>
          <span className="font-medium text-white sm:text-xs text-sm">
            Showing {currentPage + 1} out of {pageCount} pages
          </span>
          <ReactPaginate
            breakLabel="..."
            nextLabel={
              pageCount > currentPage + 1 ? (
                <span className="text-white">&gt;&gt;</span>
              ) : (
                <span className="text-gray-300 cursor-not-allowed">
                  &gt;&gt;
                </span>
              )
            }
            onPageChange={handlePageChange}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel={
              currentPage > 0 ? (
                <span className="text-white"> &lt;&lt;</span>
              ) : (
                <span className="text-gray-300 cursor-not-allowed">
                  &lt;&lt;
                </span>
              )
            }
            className="flex space-x-3 text-white font-bold"
            activeClassName="text-yellow-500"
            disabledLinkClassName="text-gray-300"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
      <ViewResidentModal user={user} setUser={setUser} brgy={brgy} />
    </div>
  );
};

export default Residents;
