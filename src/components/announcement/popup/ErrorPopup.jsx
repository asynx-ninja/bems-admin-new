import React, { useState, useEffect } from "react";
import { MdError } from "react-icons/md";

function ErrorPopup({ creationStatus, error }) {
  const textPrompts = {
    creating: "Creating the announcement...",
    waiting: "Please wait...",
    success: "Announcement Creation Successful!",
    error: error,
  };

  const [loadingText, setLoadingText] = useState(
    textPrompts[creationStatus] || "Creating the announcement.."
  );
  const [loading, setLoading] = useState(creationStatus === "creating");

  useEffect(() => {
    if (["success", "error"].includes(creationStatus)) {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [creationStatus]);

  return (
    <div className="absolute bottom-0 lg:bottom-0 lg:end-0 mb-20 lg:mr-10">
      <div
        className="w-screen md:w-80 rounded-xl shadow-lg"
        role="alert"
      >
        <div className="flex flex-row bg-[#e05353]  items-center p-3 rounded-xl space-x-3">
          <MdError size={25} className="text-white" />
          <div className="flex flex-row w-full">
            <div className="flex space-x-1.5 items-center">
              <p className="text-[#f5f5f5] text-sm font-medium ">ERROR:</p>
              <p className="text-[#f5f5f5] text-xs font-medium ">
                (Please fill in the required fields.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPopup;
