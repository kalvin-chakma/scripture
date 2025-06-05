import React from "react";
import Button from "../components/ui/Button";
import { RiEdit2Fill, RiDeleteBin5Fill } from "react-icons/ri";

export default function NoteOptionsPopup({ onEdit, onDelete }) {
  return (
    <div className="absolute top-6 right-0 z-10 w-28 bg-white border border-gray-200 shadow-lg rounded-lg  dark:bg-neutral-900 dark:border-gray-600">
      <Button
        onClick={onEdit}
        className="flex w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-700"
      >
        <RiEdit2Fill className="mr-2 text-center w-3 h-4" />
        Edit
      </Button>
      <Button
        onClick={onDelete}
        className="flex w-full text-left px-4 py-2 text-xs text-red-700 hover:bg-red-200 dark:text-red-800 dark:hover:bg-red-200"
      >
        <RiDeleteBin5Fill className="mr-2 text-center w-3 h-4" />
        Delete
      </Button>
    </div>
  );
}
