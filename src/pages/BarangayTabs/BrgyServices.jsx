import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiServiceFill } from "react-icons/ri";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsPrinter } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { AiOutlineStop, AiOutlineEye } from "react-icons/ai";
import { FaArchive, FaPlus } from "react-icons/fa";
import { MdRestartAlt } from "react-icons/md";
import ReactPaginate from "react-paginate";
import ViewArchivedServiceModal from "../../components/barangaytabs/brgyServices/ViewArchivedServiceModal";
import GenerateReportsModal from "../../components/barangaytabs/brgyServices/GenerateReportsModal";
import StatusResident from "../../components/barangaytabs/brgyServices/StatusService";
import API_LINK from "../../config/API";
import PrintPDF from "../../components/barangaytabs/brgyServices/form/PrintPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import noData from "../../assets/image/no-data.png";
import GetBrgy from "../../components/GETBrgy/getbrgy";
function Services() {
  // const [selectedItems, setSelectedItems] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [status, setStatus] = useState({});
  const brgy = searchParams.get("brgy");
  const id = searchParams.get("id");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [filteredServices, setFilteredServices] = useState([]);
  const information = GetBrgy(brgy);
  console.log("sass", brgy);
  const handleView = (service) => {
    setSelectedService(service);
  };
  const handleStatus = (status) => {
    setStatus(status);
    setSelectedService(status.service);
    console.log("panget2", status.service);
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

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `${API_LINK}/services/?brgy=${brgy}&archived=false&status=${statusFilter}&type=${serviceFilter}&page=${currentPage}`
      );
      if (response.status === 200) {
        setServices(response.data.result);
        setPageCount(response.data.pageCount);
        setFilteredServices(response.data.result);
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

  const handleResetFilter = () => {
    setStatusFilter("all");
    setServiceFilter("all");
    setDateFilter(null);
    setSearchQuery("");
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
              SERVICE MANAGEMENT
            </h1>
          </div>
          <div className="lg:w-3/5 flex flex-row justify-end items-center ">
            <div className="sm:w-full md:w-full lg:w-2/5 flex sm:flex-col md:flex-row md:justify-center md:items-center sm:space-y-2 md:space-y-0 md:space-x-2 ">
              <div className="w-full rounded-lg ">
                <Link to={`/brgyarchivedservices/?id=${id}&brgy=${brgy}`}>
                  <div className="hs-tooltip inline-block w-full">
                    <button
                      type="button"
                      className="hs-tooltip-toggle justify-center sm:px-2 sm:p-2 md:px-5 md:p-3 rounded-lg  w-full text-white font-medium text-sm text-center inline-flex items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
                      style={{
                        background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
                      }}
                    >
                      <FaArchive size={24} style={{ color: "#ffffff" }} />
                      <span className="sm:block md:hidden sm:pl-5">
                        Archived Services
                      </span>
                      <span
                        className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
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
          <div className="sm:flex-col-reverse md:flex-row flex justify-between w-full">
            <div className="flex flex-col lg:flex-row lg:space-x-2 md:mt-2 lg:mt-0 md:space-y-2 lg:space-y-0">
              {/* Status Sort */}
              <div className="hs-dropdown relative inline-flex sm:[--placement:bottom] md:[--placement:bottom-left]">
                <button
                  id="hs-dropdown"
                  type="button"
                  className="bg-[#295141] sm:w-full md:w-full sm:mt-2 md:mt-0 text-white hs-dropdown-toggle py-1 px-5 inline-flex justify-center items-center gap-2 rounded-md  font-medium shadow-sm align-middle transition-all text-sm  "
                  style={{ backgroundColor: information?.theme?.primary }}
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
            <div className="sm:flex-col md:flex-row flex sm:w-full md:w-4/12">
              <div className="flex flex-row w-full md:mr-2">
                <button
                  className=" bg-[#295141] p-3 rounded-l-md"
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
                    const Service = services.filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    );

                    setFilteredServices(Service);
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
              className="bg-[#295141] sticky top-0"
              style={{ backgroundColor: information?.theme?.primary }}
            >
              <tr className="">
                {/* <th scope="col" className="px-6 py-4">
                  <div className="flex justify-center items-center">
                    <input
                      type="checkbox"
                      name=""
                      onClick={checkAllHandler}
                      id=""
                    />
                  </div>
                </th> */}
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
              {filteredServices.length === 0 ? (
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
                filteredServices.map((service) => (
                  <tr
                    key={service._id}
                    className="odd:bg-slate-100 text-center"
                  >
                    {/* <td className="px-6 py-3">
                    <div className="flex justify-center items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        value={item.id}
                        onChange={checkboxHandler}
                      />
                    </div>
                  </td> */}
                    <td className="px-6 py-3">
                      <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                        {service.name}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2 w-[100px]">
                          {service.details}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                          {service.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm text-black line-clamp-2">
                          PHP {service.fee}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {service.isApproved === "Approved" && (
                        <div className="flex w-full items-center justify-center bg-custom-green-button3 m-2 rounded-lg">
                          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-bold text-white p-3 mx-5">
                            APPROVED
                          </span>
                        </div>
                      )}
                      {service.isApproved === "Disapproved" && (
                        <div className="flex w-full items-center justify-center bg-custom-red-button m-2 rounded-lg">
                          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-bold text-white p-3 mx-5">
                            DISAPPROVED
                          </span>
                        </div>
                      )}
                      {service.isApproved === "Pending" && (
                        <div className="flex w-full items-center justify-center bg-custom-amber m-2 rounded-lg">
                          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-bold text-white p-3 mx-5">
                            PENDING
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex justify-center space-x-1 sm:space-x-none">
                        <button
                          type="button"
                          data-hs-overlay="#hs-view-archived-service-modal"
                          className="text-white bg-teal-800 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                          onClick={() => handleView({ ...service })}
                        >
                          <AiOutlineEye
                            size={24}
                            style={{ color: "#ffffff" }}
                          />
                        </button>
                        <button
                          type="button"
                          data-hs-overlay="#hs-modal-serviceStatus"
                          onClick={() =>
                            handleStatus({
                              id: service._id,
                              status: service.isApproved,
                              service: { ...service },
                            })
                          }
                          className="text-white bg-yellow-800 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                        >
                          <FiEdit size={24} style={{ color: "#ffffff" }} />
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
      <div
        className="md:py-4 md:px-4 bg-[#295141] flex items-center justify-between sm:flex-col-reverse md:flex-row sm:py-3"
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
      <ViewArchivedServiceModal selectedService={selectedService} setSelectedService={setSelectedService}   brgy={brgy}/>

      <StatusResident
        status={status}
        setStatus={setStatus}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        brgy={brgy}
      />
    </div>
  );
}

export default Services;
