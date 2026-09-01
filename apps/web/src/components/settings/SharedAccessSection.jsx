import { useEffect, useState } from "react";
import HomeLoader from "../loaders/homeLoader";
import { getNote, getCollaborators, removeCollaborator } from "../../services/api";
import {
  HiOutlineDocumentText,
  HiOutlineRectangleGroup,
  HiOutlineListBullet,
} from "react-icons/hi2";
import { IoPersonCircle } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";

const noteTypeIcons = {
  markdown: HiOutlineDocumentText,
  structured: HiOutlineRectangleGroup,
  todo: HiOutlineListBullet,
};

export default function SharedAccessSection() {
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedNotes = async () => {
      setLoading(true);
      try {
        const { data } = await getNote();
        const ownedNotes = data.notes.filter((note) => note.isOwner);

        const withCollaborators = await Promise.all(
          ownedNotes.map(async (note) => {
            const { data: collabData } = await getCollaborators(note.id);
            return { note, collaborators: collabData.collaborators };
          })
        );

        setSharedNotes(withCollaborators.filter((n) => n.collaborators.length > 0));
      } catch (err) {
        console.error("Failed to load shared notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedNotes();
  }, []);

  const handleRemove = async (noteId, userId) => {
    try {
      await removeCollaborator(noteId, userId);
      setSharedNotes((prev) =>
        prev
          .map((entry) =>
            entry.note.id === noteId
              ? {
                  ...entry,
                  collaborators: entry.collaborators.filter((c) => c.id !== userId),
                }
              : entry
          )
          .filter((entry) => entry.collaborators.length > 0)
      );
    } catch (err) {
      console.error("Failed to remove collaborator:", err);
    }
  };

  if (loading) return <HomeLoader />;

  if (sharedNotes.length === 0) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500">
        You haven&apos;t shared any notes yet. Open a note you own and use the
        Share button to add collaborators.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {sharedNotes.map(({ note, collaborators }) => {
        const TypeIcon =
          noteTypeIcons[note.noteType?.toLowerCase()] || HiOutlineDocumentText;
        return (
          <div
            key={note.id}
            className="border border-gray-200 rounded-lg p-4 dark:border-neutral-700"
          >
            <div className="flex items-center gap-2 mb-3 font-semibold text-sm">
              <TypeIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{note.title}</span>
            </div>
            <div className="space-y-1">
              {collaborators.map((c) => (
                <div
                  key={c.id}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <IoPersonCircle className="w-6 h-6 flex-shrink-0 text-gray-400" />
                    )}
                    <span className="text-sm truncate">
                      {c.displayName || c.username}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(note.id, c.id)}
                    className="flex-shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity duration-150 dark:hover:text-red-400"
                  >
                    <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
