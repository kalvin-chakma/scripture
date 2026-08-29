import { motion as Motion } from "framer-motion";
import NoteForm from "./NoteForm";

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
        <h2 className="text-lg font-semibold mb-4 text-center">
          Create a Note
        </h2>
        <NoteForm onClose={onClose} />
      </Motion.div>
    </Motion.div>
  );
}
