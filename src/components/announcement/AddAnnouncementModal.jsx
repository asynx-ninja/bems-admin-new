import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dropbox from "./Dropbox";
import API_LINK from "../../config/API";
import { CiImageOn } from "react-icons/ci";
import AddLoader from "./loaders/AddLoader";
import { MdError } from "react-icons/md";
import ErrorPopup from "./popup/ErrorPopup";
import moment from "moment";
function CreateAnnouncementModal({ brgy }) {
  const [announcement, setAnnouncement] = useState({
    title: "",
    details: "",
    date: "",
    brgy: brgy,
    isOpen: true,
  });

  const [logo, setLogo] = useState();
  const [banner, setBanner] = useState();
  const [files, setFiles] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [empty, setEmpty] = useState(false);

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);

    var output = document.getElementById("add_logo");
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  const handleBannerChange = (e) => {
    setBanner(e.target.files[0]);

    var output = document.getElementById("add_banner");
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  const handleChange = (e) => {
    setAnnouncement((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "isOpen" ? e.target.checked : e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    e.preventDefault();

    setFiles([...files, ...e.target.files]);
  };

  const clearForm = () => {
    setAnnouncement({
      title: "",
      details: "",
      date: "",
      brgy: "",
    });
    setLogo(null);
    setBanner(null);
    setFiles([]);
    setError(null);
  };

  const getType = (type) => {
    switch (type) {
      case "MUNISIPYO":
        return "Municipality";
      default:
        return "Barangay";
    }
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (
        !announcement.title.trim() ||
        !announcement.details.trim() ||
        !announcement.date.trim() ||
        !files ||
        !banner ||
        !logo
      ) {
        setError("Please fill out all required fields.");
        return; // Prevent further execution of handleSubmit
      }
      setSubmitClicked(true);
      // const emptyFieldsArr = checkEmptyFieldsForAnnouncement();

      // if (emptyFieldsArr.length > 0) {
      //   setEmpty(true);
      //   setSubmitClicked(false);
      //   return;
      // }

      const formData = new FormData();
      const newFiles = [banner, logo, ...files].filter((file) => file);

      for (const file of newFiles) {
        formData.append("files", file);
      }

      const obj = {
        title: announcement.title,
        details: announcement.details,
        date: announcement.date,
        brgy: brgy,
        isOpen: announcement.isOpen,
      };

      formData.append("announcement", JSON.stringify(obj));

      const res_folder = await axios.get(
        `${API_LINK}/folder/specific/?brgy=${brgy}`
      );
      console.log(res_folder);
      if (res_folder.status === 200) {
        const response = await axios.post(
          `${API_LINK}/announcement/?event_folder_id=${res_folder.data[0].events}`,
          formData
        );

        if (response.status === 200) {
          let notify;

          const formattedDate = moment(announcement.date).format(
            "MMMM Do YYYY, h:mm:ss a"
          );
          notify = {
            category: "All",
            compose: {
              subject: `EVENT - ${announcement.title}`,
              message: `Barangay ${brgy} has posted a new event named: ${announcement.title}.\n\n
              
              Event Details:\n 
              ${announcement.details}\n\n
  
              Event Date:
              ${formattedDate}\n\n
              `,
              go_to: "Events",
            },
            target: {
              user_id: null,
              area: null,
            },
            type: getType(brgy),
            banner: response.data.collections.banner,
            logo: response.data.collections.logo,
          };

          const result = await axios.post(`${API_LINK}/notification/`, notify, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (result.status === 200) {
            clearForm();
            setSubmitClicked(false);
            setCreationStatus("success");
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setSubmitClicked(false);
      setCreationStatus("error");
      setError(err.message);
    }
  };

  // const checkEmptyFieldsForAnnouncement = () => {
  //   let arr = [];
  //   const keysToCheck = ["title", "details", "date"];
  //   for (const key of keysToCheck) {
  //     if (announcement[key] === "") {
  //       arr.push(key);
  //     }
  //   }
  //   setEmptyFields(arr);
  //   return arr;
  // };

  return (
    <div>
      <div
        id="hs-modal-add"
        className="hs-overlay hidden fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center "
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
                CREATE MUNICIPALITY EVENT
              </h3>
            </div>

            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
              {error && (
                <div
                  className="max-w-full border-2 mb-4 border-[#bd4444] rounded-xl shadow-lg bg-red-300"
                  role="alert"
                >
                  <div className="flex p-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="flex-shrink-0 h-4 w-4 text-red-600 mt-0.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                      </svg>
                    </div>
                    <div className="ms-3">
                      <p className="text-sm text-gray-700 font-medium ">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                        className={`${
                          logo ? "" : "hidden"
                        } w-[200px] md:w-[250px]  lg:w-full md:h-[140px] lg:h-[250px] object-cover`}
                        id="add_logo"
                        alt="Current profile photo"
                      />{" "}
                      <CiImageOn
                        size={250}
                        className={`${!logo ? "" : "hidden"} mx-auto`}
                      />
                    </div>
                    <label
                      className={`w-full bg-white border   ${
                        error && !logo ? " border-red-500" : "border-gray-300"
                      }`}
                    >
                      <span className="sr-only">Choose logo photo</span>
                      <input
                        type="file"
                        onChange={handleLogoChange}
                        name="logo"
                        accept="image/*"
                        value={!logo ? "" : logo.originalname}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      />
                    </label>
                  </div>
                  {error && !logo && (
                    <p className="text-red-500 text-xs italic">
                      Please select logo image.
                    </p>
                  )}
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
                        className={`${
                          banner ? "" : "hidden"
                        } w-[200px] md:w-[250px]  lg:w-full md:h-[140px] lg:h-[250px] object-cover`}
                        id="add_banner"
                        alt="Current profile photo"
                      />{" "}
                      <CiImageOn
                        size={250}
                        className={`${!banner ? "" : "hidden"} mx-auto`}
                      />
                    </div>
                    <label
                      className={`w-full bg-white border   ${
                        error && !banner ? " border-red-500" : "border-gray-300"
                      }`}
                    >
                      <span className="sr-only">Choose banner photo</span>
                      <input
                        type="file"
                        onChange={handleBannerChange}
                        name="banner"
                        accept="image/*"
                        value={!banner ? "" : banner.originalname}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      />
                    </label>
                  </div>
                  {error && !banner && (
                    <p className="text-red-500 text-xs italic">
                      Please select banner image.
                    </p>
                  )}
                </div>
              </div>

              {/* <div className="flex items-center justify-between mb-2">
                <label className="block sm:text-xs lg:text-sm text-gray-700 font-bold">
                  OPEN FOR ALL?
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isOpen"
                    onChange={handleChange}
                    defaultChecked={announcement.isOpen}
                    className="sr-only peer"
                    disabled
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-400 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-800" />
                </label>
              </div> */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Event Title
                </label>
                <input
                  id="title"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    error && !announcement.title
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  name="title"
                  type="text"
                  value={announcement.title}
                  onChange={handleChange}
                  placeholder="Announcement title"
                  required
                />
                {error && !announcement.title && (
                  <p className="text-red-500 text-xs italic">
                    Please enter a title.
                  </p>
                )}
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
                  name="details"
                  value={announcement.details}
                  onChange={handleChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    error && !announcement.details
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter announcement details..."
                  required
                />
                {error && !announcement.details && (
                  <p className="text-red-500 text-xs italic">
                    Please enter a details.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="fee"
                >
                  Date
                </label>
                <input
                  className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    error && !announcement.date
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  id="date"
                  name="date"
                  type="date"
                  value={announcement.date}
                  onChange={handleChange}
                  required
                />
                {error && !announcement.date && (
                  <p className="text-red-500 text-xs italic">
                    Please enter a date.
                  </p>
                )}
              </div>
              <Dropbox
                files={files}
                setFiles={setFiles}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
                error={error}
                isEmpty={files.length === 0}
              />
            </div>
            <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                <button
                  type="submit"
                  className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-teal-900 text-white shadow-sm"
                  onClick={handleSubmit}
                >
                  CREATE
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="h-[2.5rem] w-full py-1 px-6  gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                  data-hs-overlay="#hs-modal-add"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {empty && <ErrorPopup />}
      {/* <AddLoader /> */}
      {submitClicked && <AddLoader creationStatus="creating" />}
      {creationStatus && (
        <AddLoader creationStatus={creationStatus} error={error} />
      )}
    </div>
  );
}

export default CreateAnnouncementModal;
