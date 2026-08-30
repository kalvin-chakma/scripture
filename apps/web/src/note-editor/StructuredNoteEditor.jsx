import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BlockNoteEditor from "../components/structured-editor/BlockNoteEditor";
import { getNote, saveNote, updateNote } from "../services/api";
import Button from "../components/ui/Button";
import { RiArrowLeftSFill, RiSave2Fill } from "react-icons/ri";
import { useTheme } from "next-themes";
import HomeLoader from "../components/loaders/homeLoader";

const StructuredNoteEditor = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);
  const { title: stateTitle, noteType: stateNoteType } = location.state || {};

  const [title, setTitle] = useState(stateTitle || "");
  const [noteType, setNoteType] = useState(stateNoteType || "structured");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  const [editorData, setEditorData] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      const fetchNote = async () => {
        try {
          const response = await getNote();
          const notes = response.data.notes;
          const foundNote = notes.find((note) => note.id === id);

          if (foundNote) {
            setEditorData(JSON.parse(foundNote.content));
            setTitle(foundNote.title);
            setNoteType(foundNote.noteType);
          } else {
            console.warn("Note not found");
          }
        } catch (error) {
          console.error("Failed to fetch Note:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchNote();
    }
  }, [id, isEditMode]);

  const handleChange = (data) => {
    setEditorData(data);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const contentString = JSON.stringify(editorData);

      const payload = {
        title,
        content: contentString,
        noteType,
      };

      if (isEditMode) {
        await updateNote(id, payload);
      } else {
        await saveNote(payload);
      }
      alert("Note saved!");
      navigate("/dashboard");
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
    <div className="max-w-5xl mx-auto p-5 dark:bg-[#1f1f1f] dark:text-white h-screen flex flex-col">
      <div className="flex justify-between items-center px-1 mb-1">
        <Button
          onClick={goBack}
          disabled={saving}
          className="flex items-center gap-0.5 text-black/60 text-sm rounded-lg border-none px-2 py-1 transition-colors duration-150 hover:text-black hover:bg-gray-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
        >
          <RiArrowLeftSFill className="w-5 h-5 dark:text-white/70 dark:hover:text-white" />
          <span>Back</span>
        </Button>

        <h1 className="text-2xl font-bold flex items-center">
          {isEditMode ? "Edit Note" : "New Note"}
        </h1>

        <Button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-1.5 text-white px-4 text-xs py-1.5 rounded-lg shadow-sm transition-all duration-150 ${
            saving
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 hover:shadow-md"
          }`}
        >
          <RiSave2Fill className="w-5 h-5" />
          {saving ? "Saving..." : "Save Note"}
        </Button>
      </div>
      {loading ? (
        <div className="text-center w-full text-lg text-gray-500">
          <HomeLoader />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1f1f1f] w-full flex-1 overflow-y-auto no-scrollbar">
          <BlockNoteEditor
            data={editorData}
            onChange={handleChange}
            editorBlock="blocknote-container"
            theme={theme}
          />
        </div>
      )}
    </div>
  );
};

export default StructuredNoteEditor;
