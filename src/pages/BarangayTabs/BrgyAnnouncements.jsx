import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { AiOutlineStop, AiOutlineEye } from "react-icons/ai";
import { FaArchive, FaPlus } from "react-icons/fa";
import { BsPrinter } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import axios from "axios";
import API_LINK from "../../config/API";
import GenerateReportsModal from "../../components/barangaytabs/brgyAnnouncements/GenerateReportsModal";
import ViewArchivedAnnouncementModal from "../../components/barangaytabs/brgyAnnouncements/ViewArchivedAnnouncement";
import PrintPDF from "../../components/barangaytabs/brgyAnnouncements/form/PrintPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import noData from "../../assets/image/no-data.png";
import GetBrgy from "../../components/GETBrgy/getbrgy";
const BrgyAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const brgy = searchParams.get("brgy");

  const [announcement, setAnnouncement] = useState([]);
  const [announcementWithCounts, setAnnouncementWithCounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  //date filtering
  const [specifiedDate, setSpecifiedDate] = useState(new Date());
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [selected, setSelected] = useState("date");
  const information = GetBrgy(brgy);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const announcementsResponse = await axios.get(
          `${API_LINK}/announcement/?brgy=${brgy}&archived=false&page=${currentPage}`
        );

        if (announcementsResponse.status === 200) {
          const announcementsData = announcementsResponse.data.result.map(
            async (announcement) => {
              const completedResponse = await axios.get(
                `${API_LINK}/application/completed?brgy=${brgy}&event_id=${announcement.event_id}`
              );

              if (completedResponse.status === 200) {
                const completedCount = completedResponse.data.completedCount;
                return { ...announcement, completedCount };
              }
            }
          );

          setAnnouncements(announcementsResponse.data.result);

          Promise.all(announcementsData).then((announcementsWithCounts) => {
            setAnnouncementWithCounts(announcementsWithCounts);
            setFilteredAnnouncements(announcementsWithCounts);
          });

          setPageCount(announcementsResponse.data.pageCount);
        } else {
          setAnnouncementWithCounts([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);

        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
      }
    };

    fetchData();
  }, [currentPage, brgy]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const tableHeader = [
    "Event id",
    "title",
    "details",
    "creation date",
    "event date",
    "# of applicants",
    "actions",
  ];

  const Announcements = announcements.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.event_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    document.title = "Announcement | Barangay E-Services Management";
  }, []);

  const handleView = (item) => {
    setAnnouncement(item);
  };

  const DateFormat = (date) => {
    const dateFormat = date === undefined ? "" : date.substr(0, 10);
    return dateFormat;
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setAnnouncements([]);
  };

  const filters = (choice, selectedDate) => {
    switch (choice) {
      case "date":
        return announcements.filter((item) => {
          console.log(typeof new Date(item.createdAt), selectedDate);
          console.log("Announcements: ", announcements);
          return (
            new Date(item.createdAt).getFullYear() ===
              selectedDate.getFullYear() &&
            new Date(item.createdAt).getMonth() === selectedDate.getMonth() &&
            new Date(item.createdAt).getDate() === selectedDate.getDate()
          );
        });
      case "week":
        const startDate = selectedDate;
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        console.log("start and end", startDate, endDate);

        return announcements.filter(
          (item) =>
            new Date(item.createdAt).getFullYear() ===
              startDate.getFullYear() &&
            new Date(item.createdAt).getMonth() === startDate.getMonth() &&
            new Date(item.createdAt).getDate() >= startDate.getDate() &&
            new Date(item.createdAt).getDate() <= endDate.getDate()
        );
      case "month":
        return announcements.filter(
          (item) =>
            new Date(item.createdAt).getFullYear() ===
              selectedDate.getFullYear() &&
            new Date(item.createdAt).getMonth() === selectedDate.getMonth()
        );
      case "year":
        return announcements.filter(
          (item) =>
            new Date(item.createdAt).getFullYear() ===
            selectedDate.getFullYear()
        );
    }
  };

  const onSelect = (e) => {
    console.log("select", e.target.value);

    setSelected(e.target.value);

    console.log("specified select", filters(e.target.value, specifiedDate));
  };

  const onChangeDate = (e) => {
    const date = new Date(e.target.value);
    setSpecifiedDate(date);
    setFilteredAnnouncements(filters(selected, date));
  };

  const onChangeWeek = (e) => {
    const date = moment(e.target.value).toDate();
    setSpecifiedDate(date);
    setFilteredAnnouncements(filters(selected, date));
  };

  const onChangeMonth = (e) => {
    const date = moment(e.target.value).toDate();
    setSpecifiedDate(date);
    setFilteredAnnouncements(filters(selected, date));
  };

  const onChangeYear = (e) => {
    if (e.target.value === "") {
      setFilteredAnnouncements(announcements);
    } else {
      const date = new Date(e.target.value, 0, 1);
      setSpecifiedDate(date);
      console.log("selected year converted date", date);
      console.log("specified year", filters(selected, date));
      setFilteredAnnouncements(filters(selected, date));
    }
  };
  const TimeFormat = (date) => {
    if (!date) return "";

    const formattedTime = moment(date).format("hh:mm A");
    return formattedTime;
  };

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
              className="text-center sm:text-[15px] mx-auto font-bold md:text-xl lg:text-[15px] xl:text-xl xxl:text-2xl xxxl:text-4xl xxxl:mt-1 text-white"
              style={{ letterSpacing: "0.2em" }}
            >
              EVENTS
            </h1>
          </div>
          <div className="lg:w-3/5 flex flex-row justify-end items-center ">
            <div className="sm:w-full md:w-full lg:w-2/5 flex sm:flex-col md:flex-row md:justify-center md:items-center sm:space-y-2 md:space-y-0 md:space-x-2 ">
              <div className="w-full rounded-lg ">
                <Link
                  to={`/brgyarchivedannoucements/?id=${id}&brgy=${brgy}&archived=true`}
                >
                  <div className="hs-tooltip inline-block w-full">
                    <button
                      type="button"
                      className="hs-tooltip-toggle justify-center sm:px-2 sm:p-2 md:px-5 md:p-3 rounded-lg  w-full text-white font-medium text-sm text-center inline-flex items-center   bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
                      style={{
                        background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
                      }}
                    >
                      <FaArchive size={24} style={{ color: "#ffffff" }} />
                      <span className="sm:block md:hidden sm:pl-5">
                        Archived Announcement
                      </span>
                      <span
                        className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                        role="tooltip"
                      >
                        Archived Announcement
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
              {/* <span className="font-medium text-[#292929]  justify-center flex text-center my-auto mx-2">
                SORT BY:{" "}
              </span> */}

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
                  <div class="hs-dropdown relative inline-flex flex-col w-full space-y-1 my-2 px-2">
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    const Announcements = announcements.filter((item) =>
                      item.title
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    );
                    setFilteredAnnouncements(Announcements);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

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
              {filteredAnnouncements.length === 0 ? (
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
                filteredAnnouncements.map((item, index) => (
                  <tr key={index} className="odd:bg-slate-100 text-center">
                       <td className="px-1 xl:px-3 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm text-black  line-clamp-2 ">
                          {item.event_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black  line-clamp-2 ">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black  line-clamp-1 w-[100px] ">
                          {item.details}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 w-2/12">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm text-black line-clamp-2">
                        {moment(item.createdAt).format("MMMM DD, YYYY")} -{" "}
                          {TimeFormat(item.createdAt) || ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 w-2/12">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm text-black line-clamp-2">
                        {moment(item.date).format("MMMM DD, YYYY")} -{" "}
                          {TimeFormat(item.date) || ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm text-black line-clamp-2">
                          {item.completedCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center space-x-1 sm:space-x-none">
                        <button
                          type="button"
                          data-hs-overlay="#hs-modal-viewArchivedAnnouncement"
                          onClick={() => handleView({ ...item })}
                          className="text-white bg-teal-800 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
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
        <div
          className="md:py-4 md:px-4 flex items-center justify-between sm:flex-col-reverse md:flex-row sm:py-3 bg-[#295141]"
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
        <ViewArchivedAnnouncementModal
          announcement={announcement}
          setAnnouncement={setAnnouncement}
          brgy={brgy}
        />
        <GenerateReportsModal />
      </div>
    </div>
  );
};

export default BrgyAnnouncement;
