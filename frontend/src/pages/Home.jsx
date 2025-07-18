import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { deleteNote, getNote } from "../services/api";
import HomeLoader from "../components/loaders/homeLoader";
import { SiPinboard } from "react-icons/si";
import { RxDragHandleDots2 } from "react-icons/rx";
import NoteOptionsPopup from "../components/NoteOptionsPopup";

export default function Home() {
  document.title = "Scripture | Home";
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuNoteId, setActiveMenuNoteId] = useState(null);

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

        data.notes.forEach(({ _id, title, content, noteType }) => {
          const type = noteType || "Untitled";
          if (!groupedNotes[type]) {
            groupedNotes[type] = {
              id: type,
              noteType: type,
              notes: [],
            };
          }
          groupedNotes[type].notes.unshift({ id: _id, title, content });
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
    <div className="flex h-full text-gray-800 font-sans no-scrollbar">
      <Sidebar className="bg-black" />

      <div className="flex flex-col flex-1 px-5 mt-2">
        <div className="flex gap-5 h-full overflow-x-auto no-scrollbar">
          {loading ? (
            <div className="text-center w-full text-lg text-gray-500">
              <HomeLoader />
            </div>
          ) : (
            columns.map((col) => (
              <div
                key={col.id}
                className="w-72 px-3 flex-shrink-0 flex flex-col bg-gray-50 rounded-lg shadow-sm dark:bg-neutral-800/10 dark:text-gray-300"
              >
                <div className="p-2 border-b border-gray-500 dark:border-gray-100 ">
                  <h3 className="uppercase font-bold text-xs text-center">
                    {col.noteType}
                  </h3>
                </div>
                <div className="flex flex-col gap-2 p-2 overflow-y-auto no-scrollbar pb-16">
                  {col.notes.map((note) => (
                    <div key={note.id}>
                      <div key={note.id} className="">
                        <div className="flex flex-row  bg-white border border-gray-200 rounded-md shadow-sm text-sm cursor-pointer items-center justify-between text-center hover:shadow-lg hover:scale-105 transition-shadow dark:bg-neutral-900 dark:border-gray-500 dark:hover:bg-neutral-800 dark:shadow-lg dark:hover:scale-105">
                          <Link
                            to={`/note-details/${note.id}/${encodeURIComponent(
                              note.title
                            )}`}
                            className="w-[100%] overflow-hidden p-2"
                          >
                            <div className="flex items-center space-x-2">
                              <SiPinboard className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{note.title}</span>
                            </div>
                          </Link>

                          <div>
                            <RxDragHandleDots2
                              className="ml-1 h-5 w-5 hover:bg-zinc-400/50"
                              onClick={() =>
                                setActiveMenuNoteId(
                                  activeMenuNoteId === note.id ? null : note.id
                                )
                              }
                            />
                            {activeMenuNoteId === note.id && (
                              <NoteOptionsPopup
                                onEdit={() => {
                                  navigate(
                                    `/update/${note.id}/${encodeURIComponent(
                                      note.title
                                    )}`,
                                    {
                                      state: {
                                        title: note.title,
                                        noteType: col.noteType,
                                      },
                                    }
                                  );
                                  setActiveMenuNoteId(null);
                                }}
                                onDelete={async () => {
                                  try {
                                    await deleteNote(note.id);

                                    // Update UI by removing the deleted note from state
                                    const updatedColumns = columns.map(
                                      (column) => {
                                        if (column.noteType === col.noteType) {
                                          return {
                                            ...column,
                                            notes: column.notes.filter(
                                              (n) => n.id !== note.id
                                            ),
                                          };
                                        }
                                        return column;
                                      }
                                    );

                                    setColumns(updatedColumns);
                                  } catch (err) {
                                    console.error(
                                      "Failed to delete note:",
                                      err
                                    );
                                  } finally {
                                    setActiveMenuNoteId(null);
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
