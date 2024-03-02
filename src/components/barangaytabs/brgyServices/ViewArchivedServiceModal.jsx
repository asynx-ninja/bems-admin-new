import React from "react";
import { useState, useEffect } from "react";
import EditDropbox from "../brgyServices/EditDropbox";
import GetBrgy from "../../GETBrgy/getbrgy";
function ViewArchivedServiceModal({ selectedService, serSelectedService, brgy }) {
  const [files, setFiles] = useState([]);
  const [edit, setEdit] = useState(false);
const information = GetBrgy(brgy);
  console.log("dada", selectedService);
  const handleFileChange = (e) => {
    e.preventDefault();

    setFiles([...files, ...e.target.files]);
  };

  return (
    <div>
      <div
        id="hs-view-archived-service-modal"
        className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full md:max-h-lg overflow-x-hidden overflow-y-auto flex items-center justify-center"
      >
        {/* Modal */}
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
          <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
            {/* Header */}
            <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#396288] to-[#013D74] overflow-hidden rounded-t-2xl"   style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}>
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                VIEW ARCHIVED SERVICE
              </h3>
            </div>

            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
              <div className="flex mb-4 w-full flex-col md:flex-row sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0">
                <div className="w-full">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 sm:ml-2 md:ml-0"
                    htmlFor="username"
                  >
                    Logo
                  </label>
                  <div className="flex flex-col items-center space-y-2 relative">
                    <div className="w-full border border-gray-300">
                      <img
                        className="w-[200px] mx-auto lg:w-full h-[110px] lg:h-[250px] object-cover"
                        id="view_logo"
                        alt="Current profile photo"
                        src={
                          selectedService.length === 0
                            ? ""
                            : selectedService.collections.logo.link
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2 sm:ml-2 md:ml-0 sm:mt-2 md:mt-0"
                    htmlFor="username"
                  >
                    Banner
                  </label>
                  <div className="flex flex-col items-center space-y-2 relative">
                    <div className="w-full border border-gray-300">
                      <img
                        className="w-[200px] mx-auto lg:w-full h-[110px] lg:h-[250px] object-cover"
                        id="view_logo"
                        alt="Current profile photo"
                        src={
                          selectedService.length === 0
                            ? ""
                            : selectedService.collections.banner.link
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Service Name
                </label>
                <input
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="name"
                  type="text"
                  value={selectedService.name}
                  placeholder="Service Name"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="type"
                >
                  Service Type
                </label>
                <select
                  name="type"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                  disabled
                  value={selectedService.type}
                >
                  <option value="Healthcare">Healthcare Services</option>
                  <option value="Education">Education Services</option>
                  <option value="Social Welfare">
                    Social Welfare Services
                  </option>
                  <option value="Security and Safety">
                    Security and Safety Services
                  </option>
                  <option value="Infrastructure">
                    Infrastructure Services
                  </option>
                  <option value="Community Services">Community Services</option>
                  <option value="Administrative">
                    Administrative Services
                  </option>
                  <option value="Environmental">Environmental Services</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-bold text-gray-700 "
                >
                  Details
                </label>
                <textarea
                  id="message"
                  rows={4}
                  name="details"
                  value={selectedService.details}
                  className="block p-2.5 w-full text-sm text-gray-700  rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Enter service details..."
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="fee"
                >
                  Service Fee
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="fee"
                  name="fee"
                  type="number"
                  value={selectedService.fee}
                  placeholder="Service Fee"
                  readOnly
                />
              </div>

              <EditDropbox
                edit={edit}
                files={selectedService && files}
                handleFileChange={handleFileChange}
                setFiles={setFiles}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              <button
                type="button"
                className="h-[2.5rem] w-full py-1 px-6  gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                data-hs-overlay="#hs-view-archived-service-modal"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewArchivedServiceModal;
