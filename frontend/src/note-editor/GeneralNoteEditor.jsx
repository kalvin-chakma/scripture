import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ContentEditor from "../components/general-editor/contentEditor";
import { saveNote } from "../services/api";
const GeneralNoteEditor = () => {
  const [editorData, setEditorData] = useState({
    time: new Date().getTime(),
    blocks: [
      {
        type: "header",
        data: {
          text: "",
          level: 2,
        },
      },
    ],
  });

  const [saving, setSaving] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { title, noteType } = location.state || {};

  const handleChange = (data) => {
    setEditorData(data);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const contentString = JSON.stringify(editorData);

      const payload = {
        title: title,
        content: contentString,
        noteType: noteType,
      };

      await saveNote(payload);
      alert("Note saved!");
      navigate("/");
    } catch (error) {
      console.error(
        "Failed to save note:",
        error.response?.data || error.message
      );
      alert("Error saving note.");
    } finally {
      setSaving(false);
    }
  };
  const goBack = () => navigate(-1);
  return (
    <div className="max-w-5xl mx-auto p-5">
      <div className="flex justify-between items-center px-5">
        <button
          onClick={goBack}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 p-1 rounded-md"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold flex items-center">
          <span className="mr-2">📝</span> My Rich Note Editor
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-4 py-2 rounded text-white ${
            saving
              ? "bg-green-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {saving ? "Saving..." : "Save Note"}
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <ContentEditor
          data={editorData}
          onChange={handleChange}
          editorBlock="editorjs-container"
        />
      </div>
    </div>
  );
};

export default GeneralNoteEditor;
