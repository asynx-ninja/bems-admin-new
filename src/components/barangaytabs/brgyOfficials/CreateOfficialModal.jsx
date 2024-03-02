import React from "react";
import { useState, useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import API_LINK from "../../../config/API";
import axios from "axios";
import AddLoader from "./loaders/AddLoader";
import GetBrgy from "../../GETBrgy/getbrgy";
function CreateOfficialModal({ brgy }) {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [official, setOfficial] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    position: "",
    fromYear: "",
    toYear: "",
    brgy: brgy,
  });
  const information = GetBrgy(brgy);
  const [pfp, setPfp] = useState();

  const handlePfpChange = (e) => {
    setPfp(e.target.files[0]);

    var output = document.getElementById("add_pfp");
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (
        !official.firstName.trim() ||
        !official.middleName.trim() ||
        !official.lastName.trim() ||
        !official.fromYear.trim() ||
        !official.toYear.trim() ||
        !official.position.trim() ||
        !pfp
      ) {
        // Highlight empty fields with red border

        setError("Please fill out all required fields.");
        return; // Prevent further execution of handleSubmit
      }

      setSubmitClicked(true);
      setError(null)
      const formData = new FormData();
      formData.append("file", pfp);

      const obj = {
        firstName: official.firstName,
        middleName: official.middleName,
        lastName: official.lastName,
        suffix: official.suffix,
        position: official.position,
        fromYear: official.fromYear,
        toYear: official.toYear,
      };

      formData.append("official", JSON.stringify(obj));

      const result = await axios.post(
        `${API_LINK}/brgyofficial/?brgy=${brgy}`,
        formData
      );

      if (result.status === 200) {
        console.log("Official added successfully!");
        setOfficial({
          name: "",
          position: "",
          fromYear: "",
          toYear: "",
          brgy: "",
        });
        setPfp(null);
        setSubmitClicked(false);
        setCreationStatus("success");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      console.log(err);
      setSubmitClicked(false);
      setCreationStatus(null);
      setError("An error occurred while creating the info.");
    }
  };
  const resetForm = () => {
    setOfficial({
      firstName: "",
      lastName: "",
      middleName: "",
      fromYear: "",
      toYear: "",
      position: "",
    });
    setPfp(null); // Assuming null is the initial state of banner
    setError(null);
    setSubmitClicked(false);
    setCreationStatus(null);
  };
  return (
    <div>
      <div
        id="hs-create-official-modal"
        className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center lg:ml-10 xxl:ml-0"
      >
        {/* Modal */}
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
          <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
            {/* Header */}
            <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] overflow-hidden rounded-t-2xl"  style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}>
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                CREATE BARANGAY OFFICIAL
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
                  <div className="relative mt-4 flex flex-col w-full lg:w-1/2">
                    {/* Modal Images */}
                    <div className="relative w-full overflow-y-auto">
                      <div className="relative w-full border rounded-t-xl">
                        <img
                          className={`${
                            pfp ? "" : "hidden"
                          } w-[250px] h-[250px] md:w-full md:h-[350px] lg:w-full lg:h-[250px] rounded-t-xl object-cover`}
                          id="add_pfp"
                          alt="Current profile photo"
                        />{" "}
                        <CiImageOn
                          size={250}
                          className={`${!pfp ? "" : "hidden"} mx-auto`}
                        />
                      </div>
                    </div>
                    <label
                      className={`w-full bg-white border   ${
                        error && !pfp ? " border-red-500" : "border-gray-300"
                      }`}
                    >
                      <input
                        className={`block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100`}
                        id="officialImage"
                        type="file"
                        onChange={handlePfpChange}
                        name="pfp"
                        accept="image/*"
                        value={!pfp ? "" : pfp.originalname}
                      />
                    </label>
                    {error && !pfp && (
                      <p className="text-red-500 text-xs italic">
                        Please select banner image.
                      </p>
                    )}
                  </div>

                  {/* Request Information */}
                  <div className="relative mt-2 lg:mx-6 pb-6 overflow-y-auto flex flex-col w-full lg:w-1/2 h-full rounded-lg space-y-2">
                    <b className="border-solid border-0 border-black/50 border-b-2  uppercase font-medium text-lg md:text-lg">
                      Personal Informations
                    </b>
                    <h1
                      className="font-medium mb-1 text-black text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      FIRST NAME
                    </h1>
                    <input
                      type="text"
                      id="firstName"
                      className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                        error && !official.firstName ? "border-red-500" : ""
                      }`}
                      placeholder=""
                      value={official.firstName}
                      onChange={(e) => {
                        setOfficial({ ...official, firstName: e.target.value });
                      }}
                    />
                    {error && !official.firstName && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a First name.
                      </p>
                    )}

                    <h1
                      className="font-medium mb-1 text-black text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      MIDDLE NAME
                    </h1>
                    <input
                      type="text"
                      id="middleName"
                      className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                        error && !official.middleName ? "border-red-500" : ""
                      }`}
                      placeholder=""
                      value={official.middleName}
                      onChange={(e) => {
                        setOfficial({
                          ...official,
                          middleName: e.target.value,
                        });
                      }}
                    />
                    {error && !official.middleName && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a middle name.
                      </p>
                    )}
                    <h1
                      className="font-medium mb-1 text-black text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      SUFFIX
                    </h1>
                    <input
                      type="text"
                      id="suffix"
                      className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      placeholder=""
                      value={official.suffix}
                      onChange={(e) =>
                        setOfficial({ ...official, suffix: e.target.value })
                      }
                    />

                    <h1
                      className="font-medium mb-1 text-black text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      LAST NAME
                    </h1>
                    <input
                      type="text"
                      id="lastName"
                      className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                        error && !official.lastName ? "border-red-500" : ""
                      }`}
                      placeholder=""
                      value={official.lastName}
                      onChange={(e) => {
                        setOfficial({ ...official, lastName: e.target.value });
                      }}
                    />
                    {error && !official.lastName && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a last name.
                      </p>
                    )}
                  </div>
                </div>

                {/* Other info */}
                <b className="border-solid border-0 border-black/50 border-b-2 uppercase font-medium text-lg md:text-lg mt-1">
                  Government Information
                </b>
                <div className="relative mt-5  overflow-y-auto flex flex-col space-y-4">
                  {/* Position and Service Rendered */}
                
                  <div className="w-full">
                    <h1
                      className="font-bold text-black mx-auto text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      POSITION
                    </h1>
                    <select
                      id="position"
                      className={`shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                        error && !official.position ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setOfficial({ ...official, position: e.target.value });
                      }}
                      value={official.position}
                      required
                    >
                    <option value="" >
                        -- Select Position --
                      </option>
                      <option value="Barangay Chairman">
                        Barangay Chairman
                      </option>
                      <option value="Barangay Kagawad">Barangay Kagawad</option>
                      <option value="SK Chairman">SK Chairman</option>
                      <option value="SK Kagawad">SK Kagawad</option>
                    </select>
                    {error && !official.position && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a position.
                      </p>
                    )}
                  </div>
                  <div className="w-full mt-2">
                    <h1
                      className="font-bold text-black mx-auto text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      SERVICE RENDERED
                    </h1>

                    {/* Date 1 */}
                    <div className="flex flex-col lg:flex-row mt-2">
                      <div className="w-full lg:w-1/6">
                        <label
                          htmlFor="from_year"
                          className=" w-full font-base flex items-center"
                        >
                          FROM YEAR:{" "}
                        </label>
                      </div>
                      <div className="w-full lg:w-5/6">
                        <input
                          type="month"
                          className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                            error && !official.fromYear ? "border-red-500" : ""
                          }`}
                          id="fromyear"
                          onChange={(e) => {
                            setOfficial({
                              ...official,
                              fromYear: e.target.value,
                            });
                          }}
                          value={official.fromYear}
                          required
                        />
                        {error && !official.fromYear && (
                          <p className="text-red-500 text-xs italic">
                            Please enter a fromyear.
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Date 2 */}
                    <div className="flex flex-col lg:flex-row mt-3">
                      <div className="w-full lg:w-1/6">
                        <label
                          htmlFor="To_year"
                          className=" w-[6rem] flex items-center"
                        >
                          TO YEAR:{" "}
                        </label>
                      </div>
                      <div className="w-full lg:w-5/6">
                        <input
                          type="month"
                          className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                            error && !official.fromYear ? "border-red-500" : ""
                          }`}
                          id="toyear"
                          onChange={(e) => {
                            setOfficial({
                              ...official,
                              toYear: e.target.value,
                            });
                          }}
                          value={official.toYear}
                          required
                        />
                        {error && !official.toYear && (
                          <p className="text-red-500 text-xs italic">
                            Please enter a toyear.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end items-center gap-x-2 py-3 px-6 dark:border-gray-700">
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
                  onClick={resetForm}
                  data-hs-overlay="#hs-create-official-modal"
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
      <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
    </div>
  );
}

export default CreateOfficialModal;
