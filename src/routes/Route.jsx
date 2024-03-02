import { createBrowserRouter, Outlet } from "react-router-dom";
import Error404 from "../config/Error404";
import Dashboard from "../pages/Dashboard";
import Announcements from "../pages/Events/Announcements";
//import AnimationLayout from "../components/global/AnimationLayout";
import Navbar from "../components/global/Navbar";
import Inquiries from "../pages/Inquiries";
import Residents from "../pages/BarangayTabs/BrgyResidents";
import Information from "../pages/BarangayTabs/BrgyInformation";
import Settings from "../pages/Settings";
import Login from "../pages/login/Login";
import ForgotPassword from "../pages/login/ForgotPassword";
import SecurityPin from "../pages/login/SecurityPin";
import ChangePassword from "../pages/login/ChangePassword";
import ArchivedAnnouncements from "../pages/Events/ArchivedAnnouncements";
import ArchivedInquiries from "../pages/ArchivedInquiries";
import ArchivedResidents from "../pages/BarangayTabs/BrgyArchivedResidents";
import ArchivedServices from "../pages/BarangayTabs/BrgyArchivedServices";
import ArchivedServiceReq from "../pages/BarangayTabs/BrgyArchivedServiceReq";
import ArchivedOfficials from "../pages/BarangayTabs/BrgyArchivedOfficials";
import BarangayMenu from "../pages/BarangayMenu";
import BarangayInfo from "../pages/BarangayInfo";
import BrgyArchivedAnnouncement from "../pages/BarangayTabs/BrgyArchivedAnnouncement";
import BrgyArchivedInquiries from "../pages/BarangayTabs/BrgyArchivedInquiries";
import AccountManagement from "../pages/AccountManagement/MunicipalAccount";
import ArchivedAccountManagement from "../pages/AccountManagement/ArchiveMunicipalAccount";
import MunicipalityOffcials from "../pages/MunicipalInfo/MunicipalityOffcials";
import ArchivedMunicipalityOfficials from "../pages/MunicipalInfo/ArchivedMunicipalityOfficials";
import MAboutusInfo from "../pages/MunicipalInfo/MAboutusInfo";
import ArchivedAboutusInfo from "../pages/MunicipalInfo/ArchivedMAboutus"
import MServicesInfo from "../pages/MunicipalInfo/MServicesInfo";
import ArchivedServicesInfo from "../pages/MunicipalInfo/ArchivedMServices"
import MTouristSpot from "../pages/MunicipalInfo/MTouristSpot";
import ArchivedTouristSpot from "../pages/MunicipalInfo/ArchivedTouristSpot";
import EventsRegistrations from "../pages/Events/EventsApplication";
import ArchivedRegistrations from "../pages/Events/ArchivedApplication";
import BarangayAccount from "../pages/AccountManagement/BarangayAccount";
import ArchiveBarangayAccount from "../pages/AccountManagement/ArchiveBarangayAccount";
import ArchiveApplication from "../pages/BarangayTabs/BrgyArchiveApplication"
import Reports from "../pages/Reports";
import ViewNotifications from "../pages/ViewNotifications"
import MRequests from "../pages/Requests";
import MArchivedRequests from "../pages/ArchivedRequests";
import MServices from "../pages/Services";
import MArchivedServices from "../pages/ArchivedServices";
import Tooltip from "../pages/login/Tooltip";
import ArchivedBlotters from "../pages/BarangayTabs/BrgyArchivedBlotters";
import Blotters from "../pages/BarangayTabs/BrgyBlotters";

const pages = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/tooltip",
    element: <Tooltip />,
  },
  {
    path: "/forgot",
    element: <ForgotPassword />,
  },
  {
    path: "/pin/:email",
    element: <SecurityPin />,
  },
  {
    path: "/change/:email",
    element: <ChangePassword />,
  },
  //end of login

  {
    path: "/dashboard",
    element: <Navbar comp={<Dashboard />} />,
  },

  {
    path: "/reports",
    element: <Navbar comp={<Reports />} />,
  },

