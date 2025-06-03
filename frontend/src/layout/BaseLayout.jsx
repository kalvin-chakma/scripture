import { Outlet } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import { BsLightbulb, BsLightbulbOffFill } from "react-icons/bs";
import { IoPersonCircle } from "react-icons/io5";

export default function BaseLayout() {
  const { theme, toggleTheme } = useUserStore();

  return (
    <div className="flex flex-col text-black overflow-x-hidden w-full h-screen no-scrollbar">
      <header className="h-[10vh] border-b border-gray-200 flex items-center justify-between px-4 w-full dark:bg-neutral-950 dark:text-gray-200 dark:border-neutral-900">
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

      <main className="h-full overflow-auto no-scrollbar dark:bg-neutral-900 dark:text-gray-200">
        <Outlet />
      </main>

      <div className="border border-gray-500 w-full" />

      <footer>{/* Footer content goes here */}</footer>
    </div>
  );
}
