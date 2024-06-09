import React from "react";
import { useState, useEffect } from "react";
import moment from "moment";
import ReactPaginate from "react-paginate";
import axios from "axios";
import API_LINK from "../../config/API";
import noData from "../../assets/image/no-data.png";
import { useSearchParams,Link } from "react-router-dom";
import GetBrgy from "../../components/GETBrgy/getbrgy";

const Activitylogs = () => {
  const [actlogs, setAtcLogs] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const brgy = searchParams.get("brgy");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const information = GetBrgy(brgy);
  const [searchQuery, setSearchQuery] = useState("");
  const [specifiedDate, setSpecifiedDate] = useState(new Date());
  const [filteredlogs, setFilteredLogs] = useState([]);
  const [selected, setSelected] = useState("date");
  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(`${API_LINK}/act_logs/?brgy=${brgy}`);
      if (response.status === 200) {
        setAtcLogs(response.data.result);
        setFilteredLogs(response.data.result.slice(0, 15));
        setPageCount(response.data.pageCount);
        console.log(response.data.result);
      } else setAtcLogs([]);
    };

    fetch();
  }, []);
  useEffect(() => {
    const filteredData = actlogs.filter(
      (item) =>
        (item.firstname &&
          item.firstname.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.lastname &&
          item.lastname.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const startIndex = currentPage * 15;
    const endIndex = startIndex + 15;
    setFilteredLogs(filteredData.slice(startIndex, endIndex));
    setPageCount(Math.ceil(filteredData.length / 15));
  }, [actlogs, searchQuery, currentPage]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset current page when search query changes
  };

  const tableHeader = ["action", "user", "account type", "ip", "date",];

  useEffect(() => {
    document.title = "Activity Logs| Barangay E-Services Management";
  }, []);

  const TimeFormat = (date) => {
    if (!date) return "";

    const formattedTime = moment(date).format("hh:mm A");
    return formattedTime;
  };
  const handleResetFilter = () => {
    setSearchQuery("");
    setAtcLogs();
  };

  const filters = (choice, selectedDate) => {
    switch (choice) {
      case "date":
        const newArr = actlogs.filter((item) => {
          const createdAt = new Date(item.createdAt.slice(0, 10));

          return (
            createdAt.getFullYear() === selectedDate.getFullYear() &&
            createdAt.getMonth() === selectedDate.getMonth() &&
            createdAt.getDate() === selectedDate.getDate()
          );
        });

        return newArr;
      case "week":
        const startDate = selectedDate;
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        return actlogs.filter((item) => {
          const createdAt = new Date(item.createdAt.slice(0, 10));

          return (
            createdAt.getFullYear() === startDate.getFullYear() &&
            createdAt.getMonth() === startDate.getMonth() &&
            createdAt.getDate() >= startDate.getDate() &&
            createdAt.getDate() <= endDate.getDate()
          );
        });
      case "month":
        return actlogs.filter((item) => {
          const createdAt = new Date(item.createdAt.slice(0, 10));

          return (
            createdAt.getFullYear() === selectedDate.getFullYear() &&
            createdAt.getMonth() === selectedDate.getMonth()
          );
        });
      case "year":
        return actlogs.filter((item) => {
          const createdAt = new Date(item.createdAt.slice(0, 10));
          return createdAt.getFullYear() === selectedDate.getFullYear();
        });
    }
  };

  const onSelect = (e) => {
    setSelected(e.target.value);
  };

  const onChangeDate = (e) => {
    const date = new Date(e.target.value);
    date.setHours(0, 0, 0, 0);
    setSpecifiedDate(date);
    setFilteredLogs(filters(selected, date));
  };

  const onChangeWeek = (e) => {
    const date = moment(e.target.value).toDate();
    setSpecifiedDate(date);
    setFilteredLogs(filters(selected, date));
  };

  const onChangeMonth = (e) => {
    const date = moment(e.target.value).toDate();
    setSpecifiedDate(date);
    setFilteredLogs(filters(selected, date));
  };

  const onChangeYear = (e) => {
    if (e.target.value === "") {
      setFilteredLogs(actlogs);
    } else {
      const date = new Date(e.target.value, 0, 1);
      setSpecifiedDate(date);

      setFilteredLogs(filters(selected, date));
    }
  };

  const handleRowClick = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    // Add event listener for Escape key
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="">
      <div className="flex flex-col ">
        <div className="flex flex-row sm:flex-col-reverse lg:flex-row w-full ">
          <div
            className="sm:mt-5 md:mt-4 lg:mt-0  py-2 lg:py-4 px-5 md:px-10 lg:px-0 xl:px-10 sm:rounded-t-lg lg:rounded-t-[1.75rem]  w-full lg:w-2/5 xxl:h-[4rem] xxxl:h-[5rem]   bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
            style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}
          >
            <h1
              className="text-center sm:text-[15px] mx-auto font-bold md:text-xl lg:text-[15px] xl:text-xl xxl:text-2xl xxxl:text-3xl xxxl:mt-1 text-white"
              style={{ letterSpacing: "0.2em" }}
            >
              Activity Logs
            </h1>
          </div>
        
        </div>

        <div className="py-2 px-2 bg-gray-400 border-0 border-t-2 border-white">
          <div className="sm:flex-col-reverse md:flex-row flex justify-between w-full">
            <div className="flex flex-col lg:flex-row lg:space-x-2 md:mt-2 lg:mt-0 md:space-y-2 lg:space-y-0">
              {/* Date Sort */}
              <div className="hs-dropdown relative inline-flex sm:[--placement:bottom] md:[--placement:bottom-left] shadow-sm">
                <button
                  id="hs-dropdown"
                  type="button"
                  className=" sm:w-full md:w-full sm:mt-2 md:mt-0 text-white hs-dropdown-toggle py-1 px-5 inline-flex justify-center items-center gap-2 rounded-md  font-medium shadow-sm align-middle transition-all text-sm bg-[#295141] "
                  style={{ backgroundColor: information?.theme?.primary }}
                >
                  DATE
                  <svg
                    className={`hs-dropdown w-2.5 h-2.5 text-white`}
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
                  <hr className="border-[#4e4e4e] mt-1" />
                  <div className="hs-dropdown relative inline-flex flex-col w-full space-y-1 my-2 px-2">
                    <label className="text-black font-medium mb-1">
                      DATE RANGE
                    </label>
                    <div className="flex flex-col gap-2">
                      <select
                        className="bg-[#f8f8f8] text-gray-600 py-1 px-3 rounded-md font-medium shadow-sm text-sm border border-black"
                        onChange={onSelect}
                        defaultValue={selected}
                      >
                        <option value="date">Specific Date</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                      </select>
                      {selected === "date" && (
                        <input
                          className="bg-[#f8f8f8] text-gray-400 py-1 px-3 rounded-md font-medium shadow-sm text-sm border border-black"
                          type="date"
                          id="date"
                          name="date"
                          onChange={onChangeDate}
                        />
                      )}
                      {selected === "week" && (
                        <input
                          className="bg-[#f8f8f8] text-gray-400 py-1 px-3 rounded-md font-medium shadow-sm text-sm border border-black"
                          type="week"
                          id="week"
                          name="week"
                          onChange={onChangeWeek}
                        />
                      )}
                      {selected === "month" && (
                        <input
                          className=" text-gray-400 py-1 px-3 rounded-md font-medium shadow-sm text-sm border border-black"
                          type="month"
                          id="month"
                          name="month"
                          onChange={onChangeMonth}
                        />
                      )}
                      {selected === "year" && (
                        <input
                          className=" text-black py-1 px-3 rounded-md font-medium shadow-sm text-sm border border-grey-800 w-full"
                          type="number"
                          id="year"
                          name="year"
                          placeholder="YEAR"
                          onChange={onChangeYear}
                          min={1990}
                          max={new Date().getFullYear() + 10}
                        />
                      )}
                    </div>
                  </div>
                </ul>
              </div>
            </div>
            <div className="sm:flex-col md:flex-row flex sm:w-full md:w-4/12">
              <div className="flex flex-row w-full md:mr-2">
                <button
                  className="  p-3 rounded-l-md bg-[#295141]"
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
                  className="sm:px-3 sm:py-1 md:px-3 md:py-1 block w-full text-black border-gray-200 rounded-r-md text-sm focus:border-blue-500 focus:ring-blue-500 "
                  placeholder="Search for items"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb overflow-y-scroll lg:overflow-x-hidden h-[calc(100vh_-_275px)] xxl:h-[calc(100vh_-_275px)] xxxl:h-[calc(100vh_-_300px)]">
        <table
            className="min-w-full divide-y relative table-auto w-full rounded border-slate-200"
            cellspacing="0"
          >
            <thead className="bg-[#295141] sticky top-0" style={{ backgroundColor: information?.theme?.primary }}>
              <tr>
                {tableHeader.map((item, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    {item.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-700">
              {filteredlogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableHeader.length}
                    className="text-center  overflow-y-hidden h-[calc(100vh_-_315px)] xxxl:h-[calc(100vh_-_326px)]"
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
                filteredlogs.map((item, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer transition duration-300 ease-in-out hover:shadow-lg hover:shadow-blue-500/50"
                    onClick={() => handleRowClick(item)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      <div className="flex items-center">
                      <span
                          className={`bg-${
                            item.action === "Created"
                              ? "teal-700"
                              : item.action === "Updated"
                              ? "blue-500"
                              : item.action === "Archived"
                              ? "red-500"
                              : item.action === "Restored"
                              ? "green-500"
                              : "yellow-200"
                          } text-${
                            item.action === "Created"
                              ? "teal-400"
                              : item.action === "Updated"
                              ? "white"
                              : item.action === "Archived"
                              ? "red-800"
                              : item.action === "Restored"
                              ? "gray-800"
                              : "yellow-800"
                            } inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium mr-2`}
                        >
                          {item.action}
                        </span>
                        <span className="truncate">
                          {item.details.slice(0, 100)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-300">
                      {item.profile ? (
                        <img
                          src={item.profile}
                          alt="User Avatar"
                          className="inline-block w-8 h-8 rounded-full mr-2"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="inline-block w-8 h-8 rounded-full mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                      {item.firstname} {item.lastname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-300">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-300">
                      {item.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-300">
                      {moment(item.createdAt).format("MMMM DD, YYYY")} -{" "}
                      {TimeFormat(item.createdAt) || ""}
                    </td>
                  
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div
          className="md:py-4 md:px-4 flex items-center justify-between sm:flex-col-reverse md:flex-row sm:py-3 bg-[#295141]"
          style={{ backgroundColor: information?.theme?.primary }}
        >
          <span className="font-medium text-white sm:text-xs text-sm">
            Showing {currentPage + 1} out of {pageCount} pages
          </span>
          <ReactPaginate
            breakLabel="..."
            nextLabel=">>"
            onPageChange={handlePageChange}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="<<"
            className="flex space-x-3 text-white font-bold"
            activeClassName="text-yellow-500"
            disabledLinkClassName="text-gray-300"
            renderOnZeroPageCount={null}
          />
        </div>
        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg shadow-2xl p-6 w-11/12 md:w-2/3 max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Log Details
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:shadow-outline"
                  onClick={closeModal}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto max-h-96">
                <dl className="flex flex-col gap-4">
                  <div className="flex justify-between ">
                    <dt className="font-medium text-gray-700">User:</dt>
                    <dd className="text-gray-600">
                      {selectedLog?.firstname} {selectedLog?.lastname}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">Account Type:</dt>
                    <dd className="text-gray-600">{selectedLog?.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">IP Address:</dt>
                    <dd className="text-gray-600">{selectedLog?.ip}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-700">Date & Time:</dt>
                    <dd className="text-gray-600">
                      {moment(selectedLog?.createdAt).format(
                        "MMMM DD, YYYY hh:mm A"
                      )}
                    </dd>
                  </div>
                  <div className=" border-t-2">
                    {" "}
                    {/* <dt className="font-medium text-gray-700">Action & Details:</dt> */}
                    <dd
                      className="whitespace-pre-wrap text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: `<strong>${selectedLog?.action}:</strong> ${selectedLog?.details}`,
                      }}
                    />
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
       
      </div>
    </div>
  );
};

export default Activitylogs;
