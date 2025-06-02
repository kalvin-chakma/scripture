import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getNote } from "../services/api";

export default function Home() {
  // Initialize order from localStorage or empty array (fixed order)
  const [noteTypeOrder, setNoteTypeOrder] = useState(() => {
    const stored = localStorage.getItem("noteTypeOrder");
    return stored ? JSON.parse(stored) : [];
  });

  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await getNote();
        const groupedNotes = {};

        // Copy current order state
        const order = [...noteTypeOrder];

        // Find all noteTypes in the fetched data
        data.notes.forEach(({ noteType }) => {
          const type = noteType || "Untitled";
          // Only add new types at the end of order array (never reorder)
          if (!order.includes(type)) {
            order.push(type);
          }
        });

        // Group notes by noteType
        data.notes.forEach(({ _id, title, content, noteType }) => {
          const type = noteType || "Untitled";
          if (!groupedNotes[type]) {
            groupedNotes[type] = {
              id: type,
              noteType: type,
              notes: [],
            };
          }
          // Add new notes to the front of notes array
          groupedNotes[type].notes.unshift({ id: _id, title, content });
        });

        // Create columns in fixed order
        const orderedColumns = order.map(
          (type) =>
            groupedNotes[type] || {
              id: type,
              noteType: type,
              notes: [],
            }
        );

        // Update state only if order changed to avoid infinite loops
        if (JSON.stringify(order) !== JSON.stringify(noteTypeOrder)) {
          setNoteTypeOrder(order);
          localStorage.setItem("noteTypeOrder", JSON.stringify(order));
        }

        setColumns(orderedColumns);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, [noteTypeOrder]);

  return (
    <div className="flex h-full text-gray-800 font-sans no-scrollbar">
      <Sidebar className="bg-black" />

      <div className="flex flex-col flex-1 p-6">
        <div className="flex gap-5 h-full overflow-x-auto no-scrollbar">
          {columns.map((col) => (
            <div
              key={col.id}
              className="w-72 flex-shrink-0 flex flex-col bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="p-3 border-b border-gray-100 ">
                <h3 className="uppercase font-medium text-sm text-center">
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
                    className="p-3 bg-white border border-gray-200 rounded-md shadow-sm text-center cursor-pointer hover:shadow-md transition-shadow"
                  >
                    {note.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
