import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MarkdownEditor from "@uiw/react-markdown-editor";
import axios from "axios";

const MarkdownNoteEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTitle = location.state?.title || "Untitled";

  const [markdown, setMarkdown] = useState(`# Write your Markdown`);
  const [title] = useState(initialTitle);
  const [saving, setSaving] = useState(false);

  // Set default theme
  document.documentElement.setAttribute("data-color-mode", "light");

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

  const goBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="p-2 mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 gap-2">
        <button
          onClick={goBack}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 p-1 rounded-md"
        >
          Back
        </button>
        <h1 className="text-lg sm:text-xl font-bold">Title: {title}</h1>
      </div>

      <div className="w-full">
        <MarkdownEditor
          value={markdown}
          height="80vh"
          onChange={(value) => setMarkdown(value)}
        />
      </div>

      <div className="mt-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
          onClick={saveNoteHandler}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default MarkdownNoteEditor;
