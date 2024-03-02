import React from "react";
import { useState, useEffect } from "react";
import EditDropbox from "./EditDropbox";
import GetBrgy from "../../GETBrgy/getbrgy";
function ViewArchivedAnnouncementModal({ announcement, setAnnouncement, brgy }) {
  const [files, setFiles] = useState([]);
  const [edit, setEdit] = useState(false);
  const information = GetBrgy(brgy);
  useEffect(() => {
    setFiles(announcement.length === 0 ? [] : announcement.collections.file);
  }, [announcement]);

  const handleFileChange = (e) => {
    e.preventDefault();

    setFiles([...files, ...e.target.files]);
  };

  const dateFormat = (date) => {
    const eventdate = date === undefined ? "" : date.substr(0, 10);
    return eventdate;
  };

  return (
    <div>
      <div className="">
        <div
          id="hs-modal-viewArchivedAnnouncement"
          className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
        >
          {/* Modal */}
          <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
            <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
              {/* Header */}
              <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] overflow-hidden rounded-t-2xl"   style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}>
                <h3
                  className="font-bold text-white mx-auto md:text-xl text-center"
                  style={{ letterSpacing: "0.3em" }}
                >
                  VIEW EVENTS DETAILS
                </h3>
              </div>

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
                          src={
                            announcement.length === 0
                              ? ""
                              : announcement.collections.logo.link
                          }
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
                          src={
                            announcement.length === 0
                              ? ""
                              : announcement.collections.banner.link
                          }
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
                    Announcement Title
                  </label>
                  <input
                    id="title"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    value={announcement.title}
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
                    value={announcement.details}
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
                    value={dateFormat(announcement.date) || ""}
                    disabled
                  />
                </div>
                <EditDropbox
                  edit={edit}
                  files={announcement && files}
                  handleFileChange={handleFileChange}
                  setFiles={setFiles}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
                <button
                  type="button"
                  className="h-[2.5rem] w-full py-1 px-6  gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                  data-hs-overlay="#hs-modal-viewArchivedAnnouncement"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewArchivedAnnouncementModal;
