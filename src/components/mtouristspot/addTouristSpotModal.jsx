import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dropbox from "./Dropbox";
import API_LINK from "../../config/API";
import AddLoader from "./loaders/AddLoader";
function AddTouristSpot({ brgy, section }) {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [touristSpot, settouristSpot] = useState({
    section: section,
    name: "",
    details: "",
    brgy: brgy,
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    settouristSpot((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const editImageRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImages(file);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      editImageRef.current.src = reader.result;
    });
    reader.readAsDataURL(e.target.files[0]);

    setImages([...images, ...e.target.files]);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (
        !touristSpot.name.trim() ||
        !touristSpot.details.trim() ||
        images.length === 0
      ) {
        setError("Please fill out all required fields.");
        return; // Prevent further execution of handleSubmit
      }
      setSubmitClicked(true);
      setError(null)

      const response = await axios.get(
        `${API_LINK}/folder/specific/?brgy=${brgy}`
      );

    if (response.status === 200){
      let formData = new FormData();

      images.forEach((image) => {
        if (image instanceof File) {
          formData.append("files", image);
        } else {
          formData.append("saved", JSON.stringify(image));
        }
      });

      formData.append("touristspot", JSON.stringify(touristSpot));

      const result = await axios.post(`${API_LINK}/tourist_spot/?folder_id=${response.data[0].tourist_spot}`, formData);

      if (result.status === 200) {
        settouristSpot({
          section: "",
          name: "",
          details: "",
          brgy: "",
        });
        setImages([]);
        setSubmitClicked(false);
        setCreationStatus("success");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    }
    } catch (err) {
      console.log(err);
      setSubmitClicked(false);
      setCreationStatus(null);
      setError("An error occurred while creating the info.");
    }
  };
  const resetForm = () => {
    settouristSpot({
      name: "",
      details: "",
      brgy: "",
    });
    setImages([]);
    setError(null);
  };

  return (
    <div>
      <div
        id="hs-modal-addtouristspot"
        className="hs-overlay hidden fixed top-0 left-0 z-[70] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
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
                ADD TOURIST SPOT
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
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  NAME
                </label>
                <input
                  id="name"
                  className={`shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    error && !touristSpot.name ? "border-red-500" : ""
                  }`}
                  name="name"
                  type="text"
                  value={touristSpot.name}
                  onChange={handleChange}
                  placeholder="Tourist spot name"
                />
                {error && !touristSpot.name && (
                  <p className="text-red-500 text-xs italic">
                    Please enter a tourist spot name.
                  </p>
                )}
              </div>
              {/* <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  LOCATION
                </label>
                <input
                  id="brgy"
                  className={`shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    error && !touristSpot.brgy ? "border-red-500" : ""
                  }`}
                  name="brgy"
                  type="text"
                  value={touristSpot.brgy}
                  onChange={handleChange}
                  placeholder="Tourist spot location"
                />
                {error && !touristSpot.brgy && (
                  <p className="text-red-500 text-xs italic">
                    Please enter a brgy location.
                  </p>
                )}
              </div> */}

              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-bold text-gray-700 "
                >
                  DETAILS
                </label>
                <textarea
                  id="details"
                  rows={8}
                  name="details"
                  value={touristSpot.details}
                  onChange={handleChange}
                  className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    error && !touristSpot.details ? "border-red-500" : ""
                  }`}
                  placeholder="Enter tourist spot details..."
                />
                {error && !touristSpot.details && (
                  <p className="text-red-500 text-xs italic">
                    Please enter a details.
                  </p>
                )}
              </div>

              <Dropbox
                editImageRef={editImageRef}
                images={images}
                setImages={setImages}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
                id="imageInput"
                error={error}
                isEmpty={images.length === 0}
              />
              
            </div>

            {/* Buttons */}
            <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                <button
                  type="button"
                  className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-teal-900 text-white shadow-sm"
                  onClick={handleSubmit}
                >
                  CREATE
                </button>
                <button
                  type="button"
                  className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                  data-hs-overlay="#hs-modal-addtouristspot"
                  onClick={resetForm}
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

export default AddTouristSpot;
