import React from "react";
import Error from "../../../assets/modals/Error.png";

function RequestApprovalModal() {
  return (
    <div
      id="hs-approval-modal"
      className="z-[100] hs-overlay hidden w-full h-full fixed top-0 left-0 z-60 overflow-x-hidden overflow-y-auto"
    >
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-300 bg-opacity-0">
        <div className="bg-white sm:w-5/6 sm:h-[18rem] md:w-2/4 md:h-[18rem]  lg:w-[40rem] lg:h-[22rem] rounded-3xl shadow-lg relative flex flex-col items-center justify-center ">
          <img
            src={Error}
            className="relative bottom-[4rem]"
            alt="Error Icon"
          />

          <p className="relative bottom-[3rem] px-20 text-center sm:text-xs  lg:text-2xl text-gray-700">
            Are you sure you want to approve this request?
          </p>

          <div className="flex mt-8 space-x-4 relative bottom-[3rem]">
            <button
              type="button"
              data-hs-overlay="#hs-approval-modal"
              className=" w-[6rem] lg:w-[12rem] px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600"
            >
              Yes
            </button>
            <button
              type="button"
              data-hs-overlay="#hs-approval-modal"
              className="lg:w-[12rem] w-[6rem] px-4 py-2 border border-red-600 text-red-700 rounded hover:bg-red-400"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestApprovalModal;
