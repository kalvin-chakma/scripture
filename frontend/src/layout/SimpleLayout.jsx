import { Outlet } from "react-router-dom";


export default function SimpleLayout() {
  return (
    <div className="text-black w-screen no-scrollbar">
      <header>
      </header>

      <main className="h-screen ">
        <Outlet />
      </main>

      

      <footer>{/* Footer content goes here */}</footer>
    </div>
  );
}
