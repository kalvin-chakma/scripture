import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Editor from "../components/markdown/editor";
import MarkdownViewer from "../components/markdown/markdownViewer";

export default function MarkdownNoteEditor() {
  const location = useLocation();
  const initialTitle = location.state?.title || "Untitled";

  const [markdown, setMarkdown] = useState(`# Write your Markdown`);
  const [title] = useState(initialTitle);
  const [saving, setSaving] = useState(false);

  const saveNoteHandler = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3001/note/save",
        { title, content: markdown },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      alert("Note saved!");
      console.log("Saved note:", response.data);
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
      alert("Error saving note.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="h-screen">
      <div className="h-full flex">
        <div className="w-1/2 p-4 border-r">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <Editor value={markdown} onChange={setMarkdown} />
          <button
            className="bg-green-500 text-white p-2 rounded-md mt-2"
            onClick={saveNoteHandler}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        <div className="w-1/2 p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <MarkdownViewer content={markdown} />
        </div>
      </div>
    </main>
  );
}
