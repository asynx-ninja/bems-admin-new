import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import API_LINK from '../config/API';
const UserRegistrationChart = () => {
    const [userCounts, setUserCounts] = useState([]);

    useEffect(() => {
      const fetchUserCounts = async () => {
        try {
          const response = await axios.get(`${API_LINK}/users/allregistered`);
          setUserCounts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error('Error fetching user counts:', error);
          setUserCounts([]); // Set an empty array in case of an error
        }
      };
  
      fetchUserCounts();
    }, []);
  
    const formatDate = (monthNumber) => {
        // Ensure monthNumber is defined
        if (!monthNumber) return 'N/A';
        const date = new Date(2024, monthNumber - 1); // Adjust the year as needed
        return date.toLocaleString('en-US', { month: 'short' });
      };
    
      const chartOptions = {
        chart: {
          id: 'user-registration-chart',
          type: 'line',
        },
        xaxis: {
          categories: userCounts.map(count => formatDate(count._id)),
          title: { text: 'Month' },
        },
        yaxis: {
          title: { text: 'Number of Users' },
        },
      };
    
      const chartSeries = [
        {
          name: 'Registered Users',
          data: userCounts.map(count => count.totalUsers),
        },
      ];
    
  
    return (
      <>


      <div className="flex flex-col lg:flex-row lg:space-x-2 w-full">
          <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5">
            <h1 className="mt-5 ml-5 font-medium text-black">
            User Registration Chart
            </h1>
            <div className="flex rounded-xl">
            <Chart options={chartOptions} series={chartSeries} type="line" />
            </div>
      
            </div>
            </div>
      
      </>
         
    );
  };

export default UserRegistrationChart;
