import React from "react";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

function ViewArchivedAdmin({ user, setUser }) {
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

  return (
    <div>
      <div className="">
        <div
          id="hs-modal-viewAdmin"
          className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
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
                  ARCHIVED ADMIN ACCOUNT
                </h3>
              </div>

              <div className="flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
                <form>
                  <div className="flex mb-4 w-full flex-col md:flex-row sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0">
                    <div className="flex flex-col mb-1 w-full">
                      {/* Service Description */}

                      {/* Section 1 */}
                      <div className="relative p-1 pb-6 flex flex-col w-full h-full">
                        <b className="border-solid border-0 border-black/50 border-b-2  uppercase font-medium text-lg md:text-lg">
                          Personal Data
                        </b>
                        <div className="flex flex-col md:flex-row mt-2">
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
                              className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
                              placeholder=""
                              value={user.firstName}
                              readOnly
                            />
                          </div>

                          <div className="flex flex-col mt-2 md:mt-0 md:ml-2 w-full">
                            <h1
                              className="font-medium mb-1 text-black text-sm"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              MIDDLE NAME
                            </h1>
                            <input
                              type="text"
                              id="middleName"
                              className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
                              placeholder=""
                              value={user.middleName}
                              readOnly
                            />
                          </div>

                          <div className="flex flex-col mt-2 md:mt-0 md:ml-2 w-full">
                            <h1
                              className="font-medium mb-1 text-black text-sm"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              LAST NAME
                            </h1>
                            <input
                              type="text"
                              id="lastName"
                              className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
                              placeholder=""
                              value={user.lastName}
                              readOnly
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
                              className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
                              placeholder=""
                              value={user.suffix}
                              readOnly
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
                              type="text"
                              id="birthday"
                              className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
                              placeholder="mm/dd/yyyy"
                              value={birthdayFormat(user.birthday) || ""}
                              readOnly
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
                              className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
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
                              className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
                              placeholder=""
                              value={user.email}
                              readOnly
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
                              className="block w-full p-1 text-sm text-black bg-gray-200 rounded-lg"
                              placeholder=""
                              value={user.contact}
                              readOnly
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
                                value="Male"
                                checked={user.sex === "Male"}
                                readOnly
                              />
                              <label htmlFor="Male" className="ml-2">
                                Male
                              </label>
                              <input
                                type="radio"
                                id="Female"
                                value="Female"
                                className="ml-4 md:ml-2 lg:ml-4"
                                checked={user.sex === "Female"}
                                readOnly
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
                              className="w-full p-2 border rounded"
                              disabled
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
                              className="w-full p-2 border rounded"
                              disabled
                              value={user.religion}
                            >
                              <option value="">-- Select Religion --</option>
                              {religions.map((religion, index) => (
                                <option
                                  key={index} // Adding a unique key prop
                                  value={religion}
                                >
                                  {religion}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="mt-2 px-1 flex flex-col md:flex-row w-full">
                          <div className="flex flex-col w-full md:w-1/3 ">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium"
                            >
                              OCCUPATION
                            </label>
                            <input
                              type="text"
                              id="occupation"
                              className="block w-full p-2.5 text-sm text-black bg-gray-200 rounded-lg"
                              placeholder=""
                              value={user.occupation}
                              readOnly
                            />
                          </div>

                          <div className="flex flex-col w-full md:w-2/3 mt-2 md:mt-0 md:ml-3">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium"
                            >
                              ADDRESS
                            </label>
                            <input
                              type="text"
                              id="street"
                              className="block w-full p-2.5 text-sm text-black bg-gray-200 rounded-lg"
                              placeholder=""
                              value={
                                user.address?.street +
                                ", " +
                                user.address?.brgy +
                                ", " +
                                user.address?.city
                              }
                              readOnly
                            />
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
                                value="true"
                                checked={user.isVoter === true}
                                readOnly
                              />
                              <label htmlFor="isVoterTrue" className="ml-2">
                                Yes
                              </label>
                              <input
                                type="radio"
                                id="false"
                                value="false"
                                checked={user.isVoter === false}
                                className="ml-4"
                                readOnly
                              />
                              <label htmlFor="isVoterFalse" className="ml-2">
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
                                value="true"
                                checked={user.isHead === true}
                                readOnly
                              />
                              <label htmlFor="Yes" className="ml-2">
                                Yes
                              </label>
                              <input
                                type="radio"
                                id="false"
                                value="false"
                                className="ml-4"
                                checked={user.isHead === false}
                                readOnly
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
                              className="w-full p-1 pl-2 border rounded"
                              disabled
                              value={user.type}
                            >
                              <option>-- Select User Type --</option>
                              <option value="Admin">Admin</option>
                              <option value="Staff">Barangay Staff</option>
                              <option value="Resident">Resident</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Section 3 */}
                      <b className="border-solid border-0 border-black/50 border-b-2  uppercase font-medium text-lg md:text-lg mt-4">
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
                            className="block w-full p-2 text-sm text-black bg-gray-200 rounded-lg"
                            placeholder=""
                            value={user.username}
                            readOnly
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
                            <label htmlFor="password" className="sr-only">
                              password
                            </label>
                            <input
                              type="text"
                              id="password"
                              className="block w-full p-2 text-sm text-black bg-gray-200 rounded-lg"
                              readOnly
                              value={"User12345"}
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
                            className="block w-full p-2 text-sm text-black bg-gray-200 rounded-lg"
                            value={user.username}
                            placeholder=""
                            disabled
                          />
                        </div>

                        <div className="flex flex-col mt-2 md:mt-0 md:ml-2 w-full">
                          <div className="flex flex-col w-full md:mr-2">
                            <input
                              type="text"
                              id="facebook_link"
                              className="block w-full p-2 text-sm text-black bg-gray-200 rounded-lg"
                              value={user.username}
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
                            className="block w-full p-2 text-sm text-black bg-gray-200 rounded-lg"
                            value={user.username}
                            placeholder=""
                            disabled
                          />
                        </div>

                        <div className="flex flex-col mt-2 md:mt-0 md:ml-2 w-full">
                          <div className="flex flex-col w-full md:mr-2">
                            <input
                              type="text"
                              id="facebook_link"
                              className="block w-full p-2 text-sm text-black bg-gray-200 rounded-lg"
                              value={user.username}
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
                            className="block w-full p-2 text-sm text-black bg-gray-200 rounded-lg"
                            value={user.username}
                            placeholder=""
                            disabled
                          />
                        </div>

                        <div className="flex flex-col mt-2 md:mt-0 md:ml-2 w-full">
                          <div className="flex flex-col w-full md:mr-2">
                            <input
                              type="text"
                              id="facebook_link"
                              className="block w-full p-2 text-sm text-black bg-gray-200 rounded-lg"
                              value={user.username}
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
                <button
                  type="button"
                  className="h-[2.5rem] w-full py-1 px-6  gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                  data-hs-overlay="#hs-modal-viewAdmin"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewArchivedAdmin;
