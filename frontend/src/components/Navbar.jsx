import React, { useEffect } from "react";
import useUserStore from "../store/useUserStore";
import { BsLightbulbOffFill, BsLightbulb } from "react-icons/bs";
import { IoPersonCircle } from "react-icons/io5";

const Navbar = () => {
  const { theme, toggleTheme, fetchUsetdata, userData } = useUserStore();

  useEffect(() => {
    fetchUsetdata();
  }, [fetchUsetdata]);

  return (
    <div className="h-[8vh] border-b bg-zinc-100/65 border-gray-200 flex items-center justify-between px-4 w-full dark:bg-neutral-950/90 dark:text-gray-200 dark:border-neutral-900">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">SCRIPTURE</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="rounded text-black text-2xl dark:text-white"
        >
          {theme === "dark" ? <BsLightbulbOffFill /> : <BsLightbulb />}
        </button>
        <button className="text-gray-900 dark:text-white hover:text-gray-700">
          {userData && userData.avatar ? (
            <img
              src={userData.avatar}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <IoPersonCircle className="text-4xl" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
