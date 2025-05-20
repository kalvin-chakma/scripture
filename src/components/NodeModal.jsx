import NoteForm from './NoteForm';

export default function NoteModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Create a Note</h2>
        <NoteForm onClose={onClose} />
      </div>
    </div>
  );
}
