import React from "react";

const Dropbox = ({createFiles, setCreateFiles}) => {
  const handleDelete = (idx, e) => {
    e.preventDefault(e)
    setCreateFiles((prev) => prev.filter((_, index) => index !== idx));
  };

  const handleCancel = (e) => {
    setFiles([]);
    window.location.reload();
  };

  return (
    <>
      <div className="">
        <main className="container mx-auto max-w-screen-lg mt-2">
            {/* scroll area */}
            <section className="overflow-auto w-full flex flex-col">
              <ul id="gallery" className="flex flex-row">
                {createFiles.length > 0 ? (
                  createFiles.map((file, idx) => (
                    <li
                      className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/4"
                      key={idx}
                    >
                      <article
                        tabIndex={0}
                        className="w-full h-full bg-blue-200 rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer shadow-sm"
                      >
                        <section className="flex flex-row justify-center rounded-md text-xs truncate h-full py-2 px-2">
                          <h1 className="flex-1 my-auto group-hover:text-blue-800 line-clamp-1">
                            {file.name}
                          </h1>
                          <div className="flex">
                            <button
                              className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800"
                              onClick={(e) => handleDelete(idx, e)}
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