import React from "react";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { AiOutlineStop, AiOutlineEye } from "react-icons/ai";
import { FaArchive, FaPlus } from "react-icons/fa";
import { BsPrinter } from "react-icons/bs";

import ReactPaginate from "react-paginate";
import axios from "axios";
import API_LINK from "../../config/API";

import ArchiveAboutusModal from "../../components/maboutusnfo/archivedAboutusModal";
import ManageAboutusModal from "../../components/maboutusnfo/manageAboutusModal";
import AddAboutusModal from "../../components/maboutusnfo/addAboutusModal";
import noData from "../../assets/image/no-data.png";

const MHomepageInfo = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [aboutus, setAboutus] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const brgy = "MUNISIPYO";
  const [aboutusInfo, setAboutusinfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [specifiedDate, setSpecifiedDate] = useState(new Date());
  const [filteredAboutUs, setFilteredAboutUs] = useState([]);
  const [selected, setSelected] = useState("date");

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `${API_LINK}/aboutus/?brgy=${brgy}&archived=false&page=${currentPage}`
      );
      if (response.status === 200) {
        setAboutus(response.data.result);
        setFilteredAboutUs(response.data.result);
        setPageCount(response.data.pageCount);
      } else setAboutus([]);
    };

    fetch();
  }, [currentPage]);

  const Aboutus = aboutus.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
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
    const announcementsToCheck = Aboutus.length > 0 ? Aboutus : aboutus;

    if (announcementsToCheck.length === selectedItems.length) {
      setSelectedItems([]);
    } else {
      const postIds = announcementsToCheck.map((item) => {
        return item._id;
      });

      setSelectedItems(postIds);
    }
  };

  const tableHeader = [
    "banner",
    "title",
    "details",
    "creation date",
    "actions",
  ];

  useEffect(() => {
    document.title = "Municipal About Us Info | Barangay E-Services Management";
  }, []);

  const handleView = (item) => {
    setAboutusinfo(item);
  };

  const dateFormat = (date) => {
    const eventdate = date === undefined ? "" : date.substr(0, 10);
    return eventdate;
  };
  const TimeFormat = (date) => {
    if (!date) return "";

    const formattedTime = moment(date).format("hh:mm A");
    return formattedTime;
  };
  const handleResetFilter = () => {
    setSearchQuery("");
    setAboutus();
  };

  const filters = (choice, selectedDate) => {
    switch (choice) {
      case "date":
        const newArr = aboutus.filter((item) => {
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

        return aboutus.filter((item) => {
          const createdAt = new Date(item.createdAt.slice(0, 10));

          return (
            createdAt.getFullYear() === startDate.getFullYear() &&
            createdAt.getMonth() === startDate.getMonth() &&
            createdAt.getDate() >= startDate.getDate() &&
            createdAt.getDate() <= endDate.getDate()
          );
        });
      case "month":
        return aboutus.filter((item) => {
          const createdAt = new Date(item.createdAt.slice(0, 10));

          return (
            createdAt.getFullYear() === selectedDate.getFullYear() &&
            createdAt.getMonth() === selectedDate.getMonth()
          );
        });
      case "year":
        return aboutus.filter((item) => {
          const createdAt = new Date(item.createdAt.slice(0, 10));
          return createdAt.getFullYear() === selectedDate.getFullYear();
        });
    }
  };

  const onSelect = (e) => {
    console.log("select", e.target.value);

    setSelected(e.target.value);

    console.log("specified select", filters(e.target.value, specifiedDate));
  };

  const onChangeDate = (e) => {
    const date = new Date(e.target.value);
    date.setHours(0, 0, 0, 0);
    setSpecifiedDate(date);
    setFilteredAboutUs(filters(selected, date));
  };

  const onChangeWeek = (e) => {
    const date = moment(e.target.value).toDate();
    setSpecifiedDate(date);
    setFilteredAboutUs(filters(selected, date));
  };

  const onChangeMonth = (e) => {
    const date = moment(e.target.value).toDate();
    setSpecifiedDate(date);
    setFilteredAboutUs(filters(selected, date));
  };

  const onChangeYear = (e) => {
    if (e.target.value === "") {
      setFilteredAboutUs(aboutus);
    } else {
      const date = new Date(e.target.value, 0, 1);
      setSpecifiedDate(date);
      console.log("selected year converted date", date);
      console.log("specified year", filters(selected, date));
      setFilteredAboutUs(filters(selected, date));
    }
  };
  return (
    <div className="mx-4 mt-4">
      <div className="flex flex-col ">
        <div className="flex flex-row sm:flex-col-reverse lg:flex-row w-full ">
          <div className="sm:mt-5 md:mt-4 lg:mt-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] py-2 lg:py-4 px-5 md:px-10 lg:px-0 xl:px-10 sm:rounded-t-lg lg:rounded-t-[1.75rem]  w-full lg:w-2/5 xxl:h-[4rem] xxxl:h-[5rem]">
          <h1
              className="text-center sm:text-[15px] mx-auto font-bold md:text-xl lg:text-[15px] xl:text-xl xxl:text-2xl xxxl:text-4xl xxxl:mt-1 text-white"
              style={{ letterSpacing: "0.2em" }}
            >
              ABOUT US INFORMATION
            </h1>
          </div>
          <div className="lg:w-3/5 flex flex-row justify-end items-center ">
            <div className="sm:w-full md:w-full lg:w-2/5 flex sm:flex-col md:flex-row md:justify-center md:items-center sm:space-y-2 md:space-y-0 md:space-x-2 ">
              <div className="w-full rounded-lg flex justify-center">
                <div className="hs-tooltip inline-block w-full">
                  <button
                    type="button"
                    data-hs-overlay="#hs-modal-addaboutus"
                    className="hs-tooltip-toggle justify-center sm:px-2 sm:p-2 md:px-5 md:p-3 rounded-lg bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] w-full text-white font-medium text-sm  text-center inline-flex items-center "
                  >
                    <FaPlus size={24} style={{ color: "#ffffff" }} />
                    <span className="sm:block md:hidden sm:pl-5">
                      Add About Us
                    </span>
                    <span
                      className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                      role="tooltip"
                    >
                      Add About Us
                    </span>
                  </button>
                </div>
              </div>
              <div className="w-full rounded-lg ">
                <Link
                  to={`/archived_aboutus_info/?id=${id}&brgy=${brgy}&archived=true`}
                >
                  <div className="hs-tooltip inline-block w-full">
                    <button
                      type="button"
                      className="hs-tooltip-toggle justify-center sm:px-2 sm:p-2 md:px-5 md:p-3 rounded-lg bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] w-full text-white font-medium text-sm text-center inline-flex items-center"
                    >
                      <FaArchive size={24} style={{ color: "#ffffff" }} />
                      <span className="sm:block md:hidden sm:pl-5">
                        Archived About Us
                      </span>
                      <span
                        className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                        role="tooltip"
                      >
                        Archived About Us
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
            <div className="hs-dropdown relative inline-flex sm:[--placement:bottom] md:[--placement:bottom-left] shadow-sm">
              <button
                id="hs-dropdown"
                type="button"
                className="bg-[#295141] sm:w-full md:w-full sm:mt-2 md:mt-0 text-white hs-dropdown-toggle py-1 px-5 inline-flex justify-center items-center gap-2 rounded-md  font-medium shadow-sm align-middle transition-all text-sm  "
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
                  className="sm:px-3 sm:py-1 md:px-3 md:py-1 block w-full text-black border-gray-200 rounded-r-md text-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Search for items"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    const Aboutus = aboutus.filter((item) =>
                      item.title
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    );
                    setFilteredAboutUs(Aboutus);
                  }}
                />
              </div>
              <div className="sm:mt-2 md:mt-0 flex w-64 items-center justify-center">
                <div className="hs-tooltip inline-block w-full">
                  <button
                    type="button"
                    data-hs-overlay="#hs-archive-aboutus-modal"
                    className="hs-tooltip-toggle sm:w-full md:w-full text-white rounded-md  bg-pink-800 font-medium text-xs sm:py-1 md:px-3 md:py-2 flex items-center justify-center"
                  >
                    <AiOutlineStop size={24} style={{ color: "#ffffff" }} />
                    <span
                      className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                      role="tooltip"
                    >
                      Archived Selected About Us
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb overflow-y-scroll lg:overflow-x-hidden h-[calc(100vh_-_275px)] xxl:h-[calc(100vh_-_275px)] xxxl:h-[calc(100vh_-_300px)]">
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
              {filteredAboutUs.length === 0 ? (
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
                filteredAboutUs.map((item, index) => (
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
                    <td className="px-6 py-3">
                      <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                        <div className="px-2 sm:px-6 py-2">
                          {item.banner.link ? (
                            <div className="lg:w-32 lg:h-20 w-16 h-24 aspect-w-4 aspect-h-3 overflow-hidden mx-auto border border-4 border-[#013D74]">
                              <img
                                src={item.banner.link}
                                alt="picture"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <FaUserCircle className="lg:w-20 lg:h-32 w-16 h-24 object-cover border border-4 border-[#013D74] rounded-full text-gray-500 mx-auto" />
                          )}
                        </div>
                      </span>
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
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                        {moment(item.createdAt).format("MMMM DD, YYYY")} -{" "}
                          {TimeFormat(item.createdAt) || ""}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex justify-center space-x-1 sm:space-x-none">
                        <button
                          type="button"
                          data-hs-overlay="#hs-modal-manageaboutus"
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
        <AddAboutusModal brgy={brgy} />
        <ArchiveAboutusModal selectedItems={selectedItems} />
        <ManageAboutusModal
          brgy={brgy}
          aboutusInfo={aboutusInfo}
          setAboutusinfo={setAboutusinfo}
        />
      </div>
    </div>
  );
};

export default MHomepageInfo;
