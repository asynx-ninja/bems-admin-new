import React from "react";
import { useEffect, useState } from "react";
import { BsCamera } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import defaultPFP from "../../assets/sample-image/default-pfp.png";
import { MdOutlineFileUpload } from "react-icons/md";
import official from "../../assets/sample/official.jpg";
import header from "/imgs/bg-header.png";
import {
  useLocation,
  useNavigate,
  matchRoutes,
  useParams,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import API_LINK from "../../config/API";

const Information = () => {
  const { id } = useParams();
  const [information, setInformation] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const brgy = searchParams.get("brgy");
  const [brgyInformation, setBrgyInformation] = useState({});
  const [isEditingMode, setisEditingMode] = useState(false);
  const [logo, setLogo] = useState();
  const [banner, setBanner] = useState();
  const renameFile = (file, newName) => {
    const newFile = new File([file], newName, { type: file.type });
    return newFile;
  };

  useEffect(() => {
    document.title = "Barangay Information | Barangay E-Services Management";

    const fetchInformation = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/brgyinfo/?brgy=${brgy}&archived=true`
        );
        console.log(response);
        if (response.status === 200) {
          setInformation(response.data[0]);
          var logoSrc = document.getElementById("edit_logo");
          logoSrc.src =
            response.data[0].logo.link !== "" ? (
              response.data[0].logo.link
            ) : (
              <FaUserCircle />
            );

          var bannerSrc = document.getElementById("edit_banner");
          bannerSrc.src =
            response.data[0].banner.link !== ""
              ? response.data[0].banner.link
              : defaultPFP;
        } else {
          setInformation({});
        }
      } catch (error) {
        console.error("Error fetching information:", error);
        setInformation({});
      }
    };

    fetchInformation();
  }, [brgy]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${API_LINK}/folder/specific/?brgy=${brgy}`
      );
      console.log("ede wiw", response.data[0]);

      if (response.status === 200) {
        const formData = new FormData();
        if (logo) formData.append("files", logo);
        if (banner) formData.append("files", banner);

        formData.append("brgyinfo", JSON.stringify(information));

        const result = await axios.patch(
          `${API_LINK}/brgyinfo/${brgy}/?folder_id=${response.data[0].info}`,
          formData
        );
        console.log(result);
        window.location.reload();
        // setBrgyInformation({});
      } else {
        console.error("No Data Found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    const renamedFile = renameFile(file, "logo");

    setLogo(renamedFile);

    var output = document.getElementById("edit_logo");
    output.src = URL.createObjectURL(file);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    const renamedFile = renameFile(file, "banner");

    setBanner(renamedFile);

    var output = document.getElementById("edit_banner");
    output.src = URL.createObjectURL(e.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setInformation((prev) => ({
      ...prev,
      [name]: value,
      theme: {
        ...prev.theme,
        [name]: value,
        gradient: {
          ...prev.theme.gradient,
          [name]: value,
        },
      },
    }));
  };

  console.log("sss", id);
  useEffect(() => {
    document.title = "Barangay Information | Barangay E-Services Management";
  }, []);

  return (
    <>
      {/* Table */}

      <div className="mx-4 overflow-y-auto lg:h-[calc(100vh_-_80px)]">
        <div>
          <div className="bg-cover bg-center h-96 rounded-lg relative">
            {isEditingMode && (
              <label
                htmlFor="banner_input"
                className="absolute lg:top-[50px] top-[10px]  w-full lg:h-[370px] md:h-[202px] h-[131px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-[#295141] bg-opacity-0 hover:bg-opacity-60 cursor-pointer"
              >
                <MdOutlineFileUpload
                  size={40}
                  style={{
                    color: "#ffffff",
                    padding: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#295141",
                    border: "none",
                    top: 100,
                    right: 0,
                  }}
                />
                <input
                  type="file"
                  id="banner_input"
                  onChange={handleBannerChange}
                  name="banner"
                  accept="image/*"
                  value={!banner ? "" : banner.originalname}
                  className="hidden"
                />
              </label>
            )}
            <img
              id="edit_banner"
              className="w-full h-[150px] md:h-[300px] lg:h-[350px] xl:h-[470px] object-contain rounded-lg"
            />
          </div>

          <div className="flex justify-center sm:-mt-[260px] md:-mt-[220px] lg:-mt-[140px] xl:-mt-[60px]  h-auto md:mx-4 lg:mx-5">
            <div
              className={`w-full md:w-96 h-full lg:my-0 lg:mx-5 relative rounded-[28px] mx-auto bg-white shadow-2xl md:w-full flex flex-col `}
            >
              <div className="h-auto rounded-lg">
                <div className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
                  style={{
                    background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
                    borderRadius: "28px 28px 0 0",
                  }}
                >
                  <div
                    className="relative h-32 md:h-60 mx-auto justify-center items-center rounded-t-lg"
                    style={{
                      backgroundImage: 'url("./imgs/header-bg.png")',
                    }}
                  >
                    <img
                      id="edit_logo"
                      className="w-[120px] h-[120px] md:h-56 object-contain md:w-56 rounded-full border-4 border-white mx-auto absolute left-0 right-0 -top-[65px] md:-top-[6rem]"
                    />

                    {isEditingMode && (
                      <div className="absolute top-[19px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <label
                          htmlFor="logo_input"
                          className="block text-transparent px-8 py-8 mb-[60px] md:mb-0  md:px-[83px] md:py-[87px] font-medium rounded-full text-sm text-center opacity-0 hover:opacity-100 transition-opacity hover:bg-[#295141] hover:bg-opacity-60"
                        >
                          <BsCamera size={50} style={{ color: "#ffffff" }} />
                        </label>
                        <input
                          id="logo_input"
                          type="file"
                          onChange={handleLogoChange}
                          name="logo"
                          accept="image/*"
                          value={!logo ? "" : logo.originalname}
                          className="hidden"
                        />
                      </div>
                    )}

                    <div className="flex justify-center items-end h-full">
                      <div className="text-center">
                        <h1
                          className="font-bold text-sm md:text-xl md:text-2xl xl:text-3xl text-white mb-10"
                          style={{ letterSpacing: "0.4em" }}
                        >
                          BARANGAY {brgy.toUpperCase()}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                {isEditingMode && (
                  <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                    <div className=" mx-8 my-8 xxxl:mx-36 xxxl:my-10">
                      <div className="hs-tooltip [--trigger:click] [--placement:bottom] flex justify-start items-center gap-2">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="primary-color"
                        >
                          Primary Color
                        </label>
                        <button
                          type="button"
                          className="hs-tooltip-toggle w-4 h-4 mb-2 text-[12px] font-bold inline-flex justify-center items-center gap-2 rounded-full bg-gray-200 border border-gray-200 text-black"
                          data-tip="This primary color as the main color of your User Interface"
                        >
                          ?
                        </button>
                        <span
                          className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
                          role="tooltip"
                        >
                          This primary color will serve as the <br></br>main
                          color of your User Interface
                        </span>
                      </div>
                      <input
                        id="primary-color"
                        className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="primary"
                        type="color"
                        value={information?.theme?.primary}
                        onChange={handleChange}
                      />
                    </div>
                    <div className=" mx-8 my-8 xxxl:mx-36 xxxl:my-10">
                      <div className="hs-tooltip flex justify-start [--trigger:click] [--placement:bottom] items-center gap-2">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="primary-color"
                        >
                          Secondary Color
                        </label>
                        <button
                          type="button"
                          className="hs-tooltip-toggle w-4 h-4 mb-2 text-[12px] font-bold inline-flex justify-center items-center gap-2 rounded-full bg-gray-200 border border-gray-200 text-black"
                          data-tip="This primary color as the main color of your User Interface"
                        >
                          ?
                        </button>
                        <span
                          className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
                          role="tooltip"
                        >
                           This secondary color must be lighter <br></br>than the primary color 
                        </span>
                      </div>
                      <input
                        id="secondary-color"
                        className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="secondary"
                        type="color"
                        value={information?.theme?.secondary}
                        onChange={handleChange}
                      />
                    </div>
                    <div className=" mx-8 my-0 xxxl:mx-36 xxxl:my-10">
                      <div className="hs-tooltip flex justify-start [--trigger:click] [--placement:bottom] items-center gap-2">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="primary-color"
                        >
                          Gradient 1
                        </label>
                        <button
                          type="button"
                          className="hs-tooltip-toggle w-4 h-4 mb-2 text-[12px] font-bold inline-flex justify-center items-center gap-2 rounded-full bg-gray-200 border border-gray-200 text-black"
                          data-tip="This primary color as the main color of your User Interface"
                        >
                          ?
                        </button>
                        <span
                          className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
                          role="tooltip"
                        >
                           This gradient 1 color will be serve<br></br> as the start color of gradient
                        </span>
                      </div>
                      <input
                        id="gradient-color-1"
                        className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="start"
                        type="color"
                        value={information?.theme?.gradient?.start}
                        onChange={handleChange}
                      />
                    </div>
                    <div className=" mx-8 my-0 xxxl:mx-36 xxxl:my-10">
                      <div className="hs-tooltip flex justify-start [--trigger:click] [--placement:bottom] items-center gap-2">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="primary-color"
                        >
                          Gradient 2
                        </label>
                        <button
                          type="button"
                          className="hs-tooltip-toggle w-4 h-4 mb-2 text-[12px] font-bold inline-flex justify-center items-center gap-2 rounded-full bg-gray-200 border border-gray-200 text-black"
                          data-tip="This primary color as the main color of your User Interface"
                        >
                          ?
                        </button>
                        <span
                          className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
                          role="tooltip"
                        >
                         This gradient 1 color will be serve<br></br> as the end color of gradient
                        </span>
                      </div>
                      <input
                        id="gradient-color-2"
                        className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="end"
                        type="color"
                        value={information?.theme?.gradient?.end}
                        onChange={handleChange}
                      />
                    </div>
                    <div className=" mx-8 my-8 xxxl:mx-36 xxxl:my-10">
                      <div className="hs-tooltip flex justify-start [--trigger:click] [--placement:bottom] items-center gap-2">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="primary-color"
                        >
                          Hover Color
                        </label>
                        <button
                          type="button"
                          className="hs-tooltip-toggle w-4 h-4 mb-2 text-[12px] font-bold inline-flex justify-center items-center gap-2 rounded-full bg-gray-200 border border-gray-200 text-black"
                          data-tip="This primary color as the main color of your User Interface"
                        >
                          ?
                        </button>
                        <span
                          className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
                          role="tooltip"
                        >
                          This hover color will serve as the <br></br> color of your text
                        </span>
                      </div>
                      <input
                        id="text-color"
                        className="shadow appearance-none border rounded w-full h-12 py-2 px-3 text-gray-700 leading-tight focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                        name="hover"
                        type="color"
                        value={information?.theme?.hover}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-col md:flex-row mx-8 my-8 xxxl:mx-36 xxxl:my-10">
                  <div className="w-full md:w-1/3 py-5 md:py-0 flex items-center justify-center  rounded-t-[20px] md:rounded-t-[0px] md:rounded-tl-[20px] md:rounded-bl-[20px] bg-gradient-to-r from-[#295141] to-[#408D51]" style={{ background: `linear-gradient(to right, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,}}>
                    <h1
                      className="text-center text-white text-2xl font-bold"
                      style={{ letterSpacing: "0.2em", }}
                    >
                      STORY
                    </h1>
                  </div>
                  <div className="w-full md:w-2/3 px-6 py-4 border md:rounded-tr-[20px]  md:rounded-br-[20px] flex flex-col">
                    <textarea
                      name="story"
                      readOnly={!isEditingMode}
                      className="font-base text-black text-sm h-36 lg:h-40 overflow-y-auto mb-5"
                      style={{ letterSpacing: "0.1em", whiteSpace: "pre-line" }}
                      value={information.story}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row mx-8 my-8 xxxl:mx-36 xxxl:my-10">
                  <div className="w-full md:w-1/3 py-5 md:py-0 flex items-center justify-center  rounded-t-[20px] md:rounded-t-[0px] md:rounded-tl-[20px] md:rounded-bl-[20px] bg-gradient-to-r from-[#295141] to-[#408D51]" style={{ background: `linear-gradient(to right, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,}}>
                    <h1
                      className="text-center text-white text-2xl font-bold"
                      style={{ letterSpacing: "0.2em" }}
                    >
                      MISSION
                    </h1>
                  </div>
                  <div className="w-full md:w-2/3 px-6 py-4 border md:rounded-tr-[20px]  md:rounded-br-[20px] flex flex-col">
                    <textarea
                      readOnly={!isEditingMode}
                      className="font-base text-black text-sm h-36 lg:h-40 overflow-y-auto mb-5"
                      style={{ letterSpacing: "0.1em", whiteSpace: "pre-line" }}
                      value={information.mission}
                      name="mission"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row mx-8 my-8 xxxl:mx-36 xxxl:my-10">
                  <div className="w-full md:w-1/3 py-5 md:py-0 flex items-center justify-center  rounded-t-[20px] md:rounded-t-[0px] md:rounded-tl-[20px] md:rounded-bl-[20px] bg-gradient-to-r from-[#295141] to-[#408D51]" style={{ background: `linear-gradient(to right, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,}}>
                    <h1
                      className="text-center text-white text-2xl font-bold"
                      style={{ letterSpacing: "0.2em" }}
                    >
                      VISION
                    </h1>
                  </div>
                  <div className="w-full md:w-2/3 px-6 py-4 border md:rounded-tr-[20px] md:rounded-br-[20px] flex flex-col">
                    <textarea
                      readOnly={!isEditingMode}
                      className="font-base text-black text-sm h-36 lg:h-40 overflow-y-auto mb-5"
                      style={{ letterSpacing: "0.1em", whiteSpace: "pre-line" }}
                      value={information.vision}
                      name="vision"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className=" flex justify-center px-4 gap-4 py-6 text-white">
                {isEditingMode ? (
                    <>
                      <button
                        onClick={handleSaveChanges}
                        className="bg-custom-green-button3 w-full xxl:w-1/2 text-sm lg:text-sm px-7 py-3 md:py-2.5 rounded-xl "
                      >
                        SAVE CHANGES
                      </button>
                      <button
                        className="bg-pink-700 w-full xxl:w-1/2 px-7 py-2 rounded-xl"
                        onClick={() => setisEditingMode(false)}
                      >
                        CANCEL
                      </button>
                    </>
                  ) : (
                    <button
                      className="text-white w-full lg:w-auto bg-custom-green-button3 font-medium rounded-full text-sm m-2 py-2 px-10 text-center"
                      onClick={() => setisEditingMode(true)}
                    >
                      EDIT
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Information;
