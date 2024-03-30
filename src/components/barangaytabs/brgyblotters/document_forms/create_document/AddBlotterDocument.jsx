import React from "react";
import { useState } from "react";
import axios from "axios";
import AddSectionDocument from "./AddSectionDocument";
import AddFormLoader from "../../loaders/AddFormLoader";
import GetBrgy from "../../../../GETBrgy/getbrgy";
import API_LINK from "../../../../../config/API";

const AddBlotterDocument = ({ request, brgy }) => {
  const information = GetBrgy(brgy);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null);
  const [error, setError] = useState(null);

  // console.log("request sa add: ", request)

  // const [section, setSection] = useState([]);

  const [checked, setChecked] = useState(false);

  // const handleFormChange = (e, key) => {
  //   const newState = { ...form };
  //   newState[key].checked = e.target.checked;

  //   setForm(newState);
  // };

  const [document, setDocument] = useState({
    req_id: request.req_id,
    doc_title: "",
    date: "",
    usapin_blg: "",
    reason: "",
    patawag: "",
    complainant: "",
    complainant_address: "",
    accused: "",
    accused_address: "",
    message: "",
    bcpc_vawc: "",
    email: "",
    contact: "",
  });

  const handleChange = (e) => {
    setDocument((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      setSubmitClicked(true);

      const response = await axios.post(
        `${API_LINK}/blotter_documents/?brgy=${brgy}`,
        {
          req_id: request.req_id,
          doc_title: document.doc_title,
          date: document.date,
          usapin_blg: document.usapin_blg,
          reason: document.reason,
          patawag: document.patawag,
          complainant: document.complainant,
          complainant_address: document.complainant_address,
          accused: document.accused,
          accused_address: document.accused_address,
          message: document.message,
          bcpc_vawc: document.bcpc_vawc,
          email: document.email,
          contact: document.contact,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSubmitClicked(false);
      setCreationStatus("success");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.log(err.message);
      setSubmitClicked(false);
      setCreationStatus("error");
      setError(err.message);
    }
  };

  console.log("Document: ", document);

  return (
    <div>
      <div
        id="hs-create-serviceDocument-modal"
        className="hs-overlay hidden fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center "
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
                CREATE BLOTTER DOCUMENTS
              </h3>
            </div>
            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb my-2 py-5 px-2 overflow-y-auto relative h-[470px]">
              <div className="px-4 pb-4">
                {/* DOCUMENT INFORMATION */}
                <fieldset className="border-2 border-black">
                  <legend className="ml-2 px-2 text-lg font-medium">
                    DOCUMENT INFORMATION
                  </legend>
                  <div className="px-4 py-2">
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Document Title
                      </label>
                      <input
                        id="doc_title"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="doc_title"
                        type="text"
                        // value={service.name}
                        onChange={handleChange}
                        placeholder="Document Name"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="fee"
                      >
                        Date
                      </label>
                      <input
                        className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        id="date"
                        name="date"
                        type="date"
                        // value={announcement.date}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Usapin ng Barangay Blg
                      </label>
                      <input
                        id="usapin_blg"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="usapin_blg"
                        type="text"
                        // value={service.name}
                        onChange={handleChange}
                        placeholder="E-mail"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Para sa:
                      </label>
                      <input
                        id="reason"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="reason"
                        type="text"
                        // value={service.name}
                        onChange={handleChange}
                        placeholder="Address"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Patawag
                      </label>
                      <input
                        id="patawag"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="patawag"
                        type="text"
                        // value={service.name}
                        onChange={handleChange}
                        placeholder="Pang ilang patawag..."
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Complainant (Nagreklamo)
                      </label>
                      <input
                        id="complainant"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="complainant"
                        type="text"
                        // value={service.name}
                        onChange={handleChange}
                        placeholder="Complainant"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Complainant Address
                      </label>
                      <input
                        id="complainant_address"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="complainant_address"
                        type="text"
                        // value={service.name}
                        onChange={handleChange}
                        placeholder="Complainant"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Accused (Inereklamo)
                      </label>
                      <input
                        id="accused"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="accused"
                        type="text"
                        // value={service.name}
                        onChange={handleChange}
                        placeholder="Address"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Accused Address
                      </label>
                      <input
                        id="accused_address"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="accused_address"
                        type="text"
                        // value={service.name}
                        onChange={handleChange}
                        placeholder="Complainant"
                      />
                    </div>

                    <div className="mb-2">
                      <label
                        htmlFor="message"
                        className="block mb-2 text-sm font-bold text-gray-700 "
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={7}
                        name="message"
                        // value={service.details}
                        onChange={handleChange}
                        className="shadow appearance-none border w-full p-2.5 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        placeholder="Enter service details..."
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Bcpc / Vawc
                      </label>
                      <input
                        id="bcpc_vawc"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="bcpc_vawc"
                        type="text"
                        // value={service.name}
                        onChange={handleChange}
                        placeholder="Address"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        E-mail
                      </label>
                      <input
                        id="email"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="email"
                        type="text"
                        // value={service.name}
                        onChange={handleChange}
                        placeholder="Address"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Contact Number
                      </label>
                      <input
                        id="contact"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="contact"
                        type="text"
                        // value={service.name}
                        onChange={handleChange}
                        placeholder="Address"
                      />
                    </div>
                  </div>
                </fieldset>
              </div>
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
                  data-hs-overlay="#hs-create-serviceDocument-modal"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
        {submitClicked && <AddFormLoader creationStatus="creating" />}
        {creationStatus && (
          <AddFormLoader creationStatus={creationStatus} error={error} />
        )}
      </div>
    </div>
  );
};

export default AddBlotterDocument;
