import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ContentEditor from "../components/general-editor/contentEditor";
import { saveNote } from "../services/api";
import Button from "../components/ui/Button";
import { RiArrowLeftSFill, RiSave2Fill } from "react-icons/ri";
import useUserStore from "../store/useUserStore";

const GeneralNoteEditor = () => {
  const { theme } = useUserStore();
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
    <div className="max-w-5xl mx-auto p-5 dark:bg-[#171717] dark:text-white h-screen">
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
          <span className="mr-2">📝</span> My Rich Note Editor
        </h1>
        <Button
          onClick={handleSave}
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
      <div className="bg-white rounded-lg shadow-md w-full">
        <ContentEditor
          data={editorData}
          onChange={handleChange}
          editorBlock="editorjs-container"
          theme={theme}
        />
      </div>
    </div>
  );
};

export default GeneralNoteEditor;
