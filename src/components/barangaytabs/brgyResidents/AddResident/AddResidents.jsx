import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../AddResident/Breadcrumbs";

import axios from "axios";
import { useState, useEffect } from "react";
import API_LINK from "../../../../config/API";
import { LiaRandomSolid } from "react-icons/lia";
import { TiDelete } from "react-icons/ti";
import { FaCameraRetro } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import CreateOccupationList from "../CreateOccupationList";
import AddLoader from "../loaders/AddLoader";
import ErrorPopup from "../popup/ErrorPopup";
import GetBrgy from "../../../GETBrgy/getbrgy";
import Webcam from "react-webcam";
import moment from "moment";
import { Link } from "react-router-dom";

const AddResidents = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const brgy = searchParams.get("brgy");

  const WebcamComponent = () => <Webcam />;
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capture, setCapture] = useState(false);

  const information = GetBrgy(brgy);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [user, setUser] = useState({
    user_id: "",
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    age: "",
    contact: "",
    street: "",
    type: "",
    username: "",
    password: "",
    isArchived: false,
    isApproved: "Registered",
    city: "Rodriguez, Rizal",
    brgy: brgy,
    verification: {
      primary_id: "",
      primary_file: [],
      secondary_id: "",
      secondary_file: [],
      selfie: [],
    },
  });


  const checkEmptyFields = () => {
    let arr = [];
    const keysToCheck = [
      "firstName",
      "lastName",
      "age",
      "email",
      "birthday",
      "contact",
      "username",
      "password",
      "street",
    ];
    for (const key of keysToCheck) {
      if (user[key] === "") {
        arr.push(key);
      }
    }
    setEmptyFields(arr);
    return arr;
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      password: "User12345",
    }));
  };

  const handleChange = (e) => {
    setUser((prev) => {
      const createUser = { ...prev, [e.target.name]: e.target.value };

      if (e.target.name === "birthday") {
        createUser.age = calculateAge(createUser.birthday);
      }

      return createUser;
    });
  };

  const handleChange2 = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVerification = (name, value) => {
    setUser((prev) => ({
      ...prev,
      verification: {
        ...prev.verification,
        [name]: value,
      },
    }));
  };

  const handleFileVerification = (name, files) => {
    setUser((prev) => ({
      ...prev,
      verification: {
        ...prev.verification,
        [name]: Array.isArray(prev.verification[name])
          ? [...prev.verification[name], ...files]
          : [...files],
      },
    }));
  };

  const handleDelete = (name, idx, e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop the event from propagating to the parent container

    const newArray = user.verification[name].filter(
      (item, index) => index !== idx
    );

    setUser((prev) => ({
      ...prev,
      verification: {
        ...prev.verification,
        [name]: newArray,
      },
    }));
  };

  const handleOnCapture = () => {
    setCapture(!capture);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setViewerVisible(true);
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

        
          setUser((prev) => ({
            ...prev,
            verification: {
              ...prev.verification,
              selfie: [selfieFile], // Only keep the new selfie, replacing the existing one
            },
          }));
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      },
      [webcamRef, user]
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
            className="rounded-xl w-full h-full p-2"
          />
          <div className="flex items-center justify-center absolute bottom-4 left-1/2 transform -translate-x-1/2 gap-5">
            <button
              onClick={capture}
              className="h-12 w-12 py-1 px-2 rounded-full border text-sm font-base bg-teal-900 text-white shadow-sm "
            >
              <div className="flex items-center justify-center">
                <FaCameraRetro size={20} />
              </div>
            </button>
            <button
              onClick={handleOnCapture}
              className="h-12 w-12 py-1 px-2 rounded-full border text-sm font-base bg-pink-900 text-white shadow-sm"
            >
              <div className="flex items-center justify-center">
                <MdOutlineCancel size={27} />
              </div>
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true);

      const emptyFieldsArr = checkEmptyFields();

      if (emptyFieldsArr.length > 0) {
       
        setEmpty(true);
        setSubmitClicked(false);
      } else {
        const calculatedAge = calculateAge(user.birthday);

        const obj = {
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          suffix: user.suffix,
          religion: user.religion,
          email: user.email,
          birthday: user.birthday,
          age: calculatedAge,
          contact: user.contact,
          sex: user.sex,
          address: { street: user.street, brgy: user.brgy, city: user.city },
          occupation: user.occupation,
          civil_status: user.civil_status,
          type: user.type === "" ? "Resident" : user.type,
          isVoter: user.isVoter,
          isHead: user.isHead,
          isArchived: user.isArchived,
          isApproved: user.isApproved,
          username: user.username,
          password: user.password,
          verification: user.verification,
          primary_id: user.verification.primary_id,
          secondary_id: user.verification.secondary_id,
        };

        const folderResponse = await axios.get(
          `${API_LINK}/folder/specific/?brgy=${brgy}`
        );

        if (folderResponse.status === 200) {
          var formData = new FormData();

          formData.append("user", JSON.stringify(obj));

          if (user.verification && user.verification.selfie) {
            let selfieFile = new File(
              [user.verification.selfie[0]],
              `${user.lastName}, ${user.firstName} - SELFIE`,
              {
                type: "image/jpeg",
                size: user.verification.selfie[0].size,
                uri: user.verification.selfie[0].uri,
              }
            );

            formData.append("files", selfieFile);
          }

          if (user.verification && user.verification.primary_file) {
            for (let i = 0; i < user.verification.primary_file.length; i++) {
              let file = {
                name: `${user.lastName}, ${
                  user.firstName
                } - PRIMARY ID ${moment(new Date()).format("MMDDYYYYHHmmss")}`,
                size: user.verification.primary_file[i].size,
                type: user.verification.primary_file[i].type,
                uri: user.verification.primary_file[i].uri,
              };

          

              formData.append(
                "files",
                new File([user.verification.primary_file[i]], file.name, {
                  type: file.type,
                })
              );
            }
          }

          if (user.verification && user.verification.secondary_file) {
            for (let i = 0; i < user.verification.secondary_file.length; i++) {
              let file = {
                name: `${user.lastName}, ${
                  user.firstName
                } - SECONDARY ID ${moment(new Date()).format(
                  "MMDDYYYYHHmmss"
                )}`,
                uri: user.verification.secondary_file[i].uri,
                type: user.verification.secondary_file[i].type,
                size: user.verification.secondary_file[i].size,
              };

              formData.append(
                "files",
                new File([user.verification.secondary_file[i]], file.name, {
                  type: file.type,
                })
              );
            }
          }

          const response = await axios.post(
            `${API_LINK}/users/?folder_id=${folderResponse.data[0].verification}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
          
            setUser({
              user_id: "",
              firstName: "",
              lastName: "",
              email: "",
              birthday: "",
              age: "",
              contact: "",
              address: "",
              type: "",
              username: "",
              password: "",
              isArchived: false,
              isApproved: "Registered",
              city: "Rodriguez, Rizal",
              brgy: brgy,
              verification: {
                primary_id: "",
                primary_file: [],
                secondary_id: "",
                secondary_file: [],
                selfie: [],
              },
            });

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
      setError("An error occurred while creating resident.");
    }
  };

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

  return (
    <div className="mx-4 mt-8">
      <Breadcrumbs />
      <div className="flex flex-col w-full">
        <div className="">
          <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[50rem]">
            <form>
              <div className="flex mb-4 w-full flex-col md:flex-row sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0">
                <div className="flex flex-col mb-1 w-full">
                  {/* Service Description */}

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
                          className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                            emptyFields.includes("firstName") &&
                            "border-red-500"
                          }`}
                          placeholder=""
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
                          className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                            emptyFields.includes("lastName") && "border-red-500"
                          }`}
                          placeholder=""
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
                          placeholder="--Optional--"
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
                          className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                            emptyFields.includes("birthday") && "border-red-500"
                          }`}
                          placeholder="mm/dd/yyyy"
                          value={birthdayFormat(user.birthday) || ""}
                        />
                      </div>

                      <div className="flex flex-col  ml-2 mt-0 md:ml-2 md:w-[30%]">
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
                          value={calculateAge(user.birthday) || ""}
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
                          className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                            emptyFields.includes("email") && "border-red-500"
                          }`}
                          placeholder=""
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
                          className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                            emptyFields.includes("contact") && "border-red-500"
                          }`}
                          placeholder=""
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
                            className="text-green-500 focus:border-green-500 focus:ring-green-500"
                            onChange={handleChange}
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
                            className="ml-4 md:ml-2 lg:ml-4 text-green-500 focus:border-green-500 focus:ring-green-500"
                          />
                          <label htmlFor="Female" className="ml-2">
                            Female
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <b className="border-solid border-0 border-black/50 border-b-2  uppercase font-medium text-lg md:text-lg">
                    Additional Data
                  </b>
                  <div>
                    <div className="flex flex flex-col md:flex-row mt-2 px-1 md:space-x-2">
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

                      <div className="flex flex-col w-full mt-2 md:mt-0">
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

                    <div className="mt-2 md:mt-4 px-1 flex flex-col md:flex-row w-full">
                      <div className="flex flex-col w-full">
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium"
                        >
                          OCCUPATION
                        </label>
                        <CreateOccupationList handleChange={handleChange} />
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
                          className={`shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                            emptyFields.includes("street") && "border-red-500"
                          }`}
                          placeholder=""
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
                          defaultValue={brgy}
                          disabled
                          className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        >
                          <option value="Balite">Balite</option>
                          <option value="Burgos">Burgos</option>
                          <option value="Geronimo">Geronimo</option>
                          <option value="Macabud">Macabud</option>
                          <option value="Manggahan">Manggahan</option>
                          <option value="Mascap">Mascap</option>
                          <option value="Puray">Puray</option>
                          <option value="Rosario">Rosario</option>
                          <option value="San Isidro">San Isidro</option>
                          <option value="San Jose">San Jose</option>
                          <option value="San Rafael">San Rafael</option>
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
                          onChange={handleChange}
                          className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                          disabled
                        >
                          <option value="Rodriguez, Rizal">
                            Rodriguez, Rizal
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-2 md:mt-4 flex flex-col md:flex-row px-1">
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
                            onChange={handleChange}
                            value="true"
                            className="text-green-500 focus:border-green-500 focus:ring-green-500"
                          />
                          <label htmlFor="Male" className="ml-2">
                            Yes
                          </label>
                          <input
                            type="radio"
                            id="false"
                            name="isVoter"
                            onChange={handleChange}
                            value="false"
                            className="ml-4 text-green-500 focus:border-green-500 focus:ring-green-500"
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
                            onChange={handleChange}
                            value="true"
                            className="text-green-500 focus:border-green-500 focus:ring-green-500"
                          />
                          <label htmlFor="Yes" className="ml-2">
                            Yes
                          </label>
                          <input
                            type="radio"
                            id="false"
                            name="isHead"
                            onChange={handleChange}
                            value="false"
                            className="ml-4 text-green-500 focus:border-green-500 focus:ring-green-500"
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
                          ACTIVE USER
                        </h1>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="false"
                            name="isArchived"
                            onChange={() => handleChange2("isArchived", false)}
                            value="false"
                            className="text-green-500 focus:border-green-500 focus:ring-green-500"
                          />
                          <label htmlFor="Yes" className="ml-2">
                            Yes
                          </label>
                          <input
                            type="radio"
                            id="true"
                            name="isArchived"
                            onChange={() => handleChange2("isArchived", true)}
                            value="true"
                            className="ml-4 text-green-500 focus:border-green-500 focus:ring-green-500"
                          />
                          <label htmlFor="No" className="ml-2">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <b className="border-solid border-0 border-black/50 border-b-2 uppercase font-medium text-lg md:text-lg mt-5">
                    Account
                  </b>
                  <div className="flex flex-row mt-2 md:mt-4 px-1 flex-col md:flex-row">
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
                        className={`shadow appearance-none border w-full p-1.5 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                          emptyFields.includes("username") && "border-red-500"
                        }`}
                        placeholder=""
                      />
                    </div>

                    <div className="flex flex-col mt-2 md:mt-0 md:ml-2 w-full">
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
                          type="text"
                          id="password"
                          name="password"
                          onChange={handleChange}
                          className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-r-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                            emptyFields.includes("password") && "border-red-500"
                          }`}
                          value={user.password}
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
                            name="primary_id"
                            onChange={(event) => {
                              handleVerification(
                                "primary_id",
                                event.target.value
                              );
                            }}
                            className="shadow border w-full py-1.5 px-4 mb-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                          >
                            <option>-- Select Primary ID --</option>
                            <option value="Philippine Passport">
                              Philippine Passport
                            </option>
                            <option value="SSS/GSIS/UMID">SSS/GSIS/UMID</option>
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
                            <option value="NBI Clearance">NBI Clearance</option>
                            <option value="Alien Certification of Registration or Immigrant Certificate of Registration">
                              Alien Certification of Registration or Immigrant
                              Certificate of Registration
                            </option>
                            <option value="PhilHealth ID">PhilHealth ID</option>
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
                              className="block w-full text-sm border rounded-md text-slate-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                          </div>

                          <div className="flex flex-row gap-2 overflow-hidden overflow-x-auto">
                            {user.verification.primary_file &&
                              user.verification.primary_file.length > 0 &&
                              user.verification.primary_file.map(
                                (item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex-none w-[250px] border border-gray-300 rounded-xl bg-gray-300 cursor-pointer"
                                  >
                                    <img
                                      src={URL.createObjectURL(item)}
                                      alt={`Primary File ${idx + 1}`}
                                      className="w-[250px] h-[250px] px-2 pt-2 object-cover rounded-xl"
                                      // onClick={() => handleImageTab(item)}
                                    />
                                    <div className="text-black rounded-b-xl py-1 flex justify-between items-center">
                                      <label className="text-xs pl-2">
                                        {item.name}
                                      </label>

                                      <button
                                        onClick={(e) =>
                                          handleDelete("primary_file", idx, e)
                                        }
                                        className="border-black bg-red-500 hover:bg-white rounded-full justify-center items-center self-center mr-2"
                                      >
                                        <TiDelete
                                          size={20}
                                          className="text-white hover:text-red-500 hover:border-2 rounded-full"
                                        />
                                      </button>
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
                            Secondary ID
                          </label>
                          <select
                            name="secondary_id"
                            onChange={(event) => {
                              handleVerification(
                                "secondary_id",
                                event.target.value
                              );
                            }}
                            className="shadow border w-full py-1.5 px-4 mb-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                          >
                            <option>-- Select Secondary ID --</option>
                            <option value="TIN ID">TIN ID</option>
                            <option value="Postal ID">Postal ID</option>
                            <option value="Barangay Certification">
                              Barangay Certification
                            </option>
                            <option value="GSIS e-Card">GSIS e-Card</option>
                            <option value="Seaman's Book">Seaman's Book</option>
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
                              className="block w-full text-sm border rounded-md text-slate-500 file:mr-4 file:py-2 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                          </div>

                          <div className="flex flex-row gap-2 overflow-hidden overflow-x-auto">
                            {user.verification.secondary_file &&
                              user.verification.secondary_file.length > 0 &&
                              user.verification.secondary_file.map(
                                (item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex-none w-[250px] border border-gray-300 rounded-xl bg-gray-300 cursor-pointer"
                                  >
                                    <img
                                      src={URL.createObjectURL(item)}
                                      alt={`Secondary File ${idx + 1}`}
                                      className="w-[250px] h-[250px] px-2 pt-2 object-cover rounded-xl"
                                      // onClick={() => handleImageTab(item)}
                                    />

                                    <div className="text-black rounded-b-xl py-1 flex justify-between items-center">
                                      <label className="text-xs pl-2">
                                        {item.name}
                                      </label>

                                      <button
                                        onClick={(e) =>
                                          handleDelete("secondary_file", idx, e)
                                        }
                                        className="border-black bg-red-500 hover:bg-white rounded-full justify-center items-center self-center mr-2"
                                      >
                                        <TiDelete
                                          size={20}
                                          className="text-white hover:text-red-500 hover:border-2 rounded-full"
                                        />
                                      </button>
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

                        <div className="w-full flex flex-col justify-center items-center ">
                          {!capture ? (
                            <div className="flex flex-row gap-2 w-full h-full">
                              <div className="w-1/2 h-full">
                                <div className="flex flex-col w-full h-[440px] border border-gray-300 rounded-xl bg-gray-300 cursor-pointer items-center justify-center">
                                  <div className="flex text-gray-700 text-sm font-bold pb-5 rounded-b-xl justify-center">
                                    TAKE A NEW PHOTO
                                  </div>

                                  <button
                                    type="button"
                                    className="h-[2.5rem] w-1/2 justify-center py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-teal-900 text-white shadow-sm mb-2"
                                    onClick={handleOnCapture}
                                  >
                                    OPEN CAMERA
                                  </button>
                                </div>
                              </div>
                              <div className="w-1/2 border border-gray-300 rounded-xl bg-gray-300 cursor-pointer">
                                {user.verification.selfie.length > 0 && (
                                  <img
                                    src={
                                      user.verification.selfie[0] instanceof
                                      File
                                        ? URL.createObjectURL(
                                            user.verification.selfie[0]
                                          )
                                        : user.verification.selfie[0].hasOwnProperty(
                                            "link"
                                          )
                                        ? user.verification.selfie[0].link
                                        : user.verification.selfie[0].uri
                                    }
                                    alt={`Selfie`}
                                    className="w-full h-[410px] p-2 object-cover rounded-xl"
                                  />
                                )}
                                <div className="flex text-gray-700 text-sm font-bold pb-2 ml-2 rounded-b-xl justify-center">
                                  {user?.verification?.selfie[0]?.name}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-row gap-2 w-full h-full">
                              <div className="w-1/2">
                                <div className="w-full border border-gray-300 rounded-xl bg-gray-300 cursor-pointer">
                                  <WebcamCapture />
                                  <div className="flex text-gray-700 text-sm font-bold pb-2 ml-2 rounded-b-xl justify-center">
                                    LIVE CAMERA FEED
                                  </div>
                                </div>
                              </div>
                              <div className="w-1/2 border border-gray-300 rounded-xl bg-gray-300 cursor-pointer">
                                {user.verification.selfie.length > 0 && (
                                  <img
                                    src={
                                      user.verification.selfie[0] instanceof
                                      File
                                        ? URL.createObjectURL(
                                            user.verification.selfie[0]
                                          )
                                        : user.verification.selfie[0].hasOwnProperty(
                                            "link"
                                          )
                                        ? user.verification.selfie[0].link
                                        : user.verification.selfie[0].uri
                                    }
                                    alt={`Selfie`}
                                    className="w-full p-2 object-cover rounded-xl"
                                  />
                                )}
                                <div className="flex text-gray-700 text-sm font-bold pb-2 ml-2 rounded-b-xl justify-center">
                                  {user?.verification?.selfie[0]?.name}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            {/* Buttons */}
            <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-teal-900 text-white shadow-sm"
                >
                  ADD
                </button>
                <Link
                  to={`/residents/?id=${id}&brgy=${brgy}`}
                  type="button"
                  className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm flex items-center justify-center"
                >
                  CLOSE
                </Link>
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
};

export default AddResidents;
