import React from "react";
import {FaArchive, FaHome} from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Breadcrumbs = ({ id, brgy }) => {
  const navigate = useNavigate();
  return (
    <nav className="flex p-6 mt-4 ">
    <ol className="flex items-center space-x-2 text-gray-500 mt-[-1rem]">
      <li className="flex items-center">
        <FaHome className="mr-2 text-gray-900" />
        <Link
              //  href={`/barangayinformation/?id=${id}&brgy=${brgy}`}
              to={'..'}
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}  
          className="text-gray-900 font-bold hover:underline uppercase"
        >
                 Officials
        </Link>
      </li>
      <li>
        <span>/</span>
      </li>
      <li className="flex items-center font-bold text-teal-600 uppercase">
        <FaArchive className="mr-2" />
        Archived Officials
      </li>
    </ol>
  </nav>
  );
};

export default Breadcrumbs;