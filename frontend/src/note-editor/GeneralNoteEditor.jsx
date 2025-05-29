import { useEffect, useState } from "react";
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

  const handleChange = (data) => {
    setEditorData(data);
    console.log("Editor data changed:", data);
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
    </div>
  );
};

export default GeneralNoteEditor;
