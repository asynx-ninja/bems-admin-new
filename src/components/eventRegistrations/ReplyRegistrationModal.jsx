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
// import { io } from "socket.io-client";
// import Socket_link from "../../config/Socket";
// const socket = io(Socket_link);

function ReplyRegistrationModal({
  application,
  setApplication,
  brgy,
  socket,
  chatContainerRef,
}) {
  const [onSend, setOnSend] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [reply, setReply] = useState(false);
  const [statusChanger, setStatusChanger] = useState(false);
  const [upload, setUpload] = useState(false);
  const [createFiles, setCreateFiles] = useState([]);
  const [viewFiles, setViewFiles] = useState([]);
  const [newMessage, setNewMessage] = useState({
    message: "",
    isRepliable: true,
  });
  const [userData, setUserData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [replyingStatus, setReplyingStatus] = useState(null);
  const [error, setError] = useState(null);
  const [viewTime, setViewTime] = useState({
    state: false,
    timeKey: 0,
  });
  const [event, setEvent] = useState({
    collections: {
      banner: {},
      logo: {},
    },
  });
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    var container = document.getElementById("scrolltobottom");
    container.scrollTop = container.scrollHeight;
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_LINK}/users/specific/${id}`);

        if (res.status === 200) {
          setUserData(res.data[0]);
        }
        console.log(res.data[0]);
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

  const fileInputRef = useRef();

  const handleChange = (e) => {
    const inputValue = e.target.value;

    if (e.target.name === "isRepliable") {
      // If isRepliable checkbox is changed, update isRepliable accordingly
      setNewMessage((prev) => ({
        ...prev,
        [e.target.name]: e.target.checked,
      }));
    } else if (
      statusChanger &&
      (!newMessage.message || newMessage.message.trim() === "")
    ) {
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

  const handleOnUpload = () => {
    setUpload(!upload);
  };

  const handleOnStatusChanger = () => {
    setStatusChanger(!statusChanger);
  };

  const handleOnSend = async (e) => {
    e.preventDefault();

    // Check if the message is empty before sending

    if (newMessage.message.trim() === "" && createFiles.length === 0) {
      setErrMsg(true);
      return;
    }
    try {
      setOnSend(true);
      const obj = {
        sender: `${userData.firstName} ${userData.lastName} (${userData.type})`,
        message: newMessage.message,
        status: application.status,
        isRepliable: newMessage.isRepliable,
        folder_id: application.folder_id,
        last_sender:
          application.response.length === 0
            ? newMessage.sender
            : application.response[application.response.length - 1],
        last_array:
          application.response.length > 0 ? application.response.length - 1 : 0,
      };

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
        setCreateFiles([]);
        setNewMessage({ message: "" });
        setReplyingStatus(null);
        setReply(false);

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

        const result = await axios.post(`${API_LINK}/notification/`, notify, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      socket.emit("send-reply-event-appli", response.data);
      setOnSend(false);
      setErrMsg(false);
    } catch (error) {
      console.log(error);
      setSubmitClicked(false);
      setReplyingStatus(null);
      setError("An error occurred while replying to the event application.");
    }
  };

  const setColor = (status) => {
    if (status === "Completed") return "green-800";
    else if (status === "Pending") return "custom-amber";
    else if (status === "Cancelled") return "gray-700";
    else if (status === "Processing") return "blue-800";
    else if (status === "Paid") return "violet-700";
    else if (status === "Not Responded") return "pink-700";
    else if (status === "Rejected") return "red-800";
    else return "black";
  };

  // useEffect(() => {
  //   var container = document.getElementById("scrolltobottom");
  //   container.scrollTop = container.scrollHeight;
  // });

  // useEffect(() => {
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [application.response]);
  const handleOnViewTime = (item) => {
    console.log(item);
    setViewTime({
      state: !viewTime.state,
      timeKey: item,
    });
  };

  return (
    <div>
      <div
        id="hs-reply-modal"
        className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
      >
        {/* Modal */}
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
          <div className="flex flex-col bg-[#FEFAF6] shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
            {/* Header */}
            <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]  overflow-hidden rounded-t-2xl">
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                REPLY TO EVENT APPLICATION
              </h3>
            </div>
            <div
              id="scrolltobottom"
              ref={chatContainerRef}
              className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]"
            >
              <div className="border-solid border-0 border-black/50 border-b-2 flex justify-between items-center mb-4">
                <b className="uppercase font-medium text-lg md:text-lg">
                  Evaluation
                </b>
                <div className="flex gap-1">
                  <p className="font-medium">Status: </p>
                  <p
                    className={`font-medium text-${setColor(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </p>
                </div>
              </div>
              {
                <div className="flex flex-col p-2">
                  <form>
                    {!application.response ||
                    application.response.length === 0 ? (
                      application.status === "Cancelled" ||
                      application.status === "Rejected" ? (
                        <div>
                          <p className="text-center text-[14px]">
                            You are unable to reply to this conversation due to
                            the status of your Application is on{" "}
                            <b
                              className={`font-medium text-${setColor(
                                application.status
                              )}`}
                            >
                              {application.status}
                            </b>
                          </p>
                        </div>
                      ) : (
                        <div className={"flex flex-col items-center"}>
                          {errMsg ? (
                            <div className="w-[100%] bg-red-500 rounded-md mb-[10px] flex">
                              <p className="py-[10px] text-[12px] px-[20px] text-white font-medium">
                                Please enter a message or insert a file!
                              </p>
                            </div>
                          ) : null}
                          <div className="relative w-full mt-4 mx-2">
                            <div className="relative w-full ">
                              <textarea
                                id="message"
                                name="message"
                                multiple
                                rows="7"
                                onChange={handleChange}
                                className="p-4 pb-12 block w-full  border-[#b7e4c7] rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none border focus:outline-none focus:ring-0 focus:border-[#b7e4c7]"
                                placeholder="Input response..."
                              ></textarea>

                              <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-[#b7e4c7]">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
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
                                      className="p-2 hover:rounded-full hover:bg-white focus:shadow-outline focus:outline-none"
                                    >
                                      <IoIosAttach
                                        size={24}
                                        className="text-[#2d6a4f]"
                                      />
                                    </button>
                                    <div className="flex flex-col lg:flex-row">
                                      <div className="w-full">
                                        <div className="flex flex-row ">
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
                                                setNewMessage((prev) => ({
                                                  ...prev,
                                                  message: `The status of your event application is ${e.target.value}`,
                                                }));
                                              }
                                              setApplication((prev) => ({
                                                ...prev,
                                                status: e.target.value,
                                              }));
                                            }}
                                            className=" pl-2 pr-4 text-sm text-black rounded-lg focus:outline-none hover:bg-white "
                                            value={application.status}
                                            hidden={!statusChanger}
                                          >
                                            <option value="Pending">
                                              PENDING
                                            </option>
                                            <option value="Paid">PAID</option>
                                            <option value="Processing">
                                              PROCESSING
                                            </option>
                                            <option value="Cancelled">
                                              CANCELLED
                                            </option>
                                            <option value="Application Completed">
                                              APPLICATION COMPLETED
                                            </option>
                                            <option value="Rejected">
                                              REJECTED
                                            </option>
                                          </select>
                                          {!statusChanger ? (
                                            <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-1/6 flex">
                                              <div className="hs-tooltip inline-block">
                                                <button
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    handleOnStatusChanger();
                                                  }}
                                                  className="hs-tooltip-toggle rounded-xl p-2 hover:rounded-full hover:bg-white focus:shadow-outline focus:outline-none"
                                                >
                                                  <FaTasks
                                                    size={24}
                                                    className="text-[#2d6a4f]"
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
                                            <div className="sm:space-x-0 md:space-x-2 ml-1 sm:space-y-2 md:space-y-0 w-1/6 flex">
                                              <div className="hs-tooltip inline-block">
                                                <button
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    handleOnStatusChanger();
                                                  }}
                                                  className="hs-tooltip-toggle rounded-xl p-2 text-[#2d6a4f] hover:rounded-full hover:bg-white focus:shadow-outline focus:outline-none"
                                                >
                                                  <MdOutlineCancel
                                                    size={24}
                                                    className=""
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
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-x-1">
                                    <button
                                      type="submit"
                                      onClick={handleOnSend}
                                      disabled={onSend}
                                      className="inline-flex flex-shrink-0 justify-center items-center rounded-lg p-2 gap-2 text-[#2d6a4f] hover:bg-white hover:rounded-full  "
                                    >
                                      {
                                        onSend ? (
                                          <div
                                            class="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                                            role="status"
                                            aria-label="loading"
                                          >
                                            <span class="sr-only">
                                              Loading...
                                            </span>
                                          </div>
                                        ) : (
                                          <IoSend
                                            size={24}
                                            className="flex-shrink-0 "
                                          />
                                        )

                                      }
                                    </button>
                                    {/* <div class="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                                          <span class="sr-only">Loading...</span>
                                        </div> */}
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
                      )
                    ) : null}
                    {application &&
                      application.response &&
                      application.response.map((responseItem, index) => (
                        <div
                          key={index}
                          className={
                            responseItem.sender ===
                            `${userData?.firstName?.toUpperCase() ?? ""} ${
                              userData?.lastName?.toUpperCase() ?? ""
                            } (${userData.type})`
                              ? "flex flex-col justify-end items-end mb-2 w-full h-auto"
                              : "flex flex-col justify-start items-start mb-2 w-full h-auto"
                          }
                        >
                          <div
                            className={
                              responseItem.sender ===
                              `${userData?.firstName?.toUpperCase() ?? ""} ${
                                userData?.lastName?.toUpperCase() ?? ""
                              } (${userData.type})`
                                ? "flex flex-col items-end h-auto max-w-[80%]"
                                : "flex flex-col items-start h-auto max-w-[80%]"
                            }
                          >
                            <div
                              className={
                                responseItem.sender ===
                                `${userData?.firstName?.toUpperCase() ?? ""} ${
                                  userData?.lastName?.toUpperCase() ?? ""
                                } (${userData.type})`
                                  ? "hidden"
                                  : "flex flex-row w-full justify-between"
                              }
                            >
                              <div className="flex flex-col md:flex-row md:items-center">
                                <p className="text-[14px] text-black md:text-sm font-medium uppercase ">
                                  {responseItem.sender?.toLowerCase()}
                                </p>
                              </div>
                            </div>
                            {responseItem.message !== "" ? (
                              <div
                                className={
                                  responseItem.sender ===
                                  `${
                                    userData?.firstName?.toUpperCase() ?? ""
                                  } ${
                                    userData?.lastName?.toUpperCase() ?? ""
                                  } (${userData.type})`
                                    ? "flex flex-col rounded-xl bg-[#52b788] border border-[#2d6a4f] mb-1 text-white px-2 md:px-4 py-2 cursor-pointer"
                                    : "flex flex-col rounded-xl bg-gray-100 border text-black border-gray-300 px-2 md:px-4 py-2 cursor-pointer"
                                }
                                onClick={() => handleOnViewTime(index)}
                              >
                                <div className="w-full h-full">
                                  <div className="w-full h-full rounded-xl p-1">
                                    <p className="text-[10px] md:text-xs">
                                      {responseItem.message}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                            {responseItem.file &&
                              responseItem.file.length > 0 && (
                                <div className="flex flex-col rounded-xl">
                                  <ViewDropbox
                                    viewFiles={responseItem.file || []}
                                    setViewFiles={setViewFiles}
                                  />
                                </div>
                              )}

                            <p
                              className={
                                !viewTime.state && viewTime.timeKey === index
                                  ? "text-[10px] md:text-xs mt-[5px] text-black text-right text-xs"
                                  : "hidden"
                              }
                            >
                              {DateFormat(responseItem.date) || ""}
                            </p>
                          </div>
                          {index === application.response.length - 1 ? (
                            <div className="flex flex-row items-center w-full">
                              <div className="relative w-full mt-4 mx-2">
                                {errMsg ? (
                                  <div className="w-[100%] bg-red-500 rounded-md mb-[10px] flex">
                                    <p className="py-[10px] text-[12px] px-[20px] text-white font-medium">
                                      Please enter a message or insert a file!
                                    </p>
                                  </div>
                                ) : null}
                                <div className="relative w-full ">
                                  <textarea
                                    id="message"
                                    name="message"
                                    multiple
                                    rows="7"
                                    onChange={handleChange}
                                    className="p-4 pb-12 block w-full  border-[#b7e4c7] rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none border focus:outline-none focus:ring-0 focus:border-[#b7e4c7]"
                                    placeholder="Input response..."
                                  ></textarea>

                                  <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-[#b7e4c7]">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center">
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
                                          className="p-2 hover:rounded-full hover:bg-white focus:shadow-outline focus:outline-none"
                                        >
                                          <IoIosAttach
                                            size={24}
                                            className="text-[#2d6a4f]"
                                          />
                                        </button>
                                        <div className="flex flex-col lg:flex-row">
                                          <div className="w-full">
                                            <div className="flex flex-row ">
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
                                                    setNewMessage((prev) => ({
                                                      ...prev,
                                                      message: `The status of your event application is ${e.target.value}`,
                                                    }));
                                                  }
                                                  setApplication((prev) => ({
                                                    ...prev,
                                                    status: e.target.value,
                                                  }));
                                                }}
                                                className=" pl-2 pr-4 text-sm text-black rounded-lg focus:outline-none hover:bg-white "
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
                                                <option value="Application Completed">
                                                  APPLICATION COMPLETED
                                                </option>
                                                <option value="Rejected">
                                                  REJECTED
                                                </option>
                                              </select>
                                              {!statusChanger ? (
                                                <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-1/6 flex">
                                                  <div className="hs-tooltip inline-block">
                                                    <button
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        handleOnStatusChanger();
                                                      }}
                                                      className="hs-tooltip-toggle rounded-xl p-2 hover:rounded-full hover:bg-white focus:shadow-outline focus:outline-none"
                                                    >
                                                      <FaTasks
                                                        size={24}
                                                        className="text-[#2d6a4f]"
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
                                                <div className="sm:space-x-0 md:space-x-2 ml-1 sm:space-y-2 md:space-y-0 w-1/6 flex">
                                                  <div className="hs-tooltip inline-block">
                                                    <button
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        handleOnStatusChanger();
                                                      }}
                                                      className="hs-tooltip-toggle rounded-xl p-2 text-[#2d6a4f] hover:rounded-full hover:bg-white focus:shadow-outline focus:outline-none"
                                                    >
                                                      <MdOutlineCancel
                                                        size={24}
                                                        className=""
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
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-x-1">
                                        <button
                                          type="submit"
                                          onClick={handleOnSend}
                                          disabled={onSend}
                                          className="inline-flex flex-shrink-0 justify-center items-center rounded-lg p-2 gap-2 text-[#2d6a4f] hover:bg-white hover:rounded-full  "
                                        >
                                          {
                                            onSend ? (
                                              <div
                                                class="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
                                                role="status"
                                                aria-label="loading"
                                              >
                                                <span class="sr-only">
                                                  Loading...
                                                </span>
                                              </div>
                                            ) : (
                                              <IoSend
                                                size={24}
                                                className="flex-shrink-0 "
                                              />
                                            )
                                            // <div className="inline-flex flex-shrink-0 justify-center items-center w-28 rounded-lg text-gray-500 py-1 px-6 gap-2 ">
                                            //   </div>
                                          }
                                        </button>
                                        {/* <div class="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                                          <span class="sr-only">Loading...</span>
                                        </div> */}
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
                        </div>
                      ))}
                  </form>
                </div>
              }
            </div>

            {/* Buttons */}
            <div className="flex justify-end items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              <button
                type="button"
                className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-900 text-white shadow-sm"
                data-hs-overlay="#hs-reply-modal"
                onClick={() => {
                  setReply(false); // Set update to true
                }}
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
