import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { saveNote, getNote } from "../services/api";
import HomeLoader from "../components/loaders/homeLoader";
import useUserStore from "../store/useUserStore";
import { RiArrowLeftSFill, RiSave2Fill } from "react-icons/ri";
import Button from "../components/ui/Button";
import "./md.css";

const MarkdownNoteEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useUserStore();
  const { id, title: paramTitle } = useParams();
  const { title: stateTitle, noteType } = location.state || {};

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState(
    stateTitle || decodeURIComponent(paramTitle || "")
  );
  const [markdown, setMarkdown] = useState("# Write your Markdown");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", theme);
  }, [theme]);

  // Fetch note for editing
  useEffect(() => {
    if (isEditMode) {
      const fetchNote = async () => {
        try {
          const response = await getNote();
          const notes = response.data.notes;
          const foundNote = notes.find((note) => note._id === id);

          if (foundNote) {
            setTitle(foundNote.title);
            setMarkdown(foundNote.content);
          } else {
            console.warn("Note not found");
          }
        } catch (error) {
          console.error("Failed to fetch note:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchNote();
    }
  }, [id]);

  const saveNoteHandler = async () => {
    try {
      setSaving(true);
      const payload = {
        title,
        content: markdown,
        noteType: noteType || "default",
        id: isEditMode ? id : undefined, // include id if editing
      };

      await saveNote(payload);
      alert("Note saved!");
      navigate("/home");
    } catch (error) {
      console.error(
        "Error saving note:",
        error.response?.data || error.message
      );
      alert("Error saving note.");
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => navigate(-1);

  return (
    <div className="p-2 mx-auto dark:bg-[#161a21] dark:text-white h-screen">
      <div className="flex justify-between items-center px-1 mb-1">
        <Button
          onClick={goBack}
          disabled={saving}
          className="flex items-center text-black/60 text-sm rounded-md border-none hover:text-black dark:text-white/70 dark:hover:text-white"
        >
          <RiArrowLeftSFill className="w-5 h-5 dark:text-white/70 dark:hover:text-white" />
          <span>Back</span>
        </Button>

        <h1 className="text-2xl font-bold flex items-center">
          <span className="mr-2">📝</span> Markdown Note Editor
        </h1>
        <Button
          onClick={saveNoteHandler}
          disabled={saving}
          className={`flex items-center  text-black px-4 text-xs py-1.5 rounded-md ${
            saving
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          <RiSave2Fill className="w-5 h-5 " />
          {saving ? "Saving..." : "Save Note"}
        </Button>
      </div>
      {loading ? (
        <div className="text-center w-full text-lg text-gray-500">
          <HomeLoader />
        </div>
      ) : (
        <div className="w-full">
          <MarkdownEditor
            height="85vh"
            preview="live"
            visible={true}
            onChange={(value) => setMarkdown(value)}
          />
        </div>
      )}
    </div>
  );
};

export default MarkdownNoteEditor;
