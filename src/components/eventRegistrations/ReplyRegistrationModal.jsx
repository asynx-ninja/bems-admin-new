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
function ReplyRegistrationModal({ application, setApplication, brgy }) {
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
  const [event, setEvent] = useState({
    collections: {
      banner: {},
      logo: {},
    },
  });
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    setFiles(application.length === 0 ? [] : application.file);
  }, [application]);

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
        if (!application.event_id) {
          // If there is no event_id in the application, do not fetch events
          return;
        }
        const eventsResponse = await axios.get(
          `${API_LINK}/announcement/?brgy=${brgy}&event_id=${application.event_id}&archived=false`
        );

        if (eventsResponse.status === 200) {
          setEvent(eventsResponse.data.result[0]);
        } else {
          setEventWithCounts([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
      }
    };

    fetchData();
  }, [currentPage, brgy, application.event_id]);

  useEffect(() => {
    if (application && application.response.length !== 0) {
      const lastResponse =
        application.response[application.response.length - 1];

      if (lastResponse.file && lastResponse.file.length > 0) {
        setViewFiles(lastResponse.file);
      } else {
        setViewFiles([]);
      }
    } else {
      setViewFiles([]);
    }
  }, [application]);

  // Initialize with the last index expanded
  useEffect(() => {
    const lastIndex = application.response
      ? application.response.length - 1
      : 0;
    setExpandedIndexes([lastIndex]);
  }, [application.response]);

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

  // const handleChange = (e) => {
  //   setNewMessage((prev) => ({
  //     ...prev,
  //     [e.target.name]:
  //       e.target.name === "isRepliable" ? e.target.checked : e.target.value,
  //   }));
  // };

  const handleChange = (e) => {
    const inputValue = e.target.value;
  
    if (e.target.name === "isRepliable") {
      // If isRepliable checkbox is changed, update isRepliable accordingly
      setNewMessage((prev) => ({
        ...prev,
        [e.target.name]: e.target.checked,
      }));
    } else if (statusChanger && (!newMessage.message || newMessage.message.trim() === "")) {
      // If statusChanger is true and message is not set, update message with status
      setNewMessage((prev) => ({
        ...prev,
        message: `The status of your event application is ${inputValue}`,
        [e.target.name]: inputValue,
      }));
    } else {
      // Otherwise, update the input value normally
      setNewMessage((prev) => ({
        ...prev,
        [e.target.name]: inputValue,
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

  const handleOnSend = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true);

      const obj = {
        sender: `${userData.firstName} ${userData.lastName} (STAFF)`,
        message: newMessage.message,
        status: application.status,
        isRepliable: newMessage.isRepliable,
        folder_id: application.folder_id,
      };

      console.log("obj", obj);
      var formData = new FormData();
      formData.append("response", JSON.stringify(obj));

      for (let i = 0; i < createFiles.length; i++) {
        formData.append("files", createFiles[i]);
      }

      const response = await axios.patch(
        `${API_LINK}/application/?app_id=${application._id}`,
        formData
      );

      if (response.status === 200) {
       
        const notify = {
          category: "One",
          compose: {
            subject: `APPLICATION - ${application.event_name}`,
            message: `A municipalit staff has updated your event application form for the event of ${
              application.event_name
            }.\n\n
      
            Application Details:\n
            - Name: ${
              application.form && application.form[0]
                ? application.form[0].lastName.value
                : ""
            }, ${
              application.form && application.form[0]
                ? application.form[0].firstName.value
                : ""
            } ${
              application.form && application.form[0]
                ? application.form[0].middleName.value
                : ""
            }
            - Event Applied: ${application.event_name}\n
            - Application ID: ${application.application_id}\n
            - Date Created: ${moment(application.createdAt).format(
              "MMM. DD, YYYY h:mm a"
            )}\n
            - Status: ${application.status}\n
            - Staff Handled: ${userData.lastName}, ${userData.firstName} ${
              userData.middleName
            }\n\n
            Please update this application as you've seen this notification!\n\n
            Thank you!!,`,
            go_to: "Application",
          },
          target: {
            user_id: application.form[0].user_id.value,
            area: application.brgy,
          },
          type: "Resident",
          banner: event.collections.banner,
          logo: event.collections.logo,
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
      // window.location.reload();
    } catch (error) {
      console.log(error);
      setSubmitClicked(false);
      setReplyingStatus(null);
      setError("An error occurred while replying to the event application.");
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
            <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]  overflow-hidden rounded-t-2xl">
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                REPLY TO EVENT APPLICATION
              </h3>
            </div>

            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
              <div className="flex flex-col w-full">
                <b className="border-solid border-0 w-full border-black/50 border-b-2 my-4 uppercase font-medium text-lg md:text-lg mb-4">
                  Conversation History
                </b>
                <form>
                  {!application.response ||
                  application.response.length === 0 ? (
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
                                ? `The status of your event application is ${application.status}`
                                : ""
                            }
                            className="p-4 pb-12 block w-full border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none border"
                            placeholder="Input response..."
                          />

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
                                                Change Application Status
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
                                              Change Application Status
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
                                              message: `The status of your inquiry is ${e.target.value}`,
                                            }));
                                          }
                                          setApplication((prev) => ({
                                            ...prev,
                                            status: e.target.value,
                                          }));
                                        }}
                                        className="shadow ml-4 border w-5/6 py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline"
                                        value={application.status}
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
                                      defaultChecked={newMessage.isRepliable}
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
                  {application &&
                    application.response &&
                    application.response.map((responseItem, index) => (
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
                            {index === application.response.length - 1 && (
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
                                            ? `The status of your event application is ${application.status}`
                                            : ""
                                        }
                                        className="p-4 pb-12 block w-full border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none border"
                                        placeholder="Input response..."
                                      />

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
                                                            Change Application
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
                                                          Change Application
                                                          Status
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
                                                            message: `The status of your event application is ${e.target.value}`,
                                                          })
                                                        );
                                                      }
                                                      setApplication(
                                                        (prev) => ({
                                                          ...prev,
                                                          status:
                                                            e.target.value,
                                                        })
                                                      );
                                                    }}
                                                    className="shadow ml-4 border w-5/6 py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline"
                                                    value={application.status}
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
                                                  defaultChecked={
                                                    newMessage.isRepliable
                                                  }
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
      </div>
      {submitClicked && <ReplyLoader replyingStatus="replying" />}
      {replyingStatus && (
        <ReplyLoader replyingStatus={replyingStatus} error={error} />
      )}
    </div>
  );
}

export default ReplyRegistrationModal;
