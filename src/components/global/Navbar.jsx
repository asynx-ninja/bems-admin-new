import React from "react";
import Sidebar from "../navigation/Sidebar";
import TopHeader from "../navigation/TopHeader";

const Navbar = ({ comp }) => {
  return (
    <div className="  flex flex-row w-full">
      <div>
        <Sidebar />
      </div>
      <div className="flex flex-col w-full h-full">
        <TopHeader />
        {comp}
      </div>
    </div>
  );
};

export default Navbar;
