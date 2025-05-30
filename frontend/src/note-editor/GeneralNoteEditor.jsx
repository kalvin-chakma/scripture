import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ContentEditor from "../components/general-editor/contentEditor";

const GeneralNoteEditor = () => {
  const [editorData, setEditorData] = useState({
    time: new Date().getTime(),
    blocks: [
      {
        type: "header",
        data: {
          text: "Start writing your note...",
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
    console.log("Editor data changed:", data);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");
      const contentString = JSON.stringify(editorData);

      const payload = {
        title: title,
        noteType: noteType,
        content: contentString,
      };

      const response = await axios.post(
        "http://localhost:3001/note/save",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      alert("Note saved!");
      console.log("Note saved:", response.data);
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <span className="mr-2">📝</span> My Rich Note Editor
      </h1>

      <div className="bg-white rounded-lg shadow-md p-4">
        <ContentEditor
          data={editorData}
          onChange={handleChange}
          editorBlock="editorjs-container"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-4 py-2 rounded text-white ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save Note"}
        </button>
      </div>
    </div>
  );
};

export default GeneralNoteEditor;
