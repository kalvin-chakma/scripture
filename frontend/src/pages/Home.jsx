import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getNote } from "../services/api";
import HomeLoader from "../components/loaders/homeLoader";

export default function Home() {
  const [noteTypeOrder, setNoteTypeOrder] = useState(() => {
    const stored = localStorage.getItem("noteTypeOrder");
    return stored ? JSON.parse(stored) : [];
  });

  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [noteTypeOrder]);

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
                className="w-72 px-3 flex-shrink-0 flex flex-col bg-gray-50 rounded-lg shadow-sm dark:bg-neutral-900 dark:text-gray-300"
              >
                <div className="p-2 border-b border-gray-500 dark:border-gray-100">
                  <h3 className="uppercase font-medium text-xs text-center">
                    {col.noteType}
                  </h3>
                </div>
                <div className="flex flex-col gap-2 p-2 overflow-auto no-scrollbar">
                  {col.notes.map((note) => (
                    <Link
                      key={note.id}
                      to={`/note-details/${note.id}/${encodeURIComponent(
                        note.title
                      )}`}
                      className="p-2 bg-white border border-gray-200 rounded-md shadow-md text-center cursor-pointer hover:shadow-lg transition-shadow dark:bg-neutral-900 dark:border-gray-500 dark:hover:bg-neutral-800"
                    >
                      {note.title}
                    </Link>
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
