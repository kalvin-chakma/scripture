import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function BaseLayout() {
  return (
    <div className="flex flex-col text-black overflow-x-hidden w-full h-screen no-scrollbar">
      <header className="h-[10vh] border-b bg-zinc-100/65 border-gray-200 flex items-center justify-between px-4 w-full dark:bg-neutral-950/90 dark:text-gray-200 dark:border-neutral-900">
        <Navbar />
      </header>

      <main className="h-full overflow-auto no-scrollbar dark:bg-neutral-900 dark:text-gray-200">
        <Outlet />
      </main>

      <div className="border border-gray-500 w-full" />

      <footer>{/* Footer content goes here */}</footer>
    </div>
  );
}
