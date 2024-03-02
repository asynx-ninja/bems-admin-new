import React from "react";
import EditDropbox from "./viewDropbox";
import { useState, useEffect, useRef } from "react";
function ViewTouristSpot({touristspotInfo }) {


  const [images, setImages] = useState([]);


  useEffect(() => {
    setImages(touristspotInfo.length === 0 ? [] : touristspotInfo.image || []);
  }, [touristspotInfo]);

  const editImageRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImages(file);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        editImageRef.current.src=reader.result;
    });
    reader.readAsDataURL(e.target.files[0]);

    setImages([...images, ...e.target.files]);
  };

  return (
    <div>
      <div
        id="hs-modal-viewTouristspot"
        className="hs-overlay hidden fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center "
      >
        {/* Modal */}
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
          <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
            {/* Header */}
            <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]  overflow-hidden rounded-t-2xl">
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                VIEW TOURIST SPOT
              </h3>
            </div>

            <div className="scrollbarWidth scrollbarTrack scrollbarHover scrollbarThumb flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  TOURIST SPOT NAME
                </label>
                <input
                  id="name"
                  className="shadow appearance-none border w-full py-2 px-3 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                  name="name"
                  type="text"
                  value={touristspotInfo && touristspotInfo.name}
                  disabled
                  placeholder="Service Name"
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
                  id="message"
                  rows={8}
                  name="details"
                  value={touristspotInfo && touristspotInfo.details}
                  disabled
                  className="shadow appearance-none border w-full p-2.5 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                  placeholder="Enter service details..."
                />
              </div>
       
              <EditDropbox
                editImageRef={editImageRef}
                images={touristspotInfo && images}
                setImages={setImages}
                handleFileChange={handleFileChange}
              />
              
            </div>
            <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                <button
                  type="button"
                  className="h-[2.5rem] w-full py-1 px-6  gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                  data-hs-overlay="#hs-modal-viewTouristspot"
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

export default ViewTouristSpot;
