import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import API_LINK from "../../config/API";
import { LiaRandomSolid } from "react-icons/lia";
import AddLoader from "./loaders/AddLoader";
function AddAdminModal({ brgy, occupation }) {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    user_id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    religion: "",
    email: "",
    birthday: "",
    age: "",
    contact: "",
    sex: "",
    address: "",
    occupation: occupation,
    civil_status: "",
    type: "",
    isVoter: "",
    isHead: "",
    username: "",
    password: "",
    isArchived: false,
    isApproved: "Registered",
    city: "Rodriguez, Rizal",
    brgy: brgy,
  });

  const handleButtonClick = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      password: "User12345",
    }));
  };

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChange2 = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
console.log("g",user.type)
      if (
        !user.firstName.trim() ||
        !user.lastName.trim() ||
        !user.firstName.trim() ||
        !user.birthday.trim() ||
        !user.email.trim() ||
        !user.contact.trim() ||
        !user.sex ||
        !user.civil_status ||
        !user.religion ||
        !user.isVoter ||
        !user.isHead ||
        user.isArchived === undefined ||
        !user.street ||
        !user.username ||
        !user.password
      ) {
        setError("Please fill out all required fields.");
        return; // Prevent further execution of handleSubmit
      }

      setSubmitClicked(true);
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
        type: user.type,
        isVoter: user.isVoter,
        isHead: user.isHead,
        isArchived: user.isArchived,
        isApproved: user.isApproved,
        username: user.username,
        password: user.password,
      };
      const result = await axios.post(`${API_LINK}/municipal_admin/`, obj);

      if (result.status === 200) {
        setUser({
          user_id: "",
          firstName: "",
          middleName: "",
          lastName: "",
          suffix: "",
          religion: "",
          email: "",
          birthday: "",
          age: "",
          contact: "",
          sex: "",
          address: "",
          occupation: "",
          civil_status: "",
          type: "",
          isVoter: "",
          isHead: "",
          username: "",
          password: "",
          isArchived: "",
          isApproved: "",
          city: "Rodriguez, Rizal",
          brgy: brgy,
        });
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
      setError("An error occurred while creating the announcement.");
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
  const resetForm = () => {
    setUser({
      user_id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      religion: "",
      email: "",
      birthday: "",
      age: "",
      contact: "",
      sex: "",
      address: "",
      civil_status: "",
      type: "",
      isVoter: "",
      isHead: "",
      username: "",
      password: "",
    });
    setError(null);
  };
  return (
    <div>
      <div className="">
        <div
          id="hs-modal-addAdmin"
          className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full md:max-h-lg overflow-x-hidden overflow-y-auto flex items-center justify-center"
        >
          {/* Modal */}
          <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
            <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
              {/* Header */}
              <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] overflow-hidden rounded-t-2xl">
                <h3
                  className="font-bold text-white mx-auto md:text-xl text-center"
                  style={{ letterSpacing: "0.3em" }}
                >
                  ADD MUNICIPAL ADMIN ACCOUNT
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
                                error && !user.firstName ? "border-red-500" : ""
                              }`}
                              placeholder=""
                            />
                            {error && !user.firstName && (
                              <p className="text-red-500 text-xs italic">
                                Please enter a first name.
                              </p>
                            )}
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
                              className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                                error && !user.middleName
                                  ? "border-red-500"
                                  : ""
                              }`}
                              placeholder=""
                            />
                            {error && !user.middleName && (
                              <p className="text-red-500 text-xs italic">
                                Please enter a middle name.
                              </p>
                            )}
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
                                error && !user.lastName ? "border-red-500" : ""
                              }`}
                              placeholder=""
                            />
                            {error && !user.lastName && (
                              <p className="text-red-500 text-xs italic">
                                Please enter a last name.
                              </p>
                            )}
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
                              className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              placeholder="mm/dd/yyyy ${
                                error && !user.birthday ? "border-red-500" : ""
                              }`}
                              value={birthdayFormat(user.birthday) || ""}
                            />
                            {error && !user.birthday && (
                              <p className="text-red-500 text-xs italic">
                                Please enter a birthday.
                              </p>
                            )}
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
                                error && !user.email ? "border-red-500" : ""
                              }`}
                              placeholder=""
                            />
                            {error && !user.email && (
                              <p className="text-red-500 text-xs italic">
                                Please enter an email.
                              </p>
                            )}
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
                                error && !user.contact ? "border-red-500" : ""
                              }`}
                              placeholder=""
                            />
                            {error && !user.contact && (
                              <p className="text-red-500 text-xs italic">
                                Please enter a contact.
                              </p>
                            )}
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
                                className={`text-green-500 focus:border-green-500 focus:ring-green-500 
                                ${error && !user.sex ? "border-red-500" : ""}`}
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
                                lassName={`ml-2 md:ml-2 lg:ml-4 text-green-500 focus:border-green-500 focus:ring-green-500  ${
                                  error && !user.sex ? "border-red-500" : ""
                                }`}
                              />
                              <label htmlFor="Female" className="ml-2">
                                Female
                              </label>
                            </div>
                            {error && !user.sex && (
                              <p className="text-red-500 text-xs italic">
                                Please select a gender.
                              </p>
                            )}
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
                              className={`shadow border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                                error && !user.civil_status
                                  ? "border-red-500"
                                  : ""
                              }`}
                            >
                              <option>-- Select Status --</option>
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="Legally Separated">
                                Legally Separated
                              </option>
                              <option value="Widowed">Widowed</option>
                            </select>
                            {error && !user.civil_status && (
                              <p className="text-red-500 text-xs italic">
                                Please select a status.
                              </p>
                            )}
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
                              className={`shadow border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                                error && !user.religion ? "border-red-500" : ""
                              }`}
                            >
                              <option value="">-- Select Religion --</option>
                              {religions.map((religion, index) => (
                                <option key={index} value={religion}>
                                  {religion}
                                </option>
                              ))}
                            </select>
                            {error && !user.religion && (
                              <p className="text-red-500 text-xs italic">
                                Please enter a religion.
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col w-full mt-2 md:mt-0 md:ml-3">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium"
                            >
                              USER TYPE
                            </label>
                            <div className="relative">
                              <select
                                name="type"
                                onChange={handleChange}
                                className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              >
                                 <option>-- Select User Type --</option>
                                <option value="Admin">Admin</option>
                                <option value="Head Admin">Head Admin</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg
                                  className="fill-current h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    className="heroicon-ui"
                                    d="M6 9l6 6 6-6"
                                  />
                                </svg>
                              </div>
                            </div>
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
                            <input
                              type="text"
                              defaultValue={occupation}
                              disabled
                              className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              placeholder=""
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
                              className={`shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                                error && !user.street ? "border-red-500" : ""
                              }`}
                              placeholder=""
                            />
                            {error && !user.street && (
                              <p className="text-red-500 text-xs italic">
                                Please enter a street.
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col w-full mt-2 md:mt-0 md:ml-3">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium"
                            >
                              BARANGAY
                            </label>
                            <input
                              type="text"
                              defaultValue={brgy}
                              disabled
                              className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              placeholder=""
                            />
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
                            {error && !user.isVoter && (
                              <p className="text-red-500 text-xs italic">
                                Please answer this first.
                              </p>
                            )}
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
                            {error && !user.isHead && (
                              <p className="text-red-500 text-xs italic">
                                Please answer this first.
                              </p>
                            )}
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
                                onChange={() =>
                                  handleChange2("isArchived", false)
                                }
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
                                onChange={() =>
                                  handleChange2("isArchived", true)
                                }
                                value="true"
                                className="ml-4 text-green-500 focus:border-green-500 focus:ring-green-500"
                              />
                              <label htmlFor="No" className="ml-2">
                                No
                              </label>
                            </div>
                            {error && user.isArchived === undefined && (
                              <p className="text-red-500 text-xs italic">
                                Please answer this first.
                              </p>
                            )}
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
                            className={`shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline  ${
                              error && !user.username ? "border-red-500" : ""
                            }`}
                            placeholder=""
                          />
                          {error && !user.username && (
                            <p className="text-red-500 text-xs italic">
                              Please enter a username.
                            </p>
                          )}
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
                              name="password"
                              id="password"
                              onChange={handleChange}
                              className={`shadow appearance-none border w-full p-2 text-sm text-black rounded-r-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                                error && !user.password ? "border-red-500" : ""
                              }`}
                              value={user.password}
                            />
                          </div>
                          {error && !user.password && (
                            <p className="text-red-500 text-xs italic">
                              Please enter a password.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              {/* Buttons */}
              <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
                <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-[#295141]  text-white shadow-sm"
                  >
                    ADD
                  </button>
                  <button
                    type="button"
                    className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                    data-hs-overlay="#hs-modal-addAdmin"
                    onClick={resetForm}
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
      </div>
    </div>
  );
}

export default AddAdminModal;
