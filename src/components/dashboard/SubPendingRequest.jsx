import React from "react";
import { AiFillEye } from "react-icons/ai";
import API_LINK from "../../config/API";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import noData from "../../assets/image/no-data.png";
const SubPendingRequest = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [servicesReq, setServicesreq] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResponse = await axios.get(
          `${API_LINK}/services/pendingservices/?archived=false&status=Pending&page=${currentPage}`
        );
        setServicesreq(servicesResponse.data.result);
        setPageCount(servicesResponse.data.pageCount);
        console.log("Services Response:", servicesResponse.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  return (
    <div className="w-full lg:w-6/12 md:w-full flex flex-col h-full ">
      <div className="flex flex-col max-h-screen">
        <b className="border-solid border-0 border-black border-b-2 pb-2 uppercase font-heavy text-lg md:text-xl mb-4 shrink-0">
          PENDING BARANGAY SERVICES
        </b>
        <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb overflow-y-auto lg:h-[calc(100vh_-_480px)] xxl:h-[calc(100vh_-_465px)] xxxl:h-[calc(100vh_-_410px)] w-full">
        <table className="relative table-auto w-full ">
          <thead className="uppercase text-xs md:text-sm bg-gray-100 sticky top-0">
              <tr>
              <th className="px-4 py-1 md:px-5 md:py-2 lg:px-6 lg:py-3">
                  Barangay
                </th>
                <th className="px-4 py-1 md:px-5 md:py-2 lg:px-6 lg:py-3">
                  Name
                </th>
                <th className="px-4 py-1 md:px-5 md:py-2 lg:px-6 lg:py-3">
                  Service Type
                </th>
                <th className="px-4 py-1 md:px-5 md:py-2 lg:px-6 lg:py-3">
                  Requested Date
                </th>
                <th className="px-4 py-1 md:px-5 md:py-2 lg:px-6 lg:py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-center">
              {servicesReq.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center overflow-y-hidden h-[calc(100vh_-_400px)] xxxl:h-[calc(100vh_-_326px)]"
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
                servicesReq.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? "even:bg-gray-100" : ""
                    } hover:bg-gray-200 transition-colors duration-200`}
                  >
                    <td className="px-4 py-1 md:px-5 md:py-2 lg:px-6 lg:py-3">
                      {item.brgy}
                    </td>
                    <td className="px-4 py-1 md:px-5 md:py-2 lg:px-6 lg:py-3">
                      {item.name}
                    </td>
                    <td className="px-4 py-1 md:px-5 md:py-2 lg:px-6 lg:py-3">
                      {item.type}
                    </td>
                    <td className="px-4 py-1 md:px-5 md:py-2 lg:px-6 lg:py-3">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-1 md:px-5 md:py-2 lg:px-6 lg:py-3">
                      <Link
                        to={`/barangayinformation/?id=${id}&brgy=${item.brgy}`}
                        className="hs-tooltip"
                      >
                        <button className="hs-tooltip-toggle rounded-xl bg-[#295141] text-white p-2 text">
                          <AiFillEye size={20} />
                          <span className="hidden sm:pl-5">
                            Go to barangay {item.brgy} service request
                          </span>
                          <span
                            className="hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm"
                            role="tooltip"
                          >
                            Go to barangay {item.brgy} service request
                          </span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="md:py-4 md:px-4 bg-[#295141] flex items-center justify-between rounded-b-xl sm:flex-col-reverse md:flex-row sm:py-3">
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
    </div>
  );
};

export default SubPendingRequest;
