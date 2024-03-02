import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ViewNotification({notification, setNotification, id, brgy }) {
  // console.log("Notifications: ", notification);
  return (
        <div
          id="hs-modal-viewNotification"
          className="hs-overlay hidden fixed top-0 left-0 z-[70] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
        >
          <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
            <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
              <div className="flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
                <div className="flex mb-4 w-full flex-col md:flex-row sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0">
                  <div className="w-full">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="username"
                    >
                      Logo
                    </label>
                    <div className="flex flex-col items-center space-y-2 relative">
                      <div className="w-full border border-gray-300">
                        <img
                          className="w-[200px] md:w-[250px] mx-auto lg:w-full md:h-[140px] lg:h-[250px] object-cover"
                          id="logo"
                          alt="Current profile photo"
                          // src={
                          //   notification.length === 0
                          //     ? ""
                          //     : notification.collections.logo.link
                          // }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="username"
                    >
                      Banner
                    </label>
                    <div className="flex flex-col items-center space-y-2 relative">
                      <div className="w-full border border-gray-300">
                        <img
                          className="w-[200px] md:w-[250px] mx-auto lg:w-full md:h-[140px] lg:h-[250px] object-cover"
                          id="banner"
                          alt="Current profile photo"
                          // src={
                          //   notification.length === 0
                          //     ? ""
                          //     : notification.collections.banner.link
                          // }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="title"
                  >
                    Subject
                  </label>
                  <input
                    id="title"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    value={notification && notification.compose ? notification.compose.subject || "" : ""}
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-bold text-gray-700 "
                  >
                    Details
                  </label>
                  <textarea
                    id="details"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-700  rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                    placeholder="Enter announcement details..."
                    value={notification && notification.compose ? notification.compose.message || "" : ""}
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="fee"
                  >
                    Date
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="date"
                    type="text"
                    disabled
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
                <Link
                  to={`/events_management/?id=${id}&brgy=${brgy}`}
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
                    className="h-[2.5rem] w-full py-1 px-6  gap-2 rounded-md borde text-sm font-base bg-teal-700 text-white shadow-sm"
                  >
                    CHECK EVENTS MANAGEMENT PAGE
                  </button>
                </Link>
                <button
                  type="button"
                  className="h-[2.5rem] w-full py-1 px-6  gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                  data-hs-overlay="#hs-modal-viewNotification"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
  );
}

export default ViewNotification;
