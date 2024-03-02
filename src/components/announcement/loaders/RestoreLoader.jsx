import React, { useState, useEffect } from "react";

function RestoreLoader({ updatingStatus, error }) {
  const textPrompts = {
    updating: "Restoring the announcement, Please wait...",
    waiting: "Please wait...",
    success: "Announcement Restored Successfully!",
    error: "Error restoring announcement. Please try again.",
  };

  const [loadingText, setLoadingText] = useState(
    textPrompts[updatingStatus] || "Restoring the announcement.."
  );
  const [loading, setLoading] = useState(updatingStatus === "Restoring");

  useEffect(() => {
    if (["success", "error"].includes(updatingStatus)) {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [updatingStatus]);

  return (
    <div className="absolute top-0 lg:top-10 lg:end-0 mb-20 lg:mr-5 z-[80]">
      <div
        className={`w-screen md:w-auto ${
          updatingStatus === "error" ? "bg-red-500" : "bg-[#295141]"
        } border border-gray-200 rounded-xl shadow-lg`}
        role="alert"
        style={{ animation: "slideIn 0.3s ease-out" }}
      >
        <div className="flex items-center justify-start p-4">
          <div role="status" className="flex items-center justify-center mr-3">
            {updatingStatus === "error" ? (
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1.75C6.2 1.75 1.75 6.2 1.75 12C1.75 17.8 6.2 22.25 12 22.25C17.8 22.25 22.25 17.8 22.25 12C22.25 6.2 17.8 1.75 12 1.75ZM12 20.5C7.3 20.5 3.5 16.7 3.5 12C3.5 7.3 7.3 3.5 12 3.5C16.7 3.5 20.5 7.3 20.5 12C20.5 16.7 16.7 20.5 12 20.5ZM12 6.75C11.3 6.75 10.75 7.3 10.75 8V14C10.75 14.7 11.3 15.25 12 15.25C12.7 15.25 13.25 14.7 13.25 14V8C13.25 7.3 12.7 6.75 12 6.75ZM12 16.75C11.3 16.75 10.75 17.3 10.75 18C10.75 18.7 11.3 19.25 12 19.25C12.7 19.25 13.25 18.7 13.25 18C13.25 17.3 12.7 16.75 12 16.75Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-[#414141] animate-spin fill-[#08fcf0]"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
            <span className="sr-only">Loading...</span>
          </div>
          <div className="flex flex-col justify-center">
            {updatingStatus !== "error" && (
              <span className="text-sm text-white font-semibold">
                {loadingText}
              </span>
            )}
            {error && (
              <span className="text-sm text-white font-semibold">{error}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestoreLoader;
