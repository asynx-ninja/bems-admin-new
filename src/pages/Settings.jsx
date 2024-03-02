import React, { useEffect, useState, useRef } from "react";
import defaultPFP from "../assets/sample-image/default-pfp.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  FaCamera,
  FaFacebook,
  FaEnvelope,
  FaPhone,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import API_LINK from "../config/API";
import banner from "../assets/image/1.png";
import OccupationList from "../components/occupations/OccupationList";
import EditLoader from "../components/settings/loaders/EditLoader";
const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [error, setError] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const fileInputRef = useRef();
  const handleAdd = (e) => {
    e.preventDefault();

    fileInputRef.current.click();
  };
  const [activeButton, setActiveButton] = useState({
    personal: true,
    credential: false,
    pass: false,
  });
  const [editButton, setEditButton] = useState(true);
  const [pfp, setPfp] = useState();
  const [userAddress, setUserAddress] = useState({
    street: "",
    brgy: "",
    city: "",
  });
  const [userData, setUserData] = useState({});
  const [userCred, setUserCred] = useState({
    username: "",
    oldPass: "",
    newPass: "",
  });
  const [message, setMessage] = useState({
    display: false,
    success: false,
    error: false,
    message: "",
  });
  const [newpasswordShown, setNewPasswordShown] = useState(false);
  const [oldpasswordShown, setOldPasswordShown] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const toggleOldPassword = (e) => {
    setOldPasswordShown(!oldpasswordShown);
  };
  const toggleNewPassword = (e) => {
    setNewPasswordShown(!newpasswordShown);
  };
  const [passwordStrengthError, setPasswordStrengthError] = useState(false);
  const [passwordStrengthSuccess, setPasswordStrengthSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [userSocials, setUserSocials] = useState({
    facebook: {
      name: "",
      link: "",
    },
    instagram: {
      name: "",
      link: "",
    },
    twitter: {
      name: "",
      link: "",
    },
  });

  const handleFileChange = (e) => {
    e.preventDefault();

    setPfp(e.target.files[0]);

    var output = document.getElementById("pfp");
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_LINK}/users/specific/${id}`);
        if (res.status === 200) {
          setUserData(res.data[0]);
          console.log(res.data[0].profile.link);
          setUserAddress({
            street: res.data[0].address.street,
            brgy: res.data[0].address.brgy,
            city: res.data[0].address.city,
          });
          setUserCred({
            username: res.data[0].username,
            oldPass: "",
            newPass: "",
          });
          setUserSocials({
            facebook: {
              name: res.data[0].socials.facebook.name,
              link: res.data[0].socials.facebook.link,
            },
            instagram: {
              name: res.data[0].socials.instagram.name,
              link: res.data[0].socials.instagram.link,
            },
            twitter: {
              name: res.data[0].socials.twitter.name,
              link: res.data[0].socials.twitter.link,
            },
          });
          var pfpSrc = document.getElementById("pfp");
          pfpSrc.src =
            res.data[0].profile.link !== ""
              ? res.data[0].profile.link
              : defaultPFP;
        } else {
          setError("Invalid username or password");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    document.title = "Settings | Barangay E-Services Management";
  }, []);

  const handleUserDataChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleUserChangeAdd = (field, value) => {
    setUserAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUserChangeCred = (field, value) => {
    setUserCred((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "newPass") {
      const password = value;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
      const symbolRegex = /[@$!%*?&]/;

      if (!passwordRegex.test(password) || !symbolRegex.test(password)) {
        setPasswordStrengthError(true);
        setPasswordStrengthSuccess(false);
      } else {
        setPasswordStrengthError(false);
        setPasswordStrengthSuccess(true);
      }
      // Check if passwords match

      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/\d/.test(password)) strength++;
      setPasswordStrength(strength * 25);
    }
  };

  const handleUserSocials = (social, subsocial, value) => {
    setUserSocials({
      ...userSocials,
      [social]: {
        ...userSocials[social],
        [subsocial]: value,
      },
    });
  };

  // console.log(userSocials)

  const saveChanges = async (e) => {
    if (
      !userData.firstName.trim() ||
      !userData.lastName.trim() ||
      !userData.firstName.trim() ||
      !userData.birthday.trim() ||
      !userData.email.trim() ||
      !userData.contact.trim() ||
      !userAddress.street.trim()
    ) {
      setError("Please fill out all required fields.");
      return; // Prevent further execution of handleSubmit
    }

    try {
      const result = await axios.get(
        `${API_LINK}/folder/specific/?brgy=${userAddress.brgy}`
      );
      console.log("wewewesss", userAddress.brgy);
      if (result.status === 200) {
        const obj = {
          firstName: userData.firstName,
          middleName: userData.middleName,
          lastName: userData.lastName,
          suffix: userData.suffix,
          religion: userData.religion,
          email: userData.email,
          birthday: userData.birthday,
          age: userData.age,
          contact: userData.contact,
          sex: userData.sex,
          address: {
            street: userAddress.street,
            brgy: userAddress.brgy,
            city: userAddress.city,
          },
          occupation: userData.occupation,
          civil_status: userData.civil_status,
          type: userData.type,
          isVoter: userData.isVoter,
          isHead: userData.isHead,
          username: userData.username,
          profile: userData.profile,
          socials: {
            facebook: userSocials.facebook,
            instagram: userSocials.instagram,
            twitter: userSocials.twitter,
          },
        };
        var formData = new FormData();
        formData.append("users", JSON.stringify(obj));
        formData.append("file", pfp);
        const response = await axios.patch(
          `${API_LINK}/users/?doc_id=${id}&folder_id=${result.data[0].pfp}`,
          formData
        );

        if (activeButton.credential === true) {
          if (
            userData.username &&
            userCred.username &&
            userData.username !== userCred.username
          ) {
            if (!userCred.username || !userCred.oldPass) {
              setMessage({
                display: false,
              });
              setError("Please provide both the new username and password.");
              return; // Prevent further execution
            }
            changeCredentials(
              userData.username,
              userCred.username,
              userCred.oldPass,
              userCred.newPass
            );
          }
        } else if (activeButton.pass === true) {
          if (userCred.newPass !== "" || userCred.oldPass !== "") {
            if (!userCred.newPass || !userCred.oldPass) {
              setMessage({
                display: false,
              });
              setError("Please provide both the new username and password.");
              return; // Prevent further execution
            }
            changeCredentials(
              userData.username,
              userCred.username,
              userCred.oldPass,
              userCred.newPass
            );
          }
        } else if (response.status === 200) {
          setSubmitClicked(true);
          setError(null);
          console.log("Update successful:", response);
          setUserData(response.data);
          setUserAddress({
            street: response.data.address.street,
            brgy: response.data.address.brgy,
            city: response.data.address.city,
          });
          setUserSocials({
            facebook: response.data.socials.facebook,
            instagram: response.data.socials.instagram,
            twitter: response.data.socials.twitter,
          });
          setEditButton(true);
          setTimeout(() => {
            setSubmitClicked(false);
            setUpdatingStatus("success");
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }, 1000);
        } else {
          console.error("Update failed. Status:", response.status);
        }
      }

      // CHANGE USERNAME
    } catch (error) {
      console.error("Error saving changes:", error);
      setSubmitClicked(false);
      setUpdatingStatus(null);
      setError(
        error.response
          ? error.response.data.message
          : "An unknown error occurred"
      );
    }
  };
  const changeCredentials = async (
    oldUsername,
    newUsername,
    oldPassword,
    newPassword
  ) => {
    try {
      const user = {
        username: newUsername !== oldUsername ? newUsername : oldUsername,
        password: newPassword !== "" ? newPassword : oldPassword,
      };

      const response = await axios.get(
        `${API_LINK}/auth/${oldUsername}/${oldPassword}`
      );

      console.log("mm", user);
      console.log(response);
      if (response.status === 200) {
        setSubmitClicked(true);
        setError(null);
        await axios.patch(`${API_LINK}/auth/${id}`, user);
        setMessage({
          display: true,
          success: true,
          error: false,
          message: "Success!",
        });
        setTimeout(() => {
          setSubmitClicked(false);
          setUpdatingStatus("success");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }, 1000);
      }
    } catch (err) {
      setError(null);
      setMessage({
        display: true,
        success: false,
        error: true,
        message: "The password you entered is incorrect",
      });
      setSubmitClicked(false);
      setUpdatingStatus(null);
      // setError("The password you entered is incorrect");
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

  const handleOnActive = (e) => {
    if (e.target.name === "personal") {
      setActiveButton({
        personal: true,
        credential: false,
        pass: false,
      });
    }

    if (e.target.name === "credential") {
      setActiveButton({
        personal: false,
        credential: true,
        pass: false,
      });
    }

    if (e.target.name === "pass") {
      setActiveButton({
        personal: false,
        credential: false,
        pass: true,
      });
    }
  };

  const handleOnEdit = (e) => {
    if (e.target.name === "edit") {
      setEditButton(false);
    } else {
      setEditButton(true);
    }
  };
  const resetForm = (e) => {
    setError(null);
  };
  return (
    <div>
      <div className="mx-4 overflow-y-auto lg:mt-[1rem] mt-0 scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb h-[calc(100vh_-_80px)] lg:h-[calc(100vh_-_90px)]">
        <div className="flex flex-col">
          <div className="relative w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-900 opacity-40"></div>
              <img
                className="h-[230px] w-full object-cover"
                src={banner}
                alt=""
              />
            </div>
            <div className="absolute md:top-[56%] lg:top-[55%] transform -translate-y-1/2 flex justify-center w-full">
              <div className="flex flex-col items-center">
                <div className="relative lg:w-40 lg:h-40 sm:w-32 md:w-36">
                  <label
                    htmlFor="file_input"
                    onClick={handleAdd}
                    className={
                      editButton
                        ? "hidden"
                        : "absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity hover:bg-[#295141] hover:bg-opacity-60 "
                    }
                  >
                    <FaCamera size={32} style={{ color: "#ffffff" }} />
                  </label>
                  <input
                    disabled={editButton}
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    accept="image/*"
                    multiple="multiple"
                    className="hidden"
                  />
                  <div className="lg:w-full lg:h-full w-[130px] h-[130px] lg:mt-0 mt-8 flex mx-auto justify-center overflow-hidden rounded-full object-cover border-[5px] border-[#295141]">
                    <img
                      id="pfp"
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  </div>
                </div>
                <h6 className="font-bold mt-2 lg:text-normal">
                  {userData.firstName} {userData.lastName}
                </h6>
                <p className="text-sm lg:text-[14px] py-2 leading-[10px]">
                  {userData.username}
                </p>
              </div>
            </div>

            <div className="flex flex-col bg-white lg:py-0 py-4 text-black justify-center items-center mx-auto rounded-md mt-28 lg:p-4 lg:mt-28 lg:w-11/12 text-center">
              <div className="border-b-[2px] w-full mb-2 border-b-gray-200">
                <h6 className="font-bold mb-2 uppercase text-normal sm:text-sm">
                  Socials
                </h6>
              </div>
              <div className="lg:flex sm:grid lg:px-0 px-8 lg:py-0 py-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center items-center mx-auto">
                {userSocials.facebook && userSocials.facebook.name && (
                  <button className="flex justify-center gap-2 items-center bg-white rounded-md p-2 hover:bg-[#295141] hover:text-white  transition-all ease-in-out duration-300">
                    <FaFacebook />
                    <p className="text-left ml-2 truncate lg:text-[14px] text-[12px]">
                      {userSocials.facebook.name}
                    </p>
                  </button>
                )}
                {userSocials.twitter && userSocials.twitter.name && (
                  <button className="flex justify-center gap-2 items-center bg-white rounded-md p-2 hover:bg-[#295141] hover:text-white  transition-all ease-in-out duration-300">
                    <FaTwitter />
                    <p className="text-left ml-2 truncate lg:text-[14px] text-[12px]">
                      {userSocials.twitter.name}
                    </p>
                  </button>
                )}
                {userSocials.instagram && userSocials.instagram.name && (
                  <button className="flex justify-center gap-2 items-center bg-white rounded-md p-2 hover:bg-[#295141] hover:text-white  transition-all ease-in-out duration-300">
                    <FaInstagram />
                    <p className="text-left ml-2 truncate lg:text-[14px] text-[12px]">
                      {userSocials.instagram.name}
                    </p>
                  </button>
                )}
                {userData.contact && (
                  <button className="flex justify-center gap-2 items-center bg-white rounded-md p-2 hover:bg-[#295141] hover:text-white  transition-all ease-in-out duration-300">
                    <FaPhone />
                    <p className="text-left ml-2 truncate lg:text-[14px] text-[12px]">
                      {userData.contact}
                    </p>
                  </button>
                )}
                {userData.email && (
                  <button className="flex justify-center gap-2 items-center bg-white rounded-md p-2  hover:bg-[#295141] hover:text-white  transition-all ease-in-out duration-300">
                    <FaEnvelope />
                    <p className="text-left ml-2 truncate lg:text-[14px] text-[12px]">
                      {userData.email}
                    </p>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col-reverse lg:flex-row-reverse sm:px-[5px] px-[20px] justify-center mb-[20px]">
            <div className="flex flex-col sm:w-full lg:w-11/12 mx-auto">
              <div className="flex gap-[10px] my-5 pb-[10px] border-b-[2px] border-b-gray-200 px-[10px]">
                <button
                  name="personal"
                  onClick={handleOnActive}
                  className={
                    activeButton.personal
                      ? "sm:text-[14px] md:text-[18px] h-[50px] px-[20px] rounded-md bg-[#295141] text-white font-medium"
                      : "sm:text-[14px] md:text-[18px] h-[50px] px-[20px] rounded-md bg-white text-black font-medium transition-all ease-in-out hover:bg-[#295141]  hover:text-white"
                  }
                >
                  Personal Info
                </button>
                <button
                  name="credential"
                  onClick={handleOnActive}
                  className={
                    activeButton.credential
                      ? "sm:text-[14px] md:text-[18px] h-[50px] px-[20px] rounded-md bg-[#295141]  text-white font-medium"
                      : "sm:text-[14px] md:text-[18px] h-[50px] px-[20px] rounded-md bg-white text-black font-medium transition-all ease-in-out hover:bg-[#295141]  hover:text-white"
                  }
                >
                  Account Info
                </button>

                <button
                  name="pass"
                  onClick={handleOnActive}
                  className={
                    activeButton.pass
                      ? "sm:text-[14px] md:text-[18px] h-[50px] px-[20px] rounded-md bg-[#295141]  text-white font-medium"
                      : "sm:text-[14px] md:text-[18px] h-[50px] px-[20px] rounded-md bg-white text-black font-medium transition-all ease-in-out hover:bg-[#295141]  hover:text-white"
                  }
                >
                  Change Password
                </button>
              </div>

              <div className={activeButton.personal ? "block" : "hidden"}>
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
                <div className="h-full w-full px-4 lg:px-0 pb-[30px]">
                  {/* PERSONAL DATA */}

                  <div>
                    <div className="w-full border-b-[2px] border-black mb-5">
                      <h6 className="font-bold">PERSONAL DATA</h6>
                    </div>
                    <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 px-4">
                      <div>
                        <label
                          htmlFor="fistName"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          First name
                        </label>
                        <input
                          disabled={editButton}
                          type="text"
                          id="firstname"
                          className={`py-3 px-4 block w-full  rounded-md text-sm bg-white border ${
                            error && !userData.firstName ? "border-red-500" : ""
                          }`}
                          placeholder="First name"
                          value={userData.firstName || ""}
                          onChange={(e) =>
                            handleUserDataChange("firstName", e.target.value)
                          }
                        />
                        {error && !userData.firstName && (
                          <p className="text-red-500 text-xs italic">
                            Please enter a first name.
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="middleName"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          Middle name
                        </label>
                        <input
                          disabled={editButton}
                          type="text"
                          id="middleName"
                          className="py-3 px-4 block w-full border-gray-200 border text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                          placeholder="First name"
                          value={userData.middleName || ""}
                          onChange={(e) =>
                            handleUserDataChange("middleName", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          Last name
                        </label>
                        <input
                          disabled={editButton}
                          id="lastName"
                          type="text"
                          className={`py-3 px-4 block w-full  rounded-md text-sm bg-white border ${
                            error && !userData.lastName ? "border-red-500" : ""
                          }`}
                          placeholder="Last name"
                          aria-describedby="hs-input-helper-text"
                          value={userData.lastName || ""}
                          onChange={(e) =>
                            handleUserDataChange("lastName", e.target.value)
                          }
                        />
                        {error && !userData.lastName && (
                          <p className="text-red-500 text-xs italic">
                            Please enter a last name.
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="suffix"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          Suffix
                        </label>
                        <input
                          disabled={editButton}
                          id="suffix"
                          type="text"
                          className="py-3 px-4 block w-full border-gray-200 border text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                          placeholder="Suffix"
                          aria-describedby="hs-input-helper-text"
                          value={userData.suffix || ""}
                          onChange={(e) =>
                            handleUserDataChange("suffix", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="gender"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          Gender
                        </label>
                        <select
                          disabled={editButton}
                          className="py-3 px-4 block w-full border-gray-200 border text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                          placeholder="Suffix"
                          aria-describedby="hs-input-helper-text"
                          id="gender"
                          name="gender"
                          value={userData.sex || ""}
                          onChange={(e) =>
                            handleUserDataChange("sex", e.target.value)
                          }
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="birthday"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          Birthday
                        </label>
                        <input
                          type="date"
                          disabled={editButton}
                          id="birthday"
                          className="py-3 px-4 block w-full border-gray-200 border text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                          placeholder="Birthday"
                          aria-describedby="hs-input-helper-text"
                          value={birthdayFormat(userData.birthday) || ""}
                          onChange={(e) =>
                            handleUserDataChange("birthday", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="age"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          Age
                        </label>
                        <input
                          type="number"
                          disabled={editButton}
                          readOnly
                          id="age"
                          className="py-3 px-4 block w-full border-gray-200 border text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                          placeholder="Suffix"
                          aria-describedby="hs-input-helper-text"
                          value={calculateAge(userData.birthday) || ""}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          Phone number
                        </label>
                        <input
                          type="text"
                          disabled={editButton}
                          id="phone"
                          className="py-3 px-4 block w-full border-gray-200 border text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                          placeholder="#"
                          aria-describedby="hs-input-helper-text"
                          value={userData.contact || ""}
                          onChange={(e) =>
                            handleUserDataChange("contact", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          Email
                        </label>
                        <input
                          disabled={editButton}
                          type="email"
                          id="email"
                          className={`py-3 px-4 block w-full  rounded-md text-sm bg-white border ${
                            error && !userData.email ? "border-red-500" : ""
                          }`}
                          placeholder="you@example.com"
                          aria-describedby="hs-input-helper-text"
                          value={userData.email || ""}
                          onChange={(e) =>
                            handleUserDataChange("email", e.target.value)
                          }
                        />
                        {error && !userData.email && (
                          <p className="text-red-500 text-xs italic">
                            Please enter an email.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS DETAILS */}

                  <div>
                    <div className="w-full border-b-[2px] border-black my-5">
                      <h6 className="font-bold">ADDRESS DETAILS</h6>
                    </div>
                    <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 px-4">
                      <div>
                        <label
                          htmlFor="street"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          Street
                        </label>
                        <input
                          type="text"
                          disabled={editButton}
                          id="street"
                          className={`py-3 px-4 block w-full  rounded-md text-sm bg-white border ${
                            error && !userAddress.street ? "border-red-500" : ""
                          }`}
                          placeholder="Street"
                          aria-describedby="hs-input-helper-text"
                          value={userAddress.street || ""}
                          onChange={(e) =>
                            handleUserChangeAdd("street", e.target.value)
                          }
                        />
                        {error && !userAddress.street && (
                          <p className="text-red-500 text-xs italic">
                            Please enter your address.
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="brgy"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          Barangay
                        </label>
                        <select
                          disabled={editButton}
                          id="brgy"
                          name="brgy"
                          value={userAddress.brgy || ""}
                          onChange={(e) =>
                            handleUserChangeAdd("brgy", e.target.value)
                          }
                          className="py-3 px-4 block w-full border-gray-200 border text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                        >
                          <option selected>{userAddress.brgy}</option>
                          <option>Balite</option>
                          <option>Burgos</option>
                          <option>Geronimo</option>
                          <option>Macabud</option>
                          <option>Manggahan</option>
                          <option>Mascap</option>
                          <option>Puray</option>
                          <option>Rosario</option>
                          <option>San Isidro</option>
                          <option>San Jose</option>
                          <option>San Rafael</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="city"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          City
                        </label>
                        <select
                          id="city"
                          name="city"
                          disabled={editButton}
                          readOnly
                          value={userAddress.city || ""}
                          onChange={(e) =>
                            handleUserChangeAdd("city", e.target.value)
                          }
                          className="py-3 px-4 block w-full border-gray-200 border text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                        >
                          <option selected>Montalban</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* OTHER PERSONAL DATA */}

                  <div>
                    <div className="w-full border-b-[2px] border-black my-5">
                      <h6 className="font-bold">OTHER PERSONAL DATA</h6>
                    </div>
                    <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 px-4">
                      <div>
                        <label
                          htmlFor="occupation"
                          className="block sm:text-xs lg:text-sm font-medium mb-2"
                        >
                          Occupation
                        </label>
                        <div className="relative z-0 w-full mb-3 group">
                          <OccupationList
                            handleUserDataChange={handleUserDataChange}
                            occupation={userData.occupation}
                            editButton={editButton}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block sm:text-xs lg:text-sm font-medium mb-2">
                          * Head of the Family?
                        </label>
                        <div className="flex items-center">
                          <input
                            className="shrink-0 mt-0.5 border-gray-200 rounded-full text-green-500 focus:ring-green-500"
                            disabled={editButton}
                            id="isHeadYes"
                            name="isHead"
                            type="radio"
                            value={1}
                            checked={userData.isHead}
                            onChange={(e) =>
                              handleUserDataChange("isHead", true)
                            }
                          />
                          <label htmlFor="male" className="ml-2">
                            Yes
                          </label>
                          <input
                            className="ml-4 shrink-0 mt-0.5 border-gray-200 rounded-full text-green-500 focus:ring-green-500"
                            disabled={editButton}
                            id="isHeadNo"
                            name="isHead"
                            type="radio"
                            value={0}
                            checked={!userData.isHead}
                            onChange={(e) =>
                              handleUserDataChange("isHead", false)
                            }
                          />
                          <label className="ml-2">No</label>
                        </div>
                      </div>
                      <div>
                        <label className="block sm:text-xs lg:text-sm font-medium mb-2">
                          * Registered Voter
                        </label>
                        <div className="flex items-center">
                          <input
                            className="shrink-0 mt-0.5 border-gray-200 rounded-full text-green-500 focus:ring-green-500"
                            disabled={editButton}
                            id="isVoterYes"
                            name="isVoter"
                            type="radio"
                            value={1}
                            checked={userData.isVoter}
                            onChange={(e) =>
                              handleUserDataChange("isVoter", true)
                            }
                          />
                          <label htmlFor="male" className="ml-2">
                            Yes
                          </label>
                          <input
                            disabled={editButton}
                            className="ml-4 shrink-0 mt-0.5 border-gray-200 rounded-full text-green-500 focus:ring-green-500"
                            id="isVoterNo"
                            name="isVoter"
                            type="radio"
                            value={0}
                            checked={!userData.isVoter}
                            onChange={(e) =>
                              handleUserDataChange("isVoter", false)
                            }
                          />
                          <label className="ml-2">No</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SOCIALS */}

                  <div className={editButton ? "hidden" : "block"}>
                    <div className="w-full border-b-[2px] border-black my-5">
                      <h6 className="font-bold">SOCIALS</h6>
                    </div>
                    <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-3 p-2">
                        <div>
                          <label
                            htmlFor="facebook-name"
                            className="block sm:text-xs lg:text-sm font-medium mb-2"
                          >
                            Facebook Name
                          </label>
                          <input
                            id="facebook-name"
                            type="text"
                            value={userSocials.facebook.name || ""}
                            disabled={editButton}
                            onChange={(e) => {
                              handleUserSocials(
                                "facebook",
                                "name",
                                e.target.value
                              );
                            }}
                            className="py-3 px-4 block w-full border-gray-200 text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                            aria-describedby="hs-input-helper-text"
                            placeholder="Enter your Facebook Link"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="facebook-link"
                            className="block sm:text-xs lg:text-sm font-medium mb-2"
                          >
                            Facebook Link
                          </label>
                          <input
                            type="text"
                            id="facebook-name"
                            value={userSocials.facebook.link || ""}
                            disabled={editButton}
                            onChange={(e) => {
                              handleUserSocials(
                                "facebook",
                                "link",
                                e.target.value
                              );
                            }}
                            className="py-3 px-4 block w-full border-gray-200 text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                            aria-describedby="hs-input-helper-text"
                            placeholder="Enter your Facebook Link"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 p-2 sm:border-[0px] sm:border-t-[1px] sm:border-b-[1px] md:border-t-[0px] md:border-b-[0px] md:border-l-[1px] md:border-r-[1px] border-green-300">
                        <div>
                          <label
                            htmlFor="instagram-name"
                            className="block sm:text-xs lg:text-sm font-medium mb-2"
                          >
                            Instagram Name
                          </label>
                          <input
                            id="instagram-name"
                            type="text"
                            value={userSocials.instagram.name || ""}
                            disabled={editButton}
                            onChange={(e) => {
                              handleUserSocials(
                                "instagram",
                                "name",
                                e.target.value
                              );
                            }}
                            className="py-3 px-4 block w-full border-gray-200 text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                            aria-describedby="hs-input-helper-text"
                            placeholder="Enter your Facebook Link"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="instagram-link"
                            className="block sm:text-xs lg:text-sm font-medium mb-2"
                          >
                            Instagram Link
                          </label>
                          <input
                            id="instagram-link"
                            type="text"
                            value={userSocials.instagram.link || ""}
                            disabled={editButton}
                            onChange={(e) => {
                              handleUserSocials(
                                "instagram",
                                "link",
                                e.target.value
                              );
                            }}
                            className="py-3 px-4 block w-full border-gray-200 text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                            aria-describedby="hs-input-helper-text"
                            placeholder="Enter your Facebook Link"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 p-2">
                        <div>
                          <label
                            htmlFor="twitter-name"
                            className="block sm:text-xs lg:text-sm font-medium mb-2"
                          >
                            Twitter Name
                          </label>
                          <input
                            id="twitter-name"
                            type="text"
                            value={userSocials.twitter.name || ""}
                            disabled={editButton}
                            onChange={(e) => {
                              handleUserSocials(
                                "twitter",
                                "name",
                                e.target.value
                              );
                            }}
                            className="py-3 px-4 block w-full border-gray-200 text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                            aria-describedby="hs-input-helper-text"
                            placeholder="Enter your Facebook Link"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="facebook"
                            className="block sm:text-xs lg:text-sm font-medium mb-2"
                          >
                            Twitter Link
                          </label>
                          <input
                            type="text"
                            value={userSocials.twitter.link || ""}
                            disabled={editButton}
                            onChange={(e) => {
                              handleUserSocials(
                                "twitter",
                                "link",
                                e.target.value
                              );
                            }}
                            className="py-3 px-4 block w-full border-gray-200 text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white"
                            aria-describedby="hs-input-helper-text"
                            placeholder="Enter your Facebook Link"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={
                  activeButton.credential
                    ? "shadow-lg px-[30px] pb-[30px]"
                    : "hidden"
                }
              >
                <div className="flex flex-col w-[80%] justify-center mx-auto gap-4">
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
                  <div className={message.display ? "block" : "hidden"}>
                    <div
                      className={
                        message.success
                          ? "w-[100%] bg-green-400 rounded-md flex"
                          : "hidden"
                      }
                    >
                      <p className="py-[10px] text-[12px] px-[20px] text-white font-medium">
                        {message.message}
                      </p>
                    </div>
                    <div
                      className={
                        message.error
                          ? "w-[100%] bg-red-500 rounded-md flex"
                          : "hidden"
                      }
                    >
                      <p className="py-[10px] text-[12px] px-[20px] text-white font-medium">
                        {message.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="username"
                      className="block sm:text-xs lg:text-sm font-medium mb-2"
                    >
                      Change Username
                    </label>
                    <input
                      type="text"
                      disabled={editButton}
                      id="username"
                      className={`py-3 px-4 block w-full border-2 text-black rounded-md text-sm  bg-white ${
                        error && !userCred.username.trim()
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="username"
                      aria-describedby="hs-input-helper-text"
                      value={userCred.username || ""}
                      onChange={(e) =>
                        handleUserChangeCred("username", e.target.value)
                      }
                    />
                    {error && !userCred.username.trim() && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a username.
                      </p>
                    )}
                  </div>

                  <div className="relative z-0">
                    <label
                      htmlFor="oldpass"
                      className="block sm:text-xs lg:text-sm font-medium mb-2"
                    >
                      Enter your password
                    </label>
                    <input
                      type={oldpasswordShown ? "text" : "password"}
                      disabled={editButton}
                      id="oldpass"
                      className={`py-3 px-4 block w-full  text-black rounded-md text-sm border-2 bg-white ${
                        error && !userCred.oldPass.trim()
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="password"
                      aria-describedby="hs-input-helper-text"
                      onChange={(e) =>
                        handleUserChangeCred("oldPass", e.target.value)
                      }
                    />
                    {error && !userCred.oldPass.trim() && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a old password.
                      </p>
                    )}
                    <button
                      name="old"
                      type="button"
                      onClick={toggleOldPassword}
                      className="absolute right-2 sm:top-5 lg:top-7 p-2.5 mt-1 text-sm font-medium text-white"
                    >
                      {oldpasswordShown ? (
                        <AiOutlineEye style={{ color: "green" }} size={20} />
                      ) : (
                        <AiOutlineEyeInvisible
                          style={{ color: "green" }}
                          size={20}
                        />
                      )}
                    </button>
                  </div>

                  {/* <div className={editButton ? "hidden" : "mx-auto"}>
                    <button
                      className={
                        changePass
                          ? "bg-custom-green-button text-white mx-auto w-[200px] font-medium px-[20px] py-[5px] rounded-md"
                          : "hidden"
                      }
                      onClick={() => setChangePass(!changePass)}
                    >
                      Change Username
                    </button>
                    <button
                      className={
                        changePass
                          ? "hidden"
                          : "bg-custom-green-button text-white mx-auto w-[200px] font-medium px-[20px] py-[5px] rounded-md"
                      }
                      onClick={() => setChangePass(!changePass)}
                    >
                      Change Password
                    </button>
                  </div> */}
                </div>
              </div>
              <div className={activeButton.pass ? "flex flex-col" : "hidden"}>
                <div className=" shadow-lg px-[100px] pb-[30px] ">
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
                  <div className="relative z-0">
                    <label
                      htmlFor="oldpass"
                      className="block sm:text-xs lg:text-sm font-medium mb-2"
                    >
                      Enter your current password
                    </label>
                    <input
                      type={oldpasswordShown ? "text" : "password"}
                      disabled={editButton}
                      id="oldpass"
                      className={`py-3 px-4 block w-full  text-black rounded-md text-sm border-2 bg-white ${
                        error && !userCred.oldPass.trim()
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="password"
                      aria-describedby="hs-input-helper-text"
                      onChange={(e) =>
                        handleUserChangeCred("oldPass", e.target.value)
                      }
                    />
                    {error && !userCred.oldPass.trim() && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a old password.
                      </p>
                    )}
                    <button
                      name="old"
                      type="button"
                      onClick={toggleOldPassword}
                      className="absolute right-2 sm:top-5 lg:top-7 p-2.5 mt-1 text-sm font-medium text-white"
                    >
                      {oldpasswordShown ? (
                        <AiOutlineEye style={{ color: "green" }} size={20} />
                      ) : (
                        <AiOutlineEyeInvisible
                          style={{ color: "green" }}
                          size={20}
                        />
                      )}
                    </button>
                  </div>
                  <div className="relative z-0">
                    <label
                      htmlFor="newpass"
                      className="block sm:text-xs lg:text-sm font-medium mb-2"
                    >
                      Enter your new password
                    </label>
                    <input
                      type={newpasswordShown ? "text" : "password"}
                      disabled={editButton}
                      readOnly={userCred.oldPass === ""}
                      id="newpass"
                      className={`py-3 px-4 block w-full  text-black rounded-md text-sm border-2 bg-white ${
                        error && !userCred.newPass.trim()
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="password"
                      aria-describedby="hs-input-helper-text"
                      onChange={(e) =>
                        handleUserChangeCred("newPass", e.target.value)
                      }
                    />
                    {error && !userCred.newPass.trim() && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a new password.
                      </p>
                    )}
                    <button
                      name="new"
                      type="button"
                      onClick={toggleNewPassword}
                      className="absolute right-2 sm:top-5 lg:top-7 p-2.5 mt-1 text-sm font-medium text-white"
                    >
                      {newpasswordShown ? (
                        <AiOutlineEye style={{ color: "green" }} size={20} />
                      ) : (
                        <AiOutlineEyeInvisible
                          style={{ color: "green" }}
                          size={20}
                        />
                      )}
                    </button>
                  </div>
                  <div>
                    {userCred.newPass && (
                      <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                        <div
                          className={`flex flex-col justify-center overflow-hidden ${
                            passwordStrength < 25
                              ? "bg-red-500"
                              : passwordStrength < 50
                              ? "bg-yellow-500"
                              : passwordStrength < 75
                              ? "bg-amber-500"
                              : passwordStrength < 100
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                          role="progressbar"
                          style={{ width: `${passwordStrength}%` }}
                          aria-valuenow={passwordStrength}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    )}
                    {passwordStrengthSuccess && (
                      <div
                        className="bg-green-50 border border-green-200 text-sm text-green-600 rounded-md p-4 mt-2"
                        role="alert"
                      >
                        <span className="font-bold">Sucess:</span> Password is
                        already strong
                      </div>
                    )}
                    {passwordStrengthError && passwordStrength < 100 && (
                      <div
                        className="bg-orange-50 border border-orange-200 text-sm text-orange-600 rounded-md p-4 mt-2"
                        role="alert"
                      >
                        <span className="font-bold">Warning:</span> Password
                        must contain at least 8 characters, one uppercase
                        letter, one lowercase letter, one number, and one
                        special character
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-[20px] flex justify-center items-center gap-5">
          {editButton ? (
            <button
              name="edit"
              onClick={handleOnEdit}
              className="bg-custom-green-button text-white font-medium px-[20px] py-[5px] rounded-md"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-5">
              <button
                name="save"
                onClick={saveChanges}
                className="bg-custom-green-button text-white font-medium px-[20px] py-[5px] rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => {
                  handleOnEdit({ target: { name: "cancel" } });
                  resetForm();
                }}
                name="cancel"
                className="bg-custom-red-button text-white font-medium px-[20px] py-[5px] rounded-md"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {submitClicked && <EditLoader updatingStatus="updating" />}
      {updatingStatus && (
        <EditLoader updatingStatus={updatingStatus} error={error} />
      )}
    </div>
  );
};

export default Settings;
