import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Dropbox from "./Dropbox";
import API_LINK from "../../config/API";
import { CiImageOn } from "react-icons/ci";
import AddLoader from "./loaders/AddLoader";
import ErrorPopup from "./popup/ErrorPopup";

function CreateServiceModal({ brgy }) {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [service, setService] = useState({
    name: "",
    type: "",
    details: "",
    fee: "",
    brgy: brgy,
  });

  console.log(emptyFields);

  const [isLogoSelected, setIsLogoSelected] = useState(false);
  const [isBannerSelected, setIsBannerSelected] = useState(false);

  const [logo, setLogo] = useState();
  const [banner, setBanner] = useState();
  const [files, setFiles] = useState([]);

  const handleLogoChange = (e) => {
    const selectedFile = e.target.files[0];
    setLogo(selectedFile);

    var output = document.getElementById("add_logo");
    output.src = URL.createObjectURL(selectedFile);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  const handleBannerChange = (e) => {
    setBanner(e.target.files[0]);

    var output = document.getElementById("add_banner");
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  const handleChange = (e) => {
    setService((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    e.preventDefault();

    setFiles([...files, ...e.target.files]);
  };

  const getType = (type) => {
    switch (type) {
      case "MUNISIPYO":
        return "Municipality";
      default:
        return "Barangay";
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true);
      const emptyFieldsArr = checkEmptyFieldsForService();

      if (emptyFieldsArr.length > 0) {
        setEmpty(true);
        setSubmitClicked(false);
        return;
      }

      var formData = new FormData();

      const arr1 = [banner, logo];
      const newFiles = arr1.concat(files);

      for (let f = 0; f < newFiles.length; f += 1) {
        formData.append("files", newFiles[f]);
      }

      const obj = {
        name: service.name,
        type: service.type === "" ? "Healthcare" : service.type,
        details: service.details,
        fee: service.fee,
        brgy: service.brgy,
      };

      formData.append("service", JSON.stringify(obj));

      const res_folder = await axios.get(
        `${API_LINK}/folder/specific/?brgy=${brgy}`
      );

      console.log("brgy: ", brgy);
      console.log("res_folder: ", res_folder);

      if (res_folder.status === 200) {
        const response = await axios.post(`${API_LINK}/services/?service_folder_id=${res_folder.data[0].services}`, formData);

        console.log("response: ", response);

        if (response.status === 200) {
          var logoSrc = document.getElementById("logo");
          logoSrc.src =
            "https://thenounproject.com/api/private/icons/4322871/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0";

          var bannerSrc = document.getElementById("banner");
          bannerSrc.src =
            "https://thenounproject.com/api/private/icons/4322871/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0";
          setService({
            name: "",
            type: "",
            details: "",
            fee: "",
            brgy: "",
          });

          const notify = {
            category: "Many",
            compose: {
              subject: `SERVICES - ${service.name}`,
              message: `Barangay ${brgy} is trying to publish a new service named: ${service.name}.\n\n
            
            Please review the new service!\n

            Service Details:\n 
            ${service.details}\n\n
            `,
              go_to: "Services",
            },
            target: {
              user_id: null,
              area: "MUNISIPYO",
            },
            type: "Municipality",
            banner: response.data.collections.banner,
            logo: response.data.collections.logo,
          };

          const result = await axios.post(`${API_LINK}/notification/`, notify, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("Notify: ", notify);
          console.log("Result: ", response);

          if (result.status === 200) {
            setLogo();
            setBanner();
            setFiles([]);
            setSubmitClicked(false);
            setCreationStatus("success");
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        }
      }
    } catch (err) {
      console.log(err);
      setSubmitClicked(false);
      setCreationStatus("error");
      setError("An error occurred while creating the service.");
    }
  };

  const checkEmptyFieldsForService = () => {
    let arr = [];
    const keysToCheck = ["name", "details", "date", "logo", "banner", "fee"]; // Add "logo" and "banner" to the list of keys
    for (const key of keysToCheck) {
      if (key === "logo" && !logo) {
        arr.push(key);
      } else if (key === "banner" && !banner) {
        arr.push(key);
      } else if (service[key] === "") {
        arr.push(key);
      }
    }
    setEmptyFields(arr);
    return arr;
  };

  return (
    <div>
      <div
        id="hs-create-service-modal"
        className="hs-overlay hidden fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center "
      >
        {/* Modal */}
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
          <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full   md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
            {/* Header */}
            <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] overflow-hidden rounded-t-2xl">
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                CREATE SERVICE
              </h3>
            </div>

            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
              <div className="flex mb-4 w-full flex-col md:flex-row sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0">
                <div className="w-full">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="username"
                  >
                    Logo
                  </label>
                  <div className="flex flex-col items-center space-y-2 relative">
                    <div
                      className={`w-full border "border-gray-300"
                      `}
                    >
                      <img
                        className={`${
                          logo ? "" : "hidden"
                        } w-[200px] md:w-[250px]  lg:w-full md:h-[140px] lg:h-[250px] object-cover`}
                        id="add_logo"
                        alt="Current profile photo"
                      />{" "}
                      <CiImageOn
                        size={250}
                        className={`${!logo ? "" : "hidden"} mx-auto`}
                      />
                    </div>
                    <label
                      className={`w-full bg-white border ${
                        emptyFields.includes("logo")
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <span className="sr-only">Choose logo photo</span>
                      <input
                        type="file"
                        onChange={handleLogoChange}
                        name="logo"
                        accept="image/*"
                        value={!logo ? "" : logo.originalname}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      />
                    </label>
                  </div>
                </div>
                <div className="w-full">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="username"
                  >
                    Banner
                  </label>
                  <div className="flex flex-col items-center space-y-2 relative">
                    <div className={`w-full border `}>
                      <img
                        className={`${
                          logo ? "" : "hidden"
                        } w-[200px] md:w-[250px]  lg:w-full md:h-[140px] lg:h-[250px] object-cover`}
                        id="add_banner"
                        alt="Current profile photo"
                      />{" "}
                      <CiImageOn
                        size={250}
                        className={`${!logo ? "" : "hidden"} mx-auto`}
                      />
                    </div>
                    <label
                      className={`w-full bg-white border ${
                        emptyFields.includes("banner")
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <span className="sr-only">Choose banner photo</span>
                      <input
                        type="file"
                        onChange={handleBannerChange}
                        name="banner"
                        accept="image/*"
                        value={!banner ? "" : banner.originalname}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Service Name
                </label>
                <input
                  id="name"
                  className={`shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    emptyFields.includes("name") && "border-red-500"
                  }`}
                  name="name"
                  type="text"
                  value={service.name}
                  onChange={handleChange}
                  placeholder="Service Name"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="type"
                >
                  Service Type
                </label>
                <select
                  name="type"
                  onChange={handleChange}
                  className={`shadow  border w-full py-2 px-4 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    emptyFields.includes("type") && "border-red-500"
                  }`}
                >
                  <option value="Healthcare">Healthcare Services</option>
                  <option value="Education">Education Services</option>
                  <option value="Social Welfare">
                    Social Welfare Services
                  </option>
                  <option value="Security and Safety">
                    Security and Safety Services
                  </option>
                  <option value="Infrastructure">
                    Infrastructure Services
                  </option>
                  <option value="Community">Community Services</option>
                  <option value="Administrative">
                    Administrative Services
                  </option>
                  <option value="Environmental">Environmental Services</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-bold text-gray-700 "
                >
                  Details
                </label>
                <textarea
                  id="message"
                  rows={4}
                  name="details"
                  value={service.details}
                  onChange={handleChange}
                  className={`shadow appearance-none border w-full p-2.5 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    emptyFields.includes("details") && "border-red-500"
                  }`}
                  placeholder="Enter service details..."
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="fee"
                >
                  Service Fee
                </label>
                <input
                  className={`shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                    emptyFields.includes("fee") && "border-red-500"
                  }`}
                  id="fee"
                  name="fee"
                  type="number"
                  value={service.fee}
                  min="0"
                  onChange={handleChange}
                  placeholder="Service Fee"
                />
              </div>
              <Dropbox
                files={files}
                setFiles={setFiles}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
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
                  data-hs-overlay="#hs-create-service-modal"
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
    </div>
  );
}

export default CreateServiceModal;
