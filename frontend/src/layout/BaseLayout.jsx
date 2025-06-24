import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function BaseLayout() {
  return (
    <div className="flex flex-col text-black overflow-x-hidden w-full h-screen no-scrollbar">
      <header>
        <Navbar />
      </header>

      <main className="h-full overflow-auto no-scrollbar dark:bg-neutral-900 dark:text-gray-200">
        <Outlet />
      </main>

      <div className="border border-gray-500 w-full" />

      <footer></footer>
    </div>
  );
}
