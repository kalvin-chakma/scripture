import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNote } from "../services/api";
import MarkdownEditor from "@uiw/react-markdown-editor";
import ContentEditor from "../components/general-editor/contentEditor";
import Loader from "../components/loaders/Loader";

export default function NoteDetails() {
  document.documentElement.setAttribute("data-color-mode", "light");
  const { id, title } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await getNote();
        const notes = response.data.notes;

        const foundNote = notes.find((note) => note._id === id);
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
  }, [id]);

  if (!note)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
      <div>
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <div className="text-xl sm:text-2xl font-bold break-words">
            Title: {note.title}
          </div>
          <div className="text-[0.7rem] sm:text-xs text-gray-600 font-semibold">
            Note created on:{" "}
            {new Date(note.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      </div>

      <div className="w-full overflow-auto">
        {note.noteType === "markdown" ? (
          <MarkdownEditor.Markdown source={note.content} />
        ) : (
          <ContentEditor
            data={JSON.parse(note.content)}
            onChange={() => {}}
            editorBlock="editorjs-container"
          />
        )}
      </div>
    </div>
  );
}
