import React from 'react'
import { useEffect } from 'react'
import StatisticsDashboard from '../components/dashboard/StatisticsDashboard';
import SubPendingRequest from '../components/dashboard/SubPendingRequest';
import EventsCalendar from '../components/dashboard/UpcomingEvents';
import SubPendingApplication from "../components/dashboard/SubPendingApplication";
const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard | Barangay E-Services Management"
  }, []);

  return (
    <div className="mx-4 my-4 overflow-y-auto overflow-x-hidden lg:h-[calc(100vh_-_105px)]">
    <StatisticsDashboard />
    <div className="flex flex-col md:flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 ">
      <SubPendingApplication />
      <SubPendingRequest />
      {/* <EventsCalendar /> */}
    </div>
  </div>
  );
}

export default Dashboard