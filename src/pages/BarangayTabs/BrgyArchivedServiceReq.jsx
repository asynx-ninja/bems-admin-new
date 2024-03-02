import React from "react";
import { useState, useEffect } from "react";
import { BsPrinter } from "react-icons/bs";
import { AiOutlineStop, AiOutlineEye } from "react-icons/ai";
import { AiOutlineSend } from "react-icons/ai";
import { FaArchive } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { FaTrashRestore } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import API_LINK from "../../config/API";
import axios from "axios";
import moment from "moment";
import RequestsReportsModal from "../../components/barangaytabs/brgyserviceRequests/RequestsReportsModal";
import ViewRequestModal from "../../components/barangaytabs/brgyserviceRequests/ViewRequestModal";
import Breadcrumbs from "../../components/barangaytabs/brgyserviceRequests/Breadcrumbs";
import noData from "../../assets/image/no-data.png";
import GetBrgy from "../../components/GETBrgy/getbrgy";
function ArchiveServiceRequests() {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("brgy");
  const id = searchParams.get("id");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState({ response: [{ file: [] }] });
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortColumn, setSortColumn] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  //status filter
  const [statusFilter, setStatusFilter] = useState("all");
  //request filter
  const [requestFilter, setRequestFilter] = useState([]); // Default is "all"
  const [selectedReqFilter, setSelectedReqFilter] = useState("all");
  //date filtering
  const [specifiedDate, setSpecifiedDate] = useState(new Date());
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selected, setSelected] = useState("date");
  const information = GetBrgy(brgy);
  const [officials, setOfficials] = useState([]);
  useEffect(() => {
    document.title = "Service Requests | Barangay E-Services Management";
  }, []);
  useEffect(() => {
    const fetch = async () => {
       try{
     const response = await axios.get(
      `${API_LINK}/services/?brgy=${brgy}&archived=false&page=${currentPage}`
    );
      console.log(response.data.result)
     if (response.status === 200){
         let arr = [];
         response.data.result.map((item) => {
         arr.push(item.name);
         })
         setRequestFilter(arr);
         }
 
       }catch(err){
     console.log(err)
       }
    }
    fetch()
 }, [brgy]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/requests/?brgy=${brgy}&archived=true&status=${statusFilter}&type=${selectedReqFilter}&page=${currentPage}`
        );

        if (response.status === 200) {
          setRequests(response.data.result);
          setPageCount(response.data.pageCount);
          setFilteredRequests(response.data.result);
        } else setRequests([]);
      } catch (err) {
        console.log(err);
      }
    };

    fetch();
  }, [brgy, statusFilter, selectedReqFilter, currentPage]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/brgyofficial/?brgy=${brgy}&archived=false`
        );

        if (response.status === 200) {
          const officialsData = response.data.result || [];

          if (officialsData.length > 0) {
            setOfficials(officialsData);
          } else {
            setOfficials([]);
            console.log(`No officials found for Barangay ${brgy}`);
          }
        } else {
          setOfficials([]);
          console.error("Failed to fetch officials:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setOfficials([]);
      }
    };

    fetchData();
  }, [currentPage, brgy]); // Add positionFilter dependency
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const handleView = (item) => {
    setRequest(item);
  };
  const tableHeader = [
    "Control #",
    "SERVICE NAME",
    "REQUESTOR",
    "DATE",
    "STATUS",
    "ACTIONS",
  ];

  const handleStatusFilter = (selectedStatus) => {
    setStatusFilter(selectedStatus);
  };
  const handleRequestFilter = (selectedStatus) => {
    setRequestFilter(selectedStatus);
  };
  const handleResetFilter = () => {
    setStatusFilter("all");
    setRequestFilter("all");
    setRequest();
    setSearchQuery("");
  };

  const Requests = requests.filter((item) =>
    item.service_name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const TimeFormat = (date) => {
    if (!date) return "";

    const formattedTime = moment(date).format("hh:mm A");
    return formattedTime;
  };
  const filters = (choice, selectedDate) => {
    switch (choice) {
      case "date":
        return requests.filter((item) => {
          console.log(typeof new Date(item.createdAt), selectedDate);
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

        return requests.filter(
          (item) =>
            new Date(item.createdAt).getFullYear() ===
              startDate.getFullYear() &&
            new Date(item.createdAt).getMonth() === startDate.getMonth() &&
            new Date(item.createdAt).getDate() >= startDate.getDate() &&
            new Date(item.createdAt).getDate() <= endDate.getDate()
        );
      case "month":
        return requests.filter(
          (item) =>
            new Date(item.createdAt).getFullYear() ===
              selectedDate.getFullYear() &&
            new Date(item.createdAt).getMonth() === selectedDate.getMonth()
        );
      case "year":
        return requests.filter(
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
    setFilteredRequests(filters(selected, date));
  };

  const onChangeWeek = (e) => {
    const date = moment(e.target.value).toDate();
    setSpecifiedDate(date);
    setFilteredRequests(filters(selected, date));
  };

  const onChangeMonth = (e) => {
    const date = moment(e.target.value).toDate();
    setSpecifiedDate(date);
    setFilteredRequests(filters(selected, date));
  };

  const onChangeYear = (e) => {
    if (e.target.value === "") {
      setFilteredRequests(requests);
    } else {
      const date = new Date(e.target.value, 0, 1);
      setSpecifiedDate(date);
      console.log("selected year converted date", date);
      console.log("specified year", filters(selected, date));
      setFilteredRequests(filters(selected, date));
    }
  };

  return (
    <>
      <div className="mx-4 mt-8 overflow-y-auto lg:h-[calc(100vh_-_110px)]">
        <div
          className="w-full flex items-center justify-center  rounded-t-lg bg-[#295141]"
          style={{ backgroundColor: information?.theme?.primary }}
        >
          <h1 className="text-white text-3xl py-2 px-5 font-heavy ">
            BARANGAY SAN JOSE INFORMATION
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
                className="sm:mt-5 md:mt-4 lg:mt-0  py-2 lg:py-4 px-5 md:px-10 lg:px-0 xl:px-10 sm:rounded-t-lg lg:rounded-t-[1.75rem]  w-full lg:w-3/5 xxl:h-[4rem] xxxl:h-[5rem] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
                style={{
                  background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
                }}
              >
                 <h1
              className="text-center sm:text-[15px] mx-auto font-bold md:text-xl lg:text-[15px] xl:text-xl xxl:text-2xl xxxl:text-4xl xxxl:mt-1 text-white"
              style={{ letterSpacing: "0.2em" }}
                >
                  ARCHIVED SERVICE REQUESTS
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
                      <a
                        onClick={() => handleStatusFilter("Pending")}
                        class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                        href="#"
                      >
                        PENDING
                      </a>
                      <a
                        onClick={() => handleStatusFilter("Paid")}
                        class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                        href="#"
                      >
                        PAID
                      </a>
                      <a
                        onClick={() => handleStatusFilter("Processing")}
                        class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                        href="#"
                      >
                        PROCESSING
                      </a>
                      <a
                        onClick={() => handleStatusFilter("Cancelled")}
                        class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                        href="#"
                      >
                        CANCELLED
                      </a>
                      <a
                        onClick={() =>
                          handleStatusFilter("Transaction Completed")
                        }
                        class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                        href="#"
                      >
                        TRANSACTION COMPLETED
                      </a>
                      <a
                        onClick={() => handleStatusFilter("Rejected")}
                        class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                        href="#"
                      >
                        REJECTED
                      </a>
                    </ul>
                  </div>

                  <div className="hs-dropdown relative inline-flex sm:[--placement:bottom] md:[--placement:bottom-left]">
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
                      <hr className="border-[#4e4e4e] my-1" />
                      <div class="hs-dropdown relative inline-flex flex-col w-full space-y-1 my-2 px-2">
                        <label className="text-black font-medium mb-1">
                          DATE RANGE
                        </label>
                        <div className="flex gap-2 flex-col">
                          <select
                            className="bg-[#f8f8f8] text-gray-400 py-1 px-3 rounded-md font-medium shadow-sm text-sm border border-black"
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
                              className="bg-[#f8f8f8] text-gray-400 py-1 px-3 rounded-md font-medium shadow-sm text-sm border border-black"
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

                  {/* Service Type Sort */}
                <div className="hs-dropdown relative inline-flex sm:[--placement:bottom] md:[--placement:bottom-left]">
                <button
                  id="hs-dropdown"
                  type="button"
                  className=" sm:w-full md:w-full sm:mt-2 md:mt-0 text-white hs-dropdown-toggle py-1 px-5 inline-flex justify-center items-center gap-2 rounded-md  font-medium shadow-sm align-middle transition-all text-sm bg-[#295141] " style={{ backgroundColor: information?.theme?.primary }}
                >
                  SERVICE TYPE
                  <svg
                    className={`hs-dropdown-open:rotate-${sortOrder === "asc" ? "180" : "0"
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
                  <div className="flex flex-col scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb overflow-y-scroll h-44">
                  {requestFilter.map((service_name, index) => (
                    <a
                      key={index}
                      onClick={() => handleRequestFilter(service_name)}
                      className="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                      href="#"
                    >
                      {service_name}
                    </a>
                  ))}
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
                        const Requests = requests.filter((item) => {
                            const fullName = `${item.form[0].firstName.value} ${item.form[0].lastName.value}`;
                            const serviceId = item.req_id.toString(); // Assuming service_id is a number, convert it to string for case-insensitive comparison
                            return fullName.toLowerCase().includes(e.target.value.toLowerCase()) || serviceId.includes(e.target.value.toLowerCase());
                        });
                    
                        setFilteredRequests(Requests);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb overflow-y-scroll lg:overflow-x-hidden h-[calc(100vh_-_320px)] xxxl:h-[calc(100vh_-_340px)]">
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
                  {filteredRequests.length === 0 ? (
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
                        <strong className="text-[#535353]">
                          NO DATA FOUND
                        </strong>
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((item, index) => (
                      <tr key={index} className="odd:bg-slate-100 text-center">
                         <td className="px-6 py-3">
                      <span className="text-xs sm:text-sm text-black line-clamp-2">
                        {item.req_id}
                      </span>
                    </td>
                        <td className="px-6 py-3">
                          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                            {item.service_name}
                          </span>
                        </td>
                      
                        <td className="px-6 py-3">
                      <span className="text-xs sm:text-sm text-black line-clamp-2">
                        {item.form[0].lastName.value +
                          ", " +
                          item.form[0].firstName.value +
                          " " +
                          item.form[0].middleName.value}
                      </span>
                    </td>
                        <td className="px-6 py-3">
                          <div className="flex justify-center items-center">
                            <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                            {moment(item.createdAt).format("MMMM DD, YYYY")} -{" "}
                          {TimeFormat(item.createdAt) || ""}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          {item.status === "Transaction Completed" && (
                            <div className="flex items-center justify-center bg-custom-green-button3 m-2 rounded-lg">
                              <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-white font-bold p-3 mx-5">
                                TRANSACTION COMPLETED
                              </span>
                            </div>
                          )}
                          {item.status === "Rejected" && (
                            <div className="flex items-center justify-center bg-custom-red-button m-2 rounded-lg">
                              <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-white font-bold p-3 mx-5">
                                REJECTED
                              </span>
                            </div>
                          )}
                          {item.status === "Pending" && (
                            <div className="flex items-center justify-center bg-custom-amber m-2 rounded-lg">
                              <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-white font-bold p-3 mx-5">
                                PENDING
                              </span>
                            </div>
                          )}
                          {item.status === "Paid" && (
                            <div className="flex items-center justify-center bg-violet-800 m-2 rounded-lg">
                              <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-white font-bold p-3 mx-5">
                                PAID
                              </span>
                            </div>
                          )}

                          {item.status === "Processing" && (
                            <div className="flex items-center justify-center bg-blue-800 m-2 rounded-lg">
                              <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-white font-bold p-3 mx-5">
                                PROCESSING
                              </span>
                            </div>
                          )}

                          {item.status === "Cancelled" && (
                            <div className="flex items-center justify-center bg-gray-800 m-2 rounded-lg">
                              <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-white font-bold p-3 mx-5">
                                CANCELLED
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex justify-center space-x-1 sm:space-x-none">
                            <div className="hs-tooltip inline-block">
                              <button
                                type="button"
                                data-hs-overlay="#hs-view-request-modal"
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
                                View Request
                              </span>
                            </div>
                            {/* <div className="hs-tooltip inline-block">
                              <button
                                type="button"
                                data-hs-overlay="#hs-reply-modal"
                                onClick={() => handleView({ ...item })}
                                className="hs-tooltip-toggle text-white bg-custom-red-button font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                              >
                                <AiOutlineSend
                                  size={24}
                                  style={{ color: "#ffffff" }}
                                />
                              </button>
                              <span
                                className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                                role="tooltip"
                              >
                                Reply to Request
                              </span>
                            </div> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
        </div>
        {Object.hasOwn(request, "service_id") ? (
          <ViewRequestModal request={request} brgy={brgy} officials={officials}/>
        ) : null}
        <RequestsReportsModal />
      </div>
    </>
  );
}

export default ArchiveServiceRequests;
