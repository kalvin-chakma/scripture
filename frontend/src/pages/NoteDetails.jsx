import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNote } from "../services/api";

export default function NoteDetails() {
  const { title } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await getNote();
        const notes = response.data.notes;

        const foundNote = notes.find((note) => note.title === title);
        if (foundNote) {
          setNote(foundNote);
        } else {
          console.warn("Note not found");
        }
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };

    fetchNote();
  }, []);

  if (!note) return <div>Loading note...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
      <p className="text-gray-700 whitespace-pre-line">{note.content}</p>
    </div>
  );
}
