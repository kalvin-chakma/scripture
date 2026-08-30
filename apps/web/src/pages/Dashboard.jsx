import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { deleteNote, getNote } from "../services/api";
import HomeLoader from "../components/loaders/homeLoader";
import { SiPinboard } from "react-icons/si";
import { RiDeleteBin5Fill } from "react-icons/ri";
import {
  HiOutlineDocumentText,
  HiOutlineRectangleGroup,
  HiOutlineListBullet,
} from "react-icons/hi2";

const noteTypeIcons = {
  markdown: HiOutlineDocumentText,
  structured: HiOutlineRectangleGroup,
  todo: HiOutlineListBullet,
};

export default function Dashboard() {
  document.title = "Scripture | Dashboard";
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [noteTypeOrder, setNoteTypeOrder] = useState(() => {
    const stored = localStorage.getItem("noteTypeOrder");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const { data } = await getNote();
        const groupedNotes = {};
        const order = [...noteTypeOrder];

        data.notes.forEach(({ noteType }) => {
          const type = noteType || "Untitled";
          if (!order.includes(type)) {
            order.push(type);
          }
        });

        data.notes.forEach(({ id, title, content, noteType }) => {
          const type = noteType || "Untitled";
          if (!groupedNotes[type]) {
            groupedNotes[type] = {
              id: type,
              noteType: type,
              notes: [],
            };
          }
          groupedNotes[type].notes.unshift({ id, title, content });
        });

        const orderedColumns = order.map(
          (type) =>
            groupedNotes[type] || {
              id: type,
              noteType: type,
              notes: [],
            }
        );

        if (JSON.stringify(order) !== JSON.stringify(noteTypeOrder)) {
          setNoteTypeOrder(order);
          localStorage.setItem("noteTypeOrder", JSON.stringify(order));
        }

        setColumns(orderedColumns);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [noteTypeOrder, navigate]);

  return (
    <div className="flex h-full text-gray-800 no-scrollbar">
      <Sidebar className="bg-black" />

      <div className="flex flex-col flex-1 px-5 mt-2">
        <div className="flex gap-5 h-full overflow-x-auto no-scrollbar">
          {loading ? (
            <div className="text-center w-full text-lg text-gray-500">
              <HomeLoader />
            </div>
          ) : columns.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full text-gray-400 dark:text-gray-500">
              <HiOutlineDocumentText className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No notes yet</p>
              <p className="text-xs mt-1">Create your first note to get started</p>
            </div>
          ) : (
            columns.map((col) => {
              const TypeIcon =
                noteTypeIcons[col.noteType?.toLowerCase()] || SiPinboard;
              return (
              <div
                key={col.id}
                className="flex-1 min-w-0 px-3 flex flex-col  dark:text-gray-300"
              >
                <div className="p-2 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-center gap-2">
                  <h3 className="uppercase font-bold text-xs text-center">
                    {col.noteType}
                  </h3>
                  <span className="text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-400">
                    {col.notes.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2 py-2 overflow-y-auto no-scrollbar pb-16">
                  {col.notes.map((note) => (
                    <div key={note.id}>
                      <div key={note.id} className="group">
                        <div className="flex flex-row bg-white border border-gray-200 rounded-md shadow-sm text-md cursor-pointer items-center justify-between text-center transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 dark:bg-neutral-800/80 dark:border-gray-600 dark:hover:bg-neutral-800 dark:hover:shadow-lg px-3 py-2">
                          <Link
                            to={`/note-details/${note.id}/${encodeURIComponent(
                              note.title
                            )}`}
                            className="w-[100%] overflow-hidden"
                          >
                            <div className="flex items-center space-x-2">
                              <TypeIcon className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{note.title}</span>
                            </div>
                          </Link>

                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await deleteNote(note.id);

                                // Update UI by removing the deleted note from state
                                const updatedColumns = columns.map((column) => {
                                  if (column.noteType === col.noteType) {
                                    return {
                                      ...column,
                                      notes: column.notes.filter(
                                        (n) => n.id !== note.id
                                      ),
                                    };
                                  }
                                  return column;
                                });

                                setColumns(updatedColumns);
                              } catch (err) {
                                console.error("Failed to delete note:", err);
                              }
                            }}
                            className="flex-shrink-0 flex items-center justify-center text-gray-500 transition-opacity duration-200 hover:text-red-600 opacity-0 group-hover:opacity-100 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          >
                            <RiDeleteBin5Fill className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
