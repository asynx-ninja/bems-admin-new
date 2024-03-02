import React, { useEffect, useState, useRef } from "react";
import { FaCamera } from "react-icons/fa";
// import banner from "../assets/image/1.png";
import { useLocation } from "react-router-dom";
import header from "../assets/image/notif-header-1.png";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import API_LINK from "../config/API";

const ViewNotifications = ({ setNotification }) => {
  const location = useLocation();
  const [searchParams2, setSearchParams2] = useSearchParams();
  const brgy = searchParams2.get("brgy");
  const id = searchParams2.get("id");
  const searchParams = new URLSearchParams(location.search);
  const notificationData = searchParams.get("notification");
  const notification = notificationData
    ? JSON.parse(decodeURIComponent(notificationData))
    : null;
  console.log("Notification Passed: ", notification);

  const dateFormat = (date) => {
    const eventdate = date === undefined ? "" : date.substr(0, 10);
    return eventdate;
  };

  const TimeFormat = (date) => {
    if (!date) return "";

    const formattedTime = moment(date).format("hh:mm A");
    return formattedTime;
  };

  useEffect(() => {
    const getSpecificID = async () => {
      try {
        const id = notification._id; // Replace with the actual notification ID

        const response = await axios.get(
          `${API_LINK}/notification/get_id/?id=${id}`
        );

        console.log("itoba", response.data[0]);
        // Handle the response data here
      } catch (error) {
        console.error(error);
        // Handle the error here
      }
    };

    getSpecificID();
  }, []);

  useEffect(() => {
    const updateReadBy = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/notification/check/?user_id=${id}&notification_id=${notification._id}`
        );
        const isRead = response.data.read_by.some(
          (item) => item.readerId === id
        );
        console.log("itoulit", response.data);

        if (response.status === 200) {
          if (!isRead) {
            // Proceed with updating the 'read_by' array
            const updateResponse = await axios.patch(
              `${API_LINK}/notification/?notification_id=${notification._id}`,
              {
                readerId: id,
              }
            );

            console.log("Update response", updateResponse.data);

          } else {
            // User has already read the notification, do nothing
            console.log("User has already read the notification");
          }
        }
      } catch (error) {
        console.error(error);
        // Handle the error here
      }
    };

    updateReadBy();
  }, []);

  return (
    <div>
      <div className="mx-4 overflow-y-auto lg:mt-[1rem] mt-0 scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb h-[calc(100vh_-_100px)] lg:h-[calc(100vh_-_100px)]">
        <div className="flex flex-col">
          <div className="relative w-full border rounded-3xl">
            <div className="relative">
              <div className="absolute inset-0  rounded-t-2xl bg-gray-900 opacity-40"></div>
              <img
                className="h-[200px] lg:h-[330px] w-full  rounded-t-2xl object-cover"
                src={header}
                alt=""
              />
            </div>
            <div className="absolute md:top-[16%] lg:top-[28%] transform -translate-y-1/2 flex justify-center w-full">
              <div className="flex flex-col items-center">
                <div className="relative sm:w-32 md:w-full lg:w-56 lg:h-56 ">
                  <div className="w-[130px] h-[130px] md:w-[200px] md:h-[200px] lg:w-full lg:h-full  lg:mt-0 mt-8 flex mx-auto justify-center overflow-hidden rounded-full object-cover border-[5px] border-[#295141]">
                    <img
                      id="pfp"
                      className="w-full h-full object-cover"
                      alt="Profile"
                      src={notification.logo.link}
                    />
                  </div>
                </div>
                <h6 className="font-bold mt-2 lg:text-normal"></h6>
                <p className="text-sm lg:text-[14px] py-2 leading-[10px]"></p>
              </div>
            </div>

            <div className="flex flex-col bg-white p-5  text-black justify-center items-center mx-auto rounded-lg mt-28 lg:mt-36 lg:w-full shadow-md text-center">
              <div className="border-b-[2px] w-full mb-2 pb-5 border-b-gray-200">
                <h6 className="font-bold mb-2 uppercase  text-normal sm:text-xl">
                  {notification.compose.subject}
                </h6>
                <span className="font-light mb-2 uppercase text-normal sm:text-md">
                  {dateFormat(notification.createdAt) || ""} at{" "}
                  {TimeFormat(notification.createdAt) || ""}
                </span>
              </div>
              <div className="lg:flex sm:grid lg:py-0 py-2 h-[600px] w-full overflow-hidden overflow-y-auto gap-6 justify-center items-center mx-auto">
                <h5 className="md:px-5 py-10 whitespace-pre-line text-left">
                  {notification.compose.message}
                </h5>
              </div>
            </div>
            <Link
              to={`/dashboard/?id=${id}&brgy=${brgy}`}
              className="w-full"
              onClick={() => {
                window.innerWidth >= 300 && window.innerWidth <= 1920
                  ? document
                      .getQuerySelector("[data-hs-overlay-backdrop-template]")
                      .remove()
                  : null;
              }}
            >
              <button
                type="button"
                className="h-[2.5rem] w-full py-1 px-6  gap-2 rounded-b-xl borde text-sm font-base bg-teal-700 text-white shadow-sm uppercase"
              >
                RETURN TO {notification.compose.go_to}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNotifications;
