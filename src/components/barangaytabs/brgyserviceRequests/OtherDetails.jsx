import React from "react";

const OtherDetails = ({ detail, returnFile }) => {
  return (
    <div className="space-y-4">
      {detail.form &&
        Object.entries(detail.form[1]).map(([sectionInx, sectionItem]) => {
          return (
            <fieldset
              key={sectionInx}
              className="flex-col border-[1px] border-black rounded-md"
            >
              <legend className="ml-2 px-2 text-sm font-medium">
                {sectionItem.section_title}
              </legend>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-center items-center gap-3 p-6">
                {detail.form &&
                  Object.entries(sectionItem.form).map(([key, item], idx) => {
                    return (
                      <div key={idx}>
                        {item.type === "select" ? (
                          <div>
                            <label
                              htmlFor={item.display}
                              className="block sm:text-xs lg:text-sm font-medium mb-2"
                            >
                              {item.display.toUpperCase()}
                            </label>
                            <select
                              id={item.display}
                              name={item.variable}
                              defaultValue={item.value}
                              className={`border-gray-400 border py-3 px-4 block w-full text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500`}
                            >
                              <option value="" disabled>
                                -- Select option --
                              </option>
                              {Object.entries(item.children).map(
                                ([i, option]) => {
                                  return (
                                    <option key={i} value={option.value}>
                                      {option.option}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                          </div>
                        ) : null}
                        {item.type === "radio" || item.type === "checkbox" ? (
                          <div>
                            <label
                              htmlFor={item.display}
                              className="block sm:text-xs lg:text-sm font-medium mb-2"
                            >
                              {item.display.toUpperCase()}
                            </label>

                            {item.children.map((childItem, childIdx) => (
                              <div key={childIdx} className="flex items-center">
                                <input
                                  className={`border-gray-400 border shrink-0 mt-0.5 text-green-500 focus:ring-green-500`}
                                  name={item.variable}
                                  type={item.type}
                                  checked={childItem.value === item.value}
                                />
                                <label className="ml-2">
                                  {childItem.option}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : null}
                        {item.type === "date" ||
                        item.type === "email" ||
                        item.type === "number" ||
                        item.type === "text" ? (
                          <div>
                            <label
                              htmlFor={item.display}
                              className="block sm:text-xs lg:text-sm font-medium mb-2"
                            >
                              {item.display.toUpperCase()}
                            </label>
                            <input
                              name={item.variable}
                              type={item.type}
                              id={item.display}
                              readOnly={item.display === "age"}
                              className={`border-gray-400 border py-3 px-4 block w-full text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white`}
                              placeholder={
                                item.display === "address"
                                  ? "Street / Barangay / Municipality"
                                  : item.display.toLowerCase()
                              }
                              value={item.value}
                              aria-describedby="hs-input-helper-text"
                            />
                          </div>
                        ) : null}
                        {item.type === "file" ? (
                          <div>
                            <label
                              htmlFor={item.display}
                              className="block sm:text-xs lg:text-sm font-medium mb-2"
                            >
                              {item.display.toUpperCase()}
                            </label>
                            {returnFile(
                              `${
                                detail.form[0].lastName.value
                              } - ${item.display.toUpperCase()}`
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
              </div>
            </fieldset>
          );
        })}
    </div>
  );
};

export default OtherDetails;
