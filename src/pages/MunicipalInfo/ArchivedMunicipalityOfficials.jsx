import React from "react";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import { BsPrinter } from "react-icons/bs";
import { AiOutlineStop, AiOutlineEye } from "react-icons/ai";
import { MdRestartAlt } from "react-icons/md";
import officialimage from "../../assets/sample/official.jpg";
import moment from "moment";
import GenerateReportsModal from "../../components/municipalityofficials/GenerateReportsModal";
import Breadcrumbs from "../../components/municipalityofficials/Breadcrumbs";
import RestoreOfficialModal from "../../components/municipalityofficials/RestoreOfficialModal";
import ViewOfficialModal from "../../components/municipalityofficials/ViewOfficialModal";
import axios from "axios";
import API_LINK from "../../config/API";
import { useSearchParams } from "react-router-dom";
import {FaUserCircle} from "react-icons/fa"
import noData from "../../assets/image/no-data.png";
const ArchivedOfficials = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [officials, setOfficials] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const brgy = "MUNISIPYO";
  const id = searchParams.get("id");
  const [selectedOfficial, setSelectedOfficial] = useState({});
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortColumn, setSortColumn] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [positionFilter, setPositionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOfficials, setFilteredOfficials] = useState([]);

  const handleSort = (sortBy) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortColumn(sortBy);

    const sortedData = officials.slice().sort((a, b) => {
      if (sortBy === "name") {
        return newSortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "rendered_service") {
        const dateA = new Date(a.fromYear);
        const dateB = new Date(b.fromYear);

        return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }

      return 0;
    });

    setOfficials(sortedData);
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

  const checkAllHandler = () => {
    if (officials.length === selectedItems.length) {
      setSelectedItems([]);
    } else {
      const officialIds = officials.map((item) => {
        return item._id;
      });

      setSelectedItems(officialIds);
    }
  };

  const handleView = async (official) => {
    setSelectedOfficial(official);
  };

  useEffect(() => {
    document.title = "Archived Municipal Officials | Barangay E-Services Management";

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/mofficials/?brgy=${brgy}&archived=true&page=${currentPage}&position=${positionFilter}`
        );

        if (response.status === 200) {
          setPageCount(response.data.pageCount)
          setOfficials(response.data.result)
          setFilteredOfficials(response.data.result)
        } else {
          // Handle error here
          console.error("Error fetching users:", response.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [brgy, currentPage, positionFilter]);

  const handlePositionFilter = (selectedPosition) => {
    setPositionFilter(selectedPosition);
  };

  const handleResetFilter = () => {
    setPositionFilter("all");
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const tableHeader = [
    "IMAGE",
    "NAME",
    "POSITION",
    "RENDERED SERVICE",
    "ACTIONS",
  ];

  const dateFormat = (fromYear, toYear) => {
    const startDate = fromYear ? new Date(fromYear) : null;
    const endDate = toYear ? new Date(toYear) : null;

    const startYearMonth = startDate
      ? `${startDate.toLocaleString("default", {
        month: "short",
      })} ${startDate.getFullYear()}`
      : "";
    const endYearMonth = endDate
      ? `${endDate.toLocaleString("default", {
        month: "short",
      })} ${endDate.getFullYear()}`
      : "";

    return `${startYearMonth} ${endYearMonth}`;
  };

  return (
    <div className="mx-4 mt-8">
      <div>
      <Breadcrumbs id={id} />
        {/* Header */}
        <div className="flex flex-row lg:mt-5 sm:flex-col-reverse lg:flex-row w-full">
          <div className="sm:mt-5 md:mt-4 lg:mt-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] py-2 lg:py-4 px-5 md:px-10 lg:px-0 xl:px-10 sm:rounded-t-lg lg:rounded-t-[1.75rem]  w-full lg:w-2/5 xxl:h-[4rem] xxxl:h-[5rem]">
            <h1
              className="text-center mx-auto font-bold text-xs md:text-xl lg:text-[16px] xl:text-[20px] xxl:text-[1.5rem] xxxl:text-3xl xxxl:mt-1 text-white"
              style={{ letterSpacing: "0.2em" }}
            >
              ARCHIVED OFFICIALS
            </h1>
          </div>
        </div>

        <div className="py-2 px-2 bg-gray-400 border-0 border-t-2 border-white">
          <div className="sm:flex-col-reverse md:flex-row flex justify-between w-full">
            <div className="hs-dropdown relative inline-flex sm:[--placement:bottom] md:[--placement:bottom-left]">
              <button
                id="hs-dropdown"
                type="button"
                className="bg-[#295141] sm:w-full md:w-full sm:mt-2 md:mt-0 text-white hs-dropdown-toggle py-1 px-5 inline-flex justify-center items-center gap-2 rounded-md  font-medium shadow-sm align-middle transition-all text-sm  "
              >
                POSITION
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
                <a
                  onClick={() => handlePositionFilter("City Mayor")}
                  class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-md text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                  href="#"
                >
                  CITY MAYOR
                </a>
                <a
                  onClick={() => handlePositionFilter("Vice Mayor")}
                  class="font-medium uppercase flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                  href="#"
                >
                  VICE MAYOR
                </a>
                <a
                  onClick={() => handlePositionFilter("Congressman")}
                  class="font-medium uppercase flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                  href="#"
                >
                  CONGRESSMAN
                </a>
                <a
                  onClick={() => handlePositionFilter("Councilors")}
                  class="font-medium uppercase flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                  href="#"
                >
                  COUNCILORS
                </a>
                <a
                  onClick={() => handlePositionFilter("Sangguniang Kabataan")}
                  class="font-medium uppercase flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                  href="#"
                >
                  SANGGUNIANG KABATAAN
                </a>
              </ul>
            </div>
            <div className="sm:flex-col md:flex-row flex sm:w-full md:w-7/12">
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
                  className="sm:px-3 sm:py-1 md:px-3 md:py-1 block w-full text-black border-gray-200 rounded-r-md text-sm focus:border-blue-500 focus:ring-blue-500 "
                  placeholder="Search for items"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);

                    if (e.target.value.trim() === '') {
                      // If the search input is empty, fetch all data
                      setFilteredOfficials(officials);
                    } else {
                      // If the search input is not empty, filter the data
                      const Officials = officials.filter(
                        (item) =>
                          item.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
                          item.lastName.toLowerCase().includes(e.target.value.toLowerCase())
                      );
                      setFilteredOfficials(Officials);
                    }

                    console.log("Officials Fetched", officials);
                  }}
                />
              </div>
              <div className="sm:mt-2 md:mt-0 flex w-64 items-center justify-center">
                <div className="hs-tooltip inline-block w-full">
                  <button
                    type="button"
                    data-hs-overlay="#hs-restore-official-modal"
                    className="hs-tooltip-toggle sm:w-full md:w-full text-white rounded-md   bg-[#295141]  font-medium text-xs sm:py-1 md:px-3 md:py-2 flex items-center justify-center"
                  >
                    <MdRestartAlt size={24} style={{ color: "#ffffff" }} />
                    <span
                      className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                      role="tooltip"
                    >
                      Restore Selected Officials
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb overflow-y-scroll lg:overflow-x-hidden h-[calc(100vh_-_320px)] xxxl:h-[calc(100vh_-_340px)]">
          <table className="relative table-auto w-full">
            <thead className="bg-[#295141] sticky top-0">
              <tr className="">
                <th scope="col" className="px-6 py-4">
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
                    className="px-6 py-3 text-center text-xs font-bold text-white uppercase"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="odd:bg-slate-100">
            {filteredOfficials.length === 0 ? (
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
                filteredOfficials.map((item, index) => (
                  <tr key={index} className="odd:bg-slate-100 text-center">
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          value={item._id}
                          onChange={checkboxHandler}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-xs sm:text-sm lg:text-xs xl:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                        <div className="px-2 sm:px-6 py-2">
                          {item.picture.link ? (
                            <div className="lg:w-20 lg:h-20 w-16 h-16 aspect-w-1 aspect-h-1 overflow-hidden rounded-full mx-auto border border-4 border-[#013D74]">
                              <img
                                src={item.picture.link}
                                alt="picture"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <FaUserCircle className="lg:w-20 lg:h-20 w-16 h-16 object-cover border border-4 border-[#013D74] rounded-full text-gray-500 mx-auto" />
                          )}
                        </div>
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm lg:text-xs xl:text-sm text-black line-clamp-2 capitalize">
                          {item.lastName}, {item.firstName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                          {item.position}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                          {dateFormat(item.fromYear) || ""} -{" "}
                          {dateFormat(item.toYear) || ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center space-x-1 sm:space-x-none">
                        <button
                          onClick={() => handleView(item)}
                          type="button"
                          data-hs-overlay="#hs-view-archived-official-modal"
                          className="text-white bg-teal-800 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                        >
                          <AiOutlineEye size={24} style={{ color: "#ffffff" }} />
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
      <div className="md:py-4 md:px-4 bg-[#295141] flex items-center justify-between sm:flex-col-reverse md:flex-row sm:py-3">
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
      <GenerateReportsModal />
      <RestoreOfficialModal selectedItems={selectedItems} />
      <ViewOfficialModal
        selectedOfficial={selectedOfficial}
        setSelectedOfficial={setSelectedOfficial}
        brgy={brgy}
      />
    </div>
  );
};

export default ArchivedOfficials;
