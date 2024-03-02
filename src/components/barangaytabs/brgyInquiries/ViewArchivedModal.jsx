import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import EditDropbox from "./EditDropbox";
import ViewDropbox from "./ViewDropbox";
import GetBrgy from "../../GETBrgy/getbrgy";

function ViewArchivedModal({ inquiry, setInquiry, brgy }) {
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [files, setFiles] = useState([]);
  const [createFiles, setCreateFiles] = useState([]);
  const [viewFiles, setViewFiles] = useState([]);
  const information = GetBrgy(brgy)
  useEffect(() => {
    setFiles(inquiry.length === 0 ? [] : inquiry.compose.file);
  }, [inquiry]);

  const handleChange = (e) => {
    setInquiry((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const DateFormat = (date) => {
    if (!date) return "";

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  const handleToggleClick = (index) => {
    if (expandedIndexes.includes(index)) {
      // Collapse the clicked div
      setExpandedIndexes((prev) => prev.filter((i) => i !== index));
    } else {
      // Expand the clicked div
      setExpandedIndexes((prev) => [...prev, index]);
    }
  };

  // Initialize with the last index expanded
  useEffect(() => {
    setFiles(inquiry.length === 0 ? [] : inquiry.compose.file);
  }, [inquiry]);

  useEffect(() => {
    if (inquiry && inquiry.response && inquiry.response.length > 0) {
      const lastResponse = inquiry.response[inquiry.response.length - 1];

      if (lastResponse.file && lastResponse.file.length > 0) {
        setViewFiles(lastResponse.file);
      } else {
        setViewFiles([]);
      }
    } else {
      setViewFiles([]);
    }
  }, [inquiry]);

  const fileInputRef = useRef();

  const handleAdd = (e) => {
    e.preventDefault();

    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    e.preventDefault();

    setCreateFiles([...createFiles, ...e.target.files]);
  };

  return (
    <div>
      <div className="">
        <div
          id="hs-modal-viewArchived"
          className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
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
                  VIEW INQUIRY
                </h3>
              </div>

              <div className="flex flex-col mx-auto w-full pt-5 px-5 overflow-y-auto relative max-h-[470px]">
                <b className="border-solid border-0 border-black/50 border-b-2  uppercase font-medium text-lg md:text-lg mb-4">
                  Inquiry Details
                </b>
                <div className="flex flex-col lg:flex-row">
                  <div className="mb-4 px-2 w-full lg:w-1/2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-bold text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      value={inquiry && inquiry.name}
                      disabled
                    />
                  </div>
                  <div className="mb-4 px-2 w-full lg:w-1/2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      value={inquiry && inquiry.email}
                      disabled
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                  <div className="mb-4 px-2 w-full lg:w-1/2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      value={inquiry && inquiry?.compose?.subject}
                      disabled
                    />
                  </div>
                  <div className="mb-4 px-2 w-full lg:w-1/2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      value={
                        DateFormat(inquiry && inquiry?.compose?.date) || ""
                      }
                      disabled
                    />
                  </div>
                </div>

                <div className="mb-4 px-2">
                  <label
                    htmlFor="details"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="details"
                    name="details"
                    rows="4"
                    className="shadow appearance-none border w-full h-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                    value={inquiry && inquiry?.compose?.message}
                    disabled
                  />
                </div>

                <EditDropbox files={inquiry && files} setFiles={setFiles} />

                <div className="flex flex-col mt-5 w-full">
                  <b className="border-solid border-0 w-full border-black/50 border-b-2 my-4 uppercase font-medium text-lg md:text-lg mb-4">
                    Conversation History
                  </b>
                  <form>
                    {inquiry &&
                      inquiry.response &&
                      inquiry.response.map((responseItem, index) => (
                        <div
                          key={index}
                          className={`flex flex-col lg:flex-row h-16 mb-2 border-b ${
                            expandedIndexes.includes(index)
                              ? "h-auto border-b"
                              : ""
                          }`}
                          onClick={() => handleToggleClick(index)}
                        >
                          {!expandedIndexes.includes(index) ? (
                            <div className="flex flex-col w-full px-2 md:px-4 py-2">
                              <div className="flex flex-row w-full justify-between">
                                <p className="text-[14px] md:text-sm font-medium uppercase">
                                  {responseItem.sender}
                                </p>
                                <p className="text-[10px] md:text-xs text-right text-xs">
                                  {DateFormat(responseItem.date) || ""}
                                </p>
                              </div>
                              <p className="text-[10px] md:text-xs line-clamp-2">
                                {responseItem.message}
                              </p>
                            </div>
                          ) : (
                            <div
                              className="flex flex-col w-full px-2 md:px-4 py-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                className="flex flex-row w-full justify-between"
                                onClick={() => handleToggleClick(index)}
                              >
                                <div className="flex flex-col md:flex-row md:items-center">
                                  <p className="text-[14px] md:text-sm font-medium uppercase ">
                                    {responseItem.sender}
                                  </p>
                                </div>
                                <p className="text-[10px] md:text-xs text-right text-xs">
                                  {DateFormat(responseItem.date) || ""}
                                </p>
                              </div>
                              <div className="w-full py-4 h-full md:px-2">
                                <div className="w-full border h-full rounded-xl p-5">
                                  <p className="text-[10px] md:text-xs">
                                    {responseItem.message}
                                  </p>
                                </div>
                              </div>
                              {viewFiles.length > 0 && (
                                <ViewDropbox
                                  viewFiles={responseItem.file || []}
                                  setViewFiles={setViewFiles}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </form>
                </div>
              </div>
              {/* Buttons */}
              <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
                <button
                  type="button"
                  className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-900 text-white shadow-sm"
                  data-hs-overlay="#hs-modal-viewArchived"
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

export default ViewArchivedModal;
