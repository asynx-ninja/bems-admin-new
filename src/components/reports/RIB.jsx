import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import API_LINK from "../../config/API";
import Chart from "react-apexcharts";

const RIB = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
          chart: {
            type: "bar",
          },
          xaxis: {
            categories: [],
          },
          yaxis: {
            title: {
              text: "Number of Inquiries",
            },
          },
        },
      });
    
      useEffect(() => {
        const fetchInquiriesData = async () => {
          try {
            const response = await axios.get(
              `${API_LINK}/inquiries/inquiries_percent`
            );
            const data = response.data;
            console.log("Data:", data);
    
            const categories = [
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
    
            const seriesData = [
              {
                name: "Pending",
                data: categories.map((barangay) => {
                  const record = data.find(
                    (item) =>
                      item.barangay.toUpperCase() === barangay.toUpperCase() &&
                      item.status.toUpperCase() === "PENDING"
                  );
                  return record ? record.count : 0;
                }),
              },
              {
                name: "In Progress",
                data: categories.map((barangay) => {
                  const record = data.find(
                    (item) =>
                      item.barangay.toUpperCase() === barangay.toUpperCase() &&
                      item.status.toUpperCase() === "IN PROGRESS"
                  );
                  return record ? record.count : 0;
                }),
              },
              {
                name: "Completed",
                data: categories.map((barangay) => {
                  const record = data.find(
                    (item) =>
                      item.barangay.toUpperCase() === barangay.toUpperCase() &&
                      item.status.toUpperCase() === "COMPLETED"
                  );
                  return record ? record.count : 0;
                }),
              },
            ];
    
            setChartData({
              series: seriesData.filter((series) =>
                series.data.some((count) => count !== null)
              ),
              options: {
                chart: {
                  type: "bar",
                },
                xaxis: {
                  categories: categories,
                  title: {
                    text: "Barangays",
                  },
                },
                yaxis: {
                  title: {
                    text: "Number of Inquiries",
                  },
                },
              },
            });
            console.log("chartData:", chartData);
            // const intervalId = setInterval(() => {
            //     fetchData();
            //   }, 3000);
          
            //   return () => clearInterval(intervalId);
          } catch (error) {
            console.error("Error fetching data: ", error);
          }
        };
    
        fetchInquiriesData();
      }, []);
  return (
    <>
       <div className="bg-[#e9e9e9] w-full lg:w-100 rounded-xl mt-5 justify-center items-center">
        <h1 className="mt-5 ml-5 font-medium text-black">
          Inquiries per Barangay
        </h1>
        <div className="flex rounded-xl">
          <Chart
            className="flex w-11/12 rounded-xl "
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height="350"
          />
        </div>
      </div>
    </>
  );
};

export default RIB;
