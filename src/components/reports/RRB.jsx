import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import API_LINK from "../../config/API";
import Chart from "react-apexcharts";

const RRB = () => {
 
  const [chartData, setChartData] = useState({
    options: {
        chart: {
            type: 'bar',
        },
        xaxis: {
            categories: [
                "Balite", "Burgos", "Geronimo", "Macabud", "Manggahan", 
                "Mascap", "Puray", "Rosario", "San Isidro", "San Jose", "San Rafael"
            ],
            title: { text: "Barangays" },
        },
        yaxis: {
            title: {
              text: "No. Registered Residents",
            },
          },
    },
    series: [{
        name: 'Residents',
        data: []
    }]
});

useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_LINK}/users/brgy_registered`);
            const data = response.data;
            console.log("ito",data)
            
            const updateSeriesData = chartData.options.xaxis.categories.map(brgy => {
                const match = data.find(d => d._id.toUpperCase() === brgy.toUpperCase());
                return match ? match.totalUsers : 0;
            });

            setChartData(prevState => ({
                ...prevState,
                series: [{ ...prevState.series[0], data: updateSeriesData }]
            }));
            // const intervalId = setInterval(() => {
            //     fetchData();
            //   }, 3000);
          
            //   return () => clearInterval(intervalId);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []);
  return (
    <>
      <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5 justify-center items-center">
        <h1 className="mt-5 ml-5 font-medium text-black">
          Registered Residents per Barangay
        </h1>
        <div className="flex rounded-xl">
       
            <Chart
              className="flex w-11/12 rounded-xl "
              options={chartData.options}
              series={chartData.series}
              type="bar"
            />
        
        </div>
      </div>
    </>
  );
};

export default RRB;
