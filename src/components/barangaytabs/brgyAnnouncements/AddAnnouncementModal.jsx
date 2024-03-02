import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dropbox from "./Dropbox";
import API_LINK from "../../../config/API";
import { CiImageOn } from "react-icons/ci";

function CreateAnnouncementModal() {
  const brgy = "MUNISIPYO";
  const [announcement, setAnnouncement] = useState({
    title: "",
    details: "",
    date: "",
    brgy: brgy,
    isOpen: true,
  });

  const [logo, setLogo] = useState();
  const [banner, setBanner] = useState();
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   var logoSrc = document.getElementById("logo");
  //   logoSrc.src =
  //     "https://thenounproject.com/api/private/icons/4322871/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0";

  //   var bannerSrc = document.getElementById("banner");
  //   bannerSrc.src =
  //     "https://thenounproject.com/api/private/icons/4322871/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0";
  // }, []);

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);

    var output = document.getElementById("logo");
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  const handleBannerChange = (e) => {
    setBanner(e.target.files[0]);

    var output = document.getElementById("banner");
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  const handleChange = (e) => {
    setAnnouncement((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "isOpen" ? e.target.checked : e.target.value,
    }));
  };

  console.log(announcement);

  const handleFileChange = (e) => {
    e.preventDefault();

    setFiles([...files, ...e.target.files]);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      var formData = new FormData();

      const arr1 = [banner, logo];
      const newFiles = arr1.concat(files);

      for (let f = 0; f < newFiles.length; f += 1) {
        formData.append("files", newFiles[f]);
      }

      const obj = {
        title: announcement.title,
        details: announcement.details,
        date: announcement.date,
        brgy: brgy,
        isOpen: announcement.isOpen,
      };

      formData.append("announcement", JSON.stringify(obj));

      const result = await axios.post(`${API_LINK}/announcement/`, formData);

      if (result.status === 200) {
        var logoSrc = document.getElementById("logo");
        logoSrc.src =
          "https://thenounproject.com/api/private/icons/4322871/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0";

        var bannerSrc = document.getElementById("banner");
        bannerSrc.src =
          "https://thenounproject.com/api/private/icons/4322871/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0";
        setAnnouncement({
          title: "",
          details: "",
          date: "",
          brgy: "",
        });
        setLogo();
        setBanner();
        setFiles([]);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div
        id="hs-modal-add"
        className="hs-overlay hidden fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center "
      >
        {/* Modal */}
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
            <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
              {/* Header */}
              <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#396288] to-[#013D74] overflow-hidden rounded-t-2xl">
                <h3
                  className="font-bold text-white mx-auto md:text-xl text-center"
                  style={{ letterSpacing: "0.3em" }}
                >
                  CREATE ANNOUNCEMENT
                </h3>
              </div>

              <div className="flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
                <div className="flex mb-4 w-full flex-col md:flex-row sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0">
                <div className="w-full">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="username"
                  >
                    Logo
                  </label>
                  <div className="flex flex-col items-center space-y-2 relative">
                    <div className="w-full border border-gray-300">
                      <img
                        className={`${
                          logo ? "" : "hidden"
                        } w-[200px] md:w-[250px]  lg:w-full md:h-[140px] lg:h-[250px] object-cover`}
                        id="logo"
                        alt="Current profile photo"
                      />{" "}
                      <CiImageOn
                        size={250}
                        className={`${!logo ? "" : "hidden"} mx-auto`}
                      />
                    </div>
                    <label className="w-full bg-white border border-gray-300">
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
                    <div className="w-full border border-gray-300">
                    <img
                        className={`${
                          banner ? "" : "hidden"
                        } w-[200px] md:w-[250px]  lg:w-full md:h-[140px] lg:h-[250px] object-cover`}
                        id="banner"
                        alt="Current profile photo"
                      />{" "}
                      <CiImageOn
                        size={250}
                        className={`${!banner ? "" : "hidden"} mx-auto`}
                      />
                    </div>
                    <label className="w-full bg-white border border-gray-300">
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
              <div className="flex items-center justify-between mb-2">
                <label className="block sm:text-xs lg:text-sm text-gray-700 font-bold">
                  OPEN FOR ALL?
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isOpen"
                    onChange={handleChange}
                    defaultChecked={announcement.isOpen}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-400 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-800" />
                </label>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Announcement Title
                </label>
                <input
                  id="title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                  name="title"
                  type="text"
                  value={announcement.title}
                  onChange={handleChange}
                  placeholder="Announcement title"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-bold text-gray-700 "
                >
                  Details
                </label>
                <textarea
                  id="details"
                  rows={4}
                  name="details"
                  value={announcement.details}
                  onChange={handleChange}
                  className="block p-2.5 w-full text-sm text-gray-700  rounded-lg border border-gray-300 focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline "
                  placeholder="Enter announcement details..."
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="fee"
                >
                  Date
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                  id="date"
                  name="date"
                  type="date"
                  value={announcement.date}
                  onChange={handleChange}
                />
              </div>
              <Dropbox
                files={files}
                setFiles={setFiles}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
              />
            </div>
            <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                <button
                  type="submit"
                  className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-[#013D74] text-white shadow-sm"
                  onClick={handleSubmit}
                >
                  CREATE
                </button>
                <button
                  type="button"
                  className="h-[2.5rem] w-full py-1 px-6  gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                  data-hs-overlay="#hs-modal-add"
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

export default CreateAnnouncementModal;
