<form>
  {inquiry &&
    inquiry.response &&
    inquiry.response.map((responseItem, index) => (
      <div
        key={index}
        className={
          responseItem.sender ===
          `${userData?.firstName?.toUpperCase() ?? ""} ${userData?.lastName?.toUpperCase() ?? ""} (${userData.type})`
            ? "flex flex-col justify-end items-end w-full h-auto"
            : "flex flex-col justify-start items-start mb-1 w-full h-auto"
        }
      >
        <div
          className={
            responseItem.sender ===
            `${userData?.firstName?.toUpperCase() ?? ""} ${userData?.lastName?.toUpperCase() ?? ""} (${userData.type})`
              ? "flex flex-col items-end h-auto max-w-[80%]"
              : "flex flex-col items-start mb-5 h-auto max-w-[80%]"
          }
        >
          {responseItem.sender === `${userData?.firstName?.toUpperCase() ?? ""} ${userData?.lastName?.toUpperCase() ?? ""} (${userData.type})` ? (
            <div className="flex flex-row w-full justify-end items-center">
              <img
                src={userData?.profile?.link || dprofile} // Use userData's profile link or default image
                alt="Profile Image"
                className="w-8 h-8 rounded-full mr-2 border border-green-600" // Adjust the size and styling as needed
              />
            </div>
          ) : (
            <div className="flex flex-row w-full justify-start items-center">
              <img
                src={userDatas?.profile?.link || dprofile} // Use userDatas' profile link or default image
                alt="Profile Image"
                className="w-8 h-8 rounded-full mr-2 border border-green-600" // Adjust the size and styling as needed
              />
            </div>
          )}

          <div>
            {responseItem.message !== "" ? (
              <div
                className={
                  responseItem.sender ===
                  `${userData?.firstName?.toUpperCase() ?? ""} ${userData?.lastName?.toUpperCase() ?? ""} (${userData.type})`
                    ? "flex flex-col rounded-xl bg-green-400 mb-1 text-white px-2 md:px-4 py-2 cursor-pointer"
                    : "flex flex-col rounded-xl bg-gray-100 border text-black border-gray-300 px-2 md:px-4 py-2 cursor-pointer"
                }
                onClick={() => handleOnViewTime(index)}
              >
                <div className="w-full h-full">
                  <div className="w-full h-full rounded-xl p-1">
                    <p className="text-[12px] md:text-xs break-all">
                      {responseItem.message}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            {!responseItem.file ? null : (
              <ViewDropbox
                viewFiles={responseItem.file || []}
                responseItem={
                  responseItem.sender === `${userData?.firstName?.toUpperCase() ?? ""} ${userData?.lastName?.toUpperCase() ?? ""} (${userData.type})`
                    ? true
                    : false
                }
              />
            )}
            <p
              className={
                viewTime.timeKey === index
                  ? "text-[10px] md:text-xs mt-[5px] text-black text-right text-xs"
                  : "hidden"
              }
            >
              {DateFormat(responseItem.date) || ""}
            </p>
          </div>
        </div>
      </div>
    ))}
</form>