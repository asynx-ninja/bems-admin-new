import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_LINK from "../../config/API";
import { CiImageOn } from "react-icons/ci";
import EditLoader from "./loaders/EditLoader";
function ManageAboutus({ brgy, aboutusInfo, setAboutusinfo }) {
  const [banner, setBanner] = useState();
  const [edit, setEdit] = useState(false);
  const editBannerRef = useRef(null);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    if (e.target.name === "banner") {
      const file = e.target.files[0];
      setBanner(file);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        editBannerRef.current.src = reader.result;
      });
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setAboutusinfo((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    // Check if any field is empty
    if (!aboutusInfo.title || !aboutusInfo.details || !banner) {
      setError("Please fill out all required fields.");
      return; // Prevent further execution of handleSubmit
    }

    // If all fields are filled, proceed with form submission
    setSubmitClicked(true);
    setError(null)

    const response = await axios.get(
      `${API_LINK}/folder/specific/?brgy=${brgy}`
    );
    
   if (response.status === 200){
    const formData = new FormData();
    formData.append("file", banner);
    formData.append("aboutusInfo", JSON.stringify(aboutusInfo));

  
      const result = await axios.patch(
        `${API_LINK}/aboutus/manage/?doc_id=${aboutusInfo._id}&folder_id=${response.data[0].about_us}`,
        formData
      );
      if (result.status === 200) {
        // Handle success
        setTimeout(() => {
          setSubmitClicked(false);
          setUpdatingStatus("success");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }, 1000);
      }
   }
    } catch (err) {
      // Handle errors
      console.error(err);
      setSubmitClicked(false);
      setUpdatingStatus(null);
      setError("An error occurred while updating the info.");
    }
  };

  const handleOnEdit = () => {
    setEdit(!edit);
  };

  const resetForm = () => {

    setError(null);
   
  };
  return (
    <div>
      <div
        id="hs-modal-manageaboutus"
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
                EDIT HOMEPAGE ABOUT US
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
                    htmlFor="banner"
                  >
                    Banner
                  </label>
                  <div className="flex flex-col items-center space-y-2 relative">
                    <div className="w-full border border-gray-300">
                      <img
                        className="w-[200px] md:w-[250px] mx-auto lg:w-full md:h-[140px] lg:h-[250px] object-cover"
                        ref={editBannerRef}
                        src={
                          aboutusInfo.length === 0
                            ? ""
                            : aboutusInfo.banner.link
                        }
                        alt="Current profile photo"
                      />
                    </div>
                    <label className="w-full bg-white border border-gray-300">
                      <span className="sr-only">Choose banner photo</span>
                      <input
                        type="file"
                        onChange={handleChange}
                        disabled={!edit}
                        name="banner"
                        accept="image/*"
                        className="first-line:block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        id="bannerInput"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  ARTICLE TITLE
                </label>
                <input
                  id="title"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    error && !aboutusInfo.title ? "border-red-500" : ""
                  }`}
                  name="title"
                  type="text"
                  value={aboutusInfo.title || ""}
                  disabled={!edit}
                  onChange={handleChange}
                  placeholder="Article name"
                />
                {error && !aboutusInfo.title && (
                  <p className="text-red-500 text-xs italic">
                    Please enter article title.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="details"
                  className="block mb-2 text-sm font-bold text-gray-700 "
                >
                  DETAILS
                </label>
                <textarea
                  id="details"
                  rows={4}
                  name="details"
                  value={aboutusInfo.details || ""}
                  disabled={!edit}
                  onChange={handleChange}
                  className={`block p-2.5 w-full text-sm text-gray-700  rounded-lg border border-gray-300 focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    error && !aboutusInfo.details ? "border-red-500" : ""
                  }`}
                  placeholder="Enter article details..."
                />
                {error && !aboutusInfo.details && (
                  <p className="text-red-500 text-xs italic">
                    Please enter article title.
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              {!edit ? (
                <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                  <button
                    type="button"
                    className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-[#295141] text-white shadow-sm"
                    onClick={handleOnEdit}
                  >
                    EDIT
                  </button>
                  <button
                    type="button"
                    className="h-[2.5rem] w-full py-1 px-6  gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                    data-hs-overlay="#hs-modal-manageaboutus"
                  >
                    CLOSE
                  </button>
                </div>
              ) : (
                <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-[#295141] text-white shadow-sm"
                  >
                    SAVE CHANGES
                  </button>
                  <button
                    type="button"
                    className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                    onClick={() => {
                      handleOnEdit();
                      resetForm();
                    }}
                  >
                    CANCEL
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {submitClicked && <EditLoader updatingStatus="updating" />}
      {updatingStatus && (
        <EditLoader updatingStatus={updatingStatus} error={error} />
      )}
    </div>
  );
}

export default ManageAboutus;
