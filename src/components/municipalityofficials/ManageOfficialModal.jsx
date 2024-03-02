import React from "react";
import API_LINK from "../../config/API";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import EditLoader from "./loaders/EditLoader";
function ManageOfficialModal({ selectedOfficial, setSelectedOfficial, brgy }) {
  console.log(selectedOfficial);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false);

  const handleOnEdit = () => {
    setEdit(!edit);
  };

  const dateFormat = (date) => {
    const eventdate = date === undefined ? "" : date.substr(0, 7);
    console.log(eventdate);
    return eventdate;
  };

  const handleChange = (e) => {
    setSelectedOfficial((prev) => {
      const updatedOfficial = { ...prev, [e.target.name]: e.target.value };

      // Update the name based on the new input values
      if (
        e.target.name === "lastName" ||
        e.target.name === "firstName" ||
        e.target.name === "middleName" ||
        e.target.name === "suffix" ||
        e.target.name === "details"
      ) {
        updatedOfficial.name = `${updatedOfficial.lastName || ""}, ${
          updatedOfficial.firstName || ""
        } ${updatedOfficial.middleName || ""} ${updatedOfficial.suffix || ""}`;
      }

      return updatedOfficial;
    });
  };


  const [pfp, setPfp] = useState();

  const handlePfpChange = (e) => {
    if (e.target.name === "pfp") {
      const file = e.target.files[0];
      setPfp(file);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          editBannerRef.current.src = reader.result;
        });
        reader.readAsDataURL(e.target.files[0]);
      } else {
        setSelectedOfficial((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      }
    };
  

  const handleSaveChanges = async (e) => {
    try {
      e.preventDefault();
     
      if (
        !selectedOfficial.firstName.trim() ||
        !selectedOfficial.middleName.trim() ||
        !selectedOfficial.lastName.trim() ||
        !selectedOfficial.details.trim() 
      ) {
        // Highlight empty fields with red border
      

 
        setError("Please fill out all required fields.");
        return; // Prevent further execution of handleSubmit
      }

      setSubmitClicked(true);
      setError(null)

      const response = await axios.get(
        `${API_LINK}/folder/specific/?brgy=${brgy}`
      );

    if (response.status === 200){
      const formData = new FormData();
      if (pfp) formData.append("file", pfp);
      formData.append("official", JSON.stringify(selectedOfficial));

      const result = await axios.patch(
        `${API_LINK}/mofficials/?brgy=${brgy}&doc_id=${selectedOfficial._id}&folder_id=${response.data[0].pfp}`,
        formData
      );

      if (result.status === 200) {
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
      console.log(err);
      setSubmitClicked(false);
      setUpdatingStatus(null);
      setError("An error occurred while updating the info.");
    }
  };
  const resetForm = () => {
    setError(null);
    setSubmitClicked(false);
    setCreationStatus(null);
  };

  return (
    <div>
      <div
        id="hs-edit-official-modal"
        class="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center lg:ml-10 xxl:ml-0"
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
                MANAGE BARANGAY OFFICIAL
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
              <div className="flex flex-col">
                <div className="flex flex-col lg:flex-row mb-1">
                  {/* Service Description */}
                  <div class="relative mt-4 flex flex-col w-full">
                    {/* Modal Images */}
                    <div class="relative w-full rounded-t-xl">
                      <div className="mx-auto items-center">
                        <img
                          src={selectedOfficial.picture?.link || ""}
                          alt=""
                          id="add_profile"
                          className="w-[250px] h-[250px] md:w-full md:h-[350px] lg:max-w-[450px] lg:h-[350px] mx-auto rounded-t-xl object-cover"
                        />
                      </div>
                    </div>

                    <input
                      class="block p-2 mb-2 w-[250px] md:w-full lg:max-w-[450px] mx-auto text-sm text-black rounded-b-xl cursor-pointer bg-gray-100 "
                      id="file_input"
                      type="file"
                      onChange={handlePfpChange}
                      name="pfp"
                      accept="image/*"
                      value={!pfp ? "" : pfp.originalname}
                      disabled={!edit}
                    />
                  </div>
                </div>

                {/* Request Information */}
                <div className="relative mt-2 overflow-y-auto flex flex-col w-fullh-full rounded-lg space-y-2">
                  <b className="border-solid border-0 border-black/50 border-b-2  uppercase font-medium text-lg md:text-lg">
                    Personal Informations
                  </b>

                  <div>
                    <h1
                      className="font-medium mb-1 mt-2 text-black text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      FIRST NAME
                    </h1>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                        error && !selectedOfficial.firstName ? "border-red-500" : ""
                      }`}
                      placeholder=""
                      onChange={handleChange}
                      value={selectedOfficial.firstName}
                      disabled={!edit}
                    />
                     {error && !selectedOfficial.firstName && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a First name.
                      </p>
                    )}
                    <h1
                      className="font-medium mb-1 mt-2 text-black text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      MIDDLE NAME
                    </h1>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                        error && !selectedOfficial.middleName ? "border-red-500" : ""
                      }`}
                      placeholder=""
                      onChange={handleChange}
                      value={selectedOfficial.middleName}
                      disabled={!edit}
                    />
                   {error && !selectedOfficial.middleName && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a middle name.
                      </p>
                    )}
                    <h1
                      className="font-medium mb-1 mt-2 text-black text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      SUFFIX
                    </h1>
                    <input
                      type="text"
                      id="suffix"
                      name="suffix"
                      className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      placeholder=""
                      onChange={handleChange}
                      value={selectedOfficial.suffix}
                      disabled={!edit}
                    />

                    <h1
                      className="font-medium mb-1 mt-2 text-black text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      LAST NAME
                    </h1>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                        error && !selectedOfficial.lastName ? "border-red-500" : ""
                      }`}
                      placeholder=""
                      onChange={handleChange}
                      value={selectedOfficial.lastName}
                      disabled={!edit}
                    />
                    {error && !selectedOfficial.lastName && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a last name.
                      </p>
                    )}
                  </div>
                </div>

                {/* Other info */}
                <b className="border-solid border-0 border-black/50 border-b-2 uppercase font-medium text-lg md:text-lg mt-4">
                  Government Information
                </b>
                <div class="relative mt-5  overflow-y-auto flex flex-col space-y-4">
                  {/* Position and Service Rendered */}
                  <div className="w-full">
                    <h1
                      className="font-bold text-black mx-auto text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      DETAILS
                    </h1>
                    <textarea
                      className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                        error && !selectedOfficial.details ? "border-red-500" : ""
                      }`}
                      onChange={handleChange}
                      value={selectedOfficial.details}
                      id="details"
                      name="details"
                      cols="30"
                      rows="8"
                    ></textarea>
                     {error && !selectedOfficial.details && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a details.
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <h1
                      class="font-bold text-black mx-auto text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      POSITION
                    </h1>
                    <select
                      id="position"
                      name="position"
                      className="shadow border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      onChange={handleChange}
                      value={selectedOfficial.position}
                      required
                      disabled={!edit}
                    >
                      <option value="" disabled>
                        Select Position
                      </option>
                      <option value="City Mayor">City Mayor</option>
                      <option value="Vice Mayo">Vice Mayor</option>
                      <option value="Congressman">Congressman</option>
                      <option value="Councilors">Councilors</option>
                      <option value="Sangguniang Kabataan">
                        Sangguniang Kabataan
                      </option>
                    </select>
                  </div>
                  <div className="w-full mt-2">
                    <h1
                      className="font-bold text-black mx-auto text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      SERVICE RENDERED
                    </h1>

                    {/* Date 1 */}
                    <div className="flex flex-col  md:flex-row mt-3">
                      <div className="w-full md:w-1/5 lg:w-1/6">
                        <label
                          htmlFor="From_year"
                          className=" w-[6rem] flex items-center"
                        >
                          FROM YEAR:{" "}
                        </label>
                      </div>
                      <div className="w-full md:w-4/5 lg:w-5/6">
                        <input
                          type="month"
                          className="shadow border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                          id="from_year"
                          name="fromYear"
                          onChange={handleChange}
                          value={dateFormat(selectedOfficial.fromYear)}
                          required
                          disabled={!edit}
                        />
                      </div>
                    </div>
                    {/* Date 2 */}
                    <div className="flex flex-col  md:flex-row mt-3">
                      <div className="w-full md:w-1/5 lg:w-1/6">
                        <label
                          htmlFor="To_year"
                          className=" w-[6rem] flex items-center"
                        >
                          TO YEAR:{" "}
                        </label>
                      </div>
                      <div className="w-full md:w-4/5 lg:w-5/6">
                        <input
                          type="month"
                          className="shadow border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                          id="To_year"
                          name="toYear"
                          onChange={handleChange}
                          value={dateFormat(selectedOfficial.toYear)}
                          required
                          disabled={!edit}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div class="flex justify-end items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              {!edit ? (
                <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                  <button
                    type="button"
                    className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-teal-900 text-white shadow-sm"
                    onClick={handleOnEdit}
                  >
                    EDIT
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                    data-hs-overlay="#hs-edit-official-modal"
                  >
                    CLOSE
                  </button>
                </div>
              ) : (
                <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                  <button
                    type="submit"
                    onClick={handleSaveChanges}
                    className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-teal-900 text-white shadow-sm"
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

export default ManageOfficialModal;
