import { Outlet } from "react-router-dom";

export default function SimpleLayout() {
  return (
    <div className="font-mono text-black w-screen no-scrollbar dark:">
      <header></header>

      <main className="h-screen dark:bg-[#1f1f1f]">
        <Outlet />
      </main>

      <footer></footer>
    </div>
  );
}
