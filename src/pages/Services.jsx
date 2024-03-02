import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArchive, FaPlus } from "react-icons/fa";
import { AiOutlineStop, AiOutlineEye } from "react-icons/ai";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { MdOutlineEditNote } from "react-icons/md";
import { HiDocumentAdd } from "react-icons/hi";
import { MdEditDocument } from "react-icons/md";
import ReactPaginate from "react-paginate";
import GenerateReportsModal from "../components/services/GenerateReportsModal";
import CreateServiceModal from "../components/services/CreateServiceModal";
import ArchiveServicesModal from "../components/services/ArchiveServicesModal";
import axios from "axios";
import API_LINK from "../config/API";
import { useSearchParams } from "react-router-dom";
import ManageServiceModal from "../components/services/ManageServiceModal";
import AddServicesForm from "../components/services/form/add_service/AddServicesForm";
import EditServicesForm from "../components/services/form/edit_service/EditServicesForm";
import noData from "../assets/image/no-data.png";
import AddServicesDocument from "../components/services/document_forms/create_document/AddServicesDocument";
import EditServicesDocument from "../components/services/document_forms/edit_document/EditServicesDocument";

const Services = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [services, setServices] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const brgy = "MUNISIPYO";
  const id = searchParams.get("id");
  const [service, setService] = useState([]);
  const [status, setStatus] = useState({});
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortColumn, setSortColumn] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [officials, setOfficials] = useState([]);

  const handleSort = (sortBy) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortColumn(sortBy);

    const sortedData = services.slice().sort((a, b) => {
      if (sortBy === "service_id") {
        return newSortOrder === "asc"
          ? a.service_id.localeCompare(b.service_id)
          : b.service_id.localeCompare(a.service_id);
      } else if (sortBy === "name") {
        return newSortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "isApproved") {
        const order = { Approved: 1, Pending: 2, Disapproved: 3 };
        return newSortOrder === "asc"
          ? order[a.isApproved] - order[b.isApproved]
          : order[b.isApproved] - order[a.isApproved];
      }

      return 0;
    });

    setServices(sortedData);
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `${API_LINK}/services/?brgy=${brgy}&archived=false&status=${statusFilter}&type=${serviceFilter}&page=${currentPage}`
      );
      if (response.status === 200) {
        setServices(response.data.result);
        setPageCount(response.data.pageCount);
      } else setServices([]);
    };

    fetch();
  }, [brgy, statusFilter, serviceFilter, currentPage]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const Services = services.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusFilter = (selectedStatus) => {
    setStatusFilter(selectedStatus);
  };
  const handleServiceFilter = (selectedStatus) => {
    setServiceFilter(selectedStatus);
  };
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
  const handleResetFilter = () => {
    setStatusFilter("all");
    setServiceFilter("all");
    setSearchQuery("");
  };
  const checkAllHandler = () => {
    const servicesToCheck = Services.length > 0 ? Services : services;

    if (servicesToCheck.length === selectedItems.length) {
      setSelectedItems([]);
    } else {
      const postIds = servicesToCheck.map((item) => {
        return item._id;
      });

      setSelectedItems(postIds);
    }
  };

  const tableHeader = [
    "SERVICE NAME",
    "DETAILS",
    "TYPE OF SERVICE",
    "FEES",
    "STATUS",
    "ACTIONS",
  ];

  useEffect(() => {
    document.title = "Services | Barangay E-Services Management";
  }, []);

  const handleView = (item) => {
    setService(item);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/mofficials/?brgy=${brgy}&archived=false`
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

  return (
    <div className="mx-4">
      {/* Body */}
      <div>
        {/* Header */}
        <div className="flex flex-row mt-5 sm:flex-col-reverse lg:flex-row w-full">
          <div className="sm:mt-5 md:mt-4 lg:mt-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] py-2 lg:py-4 px-5 md:px-10 lg:px-0 xl:px-10 sm:rounded-t-lg lg:rounded-t-[1.75rem]  w-full lg:w-2/5 xxl:h-[4rem] xxxl:h-[5rem]">
            <h1
              className="text-center mx-auto font-bold text-xs md:text-xl lg:text-[16px] xl:text-[20px] xxl:text-2xl xxxl:text-3xl xxxl:mt-1 text-white"
              style={{ letterSpacing: "0.2em" }}
            >
              SERVICE MANAGEMENT
            </h1>
          </div>
          <div className="lg:w-3/5 flex flex-row justify-end items-center ">
            <div className="sm:w-full md:w-full lg:w-2/5 flex sm:flex-col md:flex-row md:justify-center md:items-center sm:space-y-2 md:space-y-0 md:space-x-2 ">
              <div className="w-full rounded-lg flex justify-center">
                <div className="hs-tooltip inline-block w-full">
                  <button
                    type="button"
                    data-hs-overlay="#hs-create-service-modal "
                    className="hs-tooltip-toggle justify-center sm:px-2 sm:p-2 md:px-5 md:p-3 rounded-lg bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] w-full text-white font-medium text-sm  text-center inline-flex items-center "
                  >
                    <FaPlus size={24} style={{ color: "#ffffff" }} />
                    <span className="sm:block md:hidden sm:pl-5">
                      Add Services
                    </span>
                    <span
                      className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                      role="tooltip"
                    >
                      Add Services
                    </span>
                  </button>
                </div>
              </div>
              <div className="w-full rounded-lg ">
                <Link
                  to={`/archive_services/?id=${id}&brgy=${brgy}&archived=true`}
                >
                  <div className="hs-tooltip inline-block w-full">
                    <button
                      type="button"
                      data-hs-overlay="#hs-modal-add"
                      className="hs-tooltip-toggle justify-center sm:px-2 sm:p-2 md:px-5 md:p-3 rounded-lg bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] w-full text-white font-medium text-sm text-center inline-flex items-center"
                    >
                      <FaArchive size={24} style={{ color: "#ffffff" }} />
                      <span className="sm:block md:hidden sm:pl-5">
                        Archived Services
                      </span>
                      <span
                        className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                        role="tooltip"
                      >
                        Archived Services
                      </span>
                    </button>
                  </div>
                </Link>
              </div>
            </div>
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
                  className="bg-[#295141] sm:w-full md:w-full sm:mt-2 md:mt-0 text-white hs-dropdown-toggle py-1 px-5 inline-flex justify-center items-center gap-2 rounded-md  font-medium shadow-sm align-middle transition-all text-sm  "
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
                    onClick={() => handleStatusFilter("Approved")}
                    class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                    href="#"
                  >
                    APPROVED
                  </a>
                  <a
                    onClick={() => handleStatusFilter("Disapproved")}
                    class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-xl text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                    href="#"
                  >
                    DISAPPROVED
                  </a>
                </ul>
              </div>

         
            </div>

            <div className="sm:flex-col md:flex-row flex sm:w-full lg:w-7/12">
              <div className="flex flex-row w-full md:mr-2">
                <button className=" bg-[#295141] p-3 rounded-l-md">
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="sm:mt-2 md:mt-0 flex w-full lg:w-64 items-center justify-center space-x-2">
                <div className="hs-tooltip inline-block w-full">
                  <button
                    type="button"
                    data-hs-overlay="#hs-archive-services-modal"
                    className="hs-tooltip-toggle sm:w-full md:w-full text-white rounded-md  bg-pink-800 font-medium text-xs sm:py-1 md:px-3 md:py-2 flex items-center justify-center"
                  >
                    <AiOutlineStop size={24} style={{ color: "#ffffff" }} />
                    <span
                      className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                      role="tooltip"
                    >
                      Archive Selected Services
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb overflow-y-scroll lg:overflow-x-hidden h-[calc(100vh_-_280px)] xxxl:h-[calc(100vh_-_304px)]">
          <table className="relative table-auto w-full ">
            <thead className="bg-[#295141] sticky top-0">
              <tr className="">
                <th scope="col" className="px-2 xl:px-6 py-4">
                  <div className="flex justify-center items-center">
                    <input
                      type="checkbox"
                      name=""
                      onClick={checkAllHandler}
                      id=""
                    />
                  </div>
                </th>
                {tableHeader.map((item, idx) => (
                  <th
                    scope="col"
                    key={idx}
                    className="px-2 xl:px-6 py-3 text-center text-xs font-bold text-white uppercase"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="odd:bg-slate-100">
              {Services.length > 0 ? (
                Services.map((item, index) => (
                  <tr key={index} className="odd:bg-slate-100 text-center">
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          value={item._id}
                          onChange={checkboxHandler}
                          id=""
                        />
                      </div>
                    </td>
                    <td className="px-2 xl:px-6 py-3 w-4/12">
                      <span className="text-xs sm:text-sm text-black line-clamp-2 ">
                        {item.name}
                      </span>
                    </td>
                    <td className="px-2 xl:px-6 py-3 w-4/12">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm text-black  line-clamp-2 ">
                          {item.details}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 xl:px-3 py-3 w-2/12">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm text-black line-clamp-2">
                          {item.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 xl:px-6 py-3 w-4/12">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm text-black line-clamp-2">
                          PHP {item.fee}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 xl:px-6 py-3 w-4/12">
                      {item.isApproved === "Approved" && (
                        <div className="flex w-full items-center justify-center bg-custom-green-button3 m-2 rounded-lg">
                          <span className="text-xs sm:text-sm font-bold text-white p-3 mx-5">
                            APPROVED
                          </span>
                        </div>
                      )}
                      {item.isApproved === "Disapproved" && (
                        <div className="flex w-full items-center justify-center bg-custom-red-button m-2 rounded-lg">
                          <span className="text-xs sm:text-sm font-bold text-white p-3 mx-5">
                            DISAPPROVED
                          </span>
                        </div>
                      )}
                      {item.isApproved === "Pending" && (
                        <div className="flex w-full items-center justify-center bg-custom-amber m-2 rounded-lg">
                          <span className="text-xs sm:text-sm font-bold text-white p-3 mx-5">
                            PENDING
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-2 xl:px-6 py-3">
                      <div className="flex justify-center space-x-1 sm:space-x-none">
                        <div className="hs-tooltip inline-block">
                          <button
                            type="button"
                            data-hs-overlay="#hs-modal-editServices"
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
                            View Service
                          </span>
                        </div>
                        <div className="hs-tooltip inline-block">
                          <button
                            type="button"
                            data-hs-overlay="#hs-create-serviceForm-modal"
                            onClick={() => handleView({ ...item })}
                            className="hs-tooltip-toggle text-white bg-yellow-800 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                          >
                            <MdFormatListBulletedAdd
                              size={24}
                              style={{ color: "#ffffff" }}
                            />
                          </button>
                          <span
                            className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                            role="tooltip"
                          >
                            Create Service Forms
                          </span>
                        </div>
                        <div className="hs-tooltip inline-block">
                          <button
                            type="button"
                            data-hs-overlay="#hs-edit-serviceForm-modal"
                            onClick={() => handleView({ ...item })}
                            className="hs-tooltip-toggle text-white bg-purple-700 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                          >
                            <MdOutlineEditNote
                              size={24}
                              style={{ color: "#ffffff" }}
                            />
                          </button>
                          <span
                            className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                            role="tooltip"
                          >
                            Edit Service Forms
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
                            Create Service Documents
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
                            Edit Service Documents
                          </span>
                        </div>

                        {/* <button
                        type="button"
                        onClick={() =>
                          handleStatus({
                            id: item._id,
                            status: item.isApproved,
                          })
                        }
                        data-hs-overlay="#hs-modal-statusServices"
                        className="text-white bg-yellow-800 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                      >
                        <FiEdit size={24} style={{ color: "#ffffff" }} />
                      </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
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
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="md:py-4 md:px-4 bg-[#295141] flex items-center justify-between sm:flex-col-reverse md:flex-row sm:py-3">
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
      <ArchiveServicesModal selectedItems={selectedItems} />
      <CreateServiceModal brgy={brgy} />
      {/*<StatusServices status={status} setStatus={setStatus}/>*/}
      <ManageServiceModal service={service} setService={setService} brgy={brgy} />
      <GenerateReportsModal />
      <AddServicesForm service_id={service.service_id} brgy={brgy} />
      <EditServicesForm service_id={service.service_id} brgy={brgy} />
      <AddServicesDocument service_id={service.service_id} brgy={brgy} officials={officials}/>
      <EditServicesDocument service_id={service.service_id} brgy={brgy} officials={officials}/>
    </div>
  );
};

export default Services;
