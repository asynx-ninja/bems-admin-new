import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { BsPrinter } from "react-icons/bs";
import { AiOutlineEye } from "react-icons/ai";
import { MdRestartAlt } from "react-icons/md";
import axios from "axios";
import API_LINK from "../../config/API";
import { useSearchParams } from "react-router-dom";
import Breadcrumbs from "../../components/municipalaccount/Breadcrumbs";
import ViewArchivedAdmin from "../../components/municipalaccount/ViewArchivedAdmin";
import RestoreAdminModal from "../../components/municipalaccount/RestoreAdminModal";
import GenerateReportsModal from "../../components/municipalaccount/GenerateReportsModal";
import noData from "../../assets/image/no-data.png";
const ArchivedAccountManagement = () => {
  useEffect(() => {
    document.title = "Archived Account | Barangay E-Services Management";
  }, []);

  const [selectedItems, setSelectedItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const brgy = "MUNISIPYO";
  const [user, setUser] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [adminFilter, setAdminFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUser, setFilteredUser] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/municipal_admin/showArchivedAdmin/?brgy=${brgy}&page=${currentPage}&type=${adminFilter}`
        );

        if (response.status === 200) {
           setPageCount(response.data.pageCount);
          setUsers(response.data.result); // Update the state variable with the fetched users
          setFilteredUser(response.data.result) // Update the state variable with the fetched users
        } else {
          // Handle error here
          console.error("Error fetching users:", response.error);
        }
      } catch (err) {
        // Handle uncaught error here
        console.error("Uncaught error:", err.message);
      }
    };

    fetchUsers();
  }, [currentPage, adminFilter]);

  const handleAdminFilter = (type) => {
    console.log("Selected Admin Type:", type);
    setAdminFilter(type);
  };

  const handleResetFilter = () => {
    setAdminFilter("all");
  }

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
    if (users.length === selectedItems.length) {
      setSelectedItems([]);
    } else {
      const postIds = users.map((item) => {
        return item._id;
      });

      setSelectedItems(postIds);
    }
  };
  const handleView = (item) => {
    setUser(item);
  };
  const tableHeader = [
    "PROFILE",
    "NAME",
    "TYPE",
    // "GENDER",
    "CONTACT",
    "ACCOUNT STATUS",
    "ACTIONS",
  ];


  return (
    <div className="mx-4 mt-8">
      <div>
        <Breadcrumbs id={id} />
        <div className="flex flex-row mt-5 sm:flex-col-reverse lg:flex-row w-full">
          <div className="flex justify-center items-center sm:mt-5 md:mt-4 lg:mt-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] py-2 lg:py-4 px-5 md:px-10 lg:px-0 xl:px-10 sm:rounded-t-lg lg:rounded-t-[1.75rem]  w-full lg:w-2/5 xxl:h-[4rem] xxxl:h-[5rem]">
          <h1
              className="text-center sm:text-[15px] mx-auto font-bold md:text-xl lg:text-[15px] xl:text-xl xxl:text-2xl xxxl:text-4xl xxxl:mt-1 text-white"
              style={{ letterSpacing: "0.2em" }}
            >
              ARCHIVED MUNICIPAL ADMIN 
            </h1>
          </div>
        </div>

        <div className="py-2 px-2 bg-gray-400 border-0 border-t-2 border-white">
          <div className="sm:flex-col-reverse md:flex-row flex justify-between w-full">
            <div className="flex flex-col lg:flex-row lg:space-x-2 md:mt-2 lg:mt-0 md:space-y-2 lg:space-y-0">
              <div className="hs-dropdown relative inline-flex sm:[--placement:bottom] md:[--placement:bottom-left]">
                <button
                  id="hs-dropdown"
                  type="button"
                  className="bg-[#295141] sm:w-full md:w-full sm:mt-2 md:mt-0 text-white hs-dropdown-toggle py-1 px-5 inline-flex justify-center items-center gap-2 rounded-md  font-medium shadow-sm align-middle transition-all text-sm  "
                >
                  POSITION
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
                    onClick={() => handleAdminFilter("Head Admin")}
                    class="flex items-center font-medium uppercase gap-x-3.5 py-2 px-3 rounded-md text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"

                  >
                    HEAD ADMIN
                  </a>
                  <a
                    onClick={() => handleAdminFilter("Admin")}
                    class="font-medium uppercase flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-black hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                  >
                    ADMIN
                  </a>

                </ul>
              </div>
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
                      setUsers(users);
                    } else {
                      // If the search input is not empty, filter the data
                      const Users = users.filter(
                        (item) =>
                          item.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
                          item.lastName.toLowerCase().includes(e.target.value.toLowerCase())
                      );
                      setFilteredUser(Users);
                    }

                    console.log("Officials Fetched", officials);
                  }}
                />
              </div>
              <div className="sm:mt-2 md:mt-0 flex w-64 items-center justify-center">
                <div className="hs-tooltip inline-block w-full">
                  <button
                    data-hs-overlay="#hs-modal-restoreAdmin"
                    className="hs-tooltip-toggle sm:w-full md:w-full text-white rounded-md  bg-[#295141] font-medium text-xs sm:py-1 md:px-3 md:py-2 flex items-center justify-center"
                  >
                    <MdRestartAlt size={24} style={{ color: "#ffffff" }} />
                    <span
                      className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                      role="tooltip"
                    >
                      Restore Selected Inquiries
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

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
              {filteredUser.length === 0 ? (
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
                filteredUser.map((item, index) => (
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
                          {item.profile.link ? (
                            <div className="lg:w-20 lg:h-20 w-16 h-16 aspect-w-1 aspect-h-1 overflow-hidden rounded-full mx-auto border border-4 border-[#013D74]">
                              <img
                                src={item.profile.link}
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
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black  line-clamp-2 ">
                          {item.firstName +
                            " " +
                            item.middleName +
                            " " +
                            item.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                          {item.type}
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
                      {item.isApproved === "Registered" && (
                        <div className="flex w-full items-center justify-center bg-custom-green-button3 m-2 rounded-lg">
                          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-bold text-white p-3 mx-5">
                            REGISTERED
                          </span>
                        </div>
                      )}
                      {item.isApproved === "Denied" && (
                        <div className="flex w-full items-center justify-center bg-custom-red-button m-2 rounded-lg">
                          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-bold text-white p-3 mx-5">
                            DENIED
                          </span>
                        </div>
                      )}
                      {item.isApproved === "Pending" && (
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
                          data-hs-overlay="#hs-modal-viewAdmin"
                          onClick={() => handleView({ ...item })}
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
        <ViewArchivedAdmin user={user} setUser={setUser} />
        <RestoreAdminModal selectedItems={selectedItems} />
        <GenerateReportsModal />
      </div>
    </div>
  );
};

export default ArchivedAccountManagement;
