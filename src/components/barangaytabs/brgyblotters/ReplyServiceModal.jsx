import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_LINK from "../../../config/API";
import { MdOutlineCancel } from "react-icons/md";
import { IoIosAttach } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { BsPersonFillAdd } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import Dropbox from "./Dropbox";
import ViewDropbox from "./ViewDropbox";
import EditDropbox from "./EditDropbox";
import { useSearchParams } from "react-router-dom";
import ReplyLoader from "./loaders/ReplyLoader";
import moment from "moment";
import GetBrgy from "../../GETBrgy/getbrgy";

function ReplyServiceModal({ request, setRequest, brgy }) {
  const information = GetBrgy(brgy);
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

  const [blotterDetails, setBlotterDetails] = useState([]);
  const [detail, setDetail] = useState(request);

  const [users, setUsers] = useState([]);
  const [selectedComplainant, setSelectedComplainant] = useState(null);
  const [selectedDefendant, setSelectedDefendant] = useState(null);
  const [customComplainant, setCustomComplainant] = useState(false);
  const [customDefendant, setCustomDefendant] = useState(false);
  const [ComplainantData, setComplainantData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    user_id: "",
    type: "Complainant",
  });
  const [DefendantData, setDefendantData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    user_id: "",
    type: "Defendant",
  });
  const [ResponseData, setResponseData] = useState({
    sender: "Nyle Chua",
    type: "Staff",
    message: "",
    date: new Date().toISOString(),
    status: "",
  });
  const [patawagData, setPatawagData] = useState({
    name: "",
    to: [ComplainantData, DefendantData],
    response: [ResponseData],
    brgy: "",
    req_id: "",
  });

  // console.log("patawag data: ", patawagData);
  console.log("response data: ", ResponseData);
  console.log("userData: ", userData);

  const handleComplainantChange = (e) => {
    const selectedUserId = e.target.value;
    setSelectedComplainant(selectedUserId);

    // Fetch and set complainant user data
    const selectedUser = users.find((user) => user._id === selectedUserId);
    setComplainantData({
      firstName: selectedUser.firstName,
      middleName: selectedUser.middleName || "",
      lastName: selectedUser.lastName,
      user_id: selectedUser.user_id,
      type: "Complainant",
    });
  };

  const handleDefendantChange = (e) => {
    const selectedUserId = e.target.value;
    setSelectedDefendant(selectedUserId);

    // Fetch and set defendant user data
    const selectedUser = users.find((user) => user._id === selectedUserId);
    setDefendantData({
      firstName: selectedUser.firstName,
      middleName: selectedUser.middleName || "",
      lastName: selectedUser.lastName,
      user_id: selectedUser.user_id,
      type: "Defendant",
    });
  };

  // console.log("complainant data: ", ComplainantData);
  // console.log("defendant data: ", DefendantData);

  useEffect(() => {
    setDetail(request);
  }, [request]);

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
    const fetchUsers = async () => {
      let page = 1;
      let hasMoreResults = true;

      while (hasMoreResults) {
        try {
          const response = await axios.get(
            `${API_LINK}/users/?brgy=${brgy}&type=Resident&page=${page}`
          );

          if (response.status === 200 && response.data.result.length > 0) {
            setUsers((prevUsers) => [...prevUsers, ...response.data.result]);
            page++;
          } else {
            hasMoreResults = false;
          }
        } catch (error) {
          console.error("Error fetching users:", error);
          hasMoreResults = false;
        }
      }
    };

    fetchUsers();
  }, [brgy]);

  // console.log("users: ", users);

  useEffect(() => {
    // function to filter
    const fetch = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/blotter/?brgy=${brgy}&req_id=${detail.req_id}`
        );

        // filter
        setBlotterDetails(response.data);
      } catch (err) {
        console.log(err.message);
        setBlotterDetails([]);
      }
    };

    fetch();
  }, [brgy, request, detail]);

  console.log("blotterDetails: ", blotterDetails);
  // console.log("request: ", request);
  // console.log("detail: ", detail);

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
  }, [brgy, request.service_id]);

  useEffect(() => {
    if (blotterDetails && blotterDetails.status) {
      // If blotterDetails has status, set it as the default status for ResponseData
      setResponseData((prev) => ({
        ...prev,
        status: blotterDetails.status,
      }));
    }
  }, [blotterDetails]);

  useEffect(() => {
    if (
      blotterDetails &&
      blotterDetails.responses &&
      blotterDetails.responses.length !== 0
    ) {
      const lastResponse =
        blotterDetails.responses[blotterDetails.responses.length - 1];

      if (lastResponse && lastResponse.file && lastResponse.file.length > 0) {
        setViewFiles(lastResponse.file);
      } else {
        setViewFiles([]);
      }
    } else {
      setViewFiles([]);
    }
  }, [blotterDetails]);

  // Initialize with the last index expanded
  useEffect(() => {
    const lastIndex = blotterDetails.responses
      ? blotterDetails.responses.length - 1
      : 0;
    setExpandedIndexes([lastIndex]);
  }, [blotterDetails.responses]);

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
    if (
      blotterDetails &&
      blotterDetails.responses &&
      blotterDetails.responses.length > 0
    ) {
      // Sort the responses based on date in ascending order
      blotterDetails.responses.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Initialize with the last index expanded
      const lastIndex = blotterDetails.responses.length - 1;
      setExpandedIndexes([lastIndex]);
    }
  }, [blotterDetails]);

  const handleChange = (e) => {
    const inputValue = e.target.value;

    if (e.target.name === "isRepliable") {
      // If isRepliable checkbox is changed, update isRepliable accordingly
      setResponseData((prev) => ({
        ...prev,
        [e.target.name]: e.target.checked,
      }));
    } else if (
      statusChanger &&
      (!ResponseData.message || ResponseData.message.trim() === "")
    ) {
      // If statusChanger is true and message is not set, update message with status
      setResponseData((prev) => ({
        ...prev,
        message: `The status of your event application is ${inputValue}`,
        [e.target.name]: inputValue,
      }));
    } else {
      // Otherwise, update the input value normally
      setResponseData((prev) => ({
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

  const handlePatawagTitleChange = (e) => {
    const title = e.target.value;
    setPatawagData((prev) => ({
      ...prev,
      name: title,
    }));
  };

  const handleOnCustomComplainant = () => {
    setCustomComplainant(!customComplainant);
  };

  const handleOnCustomDefendant = () => {
    setCustomDefendant(!customDefendant);
  };

  const resetComplainantData = () => {
    setComplainantData({
      firstName: "",
      middleName: "",
      lastName: "",
      user_id: "",
      type: "Complainant",
    });
  };

  const resetDefendantData = () => {
    setDefendantData({
      firstName: "",
      middleName: "",
      lastName: "",
      user_id: "",
      type: "Defendant",
    });
  };

  useEffect(() => {
    // Update patawagData whenever ComplainantData or DefendantData changes
    setPatawagData((prev) => ({
      ...prev,
      to: [ComplainantData, DefendantData],
    }));
  }, [ComplainantData, DefendantData]);

  const getType = (type) => {
    switch (type) {
      case "MUNISIPYO":
        return "Municipality";
      default:
        return "Barangay";
    }
  };

  const [searchTermComplainant, setSearchTermComplainant] = useState("");
  const [searchTermDefendant, setSearchTermDefendant] = useState("");

  const filteredUsersComplainant = users.filter((user) =>
    `${user.firstName} ${user.middleName} ${user.lastName}`
      .toLowerCase()
      .includes(searchTermComplainant.toLowerCase())
  );

  const filteredUsersDefendant = users.filter((user) =>
    `${user.firstName} ${user.middleName} ${user.lastName}`
      .toLowerCase()
      .includes(searchTermDefendant.toLowerCase())
  );

  const handleOnSend = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true);

      const targetUserIds = [ComplainantData.user_id, DefendantData.user_id];

      const obj = {
        name: patawagData.name,
        to: [ComplainantData, DefendantData],
        brgy: detail.brgy,
        responses: [
          {
            sender: `${userData.firstName} ${userData.lastName} (${userData.type})`,
            type: "Staff",
            message: `${ResponseData.message}`,
            date: `${ResponseData.date}`,
          },
        ],
        req_id: detail.req_id,
      };

      var formData = new FormData();
      formData.append("patawag", JSON.stringify(obj));

      const res_folder = await axios.get(
        `${API_LINK}/folder/specific/?brgy=${brgy}`
      );

      console.log("obj", obj);
      console.log("targetUserIds: ", targetUserIds);
      // console.log("res_folder: ", res_folder);
      // console.log("createFiles: ", createFiles);

      if (res_folder.status === 200) {
        for (let i = 0; i < createFiles.length; i++) {
          formData.append("files", createFiles[i]);
        }

        const response = await axios.post(
          `${API_LINK}/blotter/?patawag_folder_id=${res_folder.data[0].blotters}`,
          formData
        );

        if (response.status === 200) {
          const notify = {
            category: "One",
            compose: {
              subject: `PATAWAG - ${request.service_name}`,
              message: `A barangay staff has started your blotter request.\n\n
        
              Please update this service request as you've seen this notification!\n\n
              Thank you!!,`,
              go_to: "Patawag",
            },
            target: {
              user_id: targetUserIds,
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
      console.log(error.message);
      setSubmitClicked(false);
      setReplyingStatus("error");
      setError("An error occurred while replying to the service request.");
    }
  };

  const handleSendReply = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true);

      const targetUserIds = [
        blotterDetails?.to[0]?.user_id,
        blotterDetails?.to[1]?.user_id,
      ];

      const obj = {
        sender: `${userData.firstName} ${userData.lastName} (${userData.type})`,
        type: "Staff",
        message: `${ResponseData.message}`,
        date: `${ResponseData.date}`,
        folder_id: blotterDetails.folder_id,
        status: `${ResponseData.status}`,
      };

      console.log("obj", obj);
      var formData = new FormData();
      formData.append("response", JSON.stringify(obj));

      const res_folder = await axios.get(
        `${API_LINK}/folder/specific/?brgy=${brgy}`
      );

      if (res_folder.status === 200) {
        for (let i = 0; i < createFiles.length; i++) {
          formData.append("files", createFiles[i]);
        }

        const response = await axios.patch(
          `${API_LINK}/blotter/?patawag_id=${blotterDetails._id}&patawag_folder_id=${res_folder.data[0].blotters}`,
          formData
        );

        if (response.status === 200) {
          const notify = {
            category: "One",
            compose: {
              subject: `PATAWAG REPLIED - ${request.service_name}`,
              message: `A barangay staff has replied to your patawag conversation.\n\n
        
              Please view and respond as you've seen this notification!\n\n
              Thank you!!,`,
              go_to: "Patawag",
            },
            target: {
              user_id: targetUserIds,
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
      id="hs-replys-modal"
      className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
    >
      {/* Modal */}
      <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
        <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
          {/* Header */}
            <div
              className="py-5 px-3 flex justify-between items-center overflow-hidden rounded-t-2xl bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
              style={{
                background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
              }}
            >
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                PATAWAG
              </h3>
            </div> 

            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
              <div className="flex flex-col w-full">
                <b className="border-solid border-0 w-full border-black/50 border-b-2 mb-4 uppercase font-medium text-lg md:text-lg mb-4">
                  Conversation History
                </b>
                <form>
                  {!blotterDetails ||
                  !blotterDetails.responses ||
                  blotterDetails.responses.length === 0 ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-full mx-2">
                        <div className="relative w-full">
                          <div className="flex flex-col">
                            <div className="mb-4 w-full">
                              <label
                                className="block text-gray-700 text-sm font-bold"
                                htmlFor="title"
                              >
                                Patawag Title
                              </label>
                              {/* Complainant Search Bar */}
                              <input
                                type="text"
                                placeholder="Enter the name for the patawag..."
                                value={patawagData.name}
                                onChange={handlePatawagTitleChange}
                                className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline mt-2"
                              />
                            </div>

                            {/* Complainant Section */}
                            <div className="mb-4 w-full">
                              <div className="flex flex-row space-x-2">
                                <label
                                  className="block text-gray-700 text-sm font-bold flex justify-center items-center"
                                  htmlFor="title"
                                >
                                  Complainant
                                </label>

                                {!customComplainant ? (
                                  <div>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleOnCustomComplainant();
                                        resetComplainantData();
                                      }}
                                      className="hs-tooltip rounded-md px-2 py-1 text-xs bg-teal-800 text-white hover:bg-teal-900 focus:shadow-outline focus:outline-none"
                                    >
                                      <BsPersonFillAdd size={16} />
                                      <span
                                        className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                                        role="tooltip"
                                      >
                                        Add Custom Complainant
                                      </span>
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleOnCustomComplainant();
                                        resetComplainantData();
                                      }}
                                      className="hs-tooltip rounded-md px-2 py-1 text-xs bg-pink-800 text-white hover:bg-pink-900 focus:shadow-outline focus:outline-none"
                                    >
                                      <MdCancel size={16} />
                                      <span
                                        className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                                        role="tooltip"
                                      >
                                        Cancel Custom Complainant
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              {!customComplainant ? (
                                <div>
                                  {/* Complainant Search Bar */}
                                  <input
                                    type="text"
                                    placeholder="Search complainant..."
                                    value={searchTermComplainant}
                                    onChange={(e) =>
                                      setSearchTermComplainant(e.target.value)
                                    }
                                    className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline mt-2"
                                  />

                                  {/* Complainant Select Dropdown */}
                                  <select
                                    id="complainant"
                                    name="complainant"
                                    value={selectedComplainant}
                                    onChange={handleComplainantChange}
                                    className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline mt-2"
                                  >
                                    <option>
                                      -- Select An Existing Resident --
                                    </option>
                                    {filteredUsersComplainant
                                      .filter(
                                        (user, index, self) =>
                                          index ===
                                          self.findIndex(
                                            (u) => u._id === user._id
                                          )
                                      )
                                      .map((user) => (
                                        <option key={user.id} value={user._id}>
                                          {`${user.firstName} ${
                                            user.middleName
                                              ? user.middleName + " "
                                              : ""
                                          } ${user.lastName}`}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              ) : (
                                <div className="flex flex-row mb-4 w-full space-x-2 mt-2">
                                  <div className="flex flex-col w-full">
                                    <label
                                      className="block text-gray-700 text-sm font-bold flex items-center"
                                      htmlFor="firstName"
                                    >
                                      First Name
                                    </label>
                                    <input
                                      type="text"
                                      name="firstName"
                                      placeholder="Enter First Name..."
                                      onChange={(e) =>
                                        setComplainantData((prev) => ({
                                          ...prev,
                                          firstName: e.target.value,
                                        }))
                                      }
                                      className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline mt-2"
                                    />
                                  </div>
                                  <div className="flex flex-col w-full">
                                    <label
                                      className="block text-gray-700 text-sm font-bold flex items-center"
                                      htmlFor="middleName"
                                    >
                                      Middle Name
                                    </label>
                                    <input
                                      type="text"
                                      name="middleName"
                                      placeholder="Enter Middle Name..."
                                      onChange={(e) =>
                                        setComplainantData((prev) => ({
                                          ...prev,
                                          middleName: e.target.value || "",
                                        }))
                                      }
                                      className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline mt-2"
                                    />
                                  </div>
                                  <div className="flex flex-col w-full">
                                    <label
                                      className="block text-gray-700 text-sm font-bold flex items-center"
                                      htmlFor="lastName"
                                    >
                                      Last Name
                                    </label>
                                    <input
                                      type="text"
                                      name="lastName"
                                      placeholder="Enter Last Name..."
                                      onChange={(e) =>
                                        setComplainantData((prev) => ({
                                          ...prev,
                                          lastName: e.target.value,
                                        }))
                                      }
                                      className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline mt-2"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Defendant Section */}
                            <div className="w-full mb-4">
                              <div className="flex flex-row space-x-6">
                                <label
                                  className="block text-gray-700 text-sm font-bold flex justify-center items-center"
                                  htmlFor="title"
                                >
                                  Defendant
                                </label>

                                {!customDefendant ? (
                                  <div>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleOnCustomDefendant();
                                        resetDefendantData();
                                      }}
                                      className="hs-tooltip rounded-md px-2 py-1 text-xs bg-teal-800 text-white hover:bg-teal-900 focus:shadow-outline focus:outline-none"
                                    >
                                      <BsPersonFillAdd size={16} />
                                      <span
                                        className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                                        role="tooltip"
                                      >
                                        Add Custom Defendant
                                      </span>
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleOnCustomDefendant();
                                        resetDefendantData();
                                      }}
                                      className="hs-tooltip rounded-md px-2 py-1 text-xs bg-pink-800 text-white hover:bg-pink-900 focus:shadow-outline focus:outline-none"
                                    >
                                      <MdCancel size={16} />
                                      <span
                                        className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-50 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm "
                                        role="tooltip"
                                      >
                                        Cancel Custom Defendant
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              {!customDefendant ? (
                                <div>
                                  {/* Defendant Search Bar */}
                                  <input
                                    type="text"
                                    placeholder="Search defendant..."
                                    value={searchTermDefendant}
                                    onChange={(e) =>
                                      setSearchTermDefendant(e.target.value)
                                    }
                                    className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline mt-2"
                                  />

                                  {/* Defendant Select Dropdown */}
                                  <select
                                    id="defendant"
                                    name="defendant"
                                    value={selectedDefendant}
                                    onChange={handleDefendantChange}
                                    className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline mt-2"
                                  >
                                    <option>
                                      -- Select An Existing Resident --
                                    </option>
                                    {filteredUsersDefendant
                                      .filter(
                                        (user, index, self) =>
                                          index ===
                                          self.findIndex(
                                            (u) => u._id === user._id
                                          )
                                      )
                                      .map((user) => (
                                        <option key={user.id} value={user._id}>
                                          {`${user.firstName} ${
                                            user.middleName
                                              ? user.middleName + " "
                                              : ""
                                          } ${user.lastName}`}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              ) : (
                                <div className="flex flex-row mb-4 w-full space-x-2 mt-2">
                                  <div className="flex flex-col w-full">
                                    <label
                                      className="block text-gray-700 text-sm font-bold flex items-center"
                                      htmlFor="firstName"
                                    >
                                      First Name
                                    </label>
                                    <input
                                      type="text"
                                      name="firstName"
                                      placeholder="Enter First Name..."
                                      onChange={(e) =>
                                        setDefendantData((prev) => ({
                                          ...prev,
                                          firstName: e.target.value,
                                        }))
                                      }
                                      className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline mt-2"
                                    />
                                  </div>
                                  <div className="flex flex-col w-full">
                                    <label
                                      className="block text-gray-700 text-sm font-bold flex items-center"
                                      htmlFor="middleName"
                                    >
                                      Middle Name
                                    </label>
                                    <input
                                      type="text"
                                      name="middleName"
                                      placeholder="Enter Middle Name..."
                                      onChange={(e) =>
                                        setDefendantData((prev) => ({
                                          ...prev,
                                          middleName: e.target.value || "",
                                        }))
                                      }
                                      className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline mt-2"
                                    />
                                  </div>
                                  <div className="flex flex-col w-full">
                                    <label
                                      className="block text-gray-700 text-sm font-bold flex items-center"
                                      htmlFor="lastName"
                                    >
                                      Last Name
                                    </label>
                                    <input
                                      type="text"
                                      name="lastName"
                                      placeholder="Enter Last Name..."
                                      onChange={(e) =>
                                        setDefendantData((prev) => ({
                                          ...prev,
                                          lastName: e.target.value,
                                        }))
                                      }
                                      className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline mt-2"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <textarea
                            id="message"
                            name="message"
                            onChange={handleChange}
                            rows={7}
                            value={
                              ResponseData.message
                                ? ResponseData.message
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
                                            (!ResponseData.message ||
                                              ResponseData.message.trim() ===
                                                "")
                                          ) {
                                            setResponseData((prev) => ({
                                              ...prev,
                                              message: `The status of your service request is ${e.target.value}`,
                                            }));
                                          }
                                          setResponseData((prev) => ({
                                            ...prev,
                                            status: e.target.value,
                                          }));
                                        }}
                                        className="shadow ml-4 border w-5/6 py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline"
                                        value={ResponseData.status}
                                        hidden={!statusChanger}
                                      >
                                        <option>-- Select Status --</option>
                                        <option value="In Progress">
                                          IN PROGRESS
                                        </option>
                                        <option value="Completed">
                                          COMPLETED
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

                  {blotterDetails &&
                    blotterDetails.responses &&
                    blotterDetails.responses.map((responseItem, index) => (
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
                            {index === blotterDetails.responses.length - 1 && (
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
                                          ResponseData.message
                                            ? ResponseData.message
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
                                                        (!ResponseData.message ||
                                                          ResponseData.message.trim() ===
                                                            "")
                                                      ) {
                                                        setResponseData(
                                                          (prev) => ({
                                                            ...prev,
                                                            message: `The status of your service request is ${e.target.value}`,
                                                          })
                                                        );
                                                      }
                                                      setResponseData(
                                                        (prev) => ({
                                                          ...prev,
                                                          status:
                                                            e.target.value,
                                                        })
                                                      );
                                                    }}
                                                    className="shadow ml-4 border w-5/6 py-2 px-4 text-sm text-black rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:shadow-outline"
                                                    value={ResponseData.status}
                                                    hidden={!statusChanger}
                                                  >
                                                    <option>
                                                      -- Select Status --
                                                    </option>
                                                    <option value="In Progress">
                                                      IN PROGRESS
                                                    </option>
                                                    <option value="Completed">
                                                      COMPLETED
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
                                            <button
                                              type="submit"
                                              onClick={handleSendReply}
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
