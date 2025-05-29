import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getNote } from "../services/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getNote();
        const notes = response.data.notes;
        const grouped = {};

        notes.forEach((note) => {
          const type = note.noteType || "Untitled";
          if (!grouped[type]) {
            grouped[type] = {
              id: type,
              noteType: type,
              notes: [],
            };
          }
          grouped[type].notes.push({
            id: note._id,
            title: note.title,
            content: note.content,
          });
        });

        setColumns(Object.values(grouped));
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);
  return (
    <div className="flex h-full text-gray-800 font-sans no-scrollbar">
      <Sidebar className="bg-black" />

      <div className="flex flex-col flex-1 p-6 ">
        <div className="flex gap-5 h-full overflow-x-auto no-scrollbar">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-72 flex flex-col bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center">
                  <h3 className="font-medium text-sm">
                    {column.noteType || "Untitled"}
                  </h3>
                </div>
              </div>
              <div className="flex flex-col gap-2 p-2 overflow-auto no-scrollbar">
                {column.notes.map((note) => (
                  <Link
                    to={`/note-details/${encodeURIComponent(note.title)}`}
                    key={note.id}
                    className="p-3 bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow"
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
