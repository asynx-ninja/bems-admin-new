import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import API_LINK from "../../../config/API";
import OccupationList from "./OccupationList";
import { LiaRandomSolid } from "react-icons/lia";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaCameraRetro } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import EditLoader from "./loaders/EditLoader";
import GetBrgy from "../../GETBrgy/getbrgy";
import Webcam from "react-webcam";
import moment from "moment";

function ManageResidentModal({ user, setUser, brgy }) {
  const WebcamComponent = () => <Webcam />;
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const information = GetBrgy(brgy);
  const [edit, setEdit] = useState(false);
  const [capture, setCapture] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [verification, setVerification] = useState({
    ...user.verification,
  });

  useEffect(() => {
    setVerification({ ...user.verification });
  }, [user]);

  console.log("Verification: ", verification);

 

  const religions = [
    "Roman Catholic",
    "Islam",
    "Iglesia ni Cristo",
    "Philippine Independent Church (Aglipayan)",
    "Seventh-day Adventist",
    "Bible Baptist Church",
    "United Church of Christ in the Philippines",
    "Jehovah Witnesses",
    "Church of Christ",
    "Born Again",
    "Other Religous Affiliation",
    // Add more religions here...
  ];

  // USER INFO

  const handleChange2 = (e) => {
    const { name, value, type } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: type === "radio" ? value === "true" : value,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : value,
      age: name === "birthday" ? calculateAge(value) : prev.age,
    }));
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      password: "User12345",
    }));
  };

  const birthdayFormat = (date) => {
    const birthdate = date === undefined ? "" : date.substr(0, 10);
    return birthdate;
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleOnEdit = () => {
    setEdit(!edit);
  };

  const handleOnCapture = () => {
    setCapture(!capture);
  };

  // WEBCAM
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  function WebcamCapture() {
    const webcamRef = React.useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const capture = React.useCallback(
      async (e) => {
        e.preventDefault(); // Prevent the default behavior
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);

        try {
          const response = await fetch(imageSrc);
          const file = await response.blob();

          // Use the existing Blob for selfie with data:image/jpeg;base64 format
          let selfieFile = new File(
            [file],
            `${user.lastName}, ${user.firstName} - SELFIE`,
            {
              type: "image/jpeg",
              size: file.size,
              uri: `data:image/jpeg;base64,${imageSrc.split(",")[1]}`,
            }
          );

          console.log("selfieFile: ", selfieFile);

          setVerification((prev) => ({
            ...prev,
            selfie: selfieFile,
          }));
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      },
      [webcamRef]
    );

    return (
      <>
        <div className="relative">
          <Webcam
            audio={false}
            height={720}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={1280}
            className="rounded-xl"
          />
          <button
            onClick={capture}
            className="h-12 w-12 py-1 px-2 rounded-full border text-sm font-base bg-teal-900 text-white shadow-sm absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex items-center justify-center">
              <FaCameraRetro size={20} />
            </div>
          </button>
        </div>
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured Photo"
            className="w-full h-full px-2 py-2 object-cover rounded-xl mt-2"
          />
        )}
      </>
    );
  }

  // VIEW IMAGE

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setViewerVisible(true);
  };

  const ImageViewer = () => {
    if (!viewerVisible || !selectedImage) {
      return null;
    }

    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-[60] bg-black bg-opacity-75">
        <div className="max-w-3xl w-full max-h-3/4 h-full overflow-hidden">
          <img
            src={selectedImage.link || selectedImage.uri}
            alt="Full Image"
            className="w-full h-full p-10 object-contain"
          />
          <button
            onClick={() => setViewerVisible(false)}
            className="absolute top-4 right-4 text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // VERIFICATION

  const handleVerification = (name, value) => {
    setVerification((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileVerification = (name, files) => {
    // Map the selected files to create a flattened array of file properties
    // const fileObjects = Array.from(files).map((file) => ({
    //   name: file.name,
    //   uri: URL.createObjectURL(file), // Use createObjectURL to get a blob URL
    //   type: file.type,
    //   size: file.size,
    // }));

    setVerification((prev) => ({
      ...prev,
      [name]: [...prev[name], ...files],
    }));
  };

  const handleDelete = (name, idx, e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop the event from propagating to the parent container

    const newArray = verification[name].filter((item, index) => index !== idx);

    console.log("newArray: ", newArray);

    setVerification((prev) => ({
      ...prev,
      [name]: newArray,
    }));
  };

  const checkEmptyVerification = () => {
    const fieldsToCheck = [
      "primary_id",
      "primary_file",
      "secondary_id",
      "secondary_file",
      "selfie",
    ];

    return fieldsToCheck.filter((field) => {
      const value = field
        .split(".")
        .reduce((obj, key) => obj[key], verification);
      return value === null || value === "" || value.length === 0;
    });
  };

  const handleImageTab = (item) => {
    if (item.link) {
      // If the item has a direct link, open it in a new tab
      window.open(item.link, "_blank");
    } else {
      // Handle the case when the item doesn't have a direct link (e.g., show a message)
      console.warn("Image link not available");
    }
  };

  const handleSave = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true);

      // Common logic from handleSubmit
      const arr = checkEmptyVerification();

      if (arr.length === 0) {
        setEmptyFields([]);

        const folderResponse = await axios.get(
          `${API_LINK}/folder/specific/?brgy=${user.address.brgy}`
        );

        if (folderResponse.status === 200) {
          var formData = new FormData();

          const [primarySaved, primaryUpload] =
            verification.primary_file.reduce(
              ([a, b], elem) => {
                return elem.hasOwnProperty("link")
                  ? [[...a, elem], b]
                  : [a, [...b, elem]];
              },
              [[], []]
            );

          const [secondarySaved, secondaryUpload] =
            verification.secondary_file.reduce(
              ([a, b], elem) => {
                return elem.hasOwnProperty("link")
                  ? [[...a, elem], b]
                  : [a, [...b, elem]];
              },
              [[], []]
            );

          formData.append("primarySaved", JSON.stringify(primarySaved));
          formData.append("secondarySaved", JSON.stringify(secondarySaved));
          formData.append("oldVerification", JSON.stringify(user.verification));
          formData.append("newVerification", JSON.stringify(verification));

          console.log("Primary Upload: ", primaryUpload);
          console.log("Primary Saved: ", primarySaved);

          if (!verification.selfie.hasOwnProperty("link")) {
            // Use the existing Blob for selfie
            let selfieFile = new File(
              [verification.selfie],
              `${user.lastName}, ${user.firstName} - SELFIE`,
              {
                type: "image/jpeg",
                size: verification.selfie.size,
                uri: verification.selfie.uri,
              }
            );

            formData.append("files", selfieFile);
          }

          if (primaryUpload.length > 0) {
            for (let i = 0; i < primaryUpload.length; i += 1) {
              let file = {
                name: `${user.lastName}, ${user.firstName} - PRIMARY ID ${moment(new Date()).format("MMDDYYYYHHmmss")}`,
                size: primaryUpload[i].size,
                type: primaryUpload[i].type,
                uri: primaryUpload[i].uri,
              };
          
              console.log("check file: ", file);
          
              formData.append("files", new File([primaryUpload[i]], file.name, { type: file.type }));
            }
          }

          if (secondaryUpload.length > 0)
            for (let i = 0; i < secondaryUpload.length; i += 1) {
              let file = {
                name: `${user.lastName}, ${user.firstName} - SECONDARY ID ${moment(new Date()).format("MMDDYYYYHHmmss")}`,
                uri: secondaryUpload[i].uri,
                type: secondaryUpload[i].type,
                size: secondaryUpload[i].size,
              };

              formData.append("files", new File([secondaryUpload[i]], file.name, { type: file.type }));
            }

          const response = await axios.patch(
            `${API_LINK}/users/verification/?doc_id=${user._id}&user_id=${user.user_id}&root_folder=${folderResponse.data[0].verification}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log(response);

          if (response.status === 200) {
            setVerification(response.data.verification);
          }
        }
      } else {
        setEmptyFields(arr);
      }

      // Common logic for updating user data
      var userFormData = new FormData();
      userFormData.append("users", JSON.stringify(user));

      const userResponse = await axios.patch(
        `${API_LINK}/users/?doc_id=${user._id}`,
        userFormData
      );

      if (userResponse.status === 200) {
        console.log("User update successful:", userResponse.data);
        setTimeout(() => {
          setSubmitClicked(false);
          setUpdatingStatus("success");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }, 1000);
      } else {
        console.error("User update failed. Status:", userResponse.status);
      }
    } catch (err) {
      console.log(err);
      setSubmitClicked(false);
      setUpdatingStatus("error");
      setError("An error occurred while updating data.");
    }
  };

  return (
    <div>
      <div className="">
        <div
          id="hs-modal-editResident"
          className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
        >
          {/* Modal */}
          <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
            <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full   md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
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
                  MANAGE RESIDENT
                </h3>
              </div>

              <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
                <form>
                  <div className="flex mb-4 w-full flex-col md:flex-row sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0">
                    <div className="flex flex-col mb-1 w-full">
                      {/* user Description */}
                      {/* Section 1 */}
                      <div className="relative p-1 pb-6 flex flex-col w-full h-full">
                        <b className="border-solid border-0 border-black/50 border-b-2  uppercase font-medium text-lg md:text-lg">
                          Personal Data
                        </b>
                        <div className="flex flex-col mt-2">
                          <div className="flex flex-col w-full">
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
                              onChange={handleChange}
                              className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              placeholder=""
                              value={user.firstName}
                              disabled={!edit}
                            />
                          </div>

                          <div className="flex flex-col mt-2 w-full">
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
                              onChange={handleChange}
                              className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              placeholder=""
                              value={user.middleName}
                              disabled={!edit}
                            />
                          </div>

                          <div className="flex flex-col mt-2 w-full">
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
                              onChange={handleChange}
                              className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              placeholder=""
                              value={user.lastName}
                              disabled={!edit}
                            />
                          </div>
                        </div>

                        <div className="flex flex-row mt-2">
                          <div className="flex flex-col w-full">
                            <h1
                              className="font-medium mb-1 text-black text-sm"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              SUFFIX
                            </h1>
                            <input
                              type="text"
                              id="suffix"
                              name="suffix"
                              onChange={handleChange}
                              className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              placeholder=""
                              value={user.suffix}
                              disabled={!edit}
                            />
                          </div>

                          <div className="flex flex-col ml-2 w-full">
                            <h1
                              className="font-medium mb-1 text-black text-sm"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              BIRTHDAY
                            </h1>
                            <input
                              type="date"
                              id="birthday"
                              name="birthday"
                              onChange={handleChange}
                              className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              value={birthdayFormat(user.birthday) || ""}
                              disabled={!edit}
                            />
                          </div>

                          <div className="flex flex-col w-full mt-2 md:mt-0 md:ml-3">
                            <h1
                              className="font-medium mb-1 text-black text-sm"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              AGE
                            </h1>
                            <input
                              type="text"
                              id="age"
                              name="age"
                              onChange={handleChange}
                              className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              placeholder=""
                              value={user.age}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row mt-2">
                          <div className="flex flex-col w-full md:w-[36%] lg:w-[40%]">
                            <h1
                              className="font-medium mb-1 text-black text-sm"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              E-MAIL
                            </h1>
                            <input
                              type="text"
                              id="email"
                              name="email"
                              onChange={handleChange}
                              className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              placeholder=""
                              value={user.email}
                              disabled={!edit}
                            />
                          </div>

                          <div className="flex flex-col mt-2 md:mt-0 md:ml-2 w-full md:w-[27%] lg:w-[32%]">
                            <h1
                              className="font-medium mb-1 text-black text-sm"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              CONTACT
                            </h1>
                            <input
                              type="text"
                              id="contact"
                              name="contact"
                              onChange={handleChange}
                              className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              placeholder=""
                              value={user.contact}
                              disabled={!edit}
                            />
                          </div>

                          <div className="w-full md:ml-4 md:w-[20%]">
                            <h1
                              className="font-medium mt-2 text-black text-sm"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              GENDER
                            </h1>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="Male"
                                name="sex"
                                value="Male"
                                onChange={handleChange}
                                checked={user.sex === "Male"}
                                className="text-green-500 focus:border-green-500 focus:ring-green-500"
                                disabled={!edit}
                              />
                              <label htmlFor="Male" className="ml-2">
                                Male
                              </label>
                              <input
                                type="radio"
                                id="Female"
                                name="sex"
                                value="Female"
                                onChange={handleChange}
                                checked={user.sex === "Female"}
                                className="ml-4 md:ml-2 lg:ml-4 text-green-500 focus:border-green-500 focus:ring-green-500"
                                disabled={!edit}
                              />
                              <label htmlFor="Female" className="ml-2">
                                Female
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2 */}
                      <b className="border-solid border-0 border-black/50 border-b-2 uppercase font-medium text-lg md:text-lg">
                        Additional Data
                      </b>
                      <div>
                        <div className="flex flex-row mt-2 px-1 space-x-2">
                          <div className="flex flex-col w-full">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium"
                            >
                              CIVIL STATUS
                            </label>
                            <select
                              id="civil_status"
                              name="civil_status"
                              onChange={handleChange}
                              className="shadow border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              disabled={!edit}
                              value={user.civil_status}
                            >
                              <option>-- Select Status --</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="Legally Separated">
                                Legally Separated
                              </option>
                              <option value="Widowed">Widowed</option>
                            </select>
                          </div>

                          <div className="flex flex-col w-full">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium"
                            >
                              RELIGION
                            </label>
                            <select
                              name="religion"
                              onChange={handleChange}
                              className="shadow border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              disabled={!edit}
                              value={user.religion}
                            >
                              <option value="">-- Select Religion --</option>
                              {religions.map((religion, index) => (
                                <option key={index} value={religion}>
                                  {religion}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="mt-2 px-1 flex flex-col md:flex-row w-full">
                          <div className="flex flex-col w-full">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium"
                            >
                              OCCUPATION
                            </label>
                            <OccupationList
                              edit={edit}
                              handleChange={handleChange}
                              user={user}
                              setUser={setUser}
                            />
                          </div>

                          <div className="flex flex-col w-full mt-2 md:mt-0 md:ml-3">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium"
                            >
                              STREET
                            </label>
                            <input
                              type="text"
                              id="street"
                              name="street"
                              onChange={handleChange}
                              className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              placeholder=""
                              value={user.address?.street}
                              disabled={!edit}
                            />
                          </div>

                          <div className="flex flex-col w-full mt-2 md:mt-0 md:ml-3">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium"
                            >
                              BARANGAY
                            </label>
                            <select
                              id="brgy"
                              name="brgy"
                              onChange={handleChange}
                              className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              disabled={!edit}
                              value={user.address?.brgy}
                            >
                              <option>Select Barangay</option>
                              <option value="BALITE">Balite</option>
                              <option value="BURGOS">Burgos</option>
                              <option value="GERONIMO">Geronimo</option>
                              <option value="MACABUD">Macabud</option>
                              <option value="MANGGAHAN">Manggahan</option>
                              <option value="MASCAP">Mascap</option>
                              <option value="PURAY">Puray</option>
                              <option value="ROSARIO">Rosario</option>
                              <option value="SAN ISIDRO">San Isidro</option>
                              <option value="SAN JOSE">San Jose</option>
                              <option value="SAN RAFAEL">San Rafael</option>
                            </select>
                          </div>

                          <div className="flex flex-col w-full mt-2 md:mt-0 md:ml-3">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium"
                            >
                              CITY
                            </label>
                            <select
                              id="city"
                              name="city"
                              onChange={handleChange2}
                              className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              disabled
                            >
                              <option value="Rodriguez, Rizal">
                                Rodriguez, Rizal
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-col md:flex-row px-1">
                          <div className="w-full">
                            <h1
                              className="font-medium mt-2 text-black text-sm"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              REGISTERED VOTER?
                            </h1>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="true"
                                name="isVoter"
                                onChange={handleChange2}
                                checked={user.isVoter === true}
                                value="true"
                                className="text-green-500 focus:border-green-500 focus:ring-green-500"
                                disabled={!edit}
                              />
                              <label htmlFor="Male" className="ml-2">
                                Yes
                              </label>
                              <input
                                type="radio"
                                id="false"
                                name="isVoter"
                                onChange={handleChange2}
                                value="false"
                                checked={user.isVoter === false}
                                className="ml-4 text-green-500 focus:border-green-500 focus:ring-green-500"
                                disabled={!edit}
                              />
                              <label htmlFor="No" className="ml-2">
                                No
                              </label>
                            </div>
                          </div>

                          <div className="w-full">
                            <h1
                              className="font-medium mt-2 text-black text-sm"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              HEAD OF FAMILY?
                            </h1>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="true"
                                name="isHead"
                                onChange={handleChange2}
                                checked={user.isHead === true}
                                value="true"
                                className="text-green-500 focus:border-green-500 focus:ring-green-500"
                                disabled={!edit}
                              />
                              <label htmlFor="Yes" className="ml-2">
                                Yes
                              </label>
                              <input
                                type="radio"
                                id="false"
                                name="isHead"
                                onChange={handleChange2}
                                value="false"
                                checked={user.isHead === false}
                                className="ml-4 text-green-500 focus:border-green-500 focus:ring-green-500"
                                disabled={!edit}
                              />
                              <label htmlFor="No" className="ml-2">
                                No
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-row px-1">
                          <div className="w-full">
                            <label
                              htmlFor="type"
                              className="block text-sm font-medium"
                            >
                              USER TYPE
                            </label>
                            <select
                              id="type"
                              name="type"
                              onChange={handleChange}
                              className="shadow border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              value={user.type}
                              disabled
                            >
                              <option value="Resident">Resident</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Section 3 */}
                      <b className="border-solid border-0 border-black/50 border-b-2 mt-5 uppercase font-medium text-lg md:text-lg">
                        Account
                      </b>
                      <div className="flex flex-row mt-2 px-1">
                        <div className="flex flex-col w-full">
                          <h1
                            className="font-medium mb-1 text-black text-sm"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            USERNAME
                          </h1>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={handleChange}
                            className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                            value={user.username}
                            placeholder=""
                            disabled={!edit}
                          />
                        </div>

                        <div className="flex flex-col ml-2 w-full">
                          <h1
                            className="font-medium mb-1 text-black text-sm"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            PASSWORD
                          </h1>
                          <div className="flex flex-row w-full md:mr-2">
                            <button
                              className="bg-[#295141] p-2.5 rounded-l-md"
                              onClick={handleButtonClick}
                              disabled={!edit}
                            >
                              <div className="w-full overflow-hidden">
                                <LiaRandomSolid
                                  size={15}
                                  style={{ color: "#ffffff" }}
                                />
                              </div>
                            </button>
                            <label htmlFor="password" className="sr-only">
                              password
                            </label>
                            <input
                              type="password"
                              name="password"
                              id="password"
                              onChange={handleChange}
                              className="shadow appearance-none border w-full p-2 text-sm text-black rounded-r-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              value={user.password?.substring(0, 8)}
                              disabled={!edit}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 4 */}
                      <b className="border-solid border-0 border-black/50 border-b-2 mt-5 uppercase font-medium text-lg md:text-lg">
                        Socials
                      </b>
                      <div className="flex flex-col md:flex-row md:space-x-2 mt-4">
                        <div className="flex flex-row gap-1 md:gap-1.5">
                          <FaFacebookSquare
                            size={24}
                            style={{ color: "#1877F2" }}
                            className="my-auto"
                          />
                          <h1
                            className="font-medium mb-1 mt-1.5 md:my-auto text-black text-sm"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            FACEBOOK
                          </h1>
                        </div>
                        <div>
                          <h1
                            className="font-light mb-1 mt-1.5 text-black text-xs md:text-sm"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            (USERNAME & PROFILE LINK)
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-col mt-1 md:flex-row">
                        <div className="flex flex-col w-full">
                          <input
                            type="text"
                            id="facebook_name"
                            className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                            value={user.socials?.facebook?.name ?? ""}
                            placeholder=""
                            disabled
                          />
                        </div>

                        <div className="flex flex-col mt-2 md:mt-0 md:ml-2 w-full">
                          <div className="flex flex-col w-full md:mr-2">
                            <input
                              type="text"
                              id="facebook_link"
                              className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              value={user.socials?.facebook?.link ?? ""}
                              placeholder=""
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:space-x-2 mt-4">
                        <div className="flex flex-row gap-1 md:gap-1.5">
                          <FaSquareXTwitter
                            size={24}
                            style={{ color: "#14171A" }}
                            className="my-auto"
                          />
                          <h1
                            className="font-medium mb-1 mt-1.5 md:my-auto text-black text-sm"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            TWITTER / X
                          </h1>
                        </div>
                        <div>
                          <h1
                            className="font-light mb-1 mt-1.5 text-black text-xs md:text-sm"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            (USERNAME & PROFILE LINK)
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-col mt-1 md:flex-row">
                        <div className="flex flex-col w-full">
                          <input
                            type="text"
                            id="facebook_name"
                            className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                            value={user.socials?.twitter?.name ?? ""}
                            placeholder=""
                            disabled
                          />
                        </div>

                        <div className="flex flex-col mt-2 md:mt-0 md:ml-2 w-full">
                          <div className="flex flex-col w-full md:mr-2">
                            <input
                              type="text"
                              id="facebook_link"
                              className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              value={user.socials?.twitter?.link ?? ""}
                              placeholder=""
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:space-x-2 mt-4">
                        <div className="flex flex-row gap-1 md:gap-1.5">
                          <FaInstagram
                            size={24}
                            style={{ color: "#E4405F" }}
                            className="my-auto"
                          />
                          <h1
                            className="font-medium mb-1 mt-1.5 md:my-auto text-black text-sm"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            INSTAGRAM
                          </h1>
                        </div>
                        <div>
                          <h1
                            className="font-light mb-1 mt-1.5 text-black text-xs md:text-sm"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            (USERNAME & PROFILE LINK)
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-col mt-1 md:flex-row">
                        <div className="flex flex-col w-full">
                          <input
                            type="text"
                            id="facebook_name"
                            className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                            value={user.socials?.instagram?.name ?? ""}
                            placeholder=""
                            disabled
                          />
                        </div>

                        <div className="flex flex-col mt-2 md:mt-0 md:ml-2 w-full">
                          <div className="flex flex-col w-full md:mr-2">
                            <input
                              type="text"
                              id="facebook_link"
                              className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              value={user.socials?.instagram?.link ?? ""}
                              placeholder=""
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                      <b className="border-solid border-0 border-black/50 border-b-2  uppercase font-medium mt-5 text-lg md:text-lg mb-2">
                        ACCOUNT VERIFICATION
                      </b>
                      <div className="flex mb-4 w-full flex-col md:flex-row sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0">
                        <div className="w-full">
                          <div className="flex flex-col items-center space-y-2 relative">
                            <div className="w-full">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                                htmlFor="name"
                              >
                                Primary ID
                              </label>
                              <select
                                name="type"
                                onChange={(event) => {
                                  handleVerification(
                                    "primary_id",
                                    event.target.value
                                  );
                                }}
                                className="shadow border w-full py-1.5 px-4 mb-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                                disabled={!edit}
                                value={verification.primary_id}
                              >
                                <option>-- Select Primary ID --</option>
                                <option value="Philippine Passport">
                                  Philippine Passport
                                </option>
                                <option value="SSS/GSIS/UMID">
                                  SSS/GSIS/UMID
                                </option>
                                <option value="Driver's License">
                                  Driver's License
                                </option>
                                <option value="PRC ID">PRC ID</option>
                                <option value="OWWA ID">OWWA ID</option>
                                <option value="iDOLE Card">iDOLE Card</option>
                                <option value="Voter's ID">Voter's ID</option>
                                <option value="Voter's Certification">
                                  Voter's Certification
                                </option>
                                <option value="Firearms License">
                                  Firearms License
                                </option>
                                <option value="Senior Citizen ID">
                                  Senior Citizen ID
                                </option>
                                <option value="PWD ID">PWD ID</option>
                                <option value="NBI Clearance">
                                  NBI Clearance
                                </option>
                                <option value="Alien Certification of Registration or Immigrant Certificate of Registration">
                                  Alien Certification of Registration or
                                  Immigrant Certificate of Registration
                                </option>
                                <option value="PhilHealth ID">
                                  PhilHealth ID
                                </option>
                                <option value="GOCC ID">GOCC ID</option>
                                <option value="IBP ID">IBP ID</option>
                                <option value="School ID">School ID</option>
                                <option value="Current Valid ePassport">
                                  Current Valid ePassport
                                </option>
                              </select>
                            </div>

                            <div className="w-full">
                              <div className="mb-4">
                                <span className="sr-only">
                                  Choose profile photo
                                </span>
                                <input
                                  type="file"
                                  name="primary"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleFileVerification(
                                      "primary_file",
                                      e.target.files
                                    )
                                  }
                                  multiple
                                  disabled={!edit}
                                  className="block w-full text-sm border rounded-md text-slate-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                />
                              </div>

                              <div className="flex flex-row gap-2 overflow-hidden overflow-x-auto">
                                {verification.primary_file &&
                                  verification.primary_file.length > 0 &&
                                  verification.primary_file.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex-none w-[250px] border border-gray-300 rounded-xl bg-gray-300 cursor-pointer"
                                    >
                                      <img
                                        src={
                                          item.hasOwnProperty("link")
                                            ? item.link
                                            : item.uri
                                        }
                                        alt={`Primary File ${idx + 1}`}
                                        className="w-[250px] h-[250px] px-2 pt-2 object-cover rounded-xl"
                                        onClick={() => handleImageTab(item)}
                                      />
                                      {/* You can customize the following section based on your needs */}
                                      <div className="text-black rounded-b-xl py-1 flex justify-between items-center">
                                        <label className="text-xs pl-2">
                                          {item.name}
                                        </label>

                                        {edit && (
                                          <button
                                            onClick={(e) =>
                                              handleDelete(
                                                "primary_file",
                                                idx,
                                                e
                                              )
                                            }
                                            className="border-black bg-red-500 hover:bg-white rounded-full justify-center items-center self-center mr-2"
                                          >
                                            <TiDelete
                                              size={20}
                                              className="text-white hover:text-red-500 hover:border-2 rounded-full"
                                            />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-center space-y-2 relative mt-3">
                            <div className="w-full">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                                htmlFor="name"
                              >
                                Secondary ID
                              </label>
                              <select
                                name="type"
                                onChange={(event) => {
                                  handleVerification(
                                    "secondary_id",
                                    event.target.value
                                  );
                                }}
                                className="shadow border w-full py-1.5 px-4 mb-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                                disabled={!edit}
                                value={verification.secondary_id}
                              >
                                <option>-- Select Secondary ID --</option>
                                <option value="TIN ID">TIN ID</option>
                                <option value="Postal ID">Postal ID</option>
                                <option value="Barangay Certification">
                                  Barangay Certification
                                </option>
                                <option value="GSIS e-Card">GSIS e-Card</option>
                                <option value="Seaman's Book">
                                  Seaman's Book
                                </option>
                                <option value="NCWDP Certification">
                                  NCWDP Certification
                                </option>
                                <option value="DSWD Certification">
                                  DSWD Certification
                                </option>
                                <option value="Company ID">Company ID</option>
                                <option value="Police Clearance">
                                  Police Clearance
                                </option>
                                <option value="Barangay Clearance">
                                  Barangay Clearance
                                </option>
                                <option value="Cedula">Cedula</option>
                                <option value="Government Service Record">
                                  Government Service Record
                                </option>
                                <option value="Elementary or High School Form 137 Records">
                                  Elementary or High School Form 137 Records
                                </option>
                                <option value="Transcript of Records from University">
                                  Transcript of Records from University
                                </option>
                                <option value="Land Title">Land Title</option>
                                <option value="PSA Marriage Contract">
                                  PSA Marriage Contract
                                </option>
                                <option value="PSA Birth Certificate">
                                  PSA Birth Certificate
                                </option>
                                <option value="Homeowner's Certification">
                                  Homeowner's Certification
                                </option>
                              </select>
                            </div>

                            <div className="w-full">
                              <div className="mb-4">
                                <span className="sr-only">
                                  Choose profile photo
                                </span>
                                <input
                                  type="file"
                                  name="secondary"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleFileVerification(
                                      "secondary_file",
                                      e.target.files
                                    )
                                  }
                                  multiple
                                  disabled={!edit}
                                  className="block w-full text-sm border rounded-md text-slate-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                />
                              </div>

                              <div className="flex flex-row gap-2 overflow-hidden overflow-x-auto">
                                {verification.secondary_file &&
                                  verification.secondary_file.length > 0 &&
                                  verification.secondary_file.map(
                                    (item, idx) => (
                                      <div
                                        key={idx}
                                        className="flex-none w-[250px] border border-gray-300 rounded-xl bg-gray-300 cursor-pointer"
                                      >
                                        <img
                                          src={
                                            item.hasOwnProperty("link")
                                              ? item.link
                                              : item.uri
                                          }
                                          alt={`Secondary File ${idx + 1}`}
                                          className="w-[250px] h-[250px] px-2 pt-2 object-cover rounded-xl"
                                          onClick={() => handleImageTab(item)}
                                        />
                                        {/* You can customize the following section based on your needs */}
                                        <div className="text-black rounded-b-xl py-1 flex justify-between items-center">
                                          <label className="text-xs pl-2">
                                            {item.name}
                                          </label>

                                          {edit && (
                                            <button
                                              onClick={(e) =>
                                                handleDelete(
                                                  "secondary_file",
                                                  idx,
                                                  e
                                                )
                                              }
                                              className="border-black bg-red-500 hover:bg-white rounded-full justify-center items-center self-center mr-2"
                                            >
                                              <TiDelete
                                                size={20}
                                                className="text-white hover:text-red-500 hover:border-2 rounded-full"
                                              />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-center space-y-2 relative mt-3">
                            <div className="w-full">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                                htmlFor="name"
                              >
                                Selfie of the Resident
                              </label>
                            </div>

                            <div className="w-full">
                              {!edit ? (
                                <div></div>
                              ) : (
                                <div>
                                  {capture ? (
                                    <button
                                      type="button"
                                      className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-900 text-white shadow-sm mb-2"
                                      onClick={handleOnCapture}
                                    >
                                      CANCEL
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-teal-900 text-white shadow-sm mb-2"
                                      onClick={handleOnCapture}
                                    >
                                      TAKE A NEW PHOTO
                                    </button>
                                  )}

                                  {!capture ? (
                                    <div></div>
                                  ) : (
                                    <div>
                                      <WebcamCapture />
                                    </div>
                                  )}
                                </div>
                              )}

                              {verification.selfie &&
                                (Array.isArray(verification.selfie) ? (
                                  verification.selfie.map((item, idx) => <></>)
                                ) : (
                                  <div
                                    className="w-full border border-gray-300 rounded-xl bg-gray-300 cursor-pointer mt-2"
                                    onClick={() =>
                                      handleImageClick(verification.selfie)
                                    }
                                  >
                                    <img
                                      src={
                                        verification.selfie instanceof File
                                          ? URL.createObjectURL(
                                              verification.selfie
                                            )
                                          : verification.selfie.hasOwnProperty(
                                              "link"
                                            )
                                          ? verification.selfie.link
                                          : verification.selfie.uri
                                      }
                                      alt={`Selfie`}
                                      className="w-full h-[400px] px-2 py-2 object-cover rounded-xl"
                                    />
                                    <div className="text-black pb-2 ml-2 rounded-b-xl">
                                      {verification.selfie.name}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              {/* Buttons */}
              <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
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
                      data-hs-overlay="#hs-modal-editResident"
                    >
                      CLOSE
                    </button>
                  </div>
                ) : (
                  <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                    <button
                      type="submit"
                      onClick={handleSave}
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
          {submitClicked && <EditLoader updatingStatus="updating" />}
          {updatingStatus && (
            <EditLoader updatingStatus={updatingStatus} error={error} />
          )}
        </div>
      </div>
      <ImageViewer />
    </div>
  );
}

export default ManageResidentModal;
