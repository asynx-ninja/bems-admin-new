import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import API_LINK from "../../config/API";
import { LiaRandomSolid } from "react-icons/lia";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import EditLoader from "./loaders/EditLoader";
function ManageAdminModal({ user, setUser }) {
  const [edit, setEdit] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [error, setError] = useState(null);
  const handleOnEdit = () => {
    setEdit(!edit);
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

  const handleSave = async (e) => {
    try {
      e.preventDefault();
      if (
        !user.firstName.trim() ||
        !user.lastName.trim() ||
        !user.firstName.trim() ||
        !user.birthday.trim() ||
        !user.email.trim() ||
        !user.contact.trim() ||
        !user.gender ||
        !user.civil_status ||
        !user.religion ||
        !user.occupation ||
        !user.isVoter ||
        !user.isHead ||
        !user.street ||
        !user.username ||
        !user.password
      ) 
      // {
      //   setError("Please fill out all required fields.");
      //   return; // Prevent further execution of handleSubmit
      // }
      setSubmitClicked(true);
      var formData = new FormData();
      formData.append("users", JSON.stringify(user));

      const response = await axios.patch(
        `${API_LINK}/brgy_admin/?doc_id=${user._id}`,
        formData
      );

      if (response.status === 200) {
        console.log("Update successful:", response.data);
        setTimeout(() => {
          // HSOverlay.close(document.getElementById("hs-modal-editAnnouncement"));
          setSubmitClicked(false);
          setUpdatingStatus("success");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }, 1000);

      } else {
        console.error("Update failed. Status:", response.status);
      }
    } catch (err) {
      console.log(err);
      setSubmitClicked(false);
      setUpdatingStatus(null);
      setError("An error occurred while creating the announcement.");
    }
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
  const resetForm = () => {

    setError(null);
   
  };
  return (
    <div>
       
      <div className="">
        <div
          id="hs-modal-editAdmin"
          className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
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
                  MANAGE ADMIN ACCOUNT
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
                              value={user.firstName}
                              disabled={!edit}
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
                              value={user.middleName}
                              disabled={!edit}
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
                              value={user.lastName}
                              disabled={!edit}
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
                              className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                                error && !user.email ? "border-red-500" : ""
                              }`}
                              placeholder=""
                              value={user.email}
                              disabled={!edit}
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
                              value={user.contact}
                              disabled={!edit}
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
                              className={`shadow border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                                error && !user.civil_status
                                  ? "border-red-500"
                                  : ""
                              }`}
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
                            {error && !user.civil_status && (
                              <p className="text-red-500 text-xs italic">
                                Please select a status.
                              </p>
                            )}
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
                              className={`shadow border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                                error && !user.religion ? "border-red-500" : ""
                              }`}
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
                            {error && !user.religion && (
                              <p className="text-red-500 text-xs italic">
                                Please enter a religion.
                              </p>
                            )}
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
                            <input
                              type="text"
                              defaultValue={user.occupation}
                              disabled
                              className={`shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${
                                error && !user.occupation ? "border-red-500" : ""
                              }`}
                              placeholder=""
                            />
                             {error && !user.occupation && (
                              <p className="text-red-500 text-xs italic">
                                Please enter a occupation.
                              </p>
                            )}
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
                            <input
                              type="text"
                              defaultValue={user.address?.brgy}
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
                            {error && !user.isHead && (
                              <p className="text-red-500 text-xs italic">
                                Please answer this first.
                              </p>
                            )}
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
                            <input
                              type="text"
                              defaultValue={user.type}
                              disabled
                              className="shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              placeholder=""
                            />
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
                              type="text"
                              name="password"
                              id="password"
                              onChange={handleChange}
                              className="shadow appearance-none border w-full p-2 text-sm text-black rounded-r-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              value={user.password}
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
                            value={user.socials?.facebook?.name ?? ''}
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
                              value={user.socials?.facebook?.link ?? ''}
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
                            value={user.socials?.twitter?.name ?? ''}
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
                              value={user.socials?.twitter?.link ?? ''}
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
                            value={user.socials?.instagram?.name ?? ''}
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
                              value={user.socials?.instagram?.link ?? ''}
                              placeholder=""
                              disabled
                            />
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
                      className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-[#295141] text-white shadow-sm"
                      onClick={handleOnEdit}
                    >
                      EDIT
                    </button>
                    <button
                      type="button"
                      className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                      data-hs-overlay="#hs-modal-editAdmin"
                    >
                      CLOSE
                    </button>
                  </div>
                ) : (
                  <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                    <button
                      type="submit"
                      onClick={handleSave}
                      className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-[#295141] text-white shadow-sm"
                    >
                      SAVE CHANGES
                    </button>
                    <button
                      type="button"
                      className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                      onClick={() => {
                        handleOnEdit();
                        resetForm();
                      }}
                    >
                      CANCEL
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {submitClicked && <EditLoader updatingStatus="updating" />}
        {updatingStatus && (
          <EditLoader updatingStatus={updatingStatus} error={error} />
        )}
      </div>
    </div>
  );
}

export default ManageAdminModal;
