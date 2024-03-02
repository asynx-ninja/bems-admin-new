import React from "react";
import { useState } from "react";
import axios from "axios";
import AddSectionDocument from "./AddSectionDocument";
import AddFormLoader from "../../loaders/AddFormLoader";

const AddServicesDocument = ({ service_id, brgy, officials }) => {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setDocument((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [section, setSection] = useState([]);

  const [checked, setChecked] = useState(false);

  const handleFormChange = (e, key) => {
    const newState = { ...form };
    newState[key].checked = e.target.checked;

    setForm(newState);
  };

  const [document, setDocument] = useState({
    form_id: "",
    service_id: "",
    doc_title: "",
    details: "",
    type: "",
    punong_brgy: "",
    witnessed_by: "",
    inputs: [""],
    email: "",
    address: "",
    tel: "",
  });

  const handleSubmit = async (e) => {
    try {
      setSubmitClicked(true);

      const response = await axios.post(
        `http://localhost:8800/api/document/?brgy=${brgy}&form_id=${document.form_id}&checked=${checked}`,
        {
          service_id: service_id,
          doc_title: document.doc_title,
          details: document.details,
          type: document.type,
          punong_brgy: document.punong_brgy,
          witnessed_by: document.witnessed_by,
          inputs: document.inputs,
          email: document.email,
          address: document.address,
          tel: document.tel,
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
            <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#4b7c80] to-[#21556d] overflow-hidden rounded-t-2xl">
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                CREATE SERVICE DOCUMENTS
              </h3>
            </div>
            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb my-2 py-5 px-2 overflow-y-auto relative h-[470px]">
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-black font-medium">
                    SERVE AS ACTIVE DOCUMENT?
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isOpen"
                      onChange={(e) => setChecked(e.target.checked)}
                      checked={checked}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-400 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-800" />
                  </label>
                </div>
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

                    <div className="mb-2">
                      <label
                        htmlFor="message"
                        className="block mb-2 text-sm font-bold text-gray-700 "
                      >
                        Details
                      </label>
                      <textarea
                        id="details"
                        rows={7}
                        name="details"
                        // value={service.details}
                        onChange={handleChange}
                        className="shadow appearance-none border w-full p-2.5 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        placeholder="Enter service details..."
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="type"
                      >
                        Type of Document Layout:
                      </label>
                      <select
                        name="type"
                        onChange={handleChange}
                        className="shadow  border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      >
                        <option>-- Select a Document Type --</option>
                        <option value="Type A">
                          Barangay Certificate without Officials
                        </option>
                        <option value="Type B">
                          Barangay Certificate with Officials
                        </option>
                        <option value="Type C">Cedula</option>
                        <option value="Type D">Barangay ID</option>
                        <option value="Type E">
                          First Time Job Seeker with Oath of Undertaking
                        </option>
                        <option value="Type F">Barangay Clearance</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="type"
                      >
                        Punong Barangay
                      </label>
                      <select
                        name="punong_brgy"
                        onChange={handleChange}
                        className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      >
                        <option>-- Select an Official --</option>
                        {/* Map filtered officials with position "Barangay Chairman" to options */}
                        {officials
                          .filter(
                            (official) =>
                              official.position === "City Mayor"
                          )
                          .map((official) => (
                            <option
                              key={official.user_id}
                              value={official.user_id}
                            >
                              {official.lastName}, {official.firstName}{" "}
                              {official.middleName}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="type"
                      >
                        Witnessed By:
                      </label>
                      <select
                        name="witnessed_by"
                        onChange={handleChange}
                        className="shadow border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      >
                        <option>-- Select an Official --</option>
                        {/* Map filtered officials with position "Barangay Chairman" to options */}
                        {officials
                          .filter(
                            (official) =>
                              official.position === "Vice Mayor"
                          )
                          .map((official) => (
                            <option
                              key={official.user_id}
                              value={official.user_id}
                            >
                              {official.lastName}, {official.firstName}{" "}
                              {official.middleName}
                            </option>
                          ))}
                      </select>
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
                        placeholder="E-mail"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Address
                      </label>
                      <input
                        id="address"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="address"
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
                        Telephone Number
                      </label>
                      <input
                        id="tel"
                        className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="tel"
                        type="number"
                        // value={service.name}
                        onChange={handleChange}
                        placeholder="Telephone Number"
                      />
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* CUSTOMIZE DOCUMENT */}
              <div className="px-4 w-full h-auto overflow-y-auto">
                <fieldset className="border-2 border-black">
                  <legend className=" ml-2 px-2 text-lg font-bold">
                    CUSTOMIZE FIELDS
                  </legend>
                  <AddSectionDocument
                    section={section}
                    setSection={setSection}
                    brgy={brgy}
                    service_id={service_id}
                    document={document}
                    setDocument={setDocument}
                  />
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

export default AddServicesDocument;
