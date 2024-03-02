import React from "react";
import { useEffect, useState } from "react";
import Information from "./BarangayTabs/BrgyInformation";
import Profit from "./BarangayTabs/Reports";
import Services from "./BarangayTabs/BrgyServices";
import ServiceRequest from "./BarangayTabs/BrgyServiceRequests";
import Officials from "./BarangayTabs/BrgyOfficials";
import ArchivedOfficials from "./BarangayTabs/BrgyArchivedOfficials";
import Residents from "./BarangayTabs/BrgyResidents";
import Inquiries from "./BarangayTabs/BrgyInquiries";
import Application from "./BarangayTabs/BrgyEventsApplication";
import Blotters from "./BarangayTabs/BrgyBlotters";
import { useParams, useSearchParams } from "react-router-dom";
import Announcement from "./BarangayTabs/BrgyAnnouncements";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import axios from "axios";
import API_LINK from "../config/API";
import GetBrgy from "../components/GETBrgy/getbrgy";
function BarangayDetails() {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const brgy = searchParams.get("brgy");
  const information = GetBrgy(brgy);
  // const [activeTab, setActiveTab] = useState(1); // Initial active tab
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  const [activeTab, setActiveTab] = useState(() => {
    // Get the active tab from local storage if it exists, otherwise default to 1
    const savedTab = localStorage.getItem("activeTab");
    return savedTab !== null ? Number(savedTab) : 1;
  });

  // This effect runs when activeTab state changes
  useEffect(() => {
    // Store the active tab in local storage whenever it changes
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);
  // useEffect(() => {
  //   return () => {
  //     // Reset the active tab to the default value when the component unmounts
  //     setActiveTab(1);
  //   };
  // }, []);

  console.log("SAASA", id);

  return (
    <div className="mx-4 lg:mt-[1rem] mt-4 overflow-y-auto lg:h-[calc(100vh_-_90px)] ">
      <div
        className="w-full flex items-center justify-center rounded-t-lg bg-[#295141]"
        style={{ backgroundColor: information?.theme?.primary }}
      >
        <h1 className="text-white lg:text-3xl py-2 px-5 font-heavy ">
          BARANGAY {brgy ? brgy.toUpperCase() : ""} INFORMATION
        </h1>
      </div>
      <div className="px-4 py-4 items-center bg-gray-100">
        <button
          type="button"
          className="hs-collapse-toggle bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] py-3 px-4 mb-2 mt-2 inline-flex uppercase font-bold items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent  text-white hover:bg-[#408D51] disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          id="hs-basic-collapse"
          style={{
            background: `linear-gradient(to left, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
          }}
          data-hs-collapse="#hs-basic-collapse-heading"
          onClick={() => setCollapseOpen(!collapseOpen)}
        >
          {activeTab === 1 && "Information"}
          {activeTab === 2 && "Barangay Officials"}
          {activeTab === 3 && "Services"}
          {activeTab === 4 && "Service Requests"}
          {activeTab === 5 && "Blotters"}
          {activeTab === 6 && "Residents"}
          {activeTab === 7 && "Events"}
          {activeTab === 8 && "Events Application"}
          {activeTab === 9 && "Inquiries"}
          {activeTab === 10 && "Reports"}
          <svg
            className={`hs-collapse-open ${
              collapseOpen ? "rotate-180" : ""
            } flex-shrink-0 w-4 h-4 text-white`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <div
          id="hs-basic-collapse-heading"
          className={`hs-collapse ${
            collapseOpen ? "block" : "hidden"
          } w-full overflow-hidden transition-[height] duration-300`}
          aria-labelledby="hs-basic-collapse"
        >
          <nav
            className="grid grid-cols-2 lg:grid-cols-3"
            aria-label="Tabs"
            role="tablist"
          >
            <button
              type="button"
              className={`hs-tab-active:font-semibold uppercase mx-1 my-1 font-bold  py-2 px-6 inline-flex items-center gap-2 rounded-full text-xs lg:text-sm whitespace-nowrap text-black hover:bg-white hover:text-[#295141] active ${
                activeTab === 1
                  ? "hs-tab-active:bg-gradient-to-r from-[#295141] to-[#408D51] "
                  : ""
              } `}
              id="basic-tabs-item-1 "
              style={{
                background:
                  activeTab === 1
                    ? `linear-gradient(to left, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`
                    : "",
                textTransform: activeTab === 1 ? "uppercase" : "",
                color: activeTab === 1 ? "#ffffff" : "",
              }}
              data-hs-tab="#basic-tabs-1"
              aria-controls="basic-tabs-1"
              role="tab"
              onClick={() => handleTabChange(1)}
            >
              Information
            </button>
            <button
              type="button"
              className={`hs-tab-active:font-semibold uppercase mx-1 my-1 font-bold  py-2 px-6 inline-flex items-center gap-2 rounded-full text-xs lg:text-sm whitespace-nowrap text-black hover:bg-white hover:text-[#295141] active ${
                activeTab === 2
                  ? "hs-tab-active:bg-gradient-to-r from-[#295141] to-[#408D51] "
                  : ""
              } `}
              style={{
                background:
                  activeTab === 2
                    ? `linear-gradient(to left, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`
                    : "",
                textTransform: activeTab === 2 ? "uppercase" : "",
                color: activeTab === 2 ? "#ffffff" : "",
              }}
              id="basic-tabs-item-1"
              data-hs-tab="#basic-tabs-2"
              aria-controls="basic-tabs-2"
              role="tab"
              onClick={() => handleTabChange(2)}
            >
              Barangay Officials
            </button>
            <button
              type="button"
              className={`hs-tab-active:font-semibold uppercase mx-1 my-1 font-bold  py-2 px-6 inline-flex items-center gap-2 rounded-full text-xs lg:text-sm whitespace-nowrap text-black hover:bg-white hover:text-[#295141] active ${
                activeTab === 3
                  ? "hs-tab-active:bg-gradient-to-r from-[#295141] to-[#408D51] "
                  : ""
              } `}
              style={{
                background:
                  activeTab === 3
                    ? `linear-gradient(to left, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`
                    : "",
                textTransform: activeTab === 3 ? "uppercase" : "",
                color: activeTab === 3 ? "#ffffff" : "",
              }}
              id="basic-tabs-item-1"
              data-hs-tab="#basic-tabs-3"
              aria-controls="basic-tabs-3"
              role="tab"
              onClick={() => handleTabChange(3)}
            >
              Services
            </button>
            <button
              type="button"
              className={`hs-tab-active:font-semibold uppercase mx-1 my-1 font-bold 
               py-2 px-6 inline-flex items-center gap-2 rounded-full text-xs lg:text-sm whitespace-nowrap text-black hover:bg-white hover:text-[#295141] active ${
                activeTab === 4
                  ? "hs-tab-active:bg-gradient-to-r from-[#295141] to-[#408D51] "
                  : ""
              } `}
              style={{
                background:
                  activeTab === 4
                    ? `linear-gradient(to left, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`
                    : "",
                textTransform: activeTab === 4 ? "uppercase" : "",
                color: activeTab === 4 ? "#ffffff" : "",
              }}
              id="basic-tabs-item-1"
              data-hs-tab="#basic-tabs-4"
              aria-controls="basic-tabs-4"
              role="tab"
              onClick={() => handleTabChange(4)}
            >
              Service Requests
            </button>
            <button
              type="button"
              className={`hs-tab-active:font-semibold uppercase mx-1 my-1 font-bold  py-2 px-6 inline-flex items-center gap-2 rounded-full text-xs lg:text-sm whitespace-nowrap text-black hover:bg-white hover:text-[#295141] active ${
                activeTab === 5
                  ? "hs-tab-active:bg-gradient-to-r from-[#295141] to-[#408D51] "
                  : ""
              } `}
              style={{
                background:
                  activeTab === 5
                    ? `linear-gradient(to left, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`
                    : "",
                textTransform: activeTab === 5 ? "uppercase" : "",
                color: activeTab === 5 ? "#ffffff" : "",
              }}
              id="basic-tabs-item-1"
              data-hs-tab="#basic-tabs-5"
              aria-controls="basic-tabs-5"
              role="tab"
              onClick={() => handleTabChange(5)}
            >
              Blotters
            </button>
            <button
              type="button"
              className={`hs-tab-active:font-semibold uppercase mx-1 my-1 font-bold  py-2 px-6 inline-flex items-center gap-2 rounded-full text-xs lg:text-sm whitespace-nowrap text-black hover:bg-white hover:text-[#295141] active ${
                activeTab === 6
                  ? "hs-tab-active:bg-gradient-to-r from-[#295141] to-[#408D51] "
                  : ""
              } `}
              style={{
                background:
                  activeTab === 6
                    ? `linear-gradient(to left, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`
                    : "",
                textTransform: activeTab === 6 ? "uppercase" : "",
                color: activeTab === 6 ? "#ffffff" : "",
              }}
              id="basic-tabs-item-1"
              data-hs-tab="#basic-tabs-6"
              aria-controls="basic-tabs-6"
              role="tab"
              onClick={() => handleTabChange(6)}
            >
              Residents
            </button>
            <button
              type="button"
              className={`hs-tab-active:font-semibold uppercase mx-1 my-1 font-bold  py-2 px-6 inline-flex items-center gap-2 rounded-full text-xs lg:text-sm whitespace-nowrap text-black hover:bg-white hover:text-[#295141] active ${
                activeTab === 7
                  ? "hs-tab-active:bg-gradient-to-r from-[#295141] to-[#408D51] "
                  : ""
              } `}
              style={{
                background:
                  activeTab === 7
                    ? `linear-gradient(to left, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`
                    : "",
                textTransform: activeTab === 7 ? "uppercase" : "",
                color: activeTab === 7 ? "#ffffff" : "",
              }}
              id="basic-tabs-item-1"
              data-hs-tab="#basic-tabs-7"
              aria-controls="basic-tabs-7"
              role="tab"
              onClick={() => handleTabChange(7)}
            >
              Events
            </button>
            <button
              type="button"
              className={`hs-tab-active:font-semibold uppercase mx-1 my-1 font-bold  py-2 px-6 inline-flex items-center gap-2 rounded-full text-xs lg:text-sm whitespace-nowrap text-black hover:bg-white hover:text-[#295141] active ${
                activeTab === 8
                  ? "hs-tab-active:bg-gradient-to-r from-[#295141] to-[#408D51] "
                  : ""
              } `}
              style={{
                background:
                  activeTab === 8
                    ? `linear-gradient(to left, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`
                    : "",
                textTransform: activeTab === 8 ? "uppercase" : "",
                color: activeTab === 8 ? "#ffffff" : "",
              }}
              id="basic-tabs-item-1"
              data-hs-tab="#basic-tabs-8"
              aria-controls="basic-tabs-8"
              role="tab"
              onClick={() => handleTabChange(8)}
            >
              Events Application
            </button>
            <button
              type="button"
              className={`hs-tab-active:font-semibold uppercase mx-1 my-1 font-bold py-2 px-6 inline-flex items-center gap-2 rounded-full text-xs lg:text-sm whitespace-nowrap text-black hover:bg-white hover:text-[#295141] active ${
                activeTab === 9
                  ? "hs-tab-active:bg-gradient-to-r from-[#295141] to-[#408D51] "
                  : ""
              } `}
              style={{
                background:
                  activeTab === 9
                    ? `linear-gradient(to left, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`
                    : "",
                textTransform: activeTab === 9 ? "uppercase" : "",
                color: activeTab === 9 ? "#ffffff" : "",
              }}
              id="basic-tabs-item-1"
              data-hs-tab="#basic-tabs-9"
              aria-controls="basic-tabs-9"
              role="tab"
              onClick={() => handleTabChange(9)}
            >
              Inquiries
            </button>
            <button
              type="button"
              className={`hs-tab-active:font-semibold uppercase mx-1 my-1 font-bold  py-2 px-6 inline-flex items-center gap-2 rounded-full text-xs lg:text-sm whitespace-nowrap text-black hover:bg-white hover:text-[#295141] active ${
                activeTab === 10
                  ? "hs-tab-active:bg-gradient-to-r from-[#295141] to-[#408D51] "
                  : ""
              } `}
              style={{
                background:
                  activeTab === 10
                    ? `linear-gradient(to left, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`
                    : "",
                textTransform: activeTab === 10 ? "uppercase" : "",
                color: activeTab === 10 ? "#ffffff" : "",
              }}
              id="basic-tabs-item-1"
              data-hs-tab="#basic-tabs-10"
              aria-controls="basic-tabs-10"
              role="tab"
              onClick={() => handleTabChange(10)}
            >
              Reports
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-3 py-4 px-4">
        <div
          id="basic-tabs-1"
          className={activeTab === 1 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="basic-tabs-item-1"
        >
          <Information brgy={brgy} id={id} />
        </div>
        <div
          id="basic-tabs-2"
          className={activeTab === 2 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="basic-tabs-item-2"
        >
          <Officials brgy={brgy} id={id} />
        </div>
        <div
          id="basic-tabs-3"
          className={activeTab === 3 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="basic-tabs-item-3"
        >
          <Services brgy={brgy} id={id} />
        </div>
        <div
          id="basic-tabs-4"
          className={activeTab === 4 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="basic-tabs-item-4"
        >
          <ServiceRequest brgy={brgy} id={id} />
        </div>
        <div
          id="basic-tabs-5"
          className={activeTab === 5 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="basic-tabs-item-5"
        >
          <Blotters brgy={brgy} id={id} />
        </div>
        <div
          id="basic-tabs-6"
          className={activeTab === 6 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="basic-tabs-item-6"
        >
          <Residents brgy={brgy} id={id} />
        </div>
        <div
          id="basic-tabs-7"
          className={activeTab === 7 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="basic-tabs-item-7 "
        >
          <Announcement brgy={brgy} id={id} />
        </div>
        <div
          id="basic-tabs-8"
          className={activeTab === 8 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="basic-tabs-item-8"
        >
          <Application brgy={brgy} id={id} />
        </div>
        <div
          id="basic-tabs-9"
          className={activeTab === 9 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="basic-tabs-item-9"
        >
          <Inquiries brgy={brgy} id={id} />
        </div>
        <div
          id="basic-tabs-10"
          className={activeTab === 10 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="basic-tabs-item-10"
        >
          <Profit brgy={brgy} id={id} />
        </div>
      </div>
    </div>
  );
}

export default BarangayDetails;
