import { Outlet } from "react-router-dom";

const NoteDetailLayout = () => {
  return (
    <div className="text-black w-screen no-scrollbar">
      <header></header>

      <main className="h-screen ">
        <Outlet />
      </main>

      <footer></footer>
    </div>
  );
};

export default NoteDetailLayout;
