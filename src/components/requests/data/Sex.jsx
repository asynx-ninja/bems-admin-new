import React from "react";

const Sex = ({ variable, item, handlePersonalDetail }) => {
  return (
    <div>
      <label className="block sm:text-xs lg:text-sm font-medium mb-2">
        {item.display.toUpperCase()}
      </label>
      <div className="flex items-center">
        <input
          className={`border-gray-400 border shrink-0 mt-0.5  rounded-full text-green-500 focus:ring-green-500`}
          id="gender"
          name="gender"
          type="radio"
          value="Male"
          checked={item.value === "Male"}
          onChange={(e) => handlePersonalDetail(e, variable)}
        />
        <label htmlFor="male" className="ml-2">
          Male
        </label>
        <input
          className={`border-gray-400 border ml-4 shrink-0 mt-0.5 rounded-full text-green-500 focus:ring-green-500`}
          id="gender"
          name="gender"
          type="radio"
          value="Female"
          checked={item.value === "Female"}
          onChange={(e) => handlePersonalDetail(e, variable)}
        />
        <label className="ml-2">Female</label>
      </div>
    </div>
  );
};

export default Sex;
