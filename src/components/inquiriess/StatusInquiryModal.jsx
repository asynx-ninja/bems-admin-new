import React from "react";
import Error from "../../assets/modals/Error.png";
import axios from "axios";
import API_LINK from "../../config/API";
import { useState } from "react";
import StatusLoader from "./loaders/StatusLoader";
function ArchiveInquiryModal({ selectedItems }) {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [error, setError] = useState(null);
  const handleSave = async (e) => {

    try {
      e.preventDefault();
      setSubmitClicked(true);
      for (let i = 0; i < selectedItems.length; i++) {
        const response = await axios.patch(
          `${API_LINK}/inquiries/status/${selectedItems[i]}`
        );
        if (response.status === 200) {
          setSubmitClicked(false);
          setUpdatingStatus("success");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }
     
    } catch (err) {
      console.log(err);
      setSubmitClicked(false);
      setUpdatingStatus(null);
      setError("An error occurred while updating the inquiry.");
    }
    
  };
  return (
 <div>
     <div
      id="hs-modal-archiveInquiry"
      className="z-[100] hs-overlay hidden w-full h-full fixed top-0 left-0 overflow-x-hidden overflow-y-auto"
    >
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-300 bg-opacity-0">
        <div className="bg-white sm:w-5/6 sm:h-[18rem] md:w-2/4 md:h-[18rem]  lg:w-[40rem] lg:h-[22rem] rounded-3xl shadow-lg relative flex flex-col items-center justify-center">
          <img
            src={Error}
            className="relative bottom-[4rem]"
            alt="Error Icon"
          />

          <p className="relative bottom-[3rem] text-center sm:text-[16px] sm:w-[13rem] md:text-[1.2rem] md:w-[15rem] lg:w-[19rem]  lg:text-2xl text-gray-700 w-[30rem]">
            Are you sure you want to complete this Ticket?
          </p>

          <div className="flex mt-8 space-x-4 relative bottom-[3rem]">
            <button
              type="button"
              onClick={handleSave} 
              className=" w-[6rem] lg:w-[12rem] px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600"
            >
              Yes
            </button>
            <button
              type="button"
              data-hs-overlay="#hs-modal-archiveInquiry"
              className="lg:w-[12rem] w-[6rem] px-4 py-2 border border-red-600 text-red-700 rounded hover:bg-red-400"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
    {submitClicked && <StatusLoader updatingStatus="updating" />}
          {updatingStatus && (
            <StatusLoader updatingStatus={updatingStatus} error={error} />
          )}
 </div>
  );
}

export default ArchiveInquiryModal;
