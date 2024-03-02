import React from 'react'
import { useNavigate, Link } from 'react-router-dom';

import errorimg from "../assets/header/Error 404.png"
import errorart from "../assets/header/errorart.png"
import { useSearchParams } from "react-router-dom";

const Error404 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const brgy = searchParams.get("brgy");

  const linkTo = (id === "null" || brgy === "null") ? `/dashboard/?id=${id}&brgy=${brgy}` : "/";

  return (
    <div className="py-[50px] bg-gradient-to-r from-custom-gold1 to-gray-400 text-white min-h-screen items-center flex flex-col justify-center">
      <div className='m-auto grid sm:grid-cols-1 lg:grid-cols-2 items-center justify-center gap-5'>
        <div className="flex flex-col text-center mx-auto rounded-md sm:w-[300px] lg:w-[500px] sm:p-[25px] lg:p-[50px] bg-custom-green-header">
          <h1 className="text-3xl font-extrabold text-white mb-8 uppercase font-bold">The page you are looking for does not exist</h1>
          <Link
             to={'..'}
             onClick={(e) => {
               e.preventDefault();
               navigate(-1);
             }}
            className="inline-block bg-custom-green-button hover:bg-gradient-to-r from-custom-gold1 to-[#408D51] hover:scale-105 text-white font-semibold px-6 py-3 rounded-full transition duration-300"
          >
            Go back 
          </Link>
        </div>
        <div className='mx-auto'>
          <img
            className='sm:w-[250px] sm:h-[250px] md:w-[500px] md:h-[500px]'
            src={errorart}
            alt=""
          />
        </div>
      </div>
    </div>
  )
}

export default Error404