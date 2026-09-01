import { useEffect, useState } from "react";
import {
  IoSettings,
  IoPeople,
  IoLogOut,
  IoAddOutline,
  IoPersonCircle,
} from "react-icons/io5";
import {
  HiOutlineDocumentText,
  HiOutlineRectangleGroup,
  HiOutlineListBullet,
} from "react-icons/hi2";
import NoteModal from "./ui/NoteModal";
import useUserStore from "../store/useUserStore";
import { useNavigate, Link } from "react-router-dom";
import { getNote } from "../services/api";

const noteTypeIcons = {
  markdown: HiOutlineDocumentText,
  structured: HiOutlineRectangleGroup,
  todo: HiOutlineListBullet,
};

const RECENT_NOTES_LIMIT = 6;

export default function Sidebar() {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [recentNotes, setRecentNotes] = useState([]);
  const { signOut, fetchUsetdata, userData } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsetdata();
  }, [fetchUsetdata]);

  useEffect(() => {
    const fetchRecentNotes = async () => {
      try {
        const { data } = await getNote();
        const sorted = [...data.notes].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setRecentNotes(sorted.slice(0, RECENT_NOTES_LIMIT));
      } catch (err) {
        console.error("Error fetching recent notes:", err);
      }
    };

    fetchRecentNotes();
  }, []);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  const menuItems = [
    {
      icon: <IoSettings className="w-5 h-5 mr-2" />,
      label: "Settings",
      onClick: () => navigate("/settings"),
    },
    // Sharing now happens per-note via the Share button on the note page;
    // access across all notes can be reviewed in Settings instead.
    // { icon: <IoPeople className="w-5 h-5 mr-2" />, label: "Invite Members" },
    {
      icon: <IoLogOut className="w-5 h-5 mr-2" />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <div className="w-[17rem] bg-white border-r border-gray-200 dark:bg-[#1f1f1f] dark:text-gray-200 dark:border-neutral-700 flex flex-col">
        <div className="px-5">
          <button
            className="my-2 flex w-full items-center justify-center p-2 text-xs font-semibold border border-zinc-700 rounded hover:bg-gray-100 dark:hover:bg-zinc-600"
            onClick={() => setShowNoteModal(true)}
          >
            <IoAddOutline className="w-4 h-4 mr-2 flex-shrink-0" />
            Create Note
          </button>
        </div>

        {recentNotes.length > 0 && (
          <div className="px-5 mt-2">
            <p className="px-2 text-[0.65rem] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Recent
            </p>
            <div className="mt-1 space-y-0.5">
              {recentNotes.map((note) => {
                const TypeIcon =
                  noteTypeIcons[note.noteType?.toLowerCase()] ||
                  HiOutlineDocumentText;
                return (
                  <Link
                    key={note.id}
                    to={`/note-details/${note.id}/${encodeURIComponent(
                      note.title
                    )}`}
                    className="flex items-center p-2 rounded-lg text-xs font-medium text-gray-600 cursor-pointer transition-colors duration-150 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                  >
                    <TypeIcon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                    <span className="truncate">{note.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

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

          <div className="flex items-center gap-2 p-2">
            {userData?.avatar ? (
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-5 h-5 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-300 dark:ring-neutral-700"
              />
            ) : (
              <IoPersonCircle className="w-5 h-5 flex-shrink-0 text-gray-300 dark:text-gray-600" />
            )}
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-gray-800 dark:text-gray-200">
                {userData?.displayName || "Account"}
              </p>
              <p className="truncate text-[0.65rem] font-normal text-gray-400 dark:text-gray-500">
                {userData?.username}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showNoteModal && <NoteModal onClose={() => setShowNoteModal(false)} />}
    </>
  );
}
