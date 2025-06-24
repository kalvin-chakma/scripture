import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const NoteDetailLayout = () => {
  return (
    <div className="dark:bg-[#0d1117] w-screen h-screen flex flex-col">
      <header className="h-[7vh] max-w-4xl mx-auto border-b bg-zinc-100/65 border-gray-200 flex items-center justify-between px-4 w-full dark:bg-neutral-950 dark:text-gray-200 dark:border-neutral-900 rounded-xl">
        <Navbar />
      </header>

      {/* Make main grow and scroll */}
      <main className="flex-1 overflow-y-auto no-scrollbar dark:bg-[#0d1117]">
        <Outlet />
      </main>

      <footer className="h-[0vh]"></footer>
    </div>
  );
};

export default NoteDetailLayout;
