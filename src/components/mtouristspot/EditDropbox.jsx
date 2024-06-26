import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const EditDropbox = ({
  edit,
  images,
  setImages,
  editImageRef,
  handleFileChange,
  handleSubmit,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const dropHandler = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    setImages([...files, ...droppedFiles]);
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

  const handleAdd = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleDelete = (idx) => {
    setImages((prev) => prev.filter((_, index) => index !== idx));
  };

 

  return (
    <>
      <div className="">
        <main className="container mx-auto max-w-screen-lg h-full">
          {/* file upload modal */}
          <article
            aria-label="File Upload Modal"
            className="relative h-full flex flex-col bg-white "
            onDrop={dropHandler}
            onDragOver={dragOverHandler}
            onDragLeave={dragLeaveHandler}
            onDragEnter={dragEnterHandler}
          >
            {/* overlay */}
            {isDragging && (
              <div
                id="overlay"
                className="w-full h-full bg-opacity-75 bg-gray-100 absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md"
              >
                <i>
                  <svg
                    className="fill-current w-12 h-12 mb-3 text-blue-700"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
                  </svg>
                </i>
                <p className="text-lg text-blue-700">Drop files to upload</p>
              </div>
            )}
            {/* scroll area */}
            <section className="h-full overflow-auto p-1 w-full flex flex-col">
              {edit ? (
                <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                  <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                    <span>Drag and drop your</span>&nbsp;
                    <span>files anywhere or</span>
                  </p>
                  <input
                    type="file"
                    name="images"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    id="button"
                    onClick={handleAdd}
                    className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                  >
                    Upload a file
                  </button>
                </header>
              ) : null}
              {edit ? (
                <h1 className="pb-3 font-semibold sm:text-lg text-gray-900">
                  To Upload:
                </h1>
              ) : (
                <h1 className="pb-3 font-semibold sm:text-lg text-gray-900">
                  Files Attached:
                </h1>
              )}
              <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
                {images.length > 0 ? (
                  images.map((file, idx) => (
                    <li
                      className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/2 xl:w-1/2 h-24"
                      key={idx}
                    >
                      <article
                        tabIndex={0}
                        className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline elative bg-gray-100 cursor-pointer relative shadow-sm"
                      >
                        <img
                          alt=""
                          name="images"
                          ref={editImageRef}
                          src={file.link} 
                          className="img-preview  w-full h-full sticky object-cover rounded-md bg-fixed"
                        />
                        <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                          <a
                            href={file.link}
                            target="_blank"
                            className="flex-1 group-hover:text-blue-800 font-medium line-clamp-1"
                          >
                            {file.name}
                          </a>
                          <div className="flex">
                            <span className="p-1 text-gray-800">
                              <i>
                                <svg
                                  className="fill-current w-4 h-4 ml-auto pt-1 text-white" // Use the text-white class to set fill to white
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                                </svg>
                              </i>
                            </span>

                            <button
                              className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-white"
                              onClick={(e) => handleDelete(idx)}
                              hidden={!edit}
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
            {/* sticky footer */}
            {/* <footer className="flex justify-end px-8 pb-8 pt-4">
              <button
                id="submit"
                onClick={handleSubmit}
                // data-hs-overlay="#hs-modal-editServices"
                className="px-3 rounded-lg py-1 bg-teal-800 hover:bg-teal-700 text-white focus:shadow-outline focus:outline-none"
              >
                Submit
              </button>
              <button
                data-hs-overlay="#hs-modal-editServices"
                className="ml-3 rounded-sm px-3 py-1 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
              >
                Cancel
              </button>
            </footer> */}
          </article>
        </main>
      </div>
      {/* using two similar templates for simplicity in js code */}
      <template id="file-template" />
      <template id="image-template" />
    </>
  );
};

export default EditDropbox;
