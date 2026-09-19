import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { HiOutlineUserPlus, HiOutlineXMark } from "react-icons/hi2";
import { IoPersonCircle } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import {
  addCollaborator,
  getCollaborators,
  removeCollaborator,
} from "../../services/api";

export default function ShareModal({ noteId, onClose }) {
  const [collaborators, setCollaborators] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCollaborators(noteId)
      .then(({ data }) => setCollaborators(data.collaborators))
      .catch((err) => console.error("Failed to load collaborators:", err));
  }, [noteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { data } = await addCollaborator(noteId, email.trim());
      setCollaborators((prev) => [...prev, data.collaborator]);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add collaborator");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeCollaborator(noteId, userId);
      setCollaborators((prev) => prev.filter((c) => c.id !== userId));
    } catch (err) {
      console.error("Failed to remove collaborator:", err);
    }
  };

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
              <HiOutlineUserPlus className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-semibold">Share note</h2>
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

        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Collaborator's email"
            required
            className="flex-1 bg-gray-100 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:border-gray-400 focus:outline-none dark:bg-white/5 dark:border-neutral-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3 py-1.5 text-sm font-semibold rounded-md bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Add
          </button>
        </form>

        {error && <div className="text-red-500 text-xs mb-3">{error}</div>}

        <div className="space-y-1">
          {collaborators.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              No collaborators yet.
            </p>
          ) : (
            collaborators.map((c) => (
              <div
                key={c.id}
                className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <IoPersonCircle className="w-6 h-6 flex-shrink-0 text-gray-400" />
                  )}
                  <span className="text-sm truncate">
                    {c.displayName || c.username}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(c.id)}
                  className="flex-shrink-0 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity duration-150 dark:hover:text-red-400"
                >
                  <RiDeleteBin5Fill className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </Motion.div>
    </Motion.div>
  );
}
