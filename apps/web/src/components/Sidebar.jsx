import { useEffect, useState } from "react";
import {
  IoSettings,
  IoPeople,
  IoLogOut,
  IoAddOutline,
  IoPersonCircle,
} from "react-icons/io5";
import NoteModal from "./ui/NoteModal";
import useUserStore from "../store/useUserStore";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const { signOut, fetchUsetdata, userData } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsetdata();
  }, [fetchUsetdata]);

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
      <div className="w-56 bg-white border-r border-gray-200 dark:bg-[#1f1f1f] dark:text-gray-200 dark:border-gray-800 flex flex-col">
        <div className="px-5">
          <button
            className="my-2 flex w-full items-center justify-center p-2 text-xs font-semibold border border-zinc-700 rounded hover:bg-gray-100 dark:hover:bg-zinc-600"
            onClick={() => setShowNoteModal(true)}
          >
            <IoAddOutline className="w-4 h-4 mr-2 flex-shrink-0" />
            Create Note
          </button>
        </div>

        <div className="mt-auto px-5 my-5 text-xs font-semibold space-y-1">
          {menuItems.map(({ icon, label, onClick }) => (
            <div
              key={label}
              onClick={onClick}
              className="flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <span>{icon}</span>
              {label}
            </div>
          ))}

          <div className="flex items-center p-2 text-gray-500 dark:text-gray-400">
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-4 h-4 mr-2 rounded-full object-cover ring-1 ring-gray-300 dark:ring-neutral-700"
              />
            ) : (
              <IoPersonCircle className="w-4 h-4 mr-2" />
            )}
            <span className="truncate">{userData?.username}</span>
          </div>
        </div>
      </div>

      {showNoteModal && <NoteModal onClose={() => setShowNoteModal(false)} />}
    </>
  );
}
