import React from "react";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { BsPrinter } from "react-icons/bs";
import { AiOutlineStop, AiOutlineEye } from "react-icons/ai";
import { HiDocumentAdd } from "react-icons/hi";
import { MdEditDocument } from "react-icons/md";
import { AiOutlineSend } from "react-icons/ai";
import { FaArchive } from "react-icons/fa";
import ReplyServiceModal from "../../components/barangaytabs/brgyblotters/ReplyServiceModal";
import ViewBlotterModal from "../../components/barangaytabs/brgyblotters/ViewBlotterModal";
import { useSearchParams } from "react-router-dom";
import API_LINK from "../../config/API";
import axios from "axios";
import noData from "../../assets/image/no-data.png";
import GetBrgy from "../../components/GETBrgy/getbrgy";
import AddBlotterDocument from "../../components/barangaytabs/brgyblotters/document_forms/create_document/AddBlotterDocument";
import EditBlotterDocument from "../../components/barangaytabs/brgyblotters/document_forms/edit_document/EditBlotterDocument";

const Blotters = () => {
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState({ response: [{ file: [] }] });
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const brgy = searchParams.get("brgy");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortColumn, setSortColumn] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReqFilter, setSelectedReqFilter] = useState("all");
  const information = GetBrgy(brgy);
  //status filter
  const [statusFilter, setStatusFilter] = useState("all");
  //request filter
  const [requestFilter, setRequestFilter] = useState([]); // Default is "all"
  //pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  //date filtering
  const [specifiedDate, setSpecifiedDate] = useState(new Date());
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selected, setSelected] = useState("date");

  const [officials, setOfficials] = useState([]);

  // blotter related
  const [blotterDetails, setBlotterDetails] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/requests/getdoneblotters?brgy=${brgy}&archived=false`
        );
        if (response.status === 200) {
          let { result } = response.data;

          // Convert status of fetched requests to "IN PROGRESS"
          result = result.map((request) => {
            return {
              ...request,
              status: "In Progress",
            };
          });

          setRequests(result);
          setFilteredRequests(result);
        } else {
          setRequests([]);
          setFilteredRequests([]);
        }
      } catch (error) {
        console.error(error);
        setRequests([]);
        setFilteredRequests([]);
      }
    };

    fetchRequests();
  }, [brgy]);

  useEffect(() => {
    // function to filter
    const fetch = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/blotter/all_patawag/?brgy=${brgy}&archived=false`
        );

        // filter
        setBlotterDetails(response.data);
      } catch (err) {
        console.log(err.message);
        setBlotterDetails([]);
      }
    };

    fetch();
  }, [brgy]);

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

  const handleStatusFilter = (selectedStatus) => {
    setStatusFilter(selectedStatus);
  };

  const handleRequestFilter = (selectedType) => {
    setSelectedReqFilter(selectedType);
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

  useEffect(() => {
    document.title = "Service Requests | Barangay E-Services Management";
  }, []);

  const checkboxHandler = (e) => {
    let isSelected = e.target.checked;
    let value = e.target.value;

    if (isSelected) {
      setSelectedItems([...selectedItems, value]);
    } else {
      setSelectedItems((prevData) => {
        return prevData.filter((id) => {
          return id !== value;
        });
      });
    }
  };

  const checkAllHandler = () => {
    const requestsToCheck = Requests.length > 0 ? Requests : requests;

    if (requestsToCheck.length === selectedItems.length) {
      setSelectedItems([]);
    } else {
      const postIds = requestsToCheck.map((item) => {
        return item._id;
      });

      setSelectedItems(postIds);
    }
  };

  const tableHeader = [
    "Control #",
    "SERVICE NAME",
    "SENDER",
    "DATE",
    "STATUS",
    "ACTIONS",
  ];

  const handleView = (item) => {
    setRequest(item);
  };

  const DateFormat = (date) => {
    const dateFormat = date === undefined ? "" : date.substr(0, 10);
    return dateFormat;
  };

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
              className="text-center mx-auto font-bold text-xs md:text-xl lg:text-[16px] xl:text-[20px] xxl:text-2xl xxxl:text-3xl xxxl:mt-1 text-white"
              style={{ letterSpacing: "0.2em" }}
            >
              PATAWAG (BLOTTERS)
            </h1>
          </div>
        
        </div>

        <div className="py-2 px-2 bg-gray-400 border-0 border-t-2 border-white">
          <div className="sm:flex-col-reverse lg:flex-row flex justify-between w-full">
            <div className="flex flex-col lg:flex-row lg:space-x-2 md:mt-2 lg:mt-0 md:space-y-2 lg:space-y-0">
              {/* Status Sort */}
              <div className="hs-dropdown relative inline-flex sm:[--placement:bottom] md:[--placement:bottom-left]">
                <button
                  id="hs-dropdown"
                  type="button"
                  className=" sm:w-full md:w-full sm:mt-2 md:mt-0 text-white hs-dropdown-toggle py-1 px-5 inline-flex justify-center items-center gap-2 rounded-md  font-medium shadow-sm align-middle transition-all text-sm  bg-[#295141]"
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
                    onClick={() => handleStatusFilter("In Progress")}
                    class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                    href="#"
                  >
                    IN PROGRESS
                  </a>
                  <a
                    onClick={() => handleStatusFilter("Completed")}
                    class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                    href="#"
                  >
                    COMPLETED
                  </a>
                  <a
                    onClick={() => handleStatusFilter("Rejected")}
                    class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                    href="#"
                  >
                    REJECTED
                  </a>
                  <a
                    onClick={() => handleStatusFilter("NEW")}
                    class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                    href="#"
                  >
                    NEW
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
            </div>

            <div className="sm:flex-col md:flex-row flex sm:w-full lg:w-4/12 lg:ml-2 xl:ml-0">
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
                  className="sm:px-3 sm:py-1 md:px-3 md:py-1 block w-full text-black border-gray-200 rounded-r-md text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Search for items"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    const Requests = requests.filter((item) => {
                      const fullName = `${item.form[0].firstName.value} ${item.form[0].lastName.value}`;
                      const reqId = item.req_id.toString(); // Assuming service_id is a number, convert it to string for case-insensitive comparison
                      return (
                        fullName
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase()) ||
                        reqId.includes(e.target.value.toLowerCase())
                      );
                    });

                    setFilteredRequests(Requests);
                  }}
                />
              </div>
            
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb overflow-y-scroll lg:overflow-x-hidden h-[calc(100vh_-_280px)] xl:h-[calc(100vh_-_280px)] xxl:h-[calc(100vh_-_280px)] xxxl:h-[calc(100vh_-_300px)]">
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
              {filteredRequests.length > 0 ? (
                filteredRequests.map((item, index) => {
                  // Find the corresponding data in blotterDetails based on req_id
                  const correspondingBlotterDetail = blotterDetails.find(
                    (blotterItem) => blotterItem.req_id === item.req_id
                  );

                  // Extract status from blotterDetails
                  let status = correspondingBlotterDetail
                    ? correspondingBlotterDetail.status
                    : "";

                  // If blotter_status is empty or blank, set status to "In Progress"
                  if (!status || status.trim() === "") {
                    status = "NEW";
                  }

                  // Merge the status with the current item
                  const mergedItem = {
                    ...item,
                    blotter_status: status,
                  };

                  // Apply status filter
                  if (
                    statusFilter !== "all" &&
                    mergedItem.blotter_status !== statusFilter
                  ) {
                    return null; // Skip rendering if status doesn't match the filter
                  }

                  console.log("blotterDetail sa table: ", mergedItem);

                  return (
                    <tr key={index} className="odd:bg-slate-100 text-center">
                     
                      <td className="w-auto px-6 py-3">
                        <span className="text-xs sm:text-sm text-black line-clamp-4">
                          {item.req_id}
                        </span>
                      </td>
                      <td className="w-auto px-6 py-3">
                        <span className="text-xs sm:text-sm text-black line-clamp-2">
                          {item.service_name}
                        </span>
                      </td>
                      <td className="w-auto px-6 py-3">
                        <span className="text-xs sm:text-sm text-black line-clamp-2">
                          {item.form[0].lastName.value +
                            ", " +
                            item.form[0].firstName.value +
                            " " +
                            item.form[0].middleName.value}
                        </span>
                      </td>
                      <td className="px-6 py-3 xxl:w-auto">
                        <div className="flex justify-center items-center">
                          <span className="text-xs sm:text-sm text-black line-clamp-2">
                            {moment(item.createdAt).format("MMMM DD, YYYY")} -{" "}
                            {TimeFormat(item.createdAt) || ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 xl:px-6 py-3 xxl:w-3/12">
                        {mergedItem.blotter_status === "Completed" && (
                          <div className="flex items-center justify-center bg-custom-green-button3 m-2 rounded-lg">
                            <span className="text-xs sm:text-sm text-white font-bold p-3 xl:mx-5">
                              COMPLETED
                            </span>
                          </div>
                        )}
                        {mergedItem.blotter_status === "In Progress" && (
                          <div className="flex items-center justify-center bg-[#d68f3d] m-2 rounded-lg">
                            <span className="text-sm text-white font-bold p-3 xl:mx-3">
                              IN PROGRESS
                            </span>
                          </div>
                        )}
                        {mergedItem.blotter_status === "Rejected" && (
                          <div className="flex items-center justify-center bg-custom-red-button m-2 rounded-lg">
                            <span className="text-xs sm:text-sm text-white font-bold p-3 xl:mx-5">
                              REJECTED
                            </span>
                          </div>
                        )}
                        {mergedItem.blotter_status === "NEW" && (
                          <div className="flex items-center justify-center bg-[#6d6fcc] m-2 rounded-lg">
                            <span className="text-sm text-white font-bold p-3 xl:mx-1">
                              NEW
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-2 xl:px-6 py-3">
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

                          <div className="hs-tooltip inline-block">
                            <button
                              type="button"
                              data-hs-overlay="#hs-replys-modal"
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
                          </div>

                          <div className="hs-tooltip inline-block">
                            <button
                              type="button"
                              data-hs-overlay="#hs-create-serviceDocument-modal"
                              onClick={() => handleView({ ...item })}
                              className="hs-tooltip-toggle text-white bg-[#8b1814] font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                            >
                              <HiDocumentAdd
                                size={24}
                                style={{ color: "#ffffff" }}
                              />
                            </button>
                            <span
                              className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                              role="tooltip"
                            >
                              Create Blotter Document
                            </span>
                          </div>
                          <div className="hs-tooltip inline-block">
                            <button
                              type="button"
                              data-hs-overlay="#hs-edit-serviceDocument-modal"
                              onClick={() => handleView({ ...item })}
                              className="hs-tooltip-toggle text-white bg-[#144c8b] font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                            >
                              <MdEditDocument
                                size={24}
                                style={{ color: "#ffffff" }}
                              />
                            </button>
                            <span
                              className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                              role="tooltip"
                            >
                              Edit Blotter Document
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={tableHeader.length + 1}
                    className="text-center sm:h-[18.7rem] xl:py-1 lg:h-[20rem] xxl:py-32 xl:h-[20rem]"
                  >
                    <img
                      src={noData}
                      alt=""
                      className=" w-[150px] h-[100px] md:w-[270px] md:h-[200px] lg:w-[250px] lg:h-[180px] xl:h-[14rem] xl:w-80 mx-auto"
                    />
                    <strong className="text-[#535353]">NO DATA FOUND</strong>
                  </td>
                </tr>
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
          nextLabel=">>"
          onPageChange={handlePageChange}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="<<"
          className="flex space-x-3 text-white font-bold"
          activeClassName="text-yellow-500"
          disabledLinkClassName="text-gray-400"
          renderOnZeroPageCount={null}
        />
      </div>
      {Object.hasOwn(request, "service_id") ? (
        <ViewBlotterModal request={request} brgy={brgy} officials={officials} />
      ) : null}
      <ReplyServiceModal
        request={request}
        setRequest={setRequest}
        brgy={brgy}
      />
      <AddBlotterDocument request={request} brgy={brgy} />
      <EditBlotterDocument request={request} brgy={brgy} />
    </div>
  );
};

export default Blotters;
