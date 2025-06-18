import { Outlet } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import { BsLightbulb, BsLightbulbOffFill } from "react-icons/bs";
import { IoPersonCircle } from "react-icons/io5";

const NoteDetailLayout = () => {
  const { theme, toggleTheme } = useUserStore();

  return (
    <div className="dark:bg-[#0d1117] w-screen">
      <header className="h-[7vh] max-w-4xl mx-auto border-b bg-zinc-100/65 border-gray-200 flex items-center justify-between px-4 w-full dark:bg-neutral-950 dark:text-gray-200 dark:border-neutral-900">
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
            <IoPersonCircle className="text-4xl" />
          </button>
        </div>
      </header>

      <main className="h-screen overflow-x-hidden dark:bg-[#0d1117] no-scrollbar">
        <Outlet />
      </main>

      <footer></footer>
    </div>
  );
};

export default NoteDetailLayout;
