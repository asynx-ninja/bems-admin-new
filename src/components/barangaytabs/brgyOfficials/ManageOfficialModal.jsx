import React from "react";
import API_LINK from "../../../config/API";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import GetBrgy from "../../GETBrgy/getbrgy";
function ManageOfficialModal({ selectedOfficial, setSelectedOfficial, brgy }) {
  console.log(selectedOfficial);
  const information = GetBrgy(brgy);
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
        e.target.name === "suffix"
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
    setPfp(e.target.files[0]);

    const output = document.getElementById("edit_pfp");
    const reader = new FileReader();

    reader.onload = function () {
      output.src = reader.result;
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (pfp) formData.append("file", pfp);
      formData.append("official", JSON.stringify(selectedOfficial));

      const result = await axios.patch(
        `${API_LINK}/brgyofficial/?brgy=${brgy}&doc_id=${selectedOfficial._id}`,
        formData
      );

      console.log(result);
      setTimeout(() => {
        HSOverlay.close(document.getElementById("hs-modal-editServices"));
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
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
            <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#396288] to-[#013D74] overflow-hidden rounded-t-2xl"   style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}>
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                MANAGE BARANGAY OFFICIAL
              </h3>
            </div>

            <div className="flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
              <div className="flex flex-col">
                <div className="flex flex-col lg:flex-row mb-1">
                  {/* Service Description */}
                  <div class="relative mt-4 flex flex-col w-full lg:w-1/2">
                    {/* Modal Images */}
                    <div class="relative w-full border rounded-t-xl">
                      <div>
                        <img
                          id="edit_pfp"
                          src={selectedOfficial.picture?.link || ""}
                          alt=""
                          className="w-[250px] h-[250px] md:w-full md:h-[350px] lg:w-full lg:h-[250px] rounded-t-xl object-cover"
                        />
                      </div>
                    </div>

                    <input
                      class="block p-2 mb-2 w-full mx-auto lg:w-full text-sm text-black rounded-b-xl cursor-pointer bg-gray-100 "
                      id="file_input"
                      type="file"
                      onChange={handlePfpChange}
                      name="pfp"
                      accept="image/*"
                      value={!pfp ? "" : pfp.originalname}
                      disabled={!edit}
                    />
                  </div>

                  {/* Request Information */}
                  <div className="relative mt-2 lg:mx-6 pb-6 overflow-y-auto flex flex-col w-full lg:w-1/2 h-full rounded-lg space-y-2">
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
                        className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        placeholder=""
                        onChange={handleChange}
                        value={selectedOfficial.firstName}
                        disabled={!edit}
                      />

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
                        className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        placeholder=""
                        onChange={handleChange}
                        value={selectedOfficial.middleName}
                        disabled={!edit}
                      />

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
                        className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        placeholder=""
                        onChange={handleChange}
                        value={selectedOfficial.lastName}
                        disabled={!edit}
                      />
                    </div>
                  </div>
                </div>

                {/* Other info */}
                <b className="border-solid border-0 border-black/50 border-b-2 uppercase font-medium text-lg md:text-lg mt-1">
                  Government Information
                </b>
                <div class="relative mt-5  overflow-y-auto flex flex-col space-y-4">
                  {/* Position and Service Rendered */}
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
                      <option value="Barangay Chairman">
                        Barangay Chairman
                      </option>
                      <option value="Barangay Kagawad">Barangay Kagawad</option>
                      <option value="SK Chairman">SK Chairman</option>
                      <option value="SK Kagawad">SK Kagawad</option>
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
                    <div className="flex flex-row">
                      <div className="w-full md:w-1/5 lg:w-1/6">
                        <label
                          htmlFor="from_year"
                          className=" w-full font-base flex items-center"
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
                    onClick={handleOnEdit}
                  >
                    CANCEL
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
    </div>
  );
}

export default ManageOfficialModal;
