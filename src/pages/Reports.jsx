import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import API_LINK from "../config/API";
import Chart from "react-apexcharts";
import DatePicker from "react-datepicker"; // Import the date picker component
import "react-datepicker/dist/react-datepicker.css";
import SRT from "../components/reports/SRT";
import RRM from "../components/reports/RRM";
import RRB from "../components/reports/RRB";
import RIB from "../components/reports/RIB";
import TRB from "../components/reports/TRB";
import moment from "moment";

const Reports = () => {
  const [requests, setRequests] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const brgy = searchParams.get("brgy");
  const [isSpecificSelected, setIsSpecificSelected] = useState(false);
  const [isTodaySelected, setIsTodaySelected] = useState(false);
  const [isWeeklySelected, setIsWeeklySelected] = useState(false);
  const [isMonthlySelected, setIsMonthlySelected] = useState(false);
  const [isAnnualSelected, setIsAnnualSelected] = useState(false);
  const [dateType, setDateType] = useState("specific");
  const [startDate, setStartDate] = useState("");
  const [specifiedDate, setSpecifiedDate] = useState(new Date());
  const [selected, setSelected] = useState("date");
  const [totalUsersSum, setTotalUsersSum] = useState(0);
  const [timeRange, setTimeRange] = useState("today");
  const [specificDate, setSpecificDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [specificYear, setSpecificYear] = useState(new Date().getFullYear());
  const [specificMonth, setSpecificMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}`
  );
  const [specificWeek, setSpecificWeek] = useState(""); // Default to current date

  useEffect(() => {
    setSpecificDate(new Date().toISOString().split("T")[0]);
  }, [timeRange]);

  const [chartDatas, setChartDatas] = useState({
    options: {
      chart: {
        type: "bar",
      },
      xaxis: {
        categories: [
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
        ],
        title: { text: "Barangays" },
      },
      yaxis: {
        title: {
          text: "No. Registered Residents",
        },
      },
    },
    series: [
      {
        name: "Residents",
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { timeRange: timeRange };
        if (timeRange === "specific") {
          params.date = specificDate; // Pass specificDate directly
        }

        if (timeRange === "weekly" && specificWeek) {
          // Send only the start of the week to the backend
          const [year, weekNumber] = specificWeek.split("-W");
          const weekStart = moment()
            .isoWeekYear(year)
            .isoWeek(weekNumber)
            .startOf("isoWeek")
            .toISOString();
          params.week = weekStart;
        }
        if (timeRange === "monthly" && specificMonth) {
          const [year, month] = specificMonth.split("-");
          params.year = parseInt(year);
          params.month = parseInt(month);
        }

        if (timeRange === "annual") {
          params.year = specificYear;
        }
        const response = await axios.get(`${API_LINK}/users/brgy_registered`, {
          params: params,
        });
        const data = response.data;
        console.log("bago", data);

        // Calculate the sum of totalUsers
        const sum = data.reduce((acc, item) => acc + item.totalUsers, 0);
        setTotalUsersSum(sum);
        const updateSeriesData = chartData.options.xaxis.categories.map(
          (brgy) => {
            const match = data.find(
              (d) => d._id.toUpperCase() === brgy.toUpperCase()
            );
            return match ? match.totalUsers : 0;
          }
        );

        setChartDatas((prevState) => ({
          ...prevState,
          series: [{ ...prevState.series[0], data: updateSeriesData }],
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [timeRange, specificDate, specificWeek, specificMonth, specificYear]);

  const [series, setSeries] = useState([]);

  const [options, setOptions] = useState({
    chart: { type: "bar" },
    xaxis: { categories: [] },
    yaxis: {
      title: {
        text: "Total Revenue (₱)", // Add Peso sign to y-axis label
      },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          // Add Peso sign to tooltip
          return `₱${value}.00`;
        },
      },
    },
  });
  useEffect(() => {
    const fetchFeeSummary = async () => {
      try {
        const params = { timeRange: timeRange };
        if (timeRange === "specific") {
          // specificDate is already in ISO format (YYYY-MM-DD)
          params.specificDate = specificDate;
        }

        if (timeRange === "weekly" && specificWeek) {
          // Send only the start of the week to the backend
          const [year, weekNumber] = specificWeek.split("-W");
          const weekStart = moment()
            .isoWeekYear(year)
            .isoWeek(weekNumber)
            .startOf("isoWeek")
            .toISOString();
          params.week = weekStart;
        }
        if (timeRange === "monthly" && specificMonth) {
          const [year, month] = specificMonth.split("-");
          params.year = parseInt(year);
          params.month = parseInt(month);
        }

        if (timeRange === "annual") {
          params.year = specificYear;
        }
        // Make the API request
        const response = await axios.get(`${API_LINK}/requests/get_revenue`, {
          params: params,
        });
        const data = response.data;

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

        const mappedData = barangays.map((brgy) => {
          const found = data.find(
            (item) => item._id.toUpperCase() === brgy.toUpperCase()
          );
          return found ? found.totalFee : 0;
        });

        setSeries([{ name: "Total Fee", data: mappedData }]);
        setOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            categories: barangays,
            title: {
              text: "Barangays",
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching fee summary:", error);
      }
    };

    fetchFeeSummary();
  }, [timeRange, specificDate, specificWeek, specificMonth, specificYear]);

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

  const [chartData, setChartData] = useState({
    options: {
      chart: { id: "fee-summary" },
      xaxis: {
        categories: barangays,
      },
      yaxis: {
        title: {
          text: "Est. Total Revenue (₱)", // Add Peso sign to y-axis label
        },
      },
      tooltip: {
        y: {
          formatter: function (value) {
            // Add Peso sign to tooltip
            return `₱${value}.00`;
          },
        },
      },
    },
    series: [
      {
        name: "Total Fee",
        data: new Array(barangays.length).fill(0),
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { timeRange: timeRange };
        if (timeRange === "specific") {
          // specificDate is already in ISO format (YYYY-MM-DD)
          params.specificDate = specificDate;
        }
        if (timeRange === "weekly" && specificWeek) {
          // Send only the start of the week to the backend
          const [year, weekNumber] = specificWeek.split("-W");
          const weekStart = moment()
            .isoWeekYear(year)
            .isoWeek(weekNumber)
            .startOf("isoWeek")
            .toISOString();
          params.week = weekStart;
        }
        if (timeRange === "monthly" && specificMonth) {
          const [year, month] = specificMonth.split("-");
          params.year = parseInt(year);
          params.month = parseInt(month);
        }

        if (timeRange === "annual") {
          params.year = specificYear;
        }
        // Make the API request
        const response = await axios.get(`${API_LINK}/requests/est_revenue`, {
          params: params,
        });
        const data = response.data;
        // Map API data to barangay array, filling in zeros where no data exists
        const feeData = barangays.map((brgy) => {
          const item = data.find(
            (d) => d._id.toUpperCase() === brgy.toUpperCase()
          );
          return item ? item.totalFee : 0;
        });

        setChartData({
          ...chartData,
          series: [{ ...chartData.series[0], data: feeData }],
        });
      } catch (error) {
        console.error("Error fetching fee summary data:", error);
      }
    };

    fetchData();
  }, [timeRange, specificDate, specificWeek, specificMonth, specificYear]);

  const [totalServices, settotalServices] = useState(0);
  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const params = { timeRange: timeRange };
        if (timeRange === "specific") {
          // specificDate is already in ISO format (YYYY-MM-DD)
          params.specificDate = specificDate;
        }
        if (timeRange === "weekly" && specificWeek) {
          // Send only the start of the week to the backend
          const [year, weekNumber] = specificWeek.split("-W");
          const weekStart = moment()
            .isoWeekYear(year)
            .isoWeek(weekNumber)
            .startOf("isoWeek")
            .toISOString();
          params.week = weekStart;
        }
        if (timeRange === "monthly" && specificMonth) {
          const [year, month] = specificMonth.split("-");
          params.year = parseInt(year);
          params.month = parseInt(month);
        }

        if (timeRange === "annual") {
          params.year = specificYear;
        }
        // Make the API request
        const response = await axios.get(
          `${API_LINK}/services/approved_services`,
          {
            params: params,
          }
        );

        const data = response.data;
        settotalServices(data.length);
        console.log("wew", data);
      } catch (error) {
        console.error("Error fetching fee summary data:", error);
      }
    };

    fetchDatas();
  }, [timeRange, specificDate, specificWeek, specificMonth, specificYear]);

  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
  };

  return (
    <div className="mx-4 mt-4 ">
      <div className="flex flex-col scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb lg:overflow-y-scroll lg:overflow-x-hidden lg:h-[calc(100vh_-_95px)]">
          <div className="flex lg:justify-end mb-3 w-full lg:w-auto ">
            <div className="flex flex-col w-full lg:w-auto">
              <div
                id="toggle-count"
                className="flex gap-2 p-2 rounded-lg bg-gray-500 w-full lg:w-auto justify-start items-start overflow-x-auto lg:overflow-x-hidden"
              >
                <button
                  className={`px-3 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium text-sm lg:text-base focus:outline-none focus:ring focus:border-blue-300 ${
                    timeRange === "specific"
                      ? "bg-green-700 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => handleTimeRangeChange("specific")}
                >
                  Specific
                </button>
                <button
                  className={`px-3 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium text-sm lg:text-base focus:outline-none focus:ring focus:border-blue-300 ${
                    timeRange === "today"
                      ? "bg-green-700 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => handleTimeRangeChange("today")}
                >
                  Today
                </button>
                <button
                  className={`px-3 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium text-sm lg:text-base focus:outline-none focus:ring focus:border-blue-300 ${
                    timeRange === "weekly"
                      ? "bg-green-700 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => handleTimeRangeChange("weekly")}
                >
                  Weekly
                </button>
                <button
                  className={`px-3 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium text-sm lg:text-base focus:outline-none focus:ring focus:border-blue-300 ${
                    timeRange === "monthly"
                      ? "bg-green-700 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => handleTimeRangeChange("monthly")}
                >
                  Monthly
                </button>
                <button
                  className={`px-3 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium text-sm lg:text-base focus:outline-none focus:ring focus:border-blue-300 ${
                    timeRange === "annual"
                      ? "bg-green-700 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => handleTimeRangeChange("annual")}
                >
                  Annual
                </button>
              </div>

              <div className="w-full mt-2">
                {timeRange === "specific" && (
                  <div className="flex flex-col md:flex-row md:justify-center md:items-center bg-gray-200 shadow-sm rounded-lg p-2 ">
                    <label className="mr-4 text-sm font-medium text-gray-700">
                      Select Specific Date:
                    </label>
                    <input
                      type="date"
                      value={specificDate}
                      onChange={(e) => setSpecificDate(e.target.value)}
                      className="px-2 py-1 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm text-gray-700"
                    />
                  </div>
                )}

                {timeRange === "weekly" && (
                  <div className="flex flex-col md:flex-row md:justify-center md:items-center bg-gray-200 shadow-sm rounded-lg p-2 ">
                    <label className="mr-4 text-sm font-medium text-gray-700">
                      Select Specific Week:
                    </label>
                    <div className="relative">
                      <input
                        type="week"
                        value={specificWeek}
                        onChange={(e) => setSpecificWeek(e.target.value)}
                        className="px-2 py-1 border-2 border-gray-300 w-full rounded-md focus:outline-none focus:border-blue-500 text-sm text-gray-700"
                      />
                    </div>
                  </div>
                )}

                {timeRange === "monthly" && (
                  <div className="flex flex-col md:flex-row md:justify-center md:items-center bg-gray-200 shadow-sm rounded-lg p-2 ">
                    <label className="mr-4 text-sm font-medium text-gray-700">
                      Select Month:
                    </label>
                    <input
                      className="text-gray-400 px-2 py-1 rounded-md font-medium shadow-sm text-sm border border-black"
                      type="month"
                      id="month"
                      name="month"
                      value={specificMonth} // Directly use specificMonth as value
                      onChange={(e) => setSpecificMonth(e.target.value)} // Update specificMonth with the input's value directly
                    />
                  </div>
                )}

                {timeRange === "annual" && (
                  <div className="flex flex-col md:flex-row md:justify-center md:items-center bg-gray-200 shadow-sm rounded-lg p-2">
                    <label className="mr-4 text-sm font-medium text-gray-700">
                      Select Year:
                    </label>
                    <input
                      type="number"
                      value={specificYear}
                      min="1950"
                      max={new Date().getFullYear() + 10}
                      onChange={(e) =>
                        setSpecificYear(parseInt(e.target.value))
                      }
                      className="px-2 py-1 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm text-gray-700"
                    />
                  </div>
                )}
              </div>

              {/* END OF DATE INPUTS */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="bg-gray-200 rounded-lg shadow-lg p-6">
              <h4 className="text-lg  font-bold mb-3">
                TOTAL APPROVED BARANGAYS SERVICES
              </h4>
              <p className="text-xl text-[#408D51] font-bold">
                {totalServices}
              </p>
            </div>

            <div className="bg-gray-200 rounded-lg shadow-lg p-6">
              <h4 className="text-lg font-bold mb-3">
                TOTAL NUMBER OF REGISTERED RESIDENTS
              </h4>
              <p className="text-xl text-[#408D51] font-bold">
                {totalUsersSum}
              </p>
            </div>
          </div>

          {/* CHARTS */}
          <div className="flex flex-col lg:flex-row lg:space-x-2 w-full ">
            <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5 justify-center items-center">
              <h1 className="mt-5 ml-5 font-medium text-black">
                Total Service Revenue per Barangay
              </h1>
              <div className="flex rounded-xl">
                {series.length > 0 && (
                  <Chart
                    options={options}
                    series={series}
                    type="bar"
                    className="flex w-11/12 rounded-xl"
                  />
                )}
              </div>
            </div>
            <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5 justify-center items-center">
              <h1 className="mt-5 ml-5 font-medium text-black">
                Est. Service Revenue per Barangay
              </h1>
              <div className="flex rounded-xl">
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="bar"
                  className="flex w-11/12 rounded-xl"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-2 w-full ">
            <RRM />
            <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5 justify-center items-center">
              <h1 className="mt-5 ml-5 font-medium text-black">
                Registered Residents per Barangay
              </h1>
              <div className="flex rounded-xl">
                <Chart
                  className="flex w-11/12 rounded-xl "
                  options={chartDatas.options}
                  series={chartDatas.series}
                  type="bar"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-2 w-full ">
            <SRT />
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-2 w-full ">
            <RIB />
          </div>
   
      </div>
    </div>
  );
};

export default Reports;
