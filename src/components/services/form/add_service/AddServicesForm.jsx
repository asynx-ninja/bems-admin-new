import React from "react";
import { useState } from "react";
import axios from "axios";
import AddSectionForm from "./AddSectionForm";
import AddFormLoader from "../../loaders/AddFormLoader";

const AddServicesForm = ({ service_id, brgy }) => {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    user_id: { display: "user id", checked: true, type: "text", value: "" },
    firstName: {
      display: "first name",
      checked: true,
      type: "text",
      value: "",
    },
    middleName: {
      display: "middle name",
      checked: true,
      type: "text",
      value: "",
    },
    lastName: { display: "last name", checked: true, type: "text", value: "" },
    suffix: { display: "suffix", checked: true, type: "text", value: "" },
    birthday: { display: "birthday", checked: false, type: "date", value: "" },
    age: { display: "age", checked: false, type: "number", value: 1 },
    sex: { display: "sex", checked: false, type: "radio", value: "" },
    contact: { display: "contact", checked: false, type: "text", value: "" },
    civil_status: {
      display: "civil status",
      checked: false,
      type: "select",
      value: "",
    },
    height: {
      display: "height (ft)",
      checked: false,
      type: "text",
      value: "",
    },
    weight: {
      display: "weight (kg)",
      checked: false,
      type: "number",
      value: 0,
    },
    address: {
      display: "address",
      checked: false,
      type: "text",
      value: "",
    },
    religion: {
      display: "religion",
      checked: false,
      type: "select",
      value: "",
    },
    email: { display: "email", checked: false, type: "email", value: "" },
    occupation: {
      display: "occupation",
      checked: false,
      type: "select",
      value: "",
    },
  });

  const [titleName, setTitleName] = useState("");

  const handleChange = (e) => {
    setTitleName(e.target.value);
  };

  const [section, setSection] = useState([]);

  const [checked, setChecked] = useState(false);

  const handleFormChange = (e, key) => {
    const newState = { ...form };
    newState[key].checked = e.target.checked;

    setForm(newState);
  };

  const handleSubmit = async (e) => {
    try {
      setSubmitClicked(true);

      const response = await axios.post(
        `http://localhost:8800/api/forms/?brgy=${brgy}&service_id=${service_id}&checked=${checked}`,
        {
          form_name: titleName,
          form: form,
          section: section,
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

  console.log("Section in Add Service", section);

  return (
    <div>
      <div
        id="hs-create-serviceForm-modal"
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
                CREATE SERVICE FORM
              </h3>
            </div>
            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb my-2 py-5 px-2 overflow-y-auto relative h-[470px]">
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-black font-medium">
                    SERVE AS ACTIVE FORM?
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
                <div className="my-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    NAME OF EVENT FORM
                  </label>
                  <input
                    id="titleName"
                    className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                    name="titleName"
                    type="text"
                    value={titleName} // Use the updated form_name state here
                    onChange={handleChange}
                    placeholder="Event Form Title"
                  />
                </div>
                {/* PERSONAL INFORMATION */}
                <fieldset className="border-2 border-black">
                  <legend className="ml-2 px-2 text-lg font-medium">
                    PERSONAL INFORMATION
                  </legend>
                  <div className="px-4 py-2">
                    <h1 className="font-medium text-sm">
                      Please select which are you going to display the service
                      form details:
                    </h1>
                    <div className="grid md:grid-cols-3 mt-3">
                      {Object.entries(form).map(([key, value], idx) => {
                        return (
                          <label key={idx} className="font-medium text-sm">
                            <input
                              className="mr-2"
                              type="checkbox"
                              defaultChecked={value.checked}
                              onChange={(e) => handleFormChange(e, key)}
                            />
                            {value.display.toUpperCase()}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </fieldset>
              </div>
              {/* CUSTOMIZE FORM */}
              <div className="px-4 w-full h-auto overflow-y-auto">
                <fieldset className="border-2 border-black">
                  <legend className="ml-2 px-2 text-lg font-bold">
                    CUSTOMIZE FORM
                  </legend>
                  <AddSectionForm section={section} setSection={setSection} />
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
                  data-hs-overlay="#hs-create-serviceForm-modal"
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

export default AddServicesForm;
