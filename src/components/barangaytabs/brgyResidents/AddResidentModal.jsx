import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import API_LINK from "../../../config/API";
import { LiaRandomSolid } from "react-icons/lia";
import CreateOccupationList from "./CreateOccupationList";
import AddLoader from "./loaders/AddLoader";
import ErrorPopup from "./popup/ErrorPopup";
import GetBrgy from "../../GETBrgy/getbrgy";
function AddResidentModal({ brgy }) {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [creationStatus, setCreationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [empty, setEmpty] = useState(false);
  const information = GetBrgy(brgy)
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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true);

      const emptyFieldsArr = checkEmptyFields();

      if (emptyFieldsArr.length > 0) {
        console.log(emptyFieldsArr);
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
        };

        const result = await axios.post(`${API_LINK}/users/`, obj);

        if (result.status === 200) {
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
          });

          setSubmitClicked(false);
          setCreationStatus("success");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
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
    <div>
      <div className="">
        <div
          id="hs-modal-addResident"
          className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full md:max-h-lg overflow-x-hidden overflow-y-auto flex items-center justify-center"
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
                  CREATE RESIDENT
                </h3>
              </div>

              <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
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
                              className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${emptyFields.includes("firstName") &&
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
                              className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${emptyFields.includes("lastName") &&
                                "border-red-500"
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
                              className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${emptyFields.includes("birthday") &&
                                "border-red-500"
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
                              className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${emptyFields.includes("email") &&
                                "border-red-500"
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
                              className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${emptyFields.includes("contact") &&
                                "border-red-500"
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
                              className={`shadow appearance-none border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${emptyFields.includes("street") &&
                                "border-red-500"
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
                            className={`shadow appearance-none border w-full p-1.5 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${emptyFields.includes("username") &&
                              "border-red-500"
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
                              className={`shadow appearance-none border w-full p-1 text-sm text-black rounded-r-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline ${emptyFields.includes("password") &&
                                "border-red-500"
                                }`}
                              value={user.password}
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
                <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-teal-900 text-white shadow-sm"
                  >
                    ADD
                  </button>
                  <button
                    type="button"
                    className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                    data-hs-overlay="#hs-modal-addResident"
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
    </div>
  );
}

export default AddResidentModal;