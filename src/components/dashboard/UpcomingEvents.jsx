import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import API_LINK from "../../config/API";
import { MdEvent } from "react-icons/md";
import ViewEvent from "./ViewEvent";
import ReactPaginate from "react-paginate";
const UpcomingEvents = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const brgy = "MUNISIPYO";
  const id = searchParams.get("id");
  const [announcement, setAnnouncement] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/announcement/?brgy=${brgy}&archived=false&page=${currentPage}`
        );
        if (response.status === 200) {
          setAnnouncements(response.data.result);
          setPageCount(response.data.pageCount);
        } else {
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchAnnouncements();
  }, [brgy, currentPage]);
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };
  const dateFormat = (date) => {
    const eventdate = date === undefined ? "" : date.substr(0, 10);
    return eventdate;
  };

  const handleView = (item) => {
    setAnnouncement(item);
  };

  return (
    <div className="relative w-full mt-4 lg:w-full flex flex-col overflow-y-auto h-full">
      <div className="flex flex-col max-h-screen">
        <b className="border-solid border-0 border-black border-b-2 pb-2 uppercase font-heavy text-lg md:text-xl mb-4 shrink-0">
          UPCOMING EVENTS
        </b>
        <div className="overflow-y-auto h-auto">
          <div className="w-full gap-3 flex flex-col border">
            {announcements.map((item, index) => (
              <div
                key={index}
                className="flex flex-row bg-gradient-to-r from-[#295141]  to-[#408D51] h-full text-white font-medium overflow-hidden"
              >
                <div
                  className="bg-cover bg-center w-[20%] h-[4rem] md:h-[5rem] lg:h-[6rem] object-cover rounded-r-full border-solid border-0"
                  style={{
                    backgroundImage: `url('${item.collections.banner.link}')`,
                  }}
                >
                  <div
                    className="w-full h-full flex  justify-center items-center 
             bg-gradient-to-r from-[#00000000] to-[#FFCF67]/60 rounded-r-full"
                  ></div>
                </div>

                <div className="flex flex-row justify-between items-center w-full sm:px-3 md:px-5">
                  <div className="flex flex-col justify-center ">
                    <h1 className="line-clamp-1 sm:text-[13px] md:text-base w-full">
                      {item.title}
                    </h1>
                    <p className="text-xs md:text-sm">
                      {dateFormat(item.date) || ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-hs-overlay="#hs-modal-viewEvent"
                    onClick={() => handleView({ ...item })}
                    className="text-white bg-teal-800 font-medium text-xs px-2 py-2 mr-6 inline-flex items-center rounded-lg"
                  >
                    <MdEvent size={24} style={{ color: "#ffffff" }} />
                  </button>
                </div>
              </div>
            ))}
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
            disabledLinkClassName="text-gray-300"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
      <ViewEvent
        announcement={announcement}
        setAnnouncement={setAnnouncement}
        brgy={brgy}
        id={id}
      />
    </div>
  );
};

export default UpcomingEvents;
