import React from "react";
import { Film } from "lucide-react";

const Footer = () => {
  return (
    <footer className="flex w-full bg-black h-[65px] text-white">
      <div className="flex w-full justify-start items-center font-bold ml-10 text-xl">
        <div className="flex items-center gap-2">
          <Film />
          SceneBook
        </div>
      </div>
      <div className="flex w-full justify-end items-center gap-4 mr-10 text-sm text-gray-400 font-normal">
        Created by Natesh Oad, Ahmed Elshabasi, and Anmoldeep Gill
      </div>
    </footer>
  );
};

export default Footer;
