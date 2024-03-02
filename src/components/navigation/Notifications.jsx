import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import header from "../../assets/image/bg-sidebar.jpg";
import { FaBell } from "react-icons/fa";
import ViewNotification from "./ViewNotification";
import API_LINK from "../../config/API";
import { MdEvent } from "react-icons/md";
import { Link } from "react-router-dom";
import moment from "moment";
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [notification, setNotification] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const brgy = "MUNISIPYO";
  const id = searchParams.get("id");
  const [userData, setUserData] = useState({});
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_LINK}/users/specific/${id}`);
        console.log(res.data);
        const res1 = await axios.get(
          `${API_LINK}/brgyinfo/?brgy=${brgy}&logo=true`
        );

        if (res.status === 200 && res1.status === 200) {
          setUserData(res.data[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [id, brgy]);
  const notificationSound = new Audio("/notification/notif.mp3");
  useEffect(() => {
 
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/notification/?user_id=${userData.user_id}&area=MUNISIPYO&type=Municipality`
        );
        console.log(response.data);
        if (response.status === 200) {
          const notificationsWithTimestamp = response.data.map(
            (notification) => {
              const notificationDate = moment(notification.createdAt);
              const now = moment();
              const timeDiff = moment.duration(now.diff(notificationDate));
              let timeAgo = "";

              if (timeDiff.asMinutes() < 60) {
                timeAgo = `${Math.floor(timeDiff.asMinutes())} minutes ago`;
              } else if (timeDiff.asHours() < 24) {
                timeAgo = `${Math.floor(timeDiff.asHours())} hours ago`;
              } else if (timeDiff.asDays() === 1) {
                timeAgo = "Yesterday at " + notificationDate.format("h:mm A");
              } else {
                timeAgo = notificationDate.format("ddd [at] MMM D, h:mm A");
              }

              return {
                ...notification,
                timestamp: timeAgo,
              };
            }
          );

          const unreadCount = notificationsWithTimestamp.filter(
            (notification) =>
              notification.read_by.every((item) => item.readerId !== id)
          ).length;

          // play sound if there are new notifications
          if (unreadCount > unreadNotifications) {
            notificationSound.currentTime = 0; // Reset the audio to the beginning
            notificationSound.play();
          }

          setNotifications(notificationsWithTimestamp);
          setUnreadNotifications(unreadCount);
        } else {
          setNotifications([]);
          setUnreadNotifications(0);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
        setUnreadNotifications(0);
      }
    };

    fetchNotifications();
    // const intervalId = setInterval(() => {
    //   fetchNotifications();
    // }, 3000);

    // return () => {
    //   clearInterval(intervalId);
    // };
  }, [brgy, unreadNotifications]);

  const handleView = (item) => {
    setNotification(item);
  };

  return (
    <>
      <div className="hs-dropdown relative inline-flex sm:[--placement:bottom] md:[--placement:bottom-left]">
        <button
          id="hs-dropdown"
          type="button"
          className={`m-1 ms-0 relative flex justify-center items-center h-[2.875rem] w-[2.875rem] text-sm font-semibold text-white shadow-sm hover:bg-[#408D51] hover:rounded-xl disabled:opacity-50 disabled:pointer-events-none `}
          onClick={() => setIsButtonClicked(!isButtonClicked)}
        >
          <FaBell size={20} />
          {notifications && notifications.length > 0 && (
            <span className="flex absolute top-0 end-0 h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 dark:bg-red-600"></span>
              <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-500">
                {unreadNotifications}
              </span>
            </span>
          )}
        </button>
        <ul
          className="bg-[#e2e2e2] border-4 z-10 shadow-xl border-[#58b397] hs-dropdown-menu scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb overflow-y-scroll w-[500px] h-96 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden rounded-lg"
          aria-labelledby="hs-dropdown"
        >
          <div className="flex items-center p-4 bg-[#f8f8f8]">
            <span className="text-gray-600 text-sm mr-2">Notifications</span>
            <span className="text-red-500 font-bold">
              ({unreadNotifications})
            </span>
          </div>
          {notifications.map((data, index) => (
            <Link
              onClick={() => handleView({ ...item })}
              to={{
                pathname: `/view_notifications/`,
                search: `?id=${id}&brgy=${brgy}&notification=${encodeURIComponent(
                  JSON.stringify(data)
                )}`,
              }}
            >
              <li
                key={index}
                className={`px-4 py-3 border-b last:border-b-0 border w-full justify-between shadow-sm  font-medium uppercase gap-x-3.5 text-sm text-black bg-[#f8f8f8] hover:bg-[#b3c5cc] hover:text-gray-800 focus:ring-2 focus:ring-blue-500 ${
                  data.read_by.some((item) => item.readerId === id)
                    ? ""
                    : "bg-yellow-200"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 mr-4">
                    <img
                      className="object-cover w-full h-full rounded-lg"
                      src={data.banner.link}
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col max-h-24 w-aut">
                    <span className="font-bold text-black text-[12px]">
                      {data.compose.subject}
                    </span>
                    <span className="text-[9px] text-gray-700 text-ellipsis leading-4 line-clamp-2 overflow-hidden">
                      {data.compose.message}
                    </span>
                    <div>
                      <p className="text-[12px] text-gray-500 mt-1">
                        {data.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <ViewNotification
        notification={notification}
        setNotification={setNotification}
        brgy={brgy}
        id={id}
      />
    </>
  );
};

export default Notifications;
