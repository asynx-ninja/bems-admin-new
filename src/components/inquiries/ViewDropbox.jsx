import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegFileLines } from "react-icons/fa6";
const ViewDropbox = ({ viewFiles, setViewFiles }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();


  // console.log(viewFiles)

  // useEffect(() => {
  //   const checkExtension = (item) => {
  //     const fileExtension = item.split('.').pop().toLowerCase();

  //     return fileExtension
  //   }
  //   const checkImage = () => {
  //     let image

  //     if (viewFiles && viewFiles.length > 0) {
  //       image = viewFiles.filter(item => checkExtension(item.name) === 'jpg' ||
  //         checkExtension(item.name) === 'png' ||
  //         checkExtension(item.name) === 'jpeg' ||
  //         checkExtension(item.name) === 'gif' ||
  //         checkExtension(item.name) === 'bmp'
  //       )

  //       if (image.length > 0) {
  //         setIsImage(true)
  //       } else {
  //         setIsImage(false)
  //       }
  //     }

  //     console.log(image)
  //   }
  //   checkImage()
  // }, [viewFiles])
  function truncateFileName(fileName) {
    const maxLength = 20; // Maximum length of the displayed file name
    if (fileName.length <= maxLength) {
      return fileName;
    } else {
      const truncatedFileName = fileName.substring(0, maxLength / 2) + "..." + fileName.substring(fileName.length - maxLength / 2);
      return truncatedFileName;
    }
  }


  const checkExtension = (item) => {
    const fileExtension = item.split(".").pop().toLowerCase();

    return fileExtension;
  };

  const checkImage = (item) => {
    const fileExtension = checkExtension(item.name);

    if (
      fileExtension === "jpg" ||
      fileExtension === "png" ||
      fileExtension === "jpeg" ||
      fileExtension === "gif" ||
      fileExtension === "bmp"
    ) {
      return true;
    } else {
      return false;
    }
  };

  const dropHandler = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    setViewFiles([...viewFiles, ...droppedFiles]);
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
    setViewFiles((prev) => prev.filter((_, index) => index !== idx));
  };

  // const handleFileClick = (file) => {
  //   const url = URL.createObjectURL(file);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = file.name;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // };

  return (
    <div className="">
      <main className="container mx-auto h-auto px-1">
        <article
          aria-label="File Upload Modal"
          className="relative h-full flex flex-col "
          onDrop={dropHandler}
          onDragOver={dragOverHandler}
          onDragLeave={dragLeaveHandler}
          onDragEnter={dragEnterHandler}
        >
          {isDragging && (
            <div
              id="overlay"
              className="w-full h-full bg-opacity-75 bg-gray-100 absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md"
            >
              <i>{/* SVG code */}</i>
              <p className="text-lg text-blue-700">Drop files to upload</p>
            </div>
          )}
          <section className="h-full overflow-auto p-1 w-full flex flex-col">
            {/* <h1 className="pb-2 text-sm font-medium text-white">
              Files Attached:
            </h1> */}
            <ul id="gallery" className="flex flex-1 flex-wrap gap-2">
              {viewFiles && viewFiles.length > 0 ? (
                viewFiles.map((file, idx) => (
                  <li
                    className="flex mx-2"
                    key={idx}
                    // onClick={() => handleFileClick(file)}
                  >
                    {checkImage(file) === true ? (
                    <article
                    tabIndex={0}
                    className="group sm:w-[150px] sm:h-[150px] lg:w-[150px] lg:h-[150px] rounded-md focus:outline-none focus:shadow-outline relative bg-gray-100 cursor-pointer shadow-sm"
                  >
                    <a href={file.link}>
                      <img
                        className="w-full h-full object-contain rounded-md"
                        src={file.link}
                        alt=""
                      />
                    </a>
                  </article>
                  
                    ) : (
                      <article
                        tabIndex={0}
                        className="group w-[100%] sm:h-[40px] rounded-md focus:outline-none focus:shadow-outline elative bg-blue-300 cursor-pointer relative shadow-sm"
                      >
                        <img
                          alt="upload preview"
                          className="img-preview hidden w-full h-full sticky object-cover rounded-md bg-fixed"
                        />
                        <section className="flex flex-row relative rounded-md text-xs break-words w-full h-full z-20 top-0 py-2 px-3">
                          <a
                            href={file.link}
                            target="_blank"
                            className="flex-1 relative group-hover:text-blue-800 line-clamp-1 z-20 flex items-center truncate"
                          >
                            <FaRegFileLines className="mr-1" />
                             {truncateFileName(file.name)}
                          </a>

                          {/* <div className="flex absolute right-0 left-0 top-0 bottom-0 opacity-50 z-[0]">
                              <span className="p-1 text-blue-800 m-auto">
                                <i>
                                  <svg
                                    className="fill-current sm:w-[45px] sm:h-[45px] lg:w-[80px] lg:h-[80px] pt-1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                                  </svg>
                                </i>
                              </span>
                            </div> */}
                        </section>
                      </article>
                    )}
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
                    No files Attached
                  </span>
                </li>
              )}
            </ul>
          </section>
        </article>
      </main>
    </div>
  );
};

export default ViewDropbox;
