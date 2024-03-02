import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_LINK from "../../config/API";
import { useSearchParams } from "react-router-dom";
import { IoIosAttach } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { FaTasks } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import Dropbox from "./Dropbox";
import ViewDropbox from "./ViewDropbox";
import EditDropbox from "./EditDropbox";
import ReplyLoader from "./loaders/ReplyLoader";
import moment from "moment";
function ViewInquiriesModal({ inquiry, setInquiry, brgy }) {
  const [reply, setReply] = useState(false);
  const [upload, setUpload] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [files, setFiles] = useState([]);
  const [createFiles, setCreateFiles] = useState([]);
  const [viewFiles, setViewFiles] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [replyStatus, setReplyStatus] = useState(null);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [statusChanger, setStatusChanger] = useState(false);
  const [newMessage, setNewMessage] = useState({
    type: "Staff",
    message: "",
    date: new Date(),
  });
  const [banner, setBanner] = useState({
    link: "https://drive.google.com/thumbnail?id=1v009xuRjSNW8OGUyHbAYTJt3ynxjhtGW&sz=w1000",
    name: "inquiries_banner.jpg",
    id: "1SM_QPFb_NmyMTLdsjtEd-2M6ersJhBUc",
  });

  const [logo, setLogo] = useState({
    link: "https://drive.google.com/thumbnail?id=1sh24YL7RQY_cHLcTZ_G3GXCG18Y6_JAL&sz=w1000",
    name: "inquiries_logo.png",
    id: "1SM_QPFb_NmyMTLdsjtEd-2M6ersJhBUc",
  });
  useEffect(() => {
    setFiles(inquiry.length === 0 ? [] : inquiry.compose.file);
  }, [inquiry]);

  useEffect(() => {
    if (inquiry && inquiry.response.length !== 0) {
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

  // Initialize with the last index expanded
  useEffect(() => {
    const lastIndex = inquiry.response ? inquiry.response.length - 1 : 0;
    setExpandedIndexes([lastIndex]);
  }, [inquiry.response]);

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

  // const handleChange = (e) => {
  //   e.preventDefault();

  //   setNewMessage((prev) => ({
  //     ...prev,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  const handleChange = (e) => {
    e.preventDefault();

    const inputValue = e.target.value;

    if (
      statusChanger &&
      (!newMessage.message || newMessage.message.trim() === "")
    ) {
      setNewMessage((prev) => ({
        ...prev,
        message: `The status of your inquiry is ${inputValue}`,
      }));
    } else {
      setNewMessage((prev) => ({
        ...prev,
        [e.target.name]: inputValue,
      }));
    }
  };

  console.log("StatusChanger: ", statusChanger);

  console.log("New Message: ", newMessage.message);

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
  const getType = (type) => {
    switch (type) {
      case "MUNISIPYO":
        return "Municipality";
      default:
        return "Barangay";
    }
  };
  const handleOnSend = async (e) => {
    e.preventDefault();
    setSubmitClicked(true);
    console.log(newMessage);

    try {
      
        const obj = {
          sender: `${userData.firstName} ${userData.lastName} (${userData.type})`,
          type: newMessage.type,
          message: newMessage.message,
          date: newMessage.date,
          folder_id: inquiry.folder_id,
          status: inquiry.status,
        };
        var formData = new FormData();
        formData.append("response", JSON.stringify(obj));
        for (let i = 0; i < createFiles.length; i++) {
          formData.append("files", createFiles[i]);
        }

        const response = await axios.patch(
          `${API_LINK}/inquiries/?inq_id=${inquiry._id}`,
          formData
        );

        if (response.status === 200) {
          const notify = {
            category: "One",
            compose: {
              subject: `INQUIRIES - ${inquiry.compose.subject}`,
              message: `A municipality has responded to your inquiry.\n\n
            
            
            Inquiries Details:\n 
            - Name: ${inquiry.name}\n
            - Message: ${inquiry.compose.message}\n
            - inquiry ID: ${inquiry.inq_id}\n
            - Date Created: ${moment(inquiry.createdAt).format(
              "MMM. DD, YYYY h:mm a"
            )}\n
            - Status: ${inquiry.isApproved}\n
            - Staff Handled: ${userData.lastName}, ${userData.firstName} ${
                userData.middleName
              }\n\n
            `,
              go_to: "Inquiries",
            },
            target: {
              user_id: inquiry.user_id,
              area: inquiry.brgy,
            },
            type: "Resident",
            banner: banner,
            logo: logo,
          };

          console.log("Inquiry: ", inquiry);
          console.log("Notify: ", notify);
          console.log("Result: ", response);

          const result = await axios.post(`${API_LINK}/notification/`, notify, {
            headers: {
              "Content-Type": "application/json",
            },
          });
console.log("pangetmo", result)
          if (result.status === 200) {
            setTimeout(() => {
              setSubmitClicked(false);
              setReplyStatus("success");
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            }, 1000);
          }
        

        // setTimeout(() => {
        //   setSubmitClicked(false);
        //   setReplyStatus("success");
        //   setTimeout(() => {
        //     window.location.reload();
        //   }, 3000);
        // }, 1000);
      }
    } catch (error) {
      console.log(error);
      setSubmitClicked(false);
      setReplyStatus("error");
      setError("An error occurred while creating the announcement.");
    }
  };

  const handleOnStatusChanger = () => {
    setStatusChanger(!statusChanger);
  };

  return (
    <div>
      <div className="">
        <div
          id="hs-modal-viewInquiries"
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
                  VIEW INQUIRY
                </h3>
              </div>

              <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full pt-5 px-5 overflow-y-auto relative max-h-[470px]">
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
                  <div className="flex flex-col w-full">
                    <b className="border-solid border-0 w-full border-black/50 border-b-2 my-4 uppercase font-medium text-lg md:text-lg mb-4">
                      Conversation History
                    </b>
                    <form>
                      {!inquiry.response || inquiry.response.length === 0 ? (
                        <div className="flex flex-col items-center">
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
                                    ? `The status of your inquiry is ${inquiry.status}`
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
                                      <IoIosAttach size={24} />
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
                                            <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-1/6 flex mr-2">
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
                                                  Change Inquiry Status
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
                                                setNewMessage((prev) => ({
                                                  ...prev,
                                                  message: `The status of your inquiry is ${e.target.value}`,
                                                }));
                                              }
                                              setInquiry((prev) => ({
                                                ...prev,
                                                status: e.target.value,
                                              }));
                                            }}
                                            className="shadow ml-4 border w-5/6 py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline"
                                            value={inquiry.status}
                                            hidden={!statusChanger}
                                          >
                                            <option>- Select a Status -</option>
                                            <option value="Pending">
                                              PENDING
                                            </option>
                                            <option value="In Progress">
                                              IN PROGRESS
                                            </option>
                                            <option value="Completed">
                                              COMPLETED
                                            </option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-x-1">
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
                        </div>
                      ) : null}
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
                                {index === inquiry.response.length - 1 && (
                                  <div className="flex flex-row items-center">
                                    <button
                                      type="button"
                                      className="h-8 w-full lg:w-32 py-1 px-2 gap-2 mt-4 rounded-full borde text-sm font-base bg-teal-900 text-white shadow-sm"
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
                                                ? `The status of your inquiry is ${inquiry.status}`
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
                                                  <IoIosAttach size={24} />
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
                                                        <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-1/6 flex mr-2">
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
                                                              Change Inquiry
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
                                                                message: `The status of your inquiry is ${e.target.value}`,
                                                              })
                                                            );
                                                          }
                                                          setInquiry(
                                                            (prev) => ({
                                                              ...prev,
                                                              status:
                                                                e.target.value,
                                                            })
                                                          );
                                                        }}
                                                        className="shadow ml-4 border w-5/6 py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline"
                                                        value={inquiry.status}
                                                        hidden={!statusChanger}
                                                      >
                                                        <option>
                                                          - Select a Status -
                                                        </option>
                                                        <option value="Pending">
                                                          PENDING
                                                        </option>
                                                        <option value="In Progress">
                                                          IN PROGRESS
                                                        </option>
                                                        <option value="Completed">
                                                          COMPLETED
                                                        </option>
                                                      </select>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="flex items-center gap-x-1">
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
                                              handleFileChange={
                                                handleFileChange
                                              }
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
              </div>
              {/* Buttons */}
              <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
                <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                  <button
                    type="button"
                    className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-900 text-white shadow-sm"
                    data-hs-overlay="#hs-modal-viewInquiries"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <ReplyLoader /> */}
        {submitClicked && <ReplyLoader replyStatus="replying" />}
        {replyStatus && <ReplyLoader replyStatus={replyStatus} error={error} />}
      </div>
    </div>
  );
}

export default ViewInquiriesModal;
