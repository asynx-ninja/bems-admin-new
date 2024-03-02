import React from "react";
import { Link } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { AiOutlineStop, AiOutlineEye } from "react-icons/ai";
import { FaArchive, FaPlus, FaUserCircle } from "react-icons/fa";
import { BsPrinter } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import ArchiveAccAdmin from "../../components/barangayaccount/ArchiveAdminModal";
import StatusAccAdmin from "../../components/barangayaccount/StatusAdmin";
import GenerateReportsModal from "../../components/barangayaccount/GenerateReportsModal";
import AddAdminModal from "../../components/barangayaccount/AddAdminModal";
import ManageAdminModal from "../../components/barangayaccount/ManageAdminModal";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import API_LINK from "../../config/API";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PrintPDF from "../../components/municipalaccount/form/PrintPDF";
import noData from "../../assets/image/no-data.png";

const BarangayAccount = () => {
  useEffect(() => {
    document.title =
      "Barangay Account Management | Barangay E-Services Management";
  }, []);
  const [selectedItems, setSelectedItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const brgy = "MUNISIPYO";
  const occupation = "Barangay Admin";
  const type = "Brgy Admin";
  const [user, setUser] = useState({});
  const [status, setStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [adminFilter, setAdminFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);

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

  const tableHeader = [
    "PROFILE",
    "NAME",
    "BARANGAY",
    "ACCOUNT STATUS",
    "ACTIONS",
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/brgy_admin/?page=${currentPage}&type=${adminFilter}`
        );

        if (response.status === 200) {
          console.log("r", response.data);
          setPageCount(response.data.pageCount);
          setUsers(response.data.result); // Update the state variable with the fetched users
          setFilteredUser(response.data.result);
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
    setAdminFilter(type);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const handleView = (item) => {
    setUser(item);
  };

  const handleStatus = (status) => {
    setStatus(status);
  };

  const handleResetFilter = () => {
    setAdminFilter("all");
  };

  return (
    <div className="mx-4 mt-4">
      <div className="flex flex-col ">
        <div className="flex flex-row sm:flex-col-reverse lg:flex-row w-full ">
          <div className="sm:mt-5 md:mt-4 lg:mt-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] py-2 lg:py-4 px-5 md:px-10 lg:px-0 xl:px-10 sm:rounded-t-lg lg:rounded-t-[1.75rem]  w-full lg:w-2/5 xxl:h-[4rem] xxxl:h-[5rem]">
            <h1
              className="text-center sm:text-[15px] mx-auto font-bold text-xs md:text-xl lg:text-[16px] xl:text-[20px] xxl:text-[1.5rem] xxxl:text-3xl xxxl:mt-1 text-white"
              style={{ letterSpacing: "0.2em" }}
            >
              BARANGAY ADMIN
            </h1>
          </div>
          <div className="lg:w-3/5 flex flex-row justify-end items-center ">
            <div className="sm:w-full md:w-full lg:w-2/5 flex sm:flex-col md:flex-row md:justify-center md:items-center sm:space-y-2 md:space-y-0 md:space-x-2 ">
              <div className="w-full rounded-lg flex justify-center">
                <div className="hs-tooltip inline-block w-full">
                  <button
                    type="button"
                    data-hs-overlay="#hs-modal-addAdmin"
                    className="hs-tooltip-toggle justify-center sm:px-2 sm:p-2 md:px-5 md:p-3 rounded-lg bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] w-full text-white font-medium text-sm  text-center inline-flex items-center "
                  >
                    <FaPlus size={24} style={{ color: "#ffffff" }} />
                    <span className="sm:block md:hidden sm:pl-5">
                      Add Admin Account
                    </span>
                    <span
                      className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                      role="tooltip"
                    >
                      Add Admin Account
                    </span>
                  </button>
                </div>
              </div>
              <div className="w-full rounded-lg ">
                <Link
                  to={`/archive_brgy_account/?id=${id}&brgy=${brgy}&archived=true`}
                >
                  <div className="hs-tooltip inline-block w-full">
                    <button
                      type="button"
                      className="hs-tooltip-toggle justify-center sm:px-2 sm:p-2 md:px-5 md:p-3 rounded-lg bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] w-full text-white font-medium text-sm text-center inline-flex items-center"
                    >
                      <FaArchive size={24} style={{ color: "#ffffff" }} />
                      <span className="sm:block md:hidden sm:pl-5">
                        Archived Admin Account
                      </span>
                      <span
                        className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                        role="tooltip"
                      >
                        Archived Admin Account
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
            <div className="flex flex-col lg:flex-row lg:space-x-2 md:mt-2 lg:mt-0 md:space-y-2 lg:space-y-0"></div>
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

                    if (e.target.value.trim() === "") {
                      // If the search input is empty, fetch all data
                      setUsers(users);
                    } else {
                      // If the search input is not empty, filter the data
                      const Users = users.filter(
                        (item) =>
                          item.firstName
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase()) ||
                          item.lastName
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase()) ||
                          item.address.brgy
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase())
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
                    type="button"
                    data-hs-overlay="#hs-modal-archiveAdmin"
                    className="hs-tooltip-toggle sm:w-full md:w-full text-white rounded-md  bg-pink-800 font-medium text-xs sm:py-1 md:px-3 md:py-2 flex items-center justify-center"
                  >
                    <AiOutlineStop size={24} style={{ color: "#ffffff" }} />
                    <span
                      className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                      role="tooltip"
                    >
                      Archived Selected Inquiries
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
                      <span className="text-xs sm:text-sm lg:text-xs xl:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                        <div className="px-2 sm:px-6 py-2">
                          {item.profile.link ? (
                            <div className="lg:w-20 lg:h-20 w-16 h-16 aspect-w-1 aspect-h-1 overflow-hidden rounded-full mx-auto border border-4 border-[#013D74]">
                              <img
                                referrerPolicy="no-referrer"
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
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm lg:text-xs xl:text-sm text-black  line-clamp-2 ">
                          {item.firstName +
                            " " +
                            item.middleName +
                            " " +
                            item.lastName}
                        </span>
                      </div>
                    </td>
                    {/* <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                          {item.type}
                        </span>
                      </div>
                    </td> */}
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center">
                        <span className="text-xs sm:text-sm lg:text-xs xl:text-sm lg:text-xs xl:text-sm text-black line-clamp-2">
                          {item.address.brgy}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {item.isApproved === "Registered" && (
                        <div className="flex w-full items-center justify-center bg-custom-green-button3 m-2 rounded-lg">
                          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm lg:text-xs xl:text-sm font-bold text-white p-3 mx-5">
                            REGISTERED
                          </span>
                        </div>
                      )}
                      {item.isApproved === "Denied" && (
                        <div className="flex w-full items-center justify-center bg-custom-red-button m-2 rounded-lg">
                          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm lg:text-xs xl:text-sm font-bold text-white p-3 mx-5">
                            DENIED
                          </span>
                        </div>
                      )}
                      {item.isApproved === "Pending" && (
                        <div className="flex w-full items-center justify-center bg-custom-amber m-2 rounded-lg">
                          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm lg:text-xs xl:text-sm font-bold text-white p-3 mx-5">
                            PENDING
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center space-x-1 sm:space-x-none">
                        <button
                          type="button"
                          data-hs-overlay="#hs-modal-editAdmin"
                          onClick={() => handleView({ ...item })}
                          className="text-white bg-teal-800 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                        >
                          <AiOutlineEye
                            size={24}
                            style={{ color: "#ffffff" }}
                          />
                        </button>
                        <button
                          type="button"
                          data-hs-overlay="#hs-modal-statusAdmin"
                          className="text-white bg-yellow-800 font-medium text-xs px-2 py-2 inline-flex items-center rounded-lg"
                          onClick={() =>
                            handleStatus({
                              id: item._id,
                              status: item.isApproved,
                            })
                          }
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
      </div>
      <ArchiveAccAdmin selectedItems={selectedItems} />
      {/* <StatusAccAdmin /> */}
      <GenerateReportsModal user={user} setUser={setUser} />
      <AddAdminModal occupation={occupation} type={type} />
      <ManageAdminModal user={user} setUser={setUser} />
      <StatusAccAdmin status={status} setStatus={setStatus} />
    </div>
  );
};

export default BarangayAccount;
