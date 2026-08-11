import NoteForm from "./NoteForm";

export default function NoteModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-black dark:text-white p-6 rounded shadow-lg w-full max-w-xs lg:max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Create a Note
        </h2>
        <NoteForm onClose={onClose} />
      </div>
    </div>
  );
}
