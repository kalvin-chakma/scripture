import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NoteForm({ onClose }) {
  const [noteType, setNoteType] = useState("markdown");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();

    const editorRoutes = {
      markdown: "/markdown-editor",
      general: "/general-editor",
      todo: "/todo-editor",
    };

    const route = editorRoutes[noteType] || "";
    navigate(route, { state: { title, noteType } });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Note Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Note Type</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={noteType}
          onChange={(e) => setNoteType(e.target.value)}
        >
          <option value="markdown">Markdown</option>
          <option value="general">General</option>
          <option value="todo">To-do</option>
        </select>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
