import { Outlet } from "react-router-dom";

export default function SimpleLayout() {
  return (
    <div className="text-black w-screen no-scrollbar dark:">
      <header></header>

      <main className="h-screen dark:bg-[#0d1117]">
        <Outlet />
      </main>

      <footer>{/* Footer content goes here */}</footer>
    </div>
  );
}