//EVENTS
  {
    path: "/announcements",
    element: <Navbar comp={<Announcements />} />,
  },
  {
    path: "/archivedannoucements",
    element: <Navbar comp={<ArchivedAnnouncements />} />,
  },
  {
    path: "/archived_registrations",
    element: <Navbar comp={<ArchivedRegistrations />} />,
  },
  {
    path: "/events_registration",
    element: <Navbar comp={<EventsRegistrations />} />,
  },

  //  INQUIRIES
  {
    path: "/inquiries",
    element: <Navbar comp={<Inquiries />} />,
  },
  {
    path: "/archivedinquiries",
    element: <Navbar comp={<ArchivedInquiries/>} />,
  },

//  MUNICIPAL INFO  
  {
    path: "/aboutus_info",
    element: <Navbar comp={<MAboutusInfo />} />,
  },
  {
    path: "/archived_aboutus_info",
    element: <Navbar comp={<ArchivedAboutusInfo />} />,
  },
  {
    path: "/services_info",
    element: <Navbar comp={<MServicesInfo />} />,
  },
  {
    path: "/archived_services_info",
    element: <Navbar comp={<ArchivedServicesInfo />} />,
  },
  {
    path: "/tourist_spot",
    element: <Navbar comp={<MTouristSpot />} />,
  },
  {
    path: "/archived_tourist_spot",
    element: <Navbar comp={<ArchivedTouristSpot />} />,
  },
  {
    path: "/municipalityofficials",
    element: <Navbar comp={<MunicipalityOffcials />} />,
  },
  {
    path: "/archivedmunicipalityofficials",
    element: <Navbar comp={<ArchivedMunicipalityOfficials />} />,
  },

  //  ACCOUNT MANAGEMENT
  {
    path: "/municipal_account",
    element: <Navbar comp={<AccountManagement />} />,
  },
  {
    path: "/archive_municipal_account",
    element: <Navbar comp={<ArchivedAccountManagement />} />,
  },
  {
    path: "/brgy_account",
    element: <Navbar comp={<BarangayAccount />} />,
  },
  {
    path: "/archive_brgy_account",
    element: <Navbar comp={<ArchiveBarangayAccount />} />,
  },

  // REQUEST
  {
    path: "/request",
    element: <Navbar comp={<MRequests />} />,
  },
  {
    path: "/archive_request",
    element: <Navbar comp={<MArchivedRequests />} />,
  },

  //SERVICES
  {
    path: "/services",
    element: <Navbar comp={<MServices />} />,
  },
  {
    path: "/archive_services",
    element: <Navbar comp={<MArchivedServices />} />,
  },


  // BARANGAY MANAGEMENT
  {
    path: "/brgyarchivedservices",
    element: <Navbar comp={<ArchivedServices />} />,
  },
  {
    path: "/brgyarchivedblotters",
    element: <Navbar comp={<ArchivedBlotters />} />,
  },
  {
    path: "/brgyarchivedservicesreq",
    element: <Navbar comp={<ArchivedServiceReq />} />,
  },
  {
    path: "/brgyarchivedofficials",
    element: <Navbar comp={<ArchivedOfficials />} />,
  },
  {
    path: "/barangaymenu",
    element: <Navbar comp={<BarangayMenu />} />,
  },
  {
    path: "/barangayinformation",
    element: <Navbar comp={<BarangayInfo />} />,
  },
  {
    path: "/brgyarchivedinquiries",
    element: <Navbar comp={<BrgyArchivedInquiries />} />,
  },
  {
    path: "/brgyarchivedannoucements",
    element: <Navbar comp={<BrgyArchivedAnnouncement />} />,
  },
  {
    path: "/view_notifications",
    element: <Navbar comp={<ViewNotifications/>} />,
  },
  {
    path: "/brgyarchivedapplication",
    element: <Navbar comp={<ArchiveApplication />} />,
  },
  {
    path: "/brgyarchivedresidents",
    element: <Navbar comp={<ArchivedResidents />} />,
  },
  {
    path: "/brgyinfo",
    element: <Navbar comp={<Information />} />,
  },
  {
    path: "/settings",
    element: <Navbar comp={<Settings />} />,
  },
];

const Route = createBrowserRouter([
  {
    element: <Outlet />, //replace AnimationLayout
    errorElement: <Error404 />,
    children: pages,
  },
]);

export default Route;
