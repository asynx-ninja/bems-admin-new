import React from "react";
import { useEffect, useState } from "react";
import Information from "./BarangayTabs/Brgyinformation";
import Profit from "../pages/BarangayTabs/Reports";
import Services from "./BarangayTabs/BrgyServices";
import ServiceRequest from "./BarangayTabs/BrgyServiceRequests";
import Officials from "./BarangayTabs/BrgyOfficials";
import ArchivedOfficials from "./BarangayTabs/BrgyArchivedOfficials";
import Residents from "./BarangayTabs/BrgyResidents";
import Inquiries from "./BarangayTabs/BrgyInquiries";
import { useParams, useSearchParams } from "react-router-dom";
import Announcement from "./BarangayTabs/BrgyAnnouncements";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { FaHome, FaUser, FaCog, FaEnvelope } from "react-icons/fa";
function BarangayDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const brgy = searchParams.get("brgy");
  const [selectedTab, setSelectedTab] = useState("Information");

  const handleTabChange = (event) => {
    setSelectedTab(event.target.value);
  };

  const tabs = [
    "Information",
    "Barangay Officials",
    "Services",
    "Service Requests",
    "Residents",
    "Events",
    "Inquiries",
    "Profits",
  ];

  useEffect(() => {
    document.title = `Barangay ${brgy} Information | Barangay E-Services Management`;
  }, []);

  return (
    <div className="px-4 py-4 w-full items-center bg-gray-100">
    <div className="relative">
      <label htmlFor="tabDropdown" className="sr-only">
        Select Tab
      </label>
      <div className="relative">
        <select
          id="tabDropdown"
          name="tabDropdown"
          className="block w-full px-4 py-3 mb-2 mt-2 bg-transparent border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-r from-[#295141] to-[#408D51] text-white focus:border-blue-500"
          onChange={handleTabChange}
          value={selectedTab}
        >
          {tabs.map((tab) => (
            <option className="text-black " key={tab} value={tab}>
              {tab}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
          <svg
            className="w-4 h-4 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 7l3-3 3 3m0 6l-3 3-3-3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>

    <div className="mt-3 py-4 px-4 bg-white">
      {tabs.map((tab) => (
        <div
          key={tab}
          id={`basic-tabs-${tab}`}
          className={selectedTab === tab ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby={`basic-tabs-item-${tab}`}
        >
          {tab === "Information" && <Information brgy={brgy} id={id} />}
          {tab === "Barangay Officials" && (
            <Officials brgy={brgy} id={id} />
          )}
          {tab === "Services" && <Services brgy={brgy} id={id} />}
          {tab === "Service Requests" && (
            <ServiceRequest brgy={brgy} id={id} />
          )}
          {tab === "Residents" && <Residents brgy={brgy} id={id} />}
          {tab === "Events" && <Announcement brgy={brgy} id={id} />}
          {tab === "Inquiries" && <Inquiries brgy={brgy} id={id} />}
          {tab === "Profits" && <Profit brgy={brgy} id={id} />}
        </div>
      ))}
    </div>
  </div>
  );
}

export default BarangayDetails;
