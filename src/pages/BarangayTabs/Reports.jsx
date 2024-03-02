import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import API_LINK from "../../config/API";
import Chart from "react-apexcharts";
import moment from "moment";
import GetBrgy from "../../components/GETBrgy/getbrgy";
const Reports = () => {
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [archivedServices, setArchivedServices] = useState([]);
  const [archivedRequests, setArchivedRequests] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const brgy = searchParams.get("brgy");
  const [registeredCount, setRegisteredCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [deniedCount, setDeniedCount] = useState(0);
  const information = GetBrgy(brgy);
  useEffect(() => {
    document.title = "Reports | Barangay E-Services Management";
    const fetchData = async () => {
      try {
        // Fetch services and requests
        const servicesResponse = await axios.get(
          `${API_LINK}/services/?brgy=${brgy}&archived=false`
        );
        const requestsResponse = await axios.get(
          `${API_LINK}/requests/?brgy=${brgy}&archived=false`
        );

        if (servicesResponse.status === 200)
          setServices(servicesResponse.data.result);
        else setServices([]);

        if (requestsResponse.status === 200)
          setRequests(requestsResponse.data.result);

        // Fetch archived requests
        const archivedRequestsResponse = await axios.get(
          `${API_LINK}/requests/?brgy=${brgy}&archived=true`
        );
        if (archivedRequestsResponse.status === 200)
          setArchivedRequests(archivedRequestsResponse.data.result);

        // Fetch archived services
        const archivedServicesResponse = await axios.get(
          `${API_LINK}/services/?brgy=${brgy}&archived=true`
        );
        if (archivedServicesResponse.status === 200)
          setArchivedServices(archivedServicesResponse.data.result);

        // Fetch users
        const activeUsersResponse = await axios.get(
          `${API_LINK}/users/?brgy=${brgy}&type=Resident`
        );
        if (activeUsersResponse.status === 200) {
          setUsers(activeUsersResponse.data.result);
        } else {
          setUsers([]);
        }

        // Fetch archived users
        const announcementsResponse = await axios.get(
          `${API_LINK}/announcement/?brgy=${brgy}&archived=false`
        );

        if (announcementsResponse.status === 200) {
          setAnnouncements(announcementsResponse.data.result);

          // Fetch completed counts for each announcement
          const announcementsData = await Promise.all(
            announcementsResponse.data.result.map(async (announcement) => {
              const completedResponse = await axios.get(
                `${API_LINK}/application/completed?brgy=${brgy}&event_id=${announcement.event_id}`
              );

              if (completedResponse.status === 200) {
                const completedCount = completedResponse.data.completedCount;
                return { ...announcement, completedCount };
              }
            })
          );

          // Use the updated announcementsData with completed counts
          setAnnouncements(announcementsData);
        } else {
          setAnnouncements([]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [brgy]);

  useEffect(() => {
    // Fetch counts for each status
    const getStatusCounts = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/users/all_brgy_resident`,
          {
            params: {
              brgy: brgy,
            },
          }
        );

        const data = response.data[0];

        if (data) {
          const { residents } = data;
          const registeredCount = residents.filter(
            (resident) => resident.status === "Registered"
          ).length;
          const pendingCount = residents.filter(
            (resident) => resident.status === "Pending"
          ).length;
          const deniedCount = residents.filter(
            (resident) => resident.status === "Denied"
          ).length;

          setRegisteredCount(registeredCount);
          setPendingCount(pendingCount);
          setDeniedCount(deniedCount);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Initial fetch
    getStatusCounts();

    // Fetch data every 10 seconds
    const intervalId = setInterval(() => {
      getStatusCounts();
    }, 10000);

    // Clear the interval when the component is unmounted or when brgy changes
    return () => clearInterval(intervalId);
  }, [brgy]); // Dependency on brgy to update counts when barangay changes

  const chartDataResidentStatus = {
    series: [registeredCount, pendingCount, deniedCount],
    options: {
      colors: ["#4caf50", "#ff9800", "#ac4646"], // Colors for Registered, Pending, Denied
      chart: {
        background: "transparent",
      },
      labels: ["Registered", "Pending", "Denied"],
    },
  };

  const [activeResidentCount, setActiveResidentCount] = useState(0);
  const [archivedResidentCount, setArchivedResidentCount] = useState(0);

  useEffect(() => {
    // Fetch data for both isArchived: "true" and isArchived: "false"
    const getResidentIsArchivedData = async () => {
      try {
        const responseTrue = await axios.get(
          `${API_LINK}/users/brgy_resident_isArchived`,
          {
            params: {
              brgy: brgy,
              isArchived: "true",
            },
          }
        );

        const responseFalse = await axios.get(
          `${API_LINK}/users/brgy_resident_isArchived`,
          {
            params: {
              brgy: brgy,
              isArchived: "false",
            },
          }
        );

        const dataTrue = responseTrue.data[0];
        const dataFalse = responseFalse.data[0];

        const activeResidentCount = dataFalse ? dataFalse.residents.length : 0;
        const archivedResidentCount = dataTrue ? dataTrue.residents.length : 0;

        // Update state variables
        setActiveResidentCount(activeResidentCount);
        setArchivedResidentCount(archivedResidentCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Initial fetch
    getResidentIsArchivedData();

    // Fetch data every 10 seconds
    const intervalId = setInterval(() => {
      getResidentIsArchivedData();
    }, 10000);

    // Clear the interval when the component is unmounted or when brgy changes
    return () => clearInterval(intervalId);
  }, [brgy]);

  const chartDataResidentIsArchived = {
    series: [activeResidentCount, archivedResidentCount],
    options: {
      colors: ["#4caf50", "#ac4646"], // Colors for Active, Archived
      chart: {
        background: "transparent",
      },
      labels: ["Active Residents", "Archived Residents"],
    },
  };

  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

  const [statusPercentages, setStatusPercentages] = useState([]);

  useEffect(() => {
    const fetchTotalStatusRequests = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/requests/all_status_requests`,
          {
            params: {
              brgy: brgy,
            },
          }
        );

        const data = response.data;

        console.log("data for total status requests: ", data);

        // Assuming the API response has the structure similar to statusPercentages
        setStatusPercentages(data);
      } catch (error) {
        console.error("Error fetching total status requests:", error);
      }
    };

    // Initial fetch
    fetchTotalStatusRequests();

    // Fetch data every 10 seconds
    const intervalId = setInterval(() => {
      fetchTotalStatusRequests();
    }, 10000);

    // Clear the interval when the component is unmounted or when brgy changes
    return () => clearInterval(intervalId);
  }, [brgy]);

  const chartDataStatusPercentage = {
    series: statusPercentages.map((percentage) => percentage.totalRequests),
    options: {
      colors: statusPercentages.map((percentage) => {
        switch (percentage._id) {
          case "Transaction Completed":
            return "#007069";
          case "Rejected":
            return "#99364D";
          case "Pending":
            return "#d99c3f";
          case "Paid":
            return "#5B21B6";
          case "Processing":
            return "#1E40AF";
          case "Cancelled":
            return "#9e9e9e";
          default:
            return "#000000"; // Default color, modify as needed
        }
      }),
      chart: {
        background: "transparent",
      },
      labels: statusPercentages.map((percentage) => percentage._id),
    },
  };

  //Inquiries Percentage:
  const [statusPercentagesInquiries, setStatusPercentagesInquiries] = useState(
    []
  );

  const chartDataInquiriesStatusPercentage = {
    series: statusPercentagesInquiries.map(
      (percentage) => percentage.totalRequests
    ),
    options: {
      colors: statusPercentagesInquiries.map((percentage) => {
        switch (percentage._id) {
          case "Completed":
            return "#007069";
          case "Pending":
            return "#99364D";
          case "In Progress":
            return "#d99c3f";
          default:
            return "#000000"; // Default color, modify as needed
        }
      }),
      chart: {
        background: "transparent",
      },
      labels: statusPercentagesInquiries.map((percentage) => percentage._id),
    },
  };

  useEffect(() => {
    const fetchTotalStatusInquiries = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/inquiries/all_status_inquiries`,
          {
            params: {
              brgy: brgy,
            },
          }
        );

        const data = response.data;

        console.log("data for total status inquiries: ", data);

        // Assuming the API response has the structure similar to serviceSummary
        setStatusPercentagesInquiries(data);
      } catch (error) {
        console.error("Error fetching total status inquiries:", error);
      }
    };

    // Initial fetch
    fetchTotalStatusInquiries();

    // // Fetch data every 10 seconds
    const intervalId = setInterval(() => {
      fetchTotalStatusInquiries();
    }, 10000);

    // Clear the interval when the component is unmounted or when brgy changes
    return () => clearInterval(intervalId);
  }, [brgy]);

  const getPopulationGrowthData = () => {
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    const activePopulationData = Array.from({ length: 6 }, (_, index) => {
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - index,
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - index + 1,
        0
      );

      const activePopulationCount = users.filter(
        (user) => new Date(user.createdAt) <= endOfMonth
      ).length;

      return activePopulationCount;
    }).reverse();

    const archivedPopulationData = Array.from({ length: 6 }, (_, index) => {
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - index,
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - index + 1,
        0
      );

      const archivedPopulationCount = archivedUsers.filter(
        (user) => new Date(user.createdAt) <= endOfMonth
      ).length;

      return archivedPopulationCount;
    }).reverse();

    const totalResidentsData = Array.from({ length: 6 }, (_, index) => {
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - index,
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - index + 1,
        0
      );

      const totalResidentsCount =
        users.filter((user) => new Date(user.createdAt) <= endOfMonth).length +
        archivedUsers.filter((user) => new Date(user.createdAt) <= endOfMonth)
          .length;

      return totalResidentsCount;
    }).reverse();

    return {
      series: [
        {
          name: "Active Residents",
          data: activePopulationData,
        },
        {
          name: "Archived Residents",
          data: archivedPopulationData,
        },
        {
          name: "Total Residents",
          data: totalResidentsData,
        },
      ],
      options: {
        colors: ["#4b7c80", "#ff0000", "#0000ff"], // Adjust colors as needed
        chart: {
          background: "transparent",
        },
        xaxis: {
          categories: Array.from({ length: 6 }, (_, index) =>
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() - index,
              1
            ).toLocaleString("en-us", {
              month: "short",
            })
          ).reverse(),
          labels: {
            style: {
              fontSize: "9px",
            },
          },
        },
      },
    };
  };

  const chartDataPopulationGrowth = getPopulationGrowthData();

  const getCompletedRequestsLastSixMonths = () => {
    const startDate = sixMonthsAgo.toISOString();
    const endDate = currentDate.toISOString();
    return requests.filter(
      (request) =>
        request.status === "Transaction Completed" &&
        new Date(request.updatedAt) >= new Date(startDate) &&
        new Date(request.updatedAt) <= new Date(endDate)
    );
  };

  const completedRequestsLastSixMonths = getCompletedRequestsLastSixMonths();
  const completionRateData = Array.from({ length: 6 }, (_, index) => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - index,
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - index + 1,
      0
    );

    const completedCount = completedRequestsLastSixMonths.filter(
      (request) =>
        new Date(request.updatedAt) >= startOfMonth &&
        new Date(request.updatedAt) <= endOfMonth
    ).length;

    return completedCount;
  }).reverse();

  const chartDataCompletionRate = {
    series: [
      {
        name: "Completed Requests",
        data: completionRateData,
      },
    ],
    options: {
      colors: ["#4b7c80"],
      chart: {
        background: "transparent",
      },
      xaxis: {
        categories: Array.from({ length: 6 }, (_, index) =>
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - index,
            1
          ).toLocaleString("en-us", {
            month: "short",
          })
        ).reverse(),
        labels: {
          style: {
            fontSize: "9px",
          },
        },
      },
    },
  };

  // Use completedCount instead of attendees.length
  const totalAttendees = announcements.map((announcement) => ({
    announcement_title: announcement.title,
    attendees: announcement.completedCount || 0, // Use completedCount, default to 0 if undefined
  }));

  // Sort the total attendees array in descending order
  totalAttendees.sort((a, b) => b.attendees - a.attendees);

  // Chart data for trend of attendance in events
  const chartDataAttendanceTrend = {
    series: [
      {
        name: "Total Attendees",
        data: totalAttendees.map((item) => item.attendees),
      },
    ],
    options: {
      colors: ["#4b7c80"],
      chart: {
        background: "transparent",
      },
      xaxis: {
        categories: totalAttendees.map((item) => item.announcement_title),
        labels: {
          style: {
            fontSize: "9px",
          },
        },
      },
    },
  };

  // Function to get the total number of events created each month
  const eventsCreatedEachMonth = Array.from({ length: 6 }, (_, index) => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - index,
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - index + 1,
      0
    );

    const eventsCount = requests.filter(
      (announcement) =>
        new Date(announcement.createdAt) >= startOfMonth &&
        new Date(announcement.createdAt) <= endOfMonth
    ).length;

    return eventsCount;
  }).reverse();

  // Chart data for number of events organized each month
  const chartDataEventsOrganized = {
    series: [
      {
        name: "Number of Events",
        data: eventsCreatedEachMonth,
      },
    ],
    options: {
      colors: ["#4b7c80"],
      chart: {
        background: "transparent",
      },
      xaxis: {
        categories: Array.from({ length: 6 }, (_, index) =>
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - index,
            1
          ).toLocaleString("en-us", {
            month: "short",
          })
        ).reverse(),
        labels: {
          style: {
            fontSize: "9px",
          },
        },
      },
    },
  };

  const [timeRange, setTimeRange] = useState("today");
  const [specificDate, setSpecificDate] = useState(() => {
    return new Date(); // Initializes the state to today's date as a Date object
  });
  const [specificWeek, setSpecificWeek] = useState(""); // Default to current date
  const [specificYear, setSpecificYear] = useState(new Date().getFullYear());
  const [specificMonth, setSpecificMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}`
  );

  const [totalMonthlyRevenue, setTotalMonthlyRevenue] = useState(0);

  useEffect(() => {
    const fetchFeeSummary = async () => {
      try {
        const params = { timeRange: timeRange };

        if (timeRange === "specific") {
          params.specificDate = specificDate;
        }

        if (timeRange === "weekly" && specificWeek) {
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

        // Make the API request using the GetMonthlyRevenueBrgy function
        const response = await axios.get(
          `${API_LINK}/requests/get_monthly_revenue_brgy`,
          {
            params: {
              ...params,
              brgy: brgy,
            },
          }
        );

        const data = response.data;

        // Assuming your data structure is an array of objects
        if (data.length > 0) {
          // Assuming the totalFee property is present in each object
          const totalMonthlyRevenue = data.reduce(
            (total, item) => total + item.totalFee,
            0
          );
          setTotalMonthlyRevenue(totalMonthlyRevenue);
        } else {
          setTotalMonthlyRevenue(0);
        }
      } catch (error) {
        console.error("Error fetching monthly fee summary:", error);
      }
    };

    fetchFeeSummary();
  }, [
    timeRange,
    specificDate,
    specificWeek,
    specificMonth,
    specificYear,
    brgy,
  ]);

  // Monthly Revenue Data Calculation
  // const currentDate = new Date();

  const monthlyRevenueData = Array.from({ length: 6 }, (_, index) => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - index,
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - index + 1,
      0
    );

    const revenue =
      index === 0
        ? totalMonthlyRevenue // Use totalMonthlyRevenue for the current month
        : requests
            .filter(
              (request) =>
                request.status === "Transaction Completed" &&
                new Date(request.updatedAt) >= startOfMonth &&
                new Date(request.updatedAt) <= endOfMonth
            )
            .reduce((total, request) => total + request.fee, 0);

    return revenue;
  }).reverse();

  // Chart Data
  const chartDataRevenue = {
    series: [
      {
        name: "Revenue",
        data: monthlyRevenueData,
      },
    ],
    options: {
      colors: ["#4b7c80"],
      chart: {
        background: "transparent",
      },
      xaxis: {
        categories: Array.from({ length: 6 }, (_, index) =>
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - index,
            1
          ).toLocaleString("en-us", {
            month: "short",
          })
        ).reverse(),
        labels: {
          style: {
            fontSize: "9px",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return "PHP " + value;
          },
        },
      },
    },
  };

  const [estimatedRevenuess, setEstimatedRevenuess] = useState(0);

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
        const response = await axios.get(
          `${API_LINK}/requests/est_brgy_revenue`,
          {
            params: {
              ...params,
              brgy: brgy,
            },
          }
        );

        const data = response.data;

        // Assuming your data structure is an array with a single object
        if (data.length > 0) {
          const { totalFee } = data[0]; // Assuming the totalFee property is present
          setEstimatedRevenuess(totalFee);
        } else {
          // If there is no data, set estimatedRevenuess to 0
          setEstimatedRevenuess(0);
        }
      } catch (error) {
        console.error("Error fetching fee summary:", error);
      }
    };

    fetchFeeSummary();
  }, [timeRange, specificDate, specificWeek, specificMonth, specificYear]);

  const [totalFees, setTotalFees] = useState(0);

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

        // Make the API request using the GetRevenue function
        const response = await axios.get(
          `${API_LINK}/requests/get_brgy_revenue`,
          {
            params: {
              ...params,
              brgy: brgy, // Add your barangay value here
            },
          }
        );

        const data = response.data;

        // Assuming your data structure is an array with a single object
        if (data.length > 0) {
          const { totalFee } = data[0]; // Assuming the totalFee property is present
          setTotalFees(totalFee);
        } else {
          // If there is no data, set totalFees to 0
          setTotalFees(0);
        }
      } catch (error) {
        console.error("Error fetching fee summary:", error);
      }
    };

    fetchFeeSummary();
  }, [timeRange, specificDate, specificWeek, specificMonth, specificYear]);

  const [chartDataOverallRevenue, setChartDataOverallRevenue] = useState({
    series: [
      {
        name: "Transaction Completed",
        data: [],
      },
      {
        name: "Paid",
        data: [],
      },
    ],
    options: {
      colors: ["#4b7c80", "#ffa500"],
      chart: {
        background: "transparent",
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: "9px",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return "PHP " + value;
          },
        },
      },
    },
  });

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const params = { timeRange: timeRange };

        if (timeRange === "specific") {
          params.specificDate = specificDate;
        }

        if (timeRange === "weekly" && specificWeek) {
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

        const response = await axios.get(
          `${API_LINK}/requests/get_revenue_brgy_requests`,
          {
            params: {
              ...params,
              brgy: brgy,
            },
          }
        );

        const data = response.data;

        if (data.length > 0) {
          const categories = data.map((item) => item._id.service_name);
          const transactionCompletedData = data.map(
            (item) => item.TransactionCompleted
          );
          const paidData = data.map((item) => item.Paid);

          setChartDataOverallRevenue({
            series: [
              {
                name: "Transaction Completed",
                data: transactionCompletedData,
              },
              {
                name: "Paid",
                data: paidData,
              },
            ],
            options: {
              ...chartDataOverallRevenue.options,
              xaxis: {
                categories: categories,
                labels: {
                  style: {
                    fontSize: "9px",
                  },
                },
              },
            },
          });
        } else {
          // If there is no data, set chartDataOverallRevenue to initial state or handle as needed
          setChartDataOverallRevenue({
            series: [
              {
                name: "Transaction Completed",
                data: [],
              },
              {
                name: "Paid",
                data: [],
              },
            ],
            options: {
              colors: ["#4b7c80", "#ffa500"],
              chart: {
                background: "transparent",
              },
              xaxis: {
                categories: [],
                labels: {
                  style: {
                    fontSize: "9px",
                  },
                },
              },
            },
          });
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();

    const intervalId = setInterval(() => {
      fetchRevenueData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [
    timeRange,
    specificDate,
    specificWeek,
    specificMonth,
    specificYear,
    brgy,
  ]);

  const [totalServicess, setTotalServicess] = useState(0);
  const [chartDataOverallAvailed, setChartDataOverallAvailed] = useState({
    series: [
      {
        name: "Total Availed",
        data: [],
      },
    ],
    options: {
      colors: ["#4b7c80"],
      chart: {
        background: "transparent",
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: "9px",
          },
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

        // Make the API request using the GetRevenue function
        const response = await axios.get(
          `${API_LINK}/requests/availed_services`,
          {
            params: {
              ...params,
              brgy: brgy, // Add your barangay value here
            },
          }
        );

        const data = response.data;

        console.log("data for total availed: ", data);

        // Assuming your data structure is an array with multiple objects
        if (data.length > 0) {
          // Calculate totalServices by summing up totalRequests for all statuses
          const totalServices = data.reduce(
            (acc, statusObj) => acc + statusObj.totalRequests,
            0
          );
          setTotalServicess(totalServices);

          // Create chart data based on the fetched data
          const chartData = {
            series: [
              {
                name: "Total Availed",
                data: data.map((item) => item.totalRequests),
              },
            ],
            options: {
              colors: ["#4b7c80"],
              chart: {
                background: "transparent",
              },
              xaxis: {
                categories: data.map((item) => item._id), // Assuming service_name is in _id field
                labels: {
                  style: {
                    fontSize: "9px",
                  },
                },
              },
            },
          };

          setChartDataOverallAvailed(chartData);
        } else {
          // If there is no data, set totalServices to 0 and display the message
          setTotalServicess(0);
          // You can customize the message as needed
          setChartDataOverallAvailed({
            series: [
              {
                name: "Total Availed",
                data: [0],
              },
            ],
            options: {
              colors: ["#4b7c80"],
              chart: {
                background: "transparent",
              },
              xaxis: {
                categories: ["No Availed Service for Specific Date"],
                labels: {
                  style: {
                    fontSize: "9px",
                  },
                },
              },
            },
          });
        }
      } catch (error) {
        console.error("Error fetching fee summary:", error);
      }
    };

    fetchFeeSummary();
  }, [
    timeRange,
    specificDate,
    specificWeek,
    specificMonth,
    specificYear,
    brgy,
  ]);

  const [completedRequests, setCompletedRequests] = useState(0);
  useEffect(() => {
    const fetchCompletedRequests = async () => {
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

        // Make the API request using the GetRevenue function
        const response = await axios.get(
          `${API_LINK}/requests/completed_requests`,
          {
            params: {
              ...params,
              brgy: brgy, // Add your barangay value here
            },
          }
        );

        const data = response.data;

        console.log("data for completed requests: ", data);

        // Assuming your data structure is an array with multiple objects
        if (data.length > 0) {
          // Calculate totalCompletedRequests by summing up totalRequests for "Transaction Completed" status
          const totalCompletedRequests = data.reduce(
            (acc, statusObj) =>
              acc +
              (statusObj._id === "Transaction Completed"
                ? statusObj.totalRequests
                : 0),
            0
          );
          setCompletedRequests(totalCompletedRequests);
        } else {
          // If there is no data, set completedRequests to 0
          setCompletedRequests(0);
        }
      } catch (error) {
        console.error("Error fetching completed requests:", error);
      }
    };

    fetchCompletedRequests();
  }, [
    timeRange,
    specificDate,
    specificWeek,
    specificMonth,
    specificYear,
    brgy,
  ]);

  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
  };

  // Function to handle specific date change
  const handleSpecificDateChange = (date) => {
    setSpecificDate(date);
    // You can perform additional logic here if needed
  };

  return (
    <div className="">
      {/* Body */}
      <div>
        {/* Header */}

        <div className="flex lg:justify-end mb-3 w-full lg:w-auto ">
          <div className="flex flex-col w-full lg:w-auto">
            <div
              id="toggle-count"
              className="flex p-0.5 bg-gray-700 rounded-lg w-full lg:w-auto items-center overflow-y-hidden"
              style={{ backgroundColor: information?.theme?.primary }}
            >
              <button
                className={`px-3 py-2 w-full   bg-gray-700 text-gray-800 rounded-l-lg font-medium text-sm lg:text-base  focus:outline-none   ${
                  timeRange === "specific"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200 text-white"
                }`}
                style={{
                  backgroundColor:
                    timeRange === "specific"
                      ? information?.theme?.secondary
                      : information?.theme?.primary,
                  color: timeRange === "specific" ? "#ffffff" : "#ffffff",
                }}
                onClick={() => handleTimeRangeChange("specific")}
              >
                Specific
              </button>
              <button
                className={`px-3 py-2 w-full  bg-gray-700 text-gray-800 rounded-l-lg font-medium text-sm lg:text-base  focus:outline-none ${
                  timeRange === "today"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200 text-white"
                }`}
                style={{
                  backgroundColor:
                    timeRange === "today"
                      ? information?.theme?.secondary
                      : information?.theme?.primary,
                  color: timeRange === "specific" ? "#ffffff" : "#ffffff",
                }}
                onClick={() => handleTimeRangeChange("today")}
              >
                Today
              </button>
              <button
                className={`px-3 py-2 w-full  bg-gray-700 text-gray-800 rounded-l-lg font-medium text-sm lg:text-base  focus:outline-none ${
                  timeRange === "weekly"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200 text-white"
                }`}
                style={{
                  backgroundColor:
                    timeRange === "weekly"
                      ? information?.theme?.secondary
                      : information?.theme?.primary,
                  color: timeRange === "specific" ? "#ffffff" : "#ffffff",
                }}
                onClick={() => handleTimeRangeChange("weekly")}
              >
                Weekly
              </button>
              <button
                className={`px-3 py-2 w-full bg-gray-700 text-gray-800  rounded-l-lg font-medium text-sm lg:text-base  focus:outline-none ${
                  timeRange === "monthly"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200 text-white"
                }`}
                style={{
                  backgroundColor:
                    timeRange === "monthly"
                      ? information?.theme?.secondary
                      : information?.theme?.primary,
                  color: timeRange === "specific" ? "#ffffff" : "#ffffff",
                }}
                onClick={() => handleTimeRangeChange("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-3 py-2 w-full  bg-gray-700 text-gray-800 rounded-l-lg font-medium text-sm lg:text-base  focus:outline-none ${
                  timeRange === "annual"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200 text-white"
                }`}
                style={{
                  backgroundColor:
                    timeRange === "annual"
                      ? information?.theme?.secondary
                      : information?.theme?.primary,
                  color: timeRange === "specific" ? "#ffffff" : "#ffffff",
                }}
                onClick={() => handleTimeRangeChange("annual")}
              >
                Annual
              </button>
            </div>

            {/* DATE INPUTS */}
            <div className="w-full mt-2">
              {timeRange === "specific" && (
                <div className="flex flex-col md:flex-row md:justify-center md:items-center bg-gray-200 shadow-sm rounded-lg p-2 ">
                  <label className="mr-4 text-sm font-medium text-gray-700">
                    Select Specific Date:
                  </label>
                  <input
                    type="date"
                    value={specificDate.toISOString().split("T")[0]}
                    onChange={(e) => setSpecificDate(new Date(e.target.value))}
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
                    onChange={(e) => setSpecificYear(parseInt(e.target.value))}
                    className="px-2 py-1 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm text-gray-700"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:items-center shadow-sm rounded-xl gap-3 ">
          <div
            className="flex flex-col p-4  rounded-xl  bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
            style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}
          >
            <h4 className="text-white mb-1 text-xs lg:text-md">
              TOTAL SERVICES TAKEN
            </h4>
            <div className="flex gap-x-1">
              <p
                data-hs-toggle-count='{"target": "#toggle-count", "min": 19, "max": 29}'
                className="text-white font-semibold text-xl lg:text-3xl "
              >
                {totalServicess}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col p-4  rounded-xl bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
            style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}
          >
            <div className="flex justify-between">
              <h4 className="text-white mb-1 text-xs lg:text-md">
                COMPLETED SERVICES
              </h4>
            </div>
            <div className="flex gap-x-1">
              <p
                data-hs-toggle-count='{"target": "#toggle-count", "min": 89, "max": 99}'
                className="text-gray-800 font-semibold text-xl lg:text-3xl dark:text-gray-200"
              >
                {completedRequests}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col p-4  rounded-xl bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
            style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}
          >
            <div className="flex justify-between">
              <h4 className="text-white mb-1 text-xs lg:text-md">
                ESTIMATED OVERALL REVENUE
              </h4>
            </div>
            <div className="flex gap-x-1">
              <span className="text-md lg:text-xl font-normal text-gray-800 dark:text-gray-200">
                PHP
              </span>
              <p
                data-hs-toggle-count='{"target": "#toggle-count", "min": 89, "max": 99}'
                className="text-gray-800 font-semibold text-xl lg:text-3xl dark:text-gray-200"
              >
                {estimatedRevenuess}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col p-4  rounded-xl bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] "
            style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}
          >
            <h4 className="text-white mb-1 text-xs lg:text-md">
              CURRENT REVENUE FROM SERVICES
            </h4>
            <div className="flex gap-x-1">
              <span className="text-md lg:text-xl font-normal text-gray-800 dark:text-gray-200">
                PHP
              </span>
              <p
                data-hs-toggle-count='{"target": "#toggle-count", "min": 129, "max": 149}'
                className="text-gray-800 font-semibold text-xl lg:text-3xl dark:text-gray-200"
              >
                {totalFees}
              </p>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="flex flex-col lg:flex-row lg:space-x-2 w-full">
          <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5">
            <h1 className="mt-5 ml-5 font-medium text-black">
              REQUESTED SERVICES
            </h1>
            <div className="flex rounded-xl">
              <Chart
                type="bar"
                className="flex w-full rounded-xl"
                series={chartDataOverallAvailed.series}
                options={chartDataOverallAvailed.options}
              />
            </div>
          </div>

          <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5">
            <h1 className="mt-5 ml-5 font-medium text-black">
              REVENUE FROM SERVICES
            </h1>
            <div className="flex rounded-xl">
              <Chart
                type="bar"
                className="flex w-full rounded-xl"
                series={chartDataOverallRevenue.series}
                options={chartDataOverallRevenue.options}
              />
            </div>
          </div>
        </div>

        {/* CHARTS 2 */}
        <div className="flex flex-col lg:flex-row lg:space-x-2 w-full">
          <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5">
            <h1 className="mt-5 ml-5 font-medium text-black">
              RESIDENT STATUS CHART
            </h1>
            <div className="flex rounded-xl justify-center items-center">
              <Chart
                type="pie"
                className="flex rounded-xl justify-center w-[400px] lg:w-[300px] xl:w-[400px] xxl:w-[500px] my-10"
                series={chartDataResidentStatus.series}
                options={chartDataResidentStatus.options}
              />
            </div>
          </div>

          <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5">
            <h1 className="mt-5 ml-5 font-medium text-black">
              ACTIVE AND ARCHIVED RESIDENTS
            </h1>
            <div className="flex rounded-xl justify-center items-center">
              <Chart
                type="pie"
                className="flex rounded-xl items-center justify-center w-[400px] lg:w-[300px] xl:w-[400px] xxl:w-[540px] my-10"
                series={chartDataResidentIsArchived.series}
                options={chartDataResidentIsArchived.options}
              />
            </div>
          </div>
        </div>

        {/* CHARTS 3 */}
        <div className="flex flex-col lg:flex-row lg:space-x-2 w-full">
          <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5">
            <h1 className="mt-5 ml-5 font-medium text-black">
              SERVICE REQUEST PERCENTAGE
            </h1>
            <div className="flex justify-center items-center rounded-xl">
              <Chart
                type="pie"
                className="flex rounded-xl justify-center w-[500px] lg:w-[300px] xl:w-[400px] xxl:w-[620px] my-10"
                series={chartDataStatusPercentage.series}
                options={chartDataStatusPercentage.options}
              />
            </div>
          </div>

          <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5">
            <h1 className="mt-5 ml-5 font-medium text-black">
              INQUIRIES PERCENTAGE
            </h1>
            <div className="flex justify-center items-center rounded-xl">
              <Chart
                type="pie"
                className="flex rounded-xl justify-center w-[500px] lg:w-[300px] xl:w-[400px] xxl:w-[550px] my-10"
                series={chartDataInquiriesStatusPercentage.series}
                options={chartDataInquiriesStatusPercentage.options}
              />
            </div>
          </div>

          {/* <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5">
            <h1 className="mt-5 ml-5 font-medium text-black">
              SERVICE REQUEST COMPLETION RATE (FOR THE PAST 6 MONTHS)
            </h1>
            <div className="flex rounded-xl">
              <Chart
                type="line"
                className="flex w-full rounded-xl flex-col "
                series={chartDataCompletionRate.series}
                options={chartDataCompletionRate.options}
              />
            </div>
          </div> */}
        </div>

        {/* CHARTS 4 */}
        <div className="flex flex-col lg:flex-row lg:space-x-2 w-full ">
          <div className="flex flex-col bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5">
            <h1 className="mt-5 ml-5 font-medium text-black">
              OVERALL TRENDING EVENTS
            </h1>
            <div className="flex justify-center items-center rounded-xl">
              <Chart
                type="bar"
                className="flex w-full justify-center rounded-xl xl:w-[500px] xxl:w-full mt-5"
                series={chartDataAttendanceTrend.series}
                options={chartDataAttendanceTrend.options}
              />
            </div>
          </div>

          {/* <div className="flex flex-col bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5">
            <h1 className="mt-5 ml-5 font-medium text-black">
              OVERALL NUMBER OF CREATED EVENTS (FOR THE PAST 6 MONTHS)
            </h1>
            <div className="flex justify-center items-center rounded-xl">
              <Chart
                type="line"
                className="flex w-full justify-center rounded-xl xl:w-[500px] xxl:w-full mt-5"
                series={chartDataEventsOrganized.series}
                options={chartDataEventsOrganized.options}
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Reports;
