import React from "react";
import { useState, useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import API_LINK from "../../../config/API";
import axios from "axios";
import AddLoader from "./loaders/AddLoader";
import ErrorPopup from "./popup/ErrorPopup";
import GetBrgy from "../../GETBrgy/getbrgy";

function CreateOfficialModal({ brgy }) {
  const information = GetBrgy(brgy);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [empty, setEmpty] = useState(false);
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

  const checkEmptyFields = () => {
    let arr = [];
    const keysToCheck = ["firstName", "middleName", "lastName", "position"];
    for (const key of keysToCheck) {
      if (official[key] === "") {
        arr.push(key);
      }
    }
    setEmptyFields(arr);
    return arr;
  };

  const [pfp, setPfp] = useState();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true);

      const emptyFieldsArr = checkEmptyFields();

      if (emptyFieldsArr.length > 0) {
        setEmpty(true);
        setSubmitClicked(false);
        return;
      }

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

      const res_folder = await axios.get(
        `${API_LINK}/folder/specific/?brgy=${brgy}`
      );



      if (res_folder.status === 200) {
        const result = await axios.post(
          `${API_LINK}/brgyofficial/?brgy=${brgy}&folder_id=${res_folder.data[0].official}`,
          formData
        );

        if (result.status === 200) {
          setOfficial({
            firstName: "",
            middleName: "",
            lastName: "",
            suffix: "",
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
      }
    } catch (err) {
      console.error("Error adding official:", err);
      setSubmitClicked(false);
      setCreationStatus("error");
      setError("An error occurred while creating the announcement.");
    }
  };

  const handlePfpChange = (e) => {
    setPfp(e.target.files[0]);

    var output = document.getElementById("add_pfp");
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
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
            <div
              className="py-5 px-3 flex justify-between items-center overflow-hidden rounded-t-2xl"
              style={{
                background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
              }}
            >
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                CREATE BARANGAY OFFICIAL
              </h3>
            </div>

            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
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

                    <input
                      className="block p-2 mb-2 w-full  mx-auto lg:w-full text-sm text-black rounded-b-xl cursor-pointer bg-gray-100 "
                      type="file"
                      onChange={handlePfpChange}
                      name="pfp"
                      accept="image/*"
                      value={!pfp ? "" : pfp.originalname}
                    />
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
                      name="firstName"
                      className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                        emptyFields.includes("firstName") && "border-red-500"
                      }`}
                      placeholder=""
                      value={official.firstName}
                      onChange={(e) =>
                        setOfficial({ ...official, firstName: e.target.value })
                      }
                    />

                    <h1
                      className="font-medium mb-1 text-black text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      MIDDLE NAME
                    </h1>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                        emptyFields.includes("middleName") && "border-red-500"
                      }`}
                      placeholder=""
                      value={official.middleName}
                      onChange={(e) =>
                        setOfficial({ ...official, middleName: e.target.value })
                      }
                    />

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
                      placeholder="--Optional--"
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
                      name="lastName"
                      className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                        emptyFields.includes("lastName") && "border-red-500"
                      }`}
                      placeholder=""
                      value={official.lastName}
                      onChange={(e) =>
                        setOfficial({ ...official, lastName: e.target.value })
                      }
                    />
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
                      name="position"
                      className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                        emptyFields.includes("position") && "border-red-500"
                      }`}
                      onChange={(e) =>
                        setOfficial({ ...official, position: e.target.value })
                      }
                      value={official.position}
                      required
                    >
                      <option value="" disabled>
                        -- Select Position --
                      </option>
                      <option value="Barangay Chairman">
                        Barangay Chairman
                      </option>
                      <option value="Barangay Kagawad">Barangay Kagawad</option>
                      <option value="SK Chairman">SK Chairman</option>
                      <option value="SK Kagawad">SK Kagawad</option>
                      <option value="Secretary">Secretary</option>
                      <option value="Assistant Secretary">
                        Assistant Secretary
                      </option>
                      <option value="Treasurer">Treasurer</option>
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
                          className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                          id="from_year"
                          onChange={(e) =>
                            setOfficial({
                              ...official,
                              fromYear: e.target.value,
                            })
                          }
                          value={official.fromYear}
                          required
                        />
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
                          className="shadow border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                          id="To_year"
                          onChange={(e) =>
                            setOfficial({ ...official, toYear: e.target.value })
                          }
                          value={official.toYear}
                          required
                        />
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
                  data-hs-overlay="#hs-create-official-modal"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
        {empty && <ErrorPopup />}
        {submitClicked && <AddLoader creationStatus="creating" />}
        {creationStatus && (
          <AddLoader creationStatus={creationStatus} error={error} />
        )}
      </div>
      <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
    </div>
  );
}

export default CreateOfficialModal;
