import { motion as Motion } from "framer-motion";
import { HiOutlinePencilSquare, HiOutlineXMark } from "react-icons/hi2";
import NoteForm from "./NoteForm";
import Button from "./button";

export default function NoteModal({ onClose }) {
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <Motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white dark:bg-[#1f1f1f] dark:text-white p-6 rounded-xl shadow-xl w-full max-w-xs lg:max-w-md border border-gray-100 dark:border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-black dark:bg-white/10 dark:text-white">
              <HiOutlinePencilSquare className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-semibold">Create a Note</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer"
          >
            <HiOutlineXMark className="w-4 h-4" />
          </button>
        </div>
        <NoteForm onClose={onClose} />
      </Motion.div>
    </Motion.div>
  );
}
