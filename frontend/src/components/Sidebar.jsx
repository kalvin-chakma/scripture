import { useState } from "react";
import { IoSettings, IoPeople } from "react-icons/io5";
import NoteModal from "./ui/NoteModal";

export default function Sidebar() {
  const [showNoteModal, setShowNoteModal] = useState(false);

  return (
    <>
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col dark:bg-neutral-900 dark:text-gray-200 dark:border-gray-700">
        {/* Header */}
        {/* <div className="p-5 font-medium text-md text-center">Projects</div> */}
        <div className="flex flex-col px-5">
          <button
            className="my-2 flex items-center justify-center p-2 text-xs font-semibold border border-zinc-700 dark:hover:bg-zinc-600 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => setShowNoteModal(true)}
          >
            Create Note
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto px-5 my-5 text-xs font-semibold ">
          <div className="mb-2 flex items-center p-2 dark:hover:bg-zinc-600 hover:bg-gray-100 rounded cursor-pointer">
            <IoSettings className="w-4 h-4 mr-2" />
            <span>Settings</span>
          </div>
          <div className="flex items-center p-2 dark:hover:bg-zinc-600 hover:bg-gray-100 rounded cursor-pointer">
            <IoPeople className="w-4 h-4 mr-2" />
            <span>Invite Members</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showNoteModal && <NoteModal onClose={() => setShowNoteModal(false)} />}
    </>
  );
}
