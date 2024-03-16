import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import API_LINK from "../../../../../config/API";
import EditSectionDocument from "./EditSectionDocument";
import EditFormLoader from "../../loaders/EditFormLoader";
import GetBrgy from "../../../../GETBrgy/getbrgy";

const EditBlotterDocument = ({ request, brgy }) => {
  const information = GetBrgy(brgy);
  const [details, setDetails] = useState([]);
  const [detail, setDetail] = useState({});
  const [docDetails, setDocDetails] = useState([]);
  const [docDetail, setDocDetail] = useState({});
  const [submitClicked, setSubmitClicked] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    // function to filter
    const fetch = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/blotter_documents/?brgy=${brgy}&req_id=${request.req_id}`
        );

        // filter
        setDocDetails(response.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetch();
  }, [brgy, request]);

  const handleSelectChange = (e) => {
    setDocDetail(docDetails[e.target.value]);
  };

  
  const handleChange = (e) => {
    setDocDetail((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  
  // console.log("Edit document: ", document);
  // console.log("details: ", details);
  // console.log("Doc details: ", docDetails);
  // console.log("Doc detail: ", docDetail);

  const handleSubmit = async (e) => {
    try {
      setSubmitClicked(true);

      const response = await axios.patch(
        `${API_LINK}/blotter_documents/`,
        {
          document: docDetail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      setTimeout(() => {
        setSubmitClicked(false);
        setUpdatingStatus("success");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }, 1000);
    } catch (err) {
      setSubmitClicked(false);
      setUpdatingStatus("error");
      setError(err.message);
    }
  };

  return (
    <div>
      <div
        id="hs-edit-serviceDocument-modal"
        className="hs-overlay hidden fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center "
      >
        {/* Modal */}
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
          <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
            {/* Header */}
            <div className="py-5 px-3 flex justify-between items-center overflow-hidden rounded-t-2xl" style={{
                background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
              }}>
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                EDIT BLOTTER DOCUMENTS
              </h3>
            </div>
            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb my-2 py-5 px-2 overflow-y-auto relative h-[470px]">
              <div className="px-4 pb-2 flex flex-col md:flex-row justify-between items-center">
                <label htmlFor="" className="font-bold uppercase">
                  Select which document to edit:
                </label>
                <select
                  name="form"
                  className="border border-1 border-gray-300 shadow bg-white w-full md:w-6/12 mt-2 md:mt-0 border p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                  onChange={handleSelectChange}
                  defaultValue={""}
                >
                  <option value="" disabled>
                    Select Document
                  </option>
                  {docDetails &&
                    docDetails.map((item, idx) => (
                      <option key={idx} value={idx}>
                        {item.doc_title}
                      </option>
                    ))}
                </select>
              </div>
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
                        value={docDetail.doc_title}
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
                        value={docDetail.date}
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
                        value={docDetail.usapin_blg}
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
                        value={docDetail.reason}
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
                        value={docDetail.patawag}
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
                        value={docDetail.complainant}
                        onChange={handleChange}
                        placeholder="Name of Complainant"
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
                        value={docDetail.complainant_address}
                        onChange={handleChange}
                        placeholder="Complainant Address"
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
                        value={docDetail.accused}
                        onChange={handleChange}
                        placeholder="Name of Accused"
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
                        value={docDetail.accused_address}
                        onChange={handleChange}
                        placeholder="Complainant Address"
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
                        value={docDetail.message}
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
                        value={docDetail.bcpc_vawc}
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
                        value={docDetail.email}
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
                        value={docDetail.contact}
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
                  UPDATE
                </button>
                <button
                  type="button"
                  className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                  data-hs-overlay="#hs-edit-serviceDocument-modal"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
        {submitClicked && <EditFormLoader updatingStatus="updating" />}
        {updatingStatus && (
          <EditFormLoader updatingStatus={updatingStatus} error={error} />
        )}
      </div>
    </div>
  );
};

export default EditBlotterDocument;
