import React from "react";
import GetBrgy from "../../GETBrgy/getbrgy";
function ViewOfficialModal({
  selectedOfficial,
  setSelectedOfficial,
  brgy,
  officials,
}) {
  const information = GetBrgy(brgy)
  console.log("selected", selectedOfficial);
  console.log("selected", officials);
  const dateFormat = (date) => {
    if (!date) {
      // If date is null, undefined, or an empty string, return an empty string
      return "";
    }
  
    // Use substr only when date is a non-empty string
    const eventdate = date.substr(0, 7);
    console.log(eventdate);
    return eventdate;
  };
  
  return (
    <div>
      <div
        id="hs-view-archived-official-modal"
        class="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center lg:ml-10 xxl:ml-0"
      >
        {/* Modal */}
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
          <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
            {/* Header */}
            <div className="py-5 px-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#396288] to-[#013D74] overflow-hidden rounded-t-2xl"   style={{
              background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
            }}>
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                VIEW ARCHIVED BARANGAY OFFICIAL
              </h3>
            </div>

            <div className="flex flex-col mx-auto w-full py-5 px-5 overflow-y-auto relative h-[470px]">
              <div className="flex flex-col">
                <div className="flex flex-col mb-1">
                  {/* Service Description */}
                  <div class="relative mt-4 flex flex-col w-full">
                    {/* Modal Images */}
                    <div class="relative w-full rounded-t-xl">
                      <div className="mx-auto items-center">
                        <img
                          src={selectedOfficial.picture?.link || ""}
                          alt=""
                          className="w-[250px] h-[250px] md:w-full md:h-[350px] lg:max-w-[450px] lg:h-[350px] mx-auto rounded-xl object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Request Information */}
                  <div class="relative mt-4 pb-6 overflow-y-auto flex flex-col w-full h-full rounded-lg space-y-2">
                    <b className="border-solid border-0 border-black/50 border-b-2  uppercase font-medium text-lg md:text-lg">
                      Personal Information
                    </b>
                    <h1
                      class="font-medium mb-1 text-black text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      FULL NAME
                    </h1>
                    <input
                      type="search"
                      id="search-dropdown"
                      className="shadow appearance-none border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      placeholder=""
                      value={selectedOfficial.name || ""}
                      readOnly
                    />
                  </div>
                </div>

                {/* Other info */}
                <b className="border-solid border-0 border-black/50 border-b-2 uppercase font-medium text-lg md:text-lg mt-1">
                  Government Information
                </b>
                <div class="relative mt-5  overflow-y-auto flex flex-col space-y-4">
                  {/* Position and Service Rendered */}
                  <div className="w-full">
                    <h1
                      class="font-bold text-black mx-auto text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      POSITION
                    </h1>
                    <input
                      type="search"
                      id="search-dropdown"
                      className="shadow border w-full p-2 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      placeholder=""
                      value={selectedOfficial.position}
                      readOnly
                    />
                  </div>

                  <div className="w-full mt-2">
                    <h1
                      class="font-bold text-black mx-auto text-sm"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      SERVICE RENDERED
                    </h1>

                    {/* Date 1 */}
                    <div className="flex flex-row">
                      <div className="w-full md:w-1/5 lg:w-1/6">
                        <label
                          htmlFor="from_year"
                          className=" w-full font-base flex items-center"
                        >
                          FROM YEAR:{" "}
                        </label>
                      </div>
                      <div className="w-full md:w-4/5 lg:w-5/6">
                        <input
                          type="month"
                          className="shadow border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                          id="from_year"
                          name="fromYear"
                          value={dateFormat(selectedOfficial.fromYear)}
                          required
                          disabled
                        />
                      </div>
                    </div>
                    {/* Date 2 */}
                    <div className="flex flex-col  md:flex-row mt-3">
                      <div className="w-full md:w-1/5 lg:w-1/6">
                        <label
                          htmlFor="To_year"
                          className=" w-[6rem] flex items-center"
                        >
                          TO YEAR:{" "}
                        </label>
                      </div>
                      <div className="w-full md:w-4/5 lg:w-5/6">
                        <input
                          type="month"
                          className="shadow border w-full p-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                          id="To_year"
                          name="toYear"
                          value={dateFormat(selectedOfficial.toYear)}
                          required
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div class="flex justify-end items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              <button
                type="button"
                className="h-[2.5rem] w-full py-1 px-6 gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                data-hs-overlay="#hs-view-archived-official-modal"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
      <script src="../path/to/flowbite/dist/flowbite.min.js"></script>
    </div>
  );
}

export default ViewOfficialModal;
