import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_LINK from "../../config/API";
import { CiImageOn } from "react-icons/ci";
import { ChromePicker } from "react-color";
import AddLoader from "./loaders/AddLoader";
function CreateAnnouncementModal() {
  const [barangay, setBarangay] = useState({
    brgy: "",
    story: "",
    mission: "",
    vision: "",
    primary: "",
    secondary: "",
    start: "",
    end: "",
    hover: "",
  });

  const [logo, setLogo] = useState();
  const [banner, setBanner] = useState();
  const [submitClicked, setSubmitClicked] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null);
  const [error, setError] = useState(null);

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
    setBarangay((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  console.log("cc", barangay.primary);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (
        !barangay.brgy.trim() ||
        !barangay.story.trim() ||
        !barangay.mission.trim() ||
        !barangay.vision.trim() ||
        !logo ||
        !banner
      ) {
        setError("Please fill out all required fields.");
        return; // Prevent further execution of handleSubmit
      }

      setSubmitClicked(true);
      setError(null);
      const response = await axios.post(
        `${API_LINK}/folder/?brgy=${barangay.brgy}`
      );

      const response2 = await axios.get(
        `${API_LINK}/folder/specific/?brgy=${barangay.brgy}`
      );

      var formData = new FormData();
      formData.append("files", banner);
      formData.append("files", logo);

      const obj = {
        brgy: barangay.brgy,
        story: barangay.story,
        mission: barangay.mission,
        vision: barangay.vision,
        theme: {
          primary: barangay.primary,
          secondary: barangay.secondary,
          gradient: {
            start: barangay.start,
            end: barangay.end,
          },
        },
        hover: barangay.hover,
      };

      formData.append("brgyinfo", JSON.stringify(obj));

      if (response.status === 200) {
        const result = await axios.post(
          `${API_LINK}/brgyinfo/?folder_id=${response2.data[0].info}`,
          formData
        );

        if (result.status === 200) {
          setBarangay({
            brgy: "",
            story: "",
            mission: "",
            vision: "",
          });
          setLogo();
          setBanner();
          console.log("theme success");
          setBanner(null);
          setSubmitClicked(false);
          setCreationStatus("success");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div
        id="hs-modal-addbarangay"
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
                ADD BARANGAY
              </h3>
            </div>

            <div className="flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
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
                      Please insert logo image.
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
                      Please insert banner image.
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="brgy"
                >
                  BARANGAY NAME
                </label>
                <input
                  id="brgy"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    error && !barangay.brgy ? "border-red-500" : ""
                  }`}
                  name="brgy"
                  type="text"
                  value={barangay.brgy}
                  onChange={handleChange}
                  placeholder="Barangay name"
                />
                {error && !barangay.brgy && (
                  <p className="text-red-500 text-xs italic">
                    Please input barangay name.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-bold text-gray-700 "
                >
                  STORY
                </label>
                <textarea
                  id="story"
                  rows={4}
                  name="story"
                  value={barangay.story}
                  onChange={handleChange}
                  className={`block p-2.5 w-full text-sm text-gray-700  rounded-lg border border-gray-300 focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    error && !barangay.story ? "border-red-500" : ""
                  }`}
                  placeholder="Enter barangay story..."
                />
                {error && !barangay.story && (
                  <p className="text-red-500 text-xs italic">
                    Please input barangay story.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-bold text-gray-700 "
                >
                  MISSION
                </label>
                <textarea
                  id="mission"
                  rows={4}
                  name="mission"
                  value={barangay.mission}
                  onChange={handleChange}
                  className={`block p-2.5 w-full text-sm text-gray-700  rounded-lg border border-gray-300 focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    error && !barangay.mission ? "border-red-500" : ""
                  }`}
                  placeholder="Enter barangay mission..."
                />
                {error && !barangay.story && (
                  <p className="text-red-500 text-xs italic">
                    Please input barangay mission.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-bold text-gray-700 "
                >
                  VISION
                </label>
                <textarea
                  id="vision"
                  rows={4}
                  name="vision"
                  value={barangay.vision}
                  onChange={handleChange}
                  className={`block p-2.5 w-full text-sm text-gray-700  rounded-lg border border-gray-300 focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    error && !barangay.vision ? "border-red-500" : ""
                  }`}
                  placeholder="Enter barangay vision..."
                />
                {error && !barangay.vision && (
                  <p className="text-red-500 text-xs italic">
                    Please input barangay mission.
                  </p>
                )}
              </div>
              <hr className="w-full h-12 border border-gray-400 "></hr>
              <label
                className="block text-gray-700 text-sm uppercase font-bold mb-2 mt-2"
                htmlFor="primary-color"
              >
                Customize your ui theme
              </label>
              <hr className="w-full h-12 border border-gray-400 mb-4"></hr>
              <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                <div className="mb-4">
                  <div className="hs-tooltip [--trigger:click] [--placement:bottom] flex justify-start items-center gap-2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="primary-color"
                    >
                      Primary Color
                    </label>
                    <button
                      type="button"
                      className="hs-tooltip-toggle w-4 h-4 mb-2 text-[12px] font-bold inline-flex justify-center items-center gap-2 rounded-full bg-gray-200 border border-gray-200 text-black"
                      data-tip="This primary color as the main color of your User Interface"
                    >
                      ?
                    </button>
                    <span
                      className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
                      role="tooltip"
                    >
                      This primary color will serve as the <br></br>main color
                      of your User Interface
                    </span>
                  </div>
                  <input
                    id="primary-color"
                    className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                    name="primary"
                    type="color"
                    value={barangay.primary}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <div className="hs-tooltip flex justify-start [--trigger:click] [--placement:bottom] items-center gap-2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="primary-color"
                    >
                      Secondary Color
                    </label>
                    <button
                      type="button"
                      className="hs-tooltip-toggle w-4 h-4 mb-2 text-[12px] font-bold inline-flex justify-center items-center gap-2 rounded-full bg-gray-200 border border-gray-200 text-black"
                      data-tip="This primary color as the main color of your User Interface"
                    >
                      ?
                    </button>
                    <span
                      className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
                      role="tooltip"
                    >
                      This secondary color will serve as the <br></br>main color
                      of your User Interface
                    </span>
                  </div>
                  <input
                    id="secondary-color"
                    className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                    name="secondary"
                    type="color"
                    value={barangay.secondary}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <div className="hs-tooltip flex justify-start [--trigger:click] [--placement:bottom] items-center gap-2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="primary-color"
                    >
                      Gradient 1
                    </label>
                    <button
                      type="button"
                      className="hs-tooltip-toggle w-4 h-4 mb-2 text-[12px] font-bold inline-flex justify-center items-center gap-2 rounded-full bg-gray-200 border border-gray-200 text-black"
                      data-tip="This primary color as the main color of your User Interface"
                    >
                      ?
                    </button>
                    <span
                      className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
                      role="tooltip"
                    >
                      This primary color as the main color of your User
                      Interface
                    </span>
                  </div>
                  <input
                    id="gradient-color-1"
                    className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                    name="start"
                    type="color"
                    value={barangay.start}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <div className="hs-tooltip flex justify-start [--trigger:click] [--placement:bottom] items-center gap-2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="primary-color"
                    >
                      Gradient 2
                    </label>
                    <button
                      type="button"
                      className="hs-tooltip-toggle w-4 h-4 mb-2 text-[12px] font-bold inline-flex justify-center items-center gap-2 rounded-full bg-gray-200 border border-gray-200 text-black"
                      data-tip="This primary color as the main color of your User Interface"
                    >
                      ?
                    </button>
                    <span
                      className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
                      role="tooltip"
                    >
                      This primary color as the main color of your User
                      Interface
                    </span>
                  </div>
                  <input
                    id="gradient-color-2"
                    className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                    name="end"
                    type="color"
                    value={barangay.end}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <div className="hs-tooltip flex justify-start [--trigger:click] [--placement:bottom] items-center gap-2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="primary-color"
                    >
                      Hover Color
                    </label>
                    <button
                      type="button"
                      className="hs-tooltip-toggle w-4 h-4 mb-2 text-[12px] font-bold inline-flex justify-center items-center gap-2 rounded-full bg-gray-200 border border-gray-200 text-black"
                      data-tip="This primary color as the main color of your User Interface"
                    >
                      ?
                    </button>
                    <span
                      className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
                      role="tooltip"
                    >
                      This primary color as the main color of your User
                      Interface
                    </span>
                  </div>
                  <input
                    id="text-color"
                    className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                    name="hover"
                    type="color"
                    value={barangay.hover}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                <button
                  type="submit"
                  className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-[#295141] text-white shadow-sm"
                  onClick={handleSubmit}
                >
                  CREATE
                </button>
                <button
                  type="button"
                  className="h-[2.5rem] w-full py-1 px-6  gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                  data-hs-overlay="#hs-modal-addbarangay"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {submitClicked && <AddLoader creationStatus="creating" />}
      {creationStatus && (
        <AddLoader creationStatus={creationStatus} error={error} />
      )}
    </div>
  );
}

export default CreateAnnouncementModal;
