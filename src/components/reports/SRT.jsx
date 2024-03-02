import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import API_LINK from "../../config/API";
import Chart from "react-apexcharts";

const SRT = () => {
    const [chartData, setChartData] = useState({});
    const barangays = [
      "Balite",
      "Burgos",
      "Geronimo",
      "Macabud",
      "Manggahan",
      "Mascap",
      "Puray",
      "Rosario",
      "San Isidro",
      "San Jose",
      "San Rafael",
    ];
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${API_LINK}/requests/status/percentage`);
          const responseData = response.data;
  
          // Prepare data for chart
          const series = [
            "Pending",
            "Paid",
            "Processing",
            "Cancelled",
            "Transaction Completed",
            "Rejected",
          ].map((status) => ({
            name: status,
            data: barangays.map((brgy) => {
              const brgyData = responseData.find(
                (b) => b.brgy && b.brgy.toUpperCase() === brgy.toUpperCase()
              );
              return brgyData
                ? brgyData.statuses.find((s) => s.status === status)?.count || null
                : null;
            }),
          }));
  
          console.log("Series Data:", series);
  
          setChartData({
            options: {
              chart: {
                type: "bar",
                stacked: false,
              },
              xaxis: {
                categories: barangays,
                title: {
                  text: "Barangays",
                },
              },
              yaxis: {
                title: {
                  text: "Number of Transactions",
                },
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                },
              },
            },
            series: series,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, []);
    
  return (
    <>
    
        <div className="bg-[#e9e9e9] w-full lg:w-100 rounded-xl mt-5 justify-center items-center">
          <h1 className="mt-5 ml-5 font-medium text-black">
            Service Requests Transactions by Barangay
          </h1>
          <div className="flex rounded-xl">
            {chartData.options && chartData.series ? (
              <Chart
                className="flex w-11/12 rounded-xl "
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height="350"
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      
    </>
  );
};

export default SRT;
