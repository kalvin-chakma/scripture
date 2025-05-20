import { useState } from 'react';
import { Settings, Users } from 'lucide-react';
import NoteModal from './NodeModal';

export default function Sidebar() {
  const [showNoteModal, setShowNoteModal] = useState(false);

  return (
    <>
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-5 font-medium text-lg">Projects</div>
        <div className="flex flex-col px-5">
          <button
            className="mb-2 flex items-center justify-center text-gray-500 p-2 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => setShowNoteModal(true)}
          >
            Note
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="mb-2 flex items-center text-gray-500 p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Settings className="w-5 h-5 mr-2" />
            <span>Settings</span>
          </div>
          <div className="flex items-center text-gray-500 p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Users className="w-5 h-5 mr-2" />
            <span>Invite Members</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showNoteModal && <NoteModal onClose={() => setShowNoteModal(false)} />}
    </>
  );
}
