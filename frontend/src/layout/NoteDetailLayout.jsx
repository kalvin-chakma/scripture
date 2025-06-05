import { Outlet } from "react-router-dom";

const NoteDetailLayout = () => {
  return (
    <div className="text-black w-screen ">
      <header></header>

      <main className="h-screen overflow-x-hidden dark:bg-[#0d1117] no-scrollbar">
        <Outlet />
      </main>

      <footer></footer>
    </div>
  );
};

export default NoteDetailLayout;
