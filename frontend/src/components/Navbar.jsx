import React, { useEffect } from "react";
import useUserStore from "../store/useUserStore";
import { BsLightbulbOffFill, BsLightbulb } from "react-icons/bs";
import { IoPersonCircle } from "react-icons/io5";

const Navbar = () => {
  const { theme, toggleTheme, profile, fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div>
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
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
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
