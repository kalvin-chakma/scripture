import React from "react";
import { useTheme } from "next-themes";
import { matchPath, useLocation } from "react-router-dom";
import { BsLightbulbOffFill, BsLightbulb } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import useNoteViewStore from "../store/useNoteViewStore";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { isEditing, toggleEditing } = useNoteViewStore();
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    if (document.startViewTransition) {
      document.startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
  };

  const isNoteDetailsPage = Boolean(
    matchPath("/note-details/:id/:title", location.pathname)
  );

  return (
    <div className="h-[8vh] border-b bg-zinc-100/65 backdrop-blur-sm border-gray-200 flex items-center justify-between px-4 w-full dark:bg-[#1f1f1f]/90 dark:text-gray-200 dark:border-neutral-800">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight">SCRIPTURE</h1>
      </div>
      <div className="flex items-center space-x-2">
        {isNoteDetailsPage && (
          <button
            onClick={toggleEditing}
            title={isEditing ? "Stop editing" : "Edit note"}
            className={`rounded-full p-2 text-xl transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-white/10 ${
              isEditing
                ? "text-blue-600 bg-gray-200 dark:text-blue-400 dark:bg-white/10"
                : "text-black dark:text-white"
            }`}
          >
            <FaEdit />
          </button>
        )}
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-black text-xl transition-colors duration-150 hover:bg-gray-200 dark:text-white dark:hover:bg-white/10"
        >
          {theme === "dark" ? <BsLightbulbOffFill /> : <BsLightbulb />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
