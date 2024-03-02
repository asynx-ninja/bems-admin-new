import React from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Dropbox = ({ createFiles, setCreateFiles, handleFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const dropHandler = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    setCreateFiles([...createFiles, ...droppedFiles]);
    setIsDragging(false);
  };

  const dragOverHandler = (e) => {
    e.preventDefault();
    e.target.classList.add("drag-over");
    setIsDragging(true);
  };

  const dragLeaveHandler = (e) => {
    e.preventDefault();
    e.target.classList.remove("drag-over");
    setIsDragging(false);
  };

  const dragEnterHandler = (e) => {
    e.preventDefault();
    e.target.classList.add("drag-over");
    setIsDragging(true);
  };

  const handleDelete = (e, idx) => {
    e.preventDefault();
    setCreateFiles((prev) => prev.filter((_, index) => index !== idx));
  };

  return (
    <>
      <div className="">
        <main className="container mx-auto max-w-screen-lg h-full mt-2">
          {/* scroll area */}
          <section className="h-full overflow-auto p-1 w-full flex flex-col">
            {/* <header className="border-dashed border-2 border-gray-400 py-2 flex flex-col justify-center items-center">
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  accept=".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf"
                  multiple="multiple"
                  className="hidden"
                />
                <button
                  id="button"
                  onClick={handleAdd}
                  className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                >
                  Upload a file
                </button>
              </header> */}
            <h1 className=" font-medium sm:text-md my-2 text-gray-900">
              To Upload
            </h1>
            <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
              {createFiles.length > 0 ? (
                createFiles.map((file, idx) => (
                  <li
                    className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/4 h-16"
                    key={idx}
                  >
                    <article
                      tabIndex={0}
                      className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline elative bg-gray-100 cursor-pointer relative shadow-sm"
                    >
                      <img
                        alt="upload preview"
                        className="img-preview hidden w-full h-full sticky object-cover rounded-md bg-fixed"
                      />
                      <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                        <h1 className="flex-1 group-hover:text-blue-800 line-clamp-1">
                          {file.name}
                        </h1>
                        <div className="flex">
                          <span className="p-1 text-blue-800">
                            <i>
                              <svg
                                className="fill-current w-4 h-4 ml-auto pt-1"
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                              >
                                <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                              </svg>
                            </i>
                          </span>
                          <p className="p-1 size text-xs text-gray-700">
                            {file.size > 1024
                              ? file.size > 1048576
                                ? Math.round(file.size / 1048576) + "mb"
                                : Math.round(file.size / 1024) + "kb"
                              : file.size + "b"}
                          </p>
                          <button
                            className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800"
                            onClick={(e) => handleDelete(e, idx)}
                          >
                            <svg
                              className="pointer-events-none fill-current w-4 h-4 ml-auto"
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                            >
                              <path
                                className="pointer-events-none"
                                d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
                              />
                            </svg>
                          </button>
                        </div>
                      </section>
                    </article>
                  </li>
                ))
              ) : (
                <li
                  id="empty"
                  className="h-full w-full text-center flex flex-col items-center justify-center"
                >
                  <img
                    className="mx-auto w-32"
                    src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                    alt="no data"
                  />
                  <span className="text-small text-gray-500">
                    No files selected
                  </span>
                </li>
              )}
            </ul>
          </section>
        </main>
      </div>
      {/* using two similar templates for simplicity in js code */}
      <template id="file-template" />
      <template id="image-template" />
    </>
  );
};

export default Dropbox;
