import React from 'react';
import { BsPrinter } from 'react-icons/bs'; // Assuming you have imported the Printer icon

const YourComponent = ({users}) => {
  const handlePrint = () => {
    window.print(); // Trigger browser's print functionality
  };

  return (
    <div>
      <div className="hs-tooltip inline-block w-full">
        <button
          type="button"
          onClick={handlePrint}
          className="hs-tooltip-toggle sm:w-full md:w-full text-white rounded-md bg-blue-800 font-medium text-xs sm:py-1 md:px-3 md:py-2 flex items-center justify-center"
        >
          <BsPrinter size={24} style={{ color: "#ffffff" }} />
          <span className="sm:hidden md:block hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-20 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-sm " role="tooltip">
            Generate Report
          </span>
        </button>
      </div>

      <table className="w-full">
        {/* Your table header */}
        <tbody className="odd:bg-slate-100">
          {users.map((item, index) => (
            <tr key={index} className="odd:bg-slate-100 text-center">
              {/* Your table rows */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default YourComponent;
