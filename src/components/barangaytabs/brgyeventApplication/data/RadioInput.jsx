import React from 'react'

const RadioInput = ({ handleChange, item }) => {

    return (
      <div>
        <label className="block sm:text-xs lg:text-sm font-medium mb-2">
          * {item.display}
        </label>
        <div className="flex items-center">
          <input
            className="shrink-0 mt-0.5 border-gray-400 border rounded-full text-green-500 focus:ring-green-500"
            id="isHeadYes"
            name="isHead"
            type="radio"
            value={1}
            onChange={handleChange}
          />
          <label htmlFor="male" className="ml-2">
            Yes
          </label>
          <input
            className="ml-4 shrink-0 mt-0.5 border-gray-400 border rounded-full text-green-500 focus:ring-green-500"
            id="isHeadNo"
            name="isHead"
            type="radio"
            value={0}
            onChange={handleChange}
          />
          <label className="ml-2">No</label>
        </div>
      </div>
    );
}

export default RadioInput