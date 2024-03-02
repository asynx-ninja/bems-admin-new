import React from "react";
import { GrFormNext } from "react-icons/gr";
import { BiMessageSquareDetail } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

const Breadcrumbs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const brgy = searchParams.get("brgy");

  return (
    <nav className="flex ">
      <ol className="flex items-center space-x-2 text-gray-500 mt-[-1rem]">
        <BiMessageSquareDetail size={22} />
        <li>
          <a href={`/requests/?id=${id}&brgy=${brgy}`} className="text-gray-600 font-bold hover:underline text-sm md:text-lg">
            SERVICE REQUESTS
          </a>
        </li>
        <li>
          <GrFormNext size={24} style={{ color: "#ffffff" }} />
        </li>
        <li className="text-sm md:text-lg text-[#295141] font-bold">ARCHIVED REQUESTS</li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
