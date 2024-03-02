import React from "react";
import axios from "axios";
import API_LINK from "../../config/API";
import { useState } from "react";

function InquiryStatus({ status, setStatus }) {
  const [isLoading, setIsLoading] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const handleSave = async (e) => {
    setIsLoading(true);

    // Clear any existing timer
    clearTimeout(timerId);
    try {
      e.preventDefault();

      const response = await axios.patch(
        `${API_LINK}/inquiries/status/${status.id}`,
        {
          isApproved: status.status,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setTimerId(
          setTimeout(() => {
            setIsLoading(false);
            HSOverlay.close(document.getElementById("hs-modal-status"));
            window.location.reload();
          }, 1000)
        );
      
      } else;
    } catch (err) {
      console.log(err);
    }
   
  };

  const handleOnChange = (e) => {
    setStatus((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
        {isLoading && (
        <div className="fixed inset-0 bg-white z-50 flex justify-center items-center">
          <div className="loaders">
            <div className="loader"></div>
            <div className="loader"></div>
            <div className="loader"></div>
          </div>
        </div>
      )}
      <div className="">
        <div
          id="hs-modal-status"
          className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
        >
        
          <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-xl">
            <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto">
              {/* Header */}
              <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141] overflow-hidden rounded-t-2xl">
                <h3
                  className="font-bold text-white mx-auto md:text-xl text-center"
                  style={{ letterSpacing: "0.3em" }}
                >
                  STATUS
                </h3>
              </div>
              <div className="mt-5">
                <form>
                  <div className="flex flex-col lg:flex-row">
                    <div className="mb-4 px-4 w-full">
                      <div className="mb-4 px-4">
                        <label
                          htmlFor="civilStatus"
                          className="block text-sm font-medium text-gray-700"
                        >
                          STATUS OF INQUIRY
                        </label>
                        <select
                          id="civilStatus"
                          name="status"
                          onChange={handleOnChange}
                          className="w-full mt-3 p-2 border border-gray-300 rounded"
                          value={status.status}
                        >
                          <option value="Completed">COMPLETED</option>
                          <option value="Pending">PENDING</option>
                          <option value="In Progress">IN PROGRESS</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              {/* Buttons */}
              <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleSave}
                  className="h-[2.5rem] w-[9.5rem] py-1 px-6 inline-flex justify-center items-center gap-2 rounded-md borde text-sm font-base bg-teal-900 text-white shadow-sm align-middle"
                  data-hs-overlay="#hs-modal-status"
                >
                  SAVE CHANGES
                </button>
                <button
                  type="button"
                  className="h-[2.5rem] w-[9.5rem] py-1 px-6 inline-flex justify-center items-center gap-2 rounded-md border text-sm font-base bg-pink-800 text-white shadow-sm align-middle"
                  data-hs-overlay="#hs-modal-status"
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

export default InquiryStatus;
