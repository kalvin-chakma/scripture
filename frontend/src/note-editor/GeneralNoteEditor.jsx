import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ContentEditor from "../components/general-editor/contentEditor";
import { getNote, saveNote } from "../services/api";
import Button from "../components/ui/Button";
import { RiArrowLeftSFill, RiSave2Fill } from "react-icons/ri";
import useUserStore from "../store/useUserStore";
import HomeLoader from "../components/loaders/homeLoader";

const GeneralNoteEditor = () => {
  const { theme } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);
  const { title: stateTitle, noteType: stateNoteType } = location.state || {};

  const [title, setTitle] = useState(stateTitle || "");
  const [noteType, setNoteType] = useState(stateNoteType || "general");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

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

  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", theme);
  }, [theme]);

  useEffect(() => {
    if (isEditMode) {
      const fetchNote = async () => {
        try {
          const response = await getNote();
          const notes = response.data.notes;
          const foundNote = notes.find((note) => note._id === id);

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
  }, [id]);

  const handleChange = (data) => {
    setEditorData(data);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const contentString = JSON.stringify(editorData);

      const payload = {
        id,
        title,
        content: contentString,
        noteType,
      };

      await saveNote(payload);
      alert("Note saved!");
      navigate("/home");
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
    <div className="max-w-5xl mx-auto p-5 dark:bg-[#0d1117] dark:text-white h-screen">
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
          <span className="mr-2">📝</span>
          {isEditMode ? "Edit Note" : "New Note"}
        </h1>

        <Button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center text-black px-4 text-xs py-1.5 rounded-md ${
            saving
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
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
        <div className="bg-white rounded-lg shadow-md w-full">
          <ContentEditor
            data={editorData}
            onChange={handleChange}
            editorBlock="editorjs-container"
            theme={theme}
          />
        </div>
      )}
    </div>
  );
};

export default GeneralNoteEditor;
