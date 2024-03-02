import React from "react";
import { GrFormNext } from "react-icons/gr";
import { IoTicketSharp } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";

const Breadcrumbs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const brgy = searchParams.get("brgy");
  return (
    <nav className="flex ">
      <ol className="flex items-center space-x-2 text-gray-500 ">
        <IoTicketSharp size={22} />
        <li>
          <a href={`/inquiries/?id=${id}&brgy=${brgy}`} className="text-gray-600 font-bold hover:underline text-sm md:text-lg">
            INQUIRIES
          </a>
        </li>
        <li>
          <GrFormNext size={24} style={{ color: "#ffffff" }} />
        </li>
        <li className="text-sm md:text-lg text-[#295141] font-bold">ARCHIVED INQUIRIES</li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
