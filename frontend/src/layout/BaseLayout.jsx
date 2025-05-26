import { Outlet } from "react-router-dom";
import { ChevronDown, MoreHorizontal, Share2 } from "lucide-react";

export default function BaseLayout() {
  return (
    <div className="flex flex-col text-black overflow-x-hidden w-full no-scrollbar">
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 w-full">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">SCRIPTURE</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className=" h-screen overflow-auto no-scrollbar">
        <Outlet />
      </main>

      <div className="border border-gray-500 w-full" />

      <footer>{/* Footer content goes here */}</footer>
    </div>
  );
}
