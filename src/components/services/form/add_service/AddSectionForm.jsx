import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoTrashBin } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";

const AddSectionForm = ({ section, setSection }) => {
  const formatVariable = (value) => {
    const newValue = value.toLowerCase();

    return newValue.replace(/ /g, "_");
  };

  const addSectionField = () => {
    const updatedData = [...section];
    updatedData.push({
      section_title: "",
      section_variable: "",
      form: [
        {
          variable: "",
          display: "",
          type: "text",
          accept: "",
          value: null,
          children: [],
        },
      ],
    });
    setSection(updatedData);
  };

  const handleSectionChange = (e, index) => {
    const updatedSectionFields = [...section];

    updatedSectionFields[index] = {
      ...updatedSectionFields[index],
      section_title: e.target.value,
      section_variable: formatVariable(e.target.value),
    };

    setSection(updatedSectionFields);
  };

  const removeSectionField = (index) => {
    const updatedSectionFields = [...section];
    updatedSectionFields.splice(index, 1);

    setSection(updatedSectionFields);
  };

  // INPUT FIELDS

  const addInputField = (index) => {
    const updatedData = [...section];
    updatedData[index].form.push({
      variable: "",
      display: "",
      type: "text",
      accept: "",
      value: null,
      children: [],
    });
    setSection(updatedData);
  };

  const handleInputChange = (e, sectionIndex, formIndex) => {
    const updatedInputFields = [...section];
    updatedInputFields[sectionIndex].form[formIndex] = {
      ...updatedInputFields[sectionIndex].form[formIndex],
      [e.target.name]:
        e.target.name === "variable"
          ? formatVariable(e.target.value)
          : e.target.value,
    };

    if (
      updatedInputFields[sectionIndex].form[formIndex].type !== "radio" &&
      updatedInputFields[sectionIndex].form[formIndex].type !== "select" &&
      updatedInputFields[sectionIndex].form[formIndex].type !== "checkbox"
    ) {
      updatedInputFields[sectionIndex].form[formIndex] = {
        ...updatedInputFields[sectionIndex].form[formIndex],
        children: [],
      };
    }

    if (updatedInputFields[sectionIndex].form[formIndex].type === "checkbox") {
      updatedInputFields[sectionIndex].form[formIndex] = {
        ...updatedInputFields[sectionIndex].form[formIndex],
        value: [],
      };
    }

    if (updatedInputFields[sectionIndex].form[formIndex].type !== "file") {
      updatedInputFields[sectionIndex].form[formIndex] = {
        ...updatedInputFields[sectionIndex].form[formIndex],
        accept: "",
      };
    }

    setSection(updatedInputFields);
  };

  const removeInputField = (sectionIndex, formIndex) => {
    const updatedData = [...section];
    updatedData[sectionIndex].form.splice(formIndex, 1);
    setSection(updatedData);
  };

  // OPTION FIELD

  const addOptionField = (sectionIndex, formIndex) => {
    const updatedData = [...section];
    updatedData[sectionIndex].form[formIndex].children.push({
      value: "",
      option: "",
    });
    setSection(updatedData);
  };

  const removeOptionField = (sectionIndex, formIndex, childrenIndex) => {
    const updatedData = [...section];
    updatedData[sectionIndex].form[formIndex].children.splice(childrenIndex, 1);
    setSection(updatedData);
  };

  const handleOptionChange = (e, sectionIndex, formIndex, childrenIndex) => {
    const updatedData = [...section];
    const updatedChildren = [
      ...updatedData[sectionIndex].form[formIndex].children,
    ];
    updatedChildren[childrenIndex] = {
      ...updatedChildren[childrenIndex],
      [e.target.name]: e.target.value,
    };
    updatedData[sectionIndex].form[formIndex].children = updatedChildren;

    setSection(updatedData);
  };

  return (
    <div>
      <div className="flex justify-between items-center bg-pink-800 mb-2 px-3 py-2 sticky top-0 mx-3 mt-2 rounded-md">
        <h1 className="text-white font-bold text-sm">ADD CUSTOM SECTION</h1>
        <button
          className=" text-white font-bold uppercase text-sm"
          onClick={addSectionField}
        >
          <IoIosAddCircleOutline
            size={24}
            className="text-white hover:text-yellow-500 rounded-full"
          />
        </button>
      </div>
      <div className="w-full px-3">
        {section &&
          section.map((section, sectionIndex) => (
            <div key={sectionIndex} className="rounded-lg mb-2 w-full">
              {/* DROPDOWN */}
              <div
                className={`hs-dropdown relative bg-gradient-to-r bg-[#036666] pb-2 text-white flex flex-col justify-between items-centertext-sm px-3 py-1 md:text-base lg:text-lg rounded-lg`}
              >
                <button
                  onClick={() => removeSectionField(sectionIndex)}
                  className=" border-black absolute -top-1 -left-2 bg-red-500 hover:bg-white rounded-full"
                >
                  <TiDelete
                    size={25}
                    className="text-white hover:text-red-500 hover:border-2  rounded-full"
                  />
                </button>
                <button
                  id="hs-unstyled-collapse"
                  data-hs-collapse={`#hs-statistics-dashboard-${sectionIndex}`}
                  className="hs-collapse-toggle justify-between flex items-center w-full gap-x-3 text-sm rounded-md"
                >
                  <div className="flex items-center gap-x-3 py-2 w-full inline-flex items-center text-base rounded-lg">
                    <input
                      type="text"
                      name="section_title"
                      className="shadow placeholder-gray-400 font-medium appearance-none border w-full p-1 text-sm bg-white border-green-500 text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                      value={section.section_title}
                      placeholder="Input Section Title"
                      onChange={(e) => handleSectionChange(e, sectionIndex)}
                    />
                  </div>
                  <div className="flex">
                    <svg
                      className="hs-collapse-open:rotate-180  w-2.5 h-2.5"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>

                {/* CUSTOM INPUT */}
                <div
                  id={`hs-statistics-dashboard-${sectionIndex}`}
                  className="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300 py-2 bg-[#248277] rounded-lg px-2"
                  aria-labelledby="hs-unstyled-collapse"
                >
                  <div className="flex justify-between items-center bg-[#56ab91] mb-2 px-3 py-2  mt-2 rounded-md w-full">
                    <h1 className="text-white font-bold text-sm">
                      ADD CUSTOM INPUT
                    </h1>
                    <button
                      className=" text-white font-bold uppercase text-sm"
                      onClick={() => addInputField(sectionIndex)}
                    >
                      <IoIosAddCircleOutline
                        size={24}
                        className="text-white hover:text-yellow-500 rounded-full"
                      />
                    </button>
                  </div>
                  <div className="bg-[#56ab91] p-2 rounded-lg space-y-2">
                    {section.form.map((form, formIndex) => (
                      <div
                        className="flex flex-col bg-white rounded-lg px-2"
                        key={formIndex}
                      >
                        <div className="flex flex-col md:flex-row md:space-x-2  py-2">
                          <div className="w-full flex flex-col space-y-2">
                            <input
                              type="text"
                              name="display"
                              className="shadow appearance-none border w-full px-2 py-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              value={form.display}
                              placeholder="Display Name (i.e: First Name, Last Name)"
                              onChange={(e) =>
                                handleInputChange(e, sectionIndex, formIndex)
                              }
                            />
                            <input
                              type="text"
                              name="variable"
                              className="shadow appearance-none border w-full px-2 py-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              value={form.variable}
                              placeholder="Variable Name (e.g id_pic)"
                              onChange={(e) =>
                                handleInputChange(e, sectionIndex, formIndex)
                              }
                            />
                            <select
                              name="type"
                              className="border border-1 border-gray-300 shadow bg-white px-2 py-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                              onChange={(e) =>
                                handleInputChange(e, sectionIndex, formIndex)
                              }
                            >
                              <option value="" disabled>
                                Select Type
                              </option>
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="email">Email</option>
                              <option value="select">Select</option>
                              <option value="radio">Radio</option>
                              <option value="checkbox">Checkbox</option>
                              <option value="file">File</option>
                              <option value="date">Date</option>
                            </select>
                            {form.type === "file" && (
                              <select
                                name="accept"
                                className="border border-1 border-gray-300 shadow bg-white px-2 py-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                                onChange={(e) =>
                                  handleInputChange(e, sectionIndex, formIndex)
                                }
                                defaultValue={""}
                              >
                                <option value="" disabled>
                                  Select File Type
                                </option>
                                <option value="image/*">Image</option>
                                <option value=".doc,.docx,.pdf">
                                  Document or PDF
                                </option>
                              </select>
                            )}
                          </div>

                          <button
                            onClick={() =>
                              removeInputField(sectionIndex, formIndex)
                            }
                            className=" border-black bg-pink-800 md:bg-transparent mt-2 md:mt-0 rounded-lg"
                          >
                            <IoTrashBin
                              size={24}
                              className="text-white md:text-red-600 my-1 md:my-0 mx-auto md:mx-none hover:text-gray-200 md:hover:text-red-800 rounded-full"
                            />
                          </button>
                        </div>

                        {(form.type === "radio" ||
                          form.type === "select" ||
                          form.type === "checkbox") && (
                          <div className="pb-2">
                            <div className="flex justify-between items-center rounded-md bg-[#508a5a] mb-2 px-3 py-2 sticky top-0 ">
                              <h1 className="text-white font-medium text-sm">
                                ADD CUSTOMIZABLE OPTION
                              </h1>
                              <button
                                className=" text-white font-bold uppercase text-sm"
                                onClick={() =>
                                  addOptionField(sectionIndex, formIndex)
                                }
                              >
                                <IoIosAddCircleOutline
                                  size={24}
                                  className="hover:text-yellow-500 rounded-full"
                                />
                              </button>
                            </div>
                            {/* OPTION'S PANE */}
                            <div className="bg-[#508a5a] p-2 rounded-lg space-y-2">
                              {form.children.map(
                                (childrenItem, childrenIndex) => (
                                  <div key={childrenIndex}>
                                    <div className="flex space-x-2 p-2 bg-white rounded-lg">
                                      <input
                                        type="text"
                                        name="option"
                                        className="shadow appearance-none border w-full px-2 py-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                                        value={childrenItem.option}
                                        placeholder="Option Name (i.e: First Name, Last Name)"
                                        onChange={(e) =>
                                          handleOptionChange(
                                            e,
                                            sectionIndex,
                                            formIndex,
                                            childrenIndex
                                          )
                                        }
                                      />
                                      <input
                                        type="text"
                                        name="value"
                                        className="shadow appearance-none border w-full px-2 py-1 text-sm text-black rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none focus:shadow-outline"
                                        value={childrenItem.value}
                                        placeholder="Value (i.e: 1,2,3)"
                                        onChange={(e) =>
                                          handleOptionChange(
                                            e,
                                            sectionIndex,
                                            formIndex,
                                            childrenIndex
                                          )
                                        }
                                      />
                                      <button
                                        onClick={() =>
                                          removeOptionField(
                                            sectionIndex,
                                            formIndex,
                                            childrenIndex
                                          )
                                        }
                                        className=" border-black"
                                      >
                                        <IoTrashBin
                                          size={24}
                                          className="text-red-600 hover:text-red-800 rounded-full"
                                        />
                                      </button>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddSectionForm;
