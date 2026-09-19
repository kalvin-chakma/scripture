import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineDocumentText,
  HiOutlineRectangleGroup,
  HiOutlineListBullet,
} from "react-icons/hi2";
import Button from "./button";

const noteTypes = [
  { value: "markdown", label: "Markdown", icon: HiOutlineDocumentText },
  { value: "structured", label: "Structured", icon: HiOutlineRectangleGroup },
  { value: "todo", label: "To-do", icon: HiOutlineListBullet },
];

export default function NoteForm({ onClose }) {
  const [noteType, setNoteType] = useState("markdown");
  const [title, setTitle] = useState("Untitled");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();

    const editorRoutes = {
      markdown: "/markdown-editor",
      structured: "/structured-editor",
      todo: "/todo-editor",
    };

    const route = editorRoutes[noteType] || "";
    navigate(route, { state: { title, noteType } });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Note Type */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2 dark:text-white">
          Note Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {noteTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.value}
                variant="unstyled"
                onClick={() => setNoteType(type.value)}
                className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition-colors duration-150 cursor-pointer ${
                  noteType === type.value
                    ? "border-black bg-gray-100 text-black dark:border-white dark:bg-white/10 dark:text-white"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />
                {type.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2 dark:text-white">
          Title
        </label>
        <input
          type="text"
          autoFocus
          className="w-full border text-sm border-gray-300 rounded-lg px-3 py-2 transition-colors duration-150 focus:outline-none focus:border-black dark:bg-[#1f1f1f] dark:text-gray-200 dark:border-gray-700 dark:focus:border-white"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end sm:space-x-2 space-y-2 sm:space-y-0">
        <Button
          variant="unstyled"
          onClick={onClose}
          className="flex items-center justify-center bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-white/20 cursor-pointer h-[4vh] w-full sm:w-24"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="unstyled"
          className="flex items-center justify-center bg-black text-sm font-semibold text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-150 hover:bg-gray-800 hover:shadow-md cursor-pointer h-[4vh] w-full sm:w-24 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Save
        </Button>
      </div>
    </form>
  );
}
