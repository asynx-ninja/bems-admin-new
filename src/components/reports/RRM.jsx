import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import API_LINK from "../../config/API";
import Chart from "react-apexcharts";

const RRM = () => {

 
      const [userCounts, setUserCounts] = useState([]);

      useEffect(() => {
        const fetchUserCounts = async () => {
          try {
            const response = await axios.get(`${API_LINK}/users/allregistered`);
            setUserCounts(Array.isArray(response.data) ? response.data : []);
            console.log("weewe", response.data);
           
          } catch (error) {
            console.error("Error fetching user counts:", error);
            setUserCounts([]); // Set an empty array in case of an error
          }
          
        };
    
        fetchUserCounts();
      }, []);
    
      const getLastSixMonths = () => {
        const months = [];
        let date = new Date();
        for (let i = 0; i < 6; i++) {
          months.unshift(date.toLocaleString("en-US", { month: "short" }));
          date.setMonth(date.getMonth() - 1);
        }
        return months;
      };
    
      const lastSixMonths = getLastSixMonths();
    
      // Get the current year
      const currentYear = new Date().getFullYear();
    
      const chartOptions = {
        chart: {
          id: "user-registration-chart",
          type: "line",
        },
        xaxis: {
          categories: lastSixMonths,
          title: { text: "Month" },
        },
        yaxis: {
          title: { text: "Registered Users" },
        },
      };
    
      // Map userCounts to the lastSixMonths array
      const chartSeries = [
        {
          name: "Resident Registrations",
          data: lastSixMonths.map((month) => {
            const monthDate = new Date(`${month} 1, ${currentYear}`);
            const monthIndex = monthDate.getMonth() + 1;
            const userCount = userCounts.find((count) => count._id === monthIndex);
            return userCount ? userCount.totalUsers : 0;
          }),
        },
      ];
    
  return (
  <>
    <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5 justify-center items-center">
            <h1 className="mt-5 ml-5 font-medium text-black">
              Resident Registration for the Past 6 Months
            </h1>
            <div className="flex rounded-xl">
              <Chart
                className="flex w-11/12 rounded-xl "
                options={chartOptions}
                series={chartSeries}
                type="line"
              />
            </div>
          </div></>
  )
}

export default RRM