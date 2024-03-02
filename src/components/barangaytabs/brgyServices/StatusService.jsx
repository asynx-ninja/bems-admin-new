import React from "react";
import axios from "axios";
import API_LINK from "../../../config/API";
import { useState } from "react";
import StatusLoader from "./loaders/StatusLoader";
import GetBrgy from "../../GETBrgy/getbrgy";
function ServiceStatus({ status, setStatus, selectedService, brgy }) {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [error, setError] = useState(null);
  const information = GetBrgy(brgy);
  const getType = (type) => {
    switch (type) {
      case "MUNISIPYO":
        return "Municipality";
      default:
        return "Barangay";
    }
  };
console.log("panget",selectedService)
  const handleSave = async (e) => {
    try {
      e.preventDefault();
      setSubmitClicked(true);
      const response = await axios.patch(
        `${API_LINK}/services/status/${status.id}`,
        {
          isApproved: status.status,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      let notify;

      notify = {
        category: "Many",
        compose: {
          subject: `SERVICES - ${selectedService.name}`,
          message: `Municipality has ${status.status} your service named: ${selectedService.name}.\n`,
          go_to: "Services",
        },
        target: {
          user_id: null,
          area: selectedService.brgy,
        },
        type: "Barangay",
        banner: selectedService.collections.banner,
        logo: selectedService.collections.logo,
      };

      console.log("Notify: ", notify);
      console.log("Result: ", response);

      const result = await axios.post(`${API_LINK}/notification/`, notify, {
        headers: {
          "Content-Type": "application/json",
        },
      });
        console.log("pangetnaman",result)
      if (response.status === 200) {
        setTimeout(() => {
          setSubmitClicked(false);
          setUpdatingStatus("success");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      setSubmitClicked(false);
      setUpdatingStatus(null);
      setError("An error occurred while updating the inquiry.");
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
      <div className="">
        <div
          id="hs-modal-serviceStatus"
          className="hs-overlay hidden fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
        >
          {/* Modal */}
          <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-xl">
            <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto">
              {/* Header */}
              <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#396288] to-[#013D74] overflow-hidden rounded-t-2xl"   style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}>
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
                          SERVICE STATUS
                        </label>
                        <select
                          id="civilStatus"
                          onChange={handleOnChange}
                          name="status"
                          className="w-full mt-3 p-2 border border-gray-300 rounded"
                          value={status.status}
                        >
                          <option value="Approved">APPROVED</option>
                          <option value="Disapproved">DISAPPROVED</option>
                          <option value="Pending">PENDING</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              {/* Buttons */}
              <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700 mx-auto">
                <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="h-[2.5rem] w-full md:w-[9.5rem] py-1 px-6 inline-flex justify-center items-center gap-2 rounded-md borde text-sm font-base bg-[#295141]  text-white shadow-sm align-middle"
                  >
                    SAVE CHANGES
                  </button>
                  <button
                    type="button"
                    className="h-[2.5rem] w-full md:w-[9.5rem] py-1 px-6 inline-flex justify-center items-center gap-2 rounded-md border text-sm font-base bg-pink-800 text-white shadow-sm align-middle"
                    data-hs-overlay="#hs-modal-serviceStatus"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
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

export default ServiceStatus;
