import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NoteForm({ onClose }) {
  const [noteType, setNoteType] = useState("markdown");
  const [title, setTitle] = useState("Untitled");
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
        <label className="block text-sm font-medium mb-1 dark:text-white ">
          Note Type
        </label>
        <select
          className="w-full border text-sm border-gray-300 rounded-lg px-3 py-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 dark:bg-[#1f1f1f] dark:text-gray-200 dark:border-gray-700"
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
          className="w-full border text-sm border-gray-300 rounded-lg px-3 py-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 dark:bg-[#1f1f1f] dark:text-gray-200 dark:border-gray-700"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end sm:space-x-2 space-y-2 sm:space-y-0">
        <button
          onClick={onClose}
          className="flex items-center justify-center bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-white/20 cursor-pointer h-[4vh] w-full sm:w-24"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center justify-center bg-green-600 text-sm font-semibold text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-150 hover:bg-green-700 hover:shadow-md cursor-pointer h-[4vh] w-full sm:w-24"
        >
          Save
        </button>
      </div>
    </form>
  );
}
