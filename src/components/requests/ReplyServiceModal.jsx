import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_LINK from "../../config/API";
import { MdOutlineCancel } from "react-icons/md";
import { IoIosAttach } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import Dropbox from "./Dropbox";
import ViewDropbox from "./ViewDropbox";
import EditDropbox from "./EditDropbox";
import { useSearchParams } from "react-router-dom";
import ReplyLoader from "./loaders/ReplyLoader";
import moment from "moment";

function ReplyServiceModal({ request, setRequest, brgy }) {
  const [reply, setReply] = useState(false);
  const [statusChanger, setStatusChanger] = useState(false);
  const [upload, setUpload] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [files, setFiles] = useState([]);
  const [createFiles, setCreateFiles] = useState([]);
  const [viewFiles, setViewFiles] = useState([]);
  const [newMessage, setNewMessage] = useState({
    message: "",
    isRepliable: false,
  });
  const [userData, setUserData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [replyingStatus, setReplyingStatus] = useState(null);
  const [error, setError] = useState(null);
  const [service, setService] = useState([]);
  const [eventWithCounts, setEventWithCounts] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [specificEvent, setSpecificEvent] = useState(null);

  useEffect(() => {
    setFiles(request.length === 0 ? [] : request.file);
  }, [request]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_LINK}/users/specific/${id}`);

        if (res.status === 200) {
          setUserData(res.data[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!request.service_id) {
          // If there is no event_id in the application, do not fetch events
          return;
        }
        const serviceResponse = await axios.get(
          `${API_LINK}/services/?brgy=${brgy}&service_id=${request.service_id}&archived=false`
        );

        if (serviceResponse.status === 200) {
          setService(serviceResponse.data.result[0]);
        } else {
          // setEventWithCounts([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
      }
    };

    fetchData();
  }, [currentPage, brgy, request.service_id]);

  useEffect(() => {
    if (request && request.response.length !== 0) {
      const lastResponse = request.response[request.response.length - 1];

      if (lastResponse.file && lastResponse.file.length > 0) {
        setViewFiles(lastResponse.file);
      } else {
        setViewFiles([]);
      }
    } else {
      setViewFiles([]);
    }
  }, [request]);

  // Initialize with the last index expanded
  useEffect(() => {
    const lastIndex = request.response ? request.response.length - 1 : 0;
    setExpandedIndexes([lastIndex]);
  }, [request.response]);

  const fileInputRef = useRef();

  const handleToggleClick = (index) => {
    if (expandedIndexes.includes(index)) {
      // Collapse the clicked div
      setExpandedIndexes((prev) => prev.filter((i) => i !== index));
    } else {
      // Expand the clicked div
      setExpandedIndexes((prev) => [...prev, index]);
    }
  };

  useEffect(() => {
    if (request && request.response && request.response.length > 0) {
      // Sort the responses based on date in ascending order
      request.response.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  
      // Initialize with the last index expanded
      const lastIndex = request.response.length - 1;
      setExpandedIndexes([lastIndex]);
    }
  }, [request]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
  
    if (
      statusChanger &&
      (!newMessage.message || newMessage.message.trim() === "")
    ) {
      setNewMessage((prev) => ({
        ...prev,
        message: `The status of your service request is ${inputValue}`,
      }));
    } else {
      setNewMessage((prev) => ({
        ...prev,
        [e.target.name]:
          e.target.name === "isRepliable" ? e.target.checked : inputValue,
      }));
    }
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

  const handleFileChange = (e) => {
    e.preventDefault();

    setCreateFiles([...createFiles, ...e.target.files]);
  };

  const handleAdd = (e) => {
    e.preventDefault();

    fileInputRef.current.click();
  };

  const handleOnReply = () => {
    setReply(!reply);
  };

  const handleOnUpload = () => {
    setUpload(!upload);
  };

  const handleOnStatusChanger = () => {
    setStatusChanger(!statusChanger);
  };

  const getType = (type) => {
    switch (type) {
      case "MUNISIPYO":
        return "Municipality";
      default:
        return "Barangay";
    }
  };

  const handleOnSend = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true);
  
      const obj = {
        sender: `${userData.firstName} ${userData.lastName} (${userData.type})`,
        message: newMessage.message,
        status: request.status,
        isRepliable: newMessage.isRepliable,
        folder_id: request.folder_id,
        date: new Date(), // Add the current date and time
      };
  
      console.log("obj", obj);
      var formData = new FormData();
      formData.append("response", JSON.stringify(obj));

      const res_folder = await axios.get(
        `${API_LINK}/folder/specific/?brgy=${brgy}`
      );

      console.log("brgy: ", brgy);
      console.log("res_folder: ", res_folder);

      if (res_folder.status === 200) {
        for (let i = 0; i < createFiles.length; i++) {
          formData.append("files", createFiles[i]);
        }
    
        const response = await axios.patch(
          `${API_LINK}/requests/?req_id=${request._id}&?request_folder_id=${res_folder.data[0].request}`,
          formData
        );
    
        if (response.status === 200) {
          const notify = {
            category: "One",
            compose: {
              subject: `REQUEST - ${request.service_name}`,
              message: `A barangay staff has updated your request for the barangay service of ${
                request.service_name
              }.\n\n
        
              Request Details:\n
              - Name: ${
                request.form && request.form[0]
                  ? request.form[0].lastName.value
                  : ""
              }, ${
                request.form && request.form[0]
                  ? request.form[0].firstName.value
                  : ""
              } ${
                request.form && request.form[0]
                  ? request.form[0].middleName.value
                  : ""
              }
              - Service Applied: ${request.service_name}\n
              - Request ID: ${request.request_id}\n
              - Date Created: ${moment(request.createdAt).format(
                "MMM. DD, YYYY h:mm a"
              )}\n
              - Status: ${response.data.status}\n
              - Staff Handled: ${userData.lastName}, ${userData.firstName} ${
                userData.middleName
              }\n\n
              Please update this service request as you've seen this notification!\n\n
              Thank you!!,`,
              go_to: "Requests",
            },
            target: {
              user_id: request.form[0].user_id.value,
              area: request.brgy,
            },
            type: "Resident",
            banner: service.collections.banner,
            logo: service.collections.logo,
          };
  
          console.log("Notify: ", notify);
  
          const result = await axios.post(`${API_LINK}/notification/`, notify, {
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          if (result.status === 200) {
            setTimeout(() => {
              setSubmitClicked(false);
              setReplyingStatus("success");
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            }, 1000);
          }
        }
      }
  
      

    } catch (error) {
      console.log(error);
      setSubmitClicked(false);
      setReplyingStatus("error");
      setError("An error occurred while replying to the service request.");
    }
  };

  return (
    <div>
      <div
        id="hs-reply-modal"
        className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
      >
        {/* Modal */}
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
          <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
            {/* Header */}
            <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] overflow-hidden rounded-t-2xl">
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                REPLY TO REQUESTED SERVICE
              </h3>
            </div>

            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
              <div className="flex flex-col w-full">
                <b className="border-solid border-0 w-full border-black/50 border-b-2 my-4 uppercase font-medium text-lg md:text-lg mb-4">
                  Conversation History
                </b>
                <form>
                  {!request.response || request.response.length === 0 ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-full mx-2">
                        <div className="relative w-full">
                          <textarea
                            id="message"
                            name="message"
                            onChange={handleChange}
                            rows={7}
                            value={
                              newMessage.message
                                ? newMessage.message
                                : statusChanger
                                ? `The status of your service request is ${request.status}`
                                : ""
                            }
                            className="p-4 pb-12 block w-full border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none border"
                            placeholder="Input response..."
                          ></textarea>

                          <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-white">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="file"
                                  name="file"
                                  onChange={(e) => handleFileChange(e)}
                                  ref={fileInputRef}
                                  accept=".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf"
                                  multiple="multiple"
                                  className="hidden"
                                />
                                <button
                                  id="button"
                                  onClick={handleAdd || handleOnUpload}
                                  className="rounded-xl px-3 py-2 bg-[#329ba8] text-white hover:bg-pink-900 focus:shadow-outline focus:outline-none"
                                >
                                  <IoIosAttach size={24} className="mx-auto" />
                                </button>

                                <div className="flex flex-col lg:flex-row">
                                  <div className="w-full">
                                    <div className="flex flex-row space-x-4">
                                      {!statusChanger ? (
                                        <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-1/6 flex">
                                          <div className="hs-tooltip inline-block">
                                            <button
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleOnStatusChanger();
                                              }}
                                              className="hs-tooltip-toggle rounded-xl px-3 py-2 bg-teal-800 text-white hover:bg-teal-900 focus:shadow-outline focus:outline-none"
                                            >
                                              <FaTasks
                                                size={24}
                                                className="mx-auto"
                                              />
                                              <span
                                                className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                                                role="tooltip"
                                              >
                                                Change Request Status
                                              </span>
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-1/6 flex">
                                          <div className="hs-tooltip inline-block">
                                            <button
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleOnStatusChanger();
                                              }}
                                              className="hs-tooltip-toggle rounded-xl px-3 py-[8px] bg-pink-800 text-white hover:bg-pink-900 focus:shadow-outline focus:outline-none"
                                            >
                                              <MdOutlineCancel
                                                size={24}
                                                className="mx-auto"
                                              />
                                            </button>
                                            <span
                                              className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                                              role="tooltip"
                                            >
                                              Change Request Status
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      <select
                                        id="status"
                                        name="status"
                                        onChange={(e) => {
                                          if (
                                            statusChanger &&
                                            (!newMessage.message ||
                                              newMessage.message.trim() === "")
                                          ) {
                                            setNewMessage((prev) => ({
                                              ...prev,
                                              message: `The status of your service request is ${e.target.value}`,
                                            }));
                                          }
                                          setRequest((prev) => ({
                                            ...prev,
                                            status: e.target.value,
                                          }));
                                        }}
                                        className="shadow ml-4 border w-5/6 py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline"
                                        value={request.status}
                                        hidden={!statusChanger}
                                      >
                                        <option value="Pending">PENDING</option>
                                        <option value="Paid">PAID</option>
                                        <option value="Processing">
                                          PROCESSING
                                        </option>
                                        <option value="Cancelled">
                                          CANCELLED
                                        </option>
                                        <option value="Transaction Completed">
                                          TRANSACTION COMPLETED
                                        </option>
                                        <option value="Rejected">
                                          REJECTED
                                        </option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-center items-center gap-x-2">
                                <div className="hs-tooltip inline-block">
                                  <label className="relative flex  justify-center items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      name="isRepliable"
                                      checked={newMessage.isRepliable}
                                      onChange={handleChange}
                                      className="hs-tooltip-toggle sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-800" />
                                  </label>
                                  <span
                                    className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                                    role="tooltip"
                                  >
                                    Client can Reply
                                  </span>
                                </div>
                                <button
                                  type="submit"
                                  onClick={handleOnSend}
                                  className="inline-flex flex-shrink-0 justify-center items-center w-28 rounded-lg text-white py-1 px-6 gap-2 bg-cyan-700"
                                >
                                  <span>SEND</span>
                                  <IoSend size={18} className="flex-shrink-0" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {!upload ? (
                          // Render Dropbox only when there are uploaded files
                          createFiles.length > 0 && (
                            <Dropbox
                              createFiles={createFiles}
                              setCreateFiles={setCreateFiles}
                              handleFileChange={handleFileChange}
                            />
                          )
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  ) : null}
                  {request &&
                    request.response &&
                    request.response.map((responseItem, index) => (
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
                            <p className="text-[10px] md:text-xs overflow-hidden line-clamp-3">
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
                            {index === request.response.length - 1 && (
                              <div className="flex flex-row items-center">
                                <button
                                  type="button"
                                  className="h-8 w-full lg:w-32 py-1 px-2 gap-2 rounded-full borde text-sm font-base bg-teal-900 text-white shadow-sm"
                                  onClick={handleOnReply}
                                  hidden={reply}
                                >
                                  REPLY
                                </button>

                                {!reply ? (
                                  <div></div>
                                ) : (
                                  <div className="relative w-full mt-4 mx-2">
                                    <div className="relative w-full">
                                      <textarea
                                        id="message"
                                        name="message"
                                        onChange={handleChange}
                                        rows={7}
                                        value={
                                          newMessage.message
                                            ? newMessage.message
                                            : statusChanger
                                            ? `The status of your service request is ${request.status}`
                                            : ""
                                        }
                                        className="p-4 pb-12 block w-full border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none border"
                                        placeholder="Input response..."
                                      ></textarea>

                                      <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-white">
                                        <div className="flex justify-between items-center">
                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="file"
                                              name="file"
                                              onChange={(e) =>
                                                handleFileChange(e)
                                              }
                                              ref={fileInputRef}
                                              accept=".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf"
                                              multiple="multiple"
                                              className="hidden"
                                            />
                                            <button
                                              id="button"
                                              onClick={
                                                handleAdd || handleOnUpload
                                              }
                                              className="rounded-xl px-3 py-2 bg-[#329ba8] text-white hover:bg-pink-900 focus:shadow-outline focus:outline-none"
                                            >
                                              <IoIosAttach
                                                size={24}
                                                className="mx-auto"
                                              />
                                            </button>

                                            <div className="flex flex-col lg:flex-row">
                                              <div className="w-full">
                                                <div className="flex flex-row space-x-4">
                                                  {!statusChanger ? (
                                                    <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-1/6 flex">
                                                      <div className="hs-tooltip inline-block">
                                                        <button
                                                          onClick={(e) => {
                                                            e.preventDefault();
                                                            handleOnStatusChanger();
                                                          }}
                                                          className="hs-tooltip-toggle rounded-xl px-3 py-2 bg-teal-800 text-white hover:bg-teal-900 focus:shadow-outline focus:outline-none"
                                                        >
                                                          <FaTasks
                                                            size={24}
                                                            className="mx-auto"
                                                          />
                                                          <span
                                                            className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                                                            role="tooltip"
                                                          >
                                                            Change Request
                                                            Status
                                                          </span>
                                                        </button>
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-1/6 flex">
                                                      <div className="hs-tooltip inline-block">
                                                        <button
                                                          onClick={(e) => {
                                                            e.preventDefault();
                                                            handleOnStatusChanger();
                                                          }}
                                                          className="hs-tooltip-toggle rounded-xl px-3 py-[8px] bg-pink-800 text-white hover:bg-pink-900 focus:shadow-outline focus:outline-none"
                                                        >
                                                          <MdOutlineCancel
                                                            size={24}
                                                            className="mx-auto"
                                                          />
                                                        </button>
                                                        <span
                                                          className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                                                          role="tooltip"
                                                        >
                                                          Change Request Status
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )}
                                                  <select
                                                    id="status"
                                                    name="status"
                                                    onChange={(e) => {
                                                      if (
                                                        statusChanger &&
                                                        (!newMessage.message ||
                                                          newMessage.message.trim() ===
                                                            "")
                                                      ) {
                                                        setNewMessage(
                                                          (prev) => ({
                                                            ...prev,
                                                            message: `The status of your service request is ${e.target.value}`,
                                                          })
                                                        );
                                                      }
                                                      setRequest((prev) => ({
                                                        ...prev,
                                                        status: e.target.value,
                                                      }));
                                                    }}
                                                    className="shadow ml-4 border w-5/6 py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline"
                                                    value={request.status}
                                                    hidden={!statusChanger}
                                                  >
                                                    <option value="Pending">
                                                      PENDING
                                                    </option>
                                                    <option value="Paid">
                                                      PAID
                                                    </option>
                                                    <option value="Processing">
                                                      PROCESSING
                                                    </option>
                                                    <option value="Cancelled">
                                                      CANCELLED
                                                    </option>
                                                    <option value="Transaction Completed">
                                                      TRANSACTION COMPLETED
                                                    </option>
                                                    <option value="Rejected">
                                                      REJECTED
                                                    </option>
                                                  </select>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="flex justify-center items-center gap-x-2">
                                            <div className="hs-tooltip inline-block">
                                              <label className="relative flex  justify-center items-center cursor-pointer">
                                                <input
                                                  type="checkbox"
                                                  name="isRepliable"
                                                  checked={newMessage.isRepliable}
                                                  onChange={handleChange}
                                                  className="hs-tooltip-toggle sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-800" />
                                              </label>
                                              <span
                                                className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                                                role="tooltip"
                                              >
                                                Client can Reply
                                              </span>
                                            </div>
                                            <button
                                              type="submit"
                                              onClick={handleOnSend}
                                              className="inline-flex flex-shrink-0 justify-center items-center w-28 rounded-lg text-white py-1 px-6 gap-2 bg-cyan-700"
                                            >
                                              <span>SEND</span>
                                              <IoSend
                                                size={18}
                                                className="flex-shrink-0"
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {!upload ? (
                                      // Render Dropbox only when there are uploaded files
                                      createFiles.length > 0 && (
                                        <Dropbox
                                          createFiles={createFiles}
                                          setCreateFiles={setCreateFiles}
                                          handleFileChange={handleFileChange}
                                        />
                                      )
                                    ) : (
                                      <div></div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </form>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              <button
                type="button"
                className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-900 text-white shadow-sm"
                data-hs-overlay="#hs-reply-modal"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
        {submitClicked && <ReplyLoader replyingStatus="replying" />}
        {replyingStatus && (
          <ReplyLoader replyingStatus={replyingStatus} error={error} />
        )}
      </div>
    </div>
  );
}

export default ReplyServiceModal;
