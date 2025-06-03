import { Outlet } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import useUserStore from "../store/useUserStore";

export default function BaseLayout() {
  const { theme, toggleTheme } = useUserStore();

  return (
    <div className="flex flex-col text-black overflow-x-hidden w-full h-screen no-scrollbar">
      <header className="h-[10vh] border-b border-gray-200 flex items-center justify-between px-4 w-full dark:bg-neutral-950 dark:text-gray-200 dark:border-neutral-900">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">SCRIPTURE</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          >
            Toggle to {theme === "dark" ? "Light" : "Dark"} Mode
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
