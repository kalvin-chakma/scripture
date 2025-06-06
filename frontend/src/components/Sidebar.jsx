import { useState } from "react";
import { IoSettings, IoPeople, IoLogOut, IoAddOutline } from "react-icons/io5";
import NoteModal from "./ui/NoteModal";
import useUserStore from "../store/useUserStore";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const signOut = useUserStore((state) => state.signOut);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  const menuItems = [
    { icon: <IoSettings className="w-4 h-4 mr-2" />, label: "Settings" },
    { icon: <IoPeople className="w-4 h-4 mr-2" />, label: "Invite Members" },
    {
      icon: <IoLogOut className="w-4 h-4 mr-2" />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <div className="w-56 bg-white border-r border-gray-200 dark:bg-neutral-900 dark:text-gray-200 dark:border-gray-700 flex flex-col">
        <div className="px-5">
          <button
            className="my-2 flex w-full p-2 text-xs text-center justify-center font-semibold border border-zinc-700 dark:hover:bg-zinc-600 hover:bg-gray-100 rounded"
            onClick={() => setShowNoteModal(true)}
          >
            <IoAddOutline className="w-4 h-4 mr-2 " />
            Create Note
          </button>
        </div>

        <div className="mt-auto px-5 my-5 text-xs font-semibold">
          {menuItems.map(({ icon, label, onClick }) => (
            <div
              key={label}
              onClick={onClick}
              className="flex items-center p-2 rounded cursor-pointer dark:hover:bg-zinc-600 hover:bg-gray-100"
            >
              <span>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {showNoteModal && <NoteModal onClose={() => setShowNoteModal(false)} />}
    </>
  );
}
