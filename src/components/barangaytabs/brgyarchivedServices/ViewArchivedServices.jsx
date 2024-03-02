import React from "react";
import { useState, useEffect } from "react";
import bgmodal from "../../../assets/modals/bg-modal2.png";
import { AiOutlineSend } from "react-icons/ai";
import EditDropbox from "../../../components/barangaytabs/brgyServices/EditDropbox";

function RevisionServiceModal({ setSelectedService, selectedService }) {
  const [files, setFiles] = useState([]);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (selectedService && selectedService.collections) {
      setFiles(selectedService.collections.file || []);
    } else {
      // Handle the case where selectedService or selectedService.collections is null or undefined
      setFiles([]);
    }
  }, [selectedService]);

  const handleFileChange = (e) => {
    e.preventDefault();

    setFiles([...files, ...e.target.files]);
  };

  return (
    <div>
      <div
        id="hs-view-archived-service-modal"
        className="hs-overlay hidden fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center "
      >
        {/* Modal */}
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-full">
          <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto">
            {/* Header */}
            <div className="rounded-t-2xl bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] ">
              <div
               
                className="py-5 px-3 flex justify-between items-center overflow-hidden rounded-t-2xl"
              >
                <h3
                  className="font-bold text-white mx-auto md:text-xl uppercase text-center"
                  style={{ letterSpacing: "0.3em" }}
                >
                  Archived SERVICE INFORMATION
                </h3>
              </div>
            </div>
            {/* Modal Details */}
            <div className="flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-screen">
              <div className="flex flex-col">
                <div className="flex flex-col lg:flex-row  mb-1 pb-5 items-center justify-center">
                  {/* Service Description */}
                  <div className="relative lg:mt-2 p-5 lg:p-3 lg:ml-2 pb-6  flex flex-col w-full lg:w-2/3 h-full rounded-lg items-center justify-center">
                    <div className="">
                      <div className="relative w-full">
                        <h1
                          className="font-base text-white text-md absolute top-0 left-0 pl-2 pt-1"
                          style={{ letterSpacing: "0.3em" }}
                        >
                          LOGO
                        </h1>
                      </div>
                      <div>
                        <img
                          src={
                            selectedService &&
                            selectedService.collections.logo.link
                          }
                          alt=""
                          className="w-[100rem] h-40 rounded-lg object-contain border border-2 border-gray-400"
                        />
                      </div>
                    </div>
                    <div className=" mt-5">
                      <div className="relative w-full">
                        <h1
                          className="font-base text-white text-md absolute top-0 left-0 pl-2 pt-1"
                          style={{ letterSpacing: "0.3em" }}
                        >
                          BANNER
                        </h1>
                      </div>
                      <div>
                        <img
                          src={
                            selectedService &&
                            selectedService.collections.banner.link
                          }
                          alt=""
                          className="w-[100rem] h-40 rounded-lg object-fill border border-2 border-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Request Information */}
                  <div className="relative mt-4 mr-6 ml-3 p-5 pb-6 lg:py-3 xl:py-3 xxxl:py-10  flex flex-col lg:w-1/3 h-full bg-zinc-100 sm:md:mr-0 sm:md:ml-0 rounded-lg md:w-[29.8rem] sm:w-[21.8rem]">
                    <h1
                      className="font-medium mb-1 text-black text-xs"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      NAME OF SERVICE
                    </h1>
                    <input
                      type="search"
                      id="search-dropdown"
                      className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
                      placeholder=""
                      value={selectedService && selectedService.name}
                      readOnly
                    />
                    <h1
                      className="font-medium mb-1 mt-5 text-black text-xs"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      TYPE OF SERVICE
                    </h1>
                    <input
                      type="search"
                      id="search-dropdown"
                      className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
                      placeholder=""
                      value={selectedService && selectedService.type}
                      readOnly
                    />
                    <h1
                      className="font-medium mb-1 mt-5 text-black text-xs"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      TRANSACTION FEE
                    </h1>
                    <input
                      type="search"
                      id="search-dropdown"
                      className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
                      placeholder=""
                      value={selectedService && selectedService.fee}
                      readOnly
                    />
                    <h1
                      className="font-medium mb-1 mt-5 text-black text-xs"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      REFERENCE NUMBER
                    </h1>
                    <input
                      type="search"
                      id="search-dropdown"
                      className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
                      placeholder=""
                      readOnly
                    />
                    <h1
                      className="font-medium mb-1 mt-5 text-black text-xs"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      DATE POSTED
                    </h1>
                    <input
                      type="search"
                      id="search-dropdown"
                      className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
                      placeholder=""
                      value={new Date(
                        selectedService && selectedService.createdAt
                      ).toLocaleDateString()}
                      readOnly
                    />
                  </div>
                </div>
                <hr className="bg-gray-100 h-[1px] w-full mx-auto mt-2"></hr>
                <div className="w-full px-5 py-2">
                  <h1
                    className="font-medium mb-1 text-black text-sm mt-2"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    DETAILS
                  </h1>
                  <textarea
                    id="message"
                    rows="6"
                    className="block p-2.5 w-full text-sm text-gray-900 rounded-lg bg-gray-100 resize-none overflow-y-auto"
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Felis bibendum ut tristique et egestas quis ipsum suspendisse. Lorem ipsum dolor sit amet, cons adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Felis bibendum ut tristique et egestas quis ipsum suspendisse. "
                    readOnly
                    value={selectedService && selectedService.details}
                  ></textarea>
                </div>

                {/* Response */}
                <div className="w-full px-5">
                  <h1
                    className="font-medium mb-1 my-2 text-black text-sm"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    RESPONSE
                  </h1>
                  <textarea
                    id="message"
                    rows="4"
                    className="block p-2.5 w-full h-40 text-sm text-gray-900 rounded-lg bg-gray-100 resize-none"
                    placeholder="Enter response..."
                    readOnly
                  ></textarea>

                  {/* <div className="flex flex-col items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-16 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 mt-5"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, PDF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                    <div className="mt-2 overflow-x-auto w-full">
                      <p>Selected Files:</p>
                      {selectedFiles.length > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedFiles.map((file, index) => (
                            <span key={index} className="truncate pr-1">
                              {file.replace(/\.[^.]+$/, "")}&hellip;
                              {file.split(".").pop()},
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                  </div> */}
                </div>
                <div className="m-full px-5 py-2">
                  <form>
                    <div className="flex flex-col lg:flex-row">
                      <div className="w-full">
                        <div className="mb-4 ">
                          <label
                            for="civilStatus"
                            className="block text-sm font-medium text-black"
                          >
                            STATUS OF SERVICES
                          </label>

                          <select
                            id="civilStatus"
                            name="status"
                            disabled
                            className="w-full mt-3 p-2 border font-light border-gray-300 rounded"
                            onChange={(e) =>
                              setService({
                                ...services,
                                isApproved: e.target.value,
                              })
                            }
                          >
                            <option
                              value="Approved"
                              selected={
                                selectedService &&
                                selectedService.isApproved === "Approved"
                              }
                            >
                              Approved
                            </option>
                            <option
                              value="Disapproved"
                              selected={
                                selectedService &&
                                selectedService.isApproved === "Disapproved"
                              }
                            >
                              Denied
                            </option>
                            <option
                              value="Pending"
                              selected={
                                selectedService &&
                                selectedService.isApproved === "Pending"
                              }
                            >
                              Pending
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="m-full px-5 py-2">
                  <EditDropbox
                    edit={edit}
                    files={selectedService && files}
                    handleFileChange={handleFileChange}
                    setFiles={setFiles}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              <button
                type="button"
                className="py-1 px-6 inline-flex justify-center items-center gap-2 rounded-md border text-sm font-base bg-custom-red-button text-white shadow-sm align-middle"
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

export default RevisionServiceModal;
