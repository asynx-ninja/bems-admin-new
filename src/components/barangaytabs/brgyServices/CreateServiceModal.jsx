import React from 'react'
import Dropbox from "./Dropbox";
const CreateServiceModal = () => {
  return (
    <div>
    <div
      id="hs-create-service-modal"
      className="hs-overlay hidden fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center "
    >
      {/* Modal */}
      <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-full">
        <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto">
          {/* Header */}
          <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#396288] to-[#013D74] overflow-hidden rounded-t-2xl">
            <h3
              className="font-bold text-white mx-auto md:text-xl text-center"
              style={{ letterSpacing: "0.3em" }}
            >
              CREATE SERVICE
            </h3>
          </div>

          <div className="flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-screen">
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
                     className="w-[200px] md:w-[250px] mx-auto lg:w-full md:h-[140px] lg:h-[250px] object-cover"
                      id="logo"
                      alt="Current profile photo"
                    />
                  </div>
                  <label className="w-full bg-white border border-gray-300">
                    <span className="sr-only">Choose logo photo</span>
                    <input
                      type="file"
                    //   onChange={handleLogoChange}
                      name="logo"
                      accept="image/*"
                    //   value={!logo ? "" : logo.originalname}
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
                      className="w-[200px] md:w-[250px] mx-auto lg:w-full md:h-[140px] lg:h-[250px] object-cover"
                      id="banner"
                      alt="Current profile photo"
                    />
                  </div>
                  <label className="w-full bg-white border border-gray-300">
                    <span className="sr-only">Choose banner photo</span>
                    <input
                      type="file"
                    //   onChange={handleBannerChange}
                      name="banner"
                      accept="image/*"
                    //   value={!banner ? "" : banner.originalname}
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="name"
                type="text"
                // value={service.name}
                // onChange={handleChange}
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
                // onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500"
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
                <option value="Community Services">Community Services</option>
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
                // value={service.details}
                // onChange={handleChange}
                className="block p-2.5 w-full text-sm text-gray-700  rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="fee"
                name="fee"
                type="number"
                // value={service.fee}
                // onChange={handleChange}
                placeholder="Service Fee"
              />
            </div>
            <Dropbox
            //   files={files}
            //   setFiles={setFiles}
            //   handleFileChange={handleFileChange}
            //   handleSubmit={handleSubmit}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
          <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
            <button
              type="button"
              className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-[#013D74] text-white shadow-sm"
            //  onClick={handleSubmit}
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
    </div>
  </div>
  )
}

export default CreateServiceModal