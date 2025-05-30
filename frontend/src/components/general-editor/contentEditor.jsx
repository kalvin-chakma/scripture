import { useEffect, useRef, memo } from "react";
import EditorJS from "@editorjs/editorjs";
import tools from "./tools";

const ContentEditor = memo(({ data, onChange, editorBlock }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: editorBlock,
        data: data,
        tools: tools,
        onChange: async () => {
          if (editorRef.current) {
            const savedData = await editorRef.current.save();
            onChange(savedData);
          }
        },
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [editorBlock]);

  return (
    <div
      id={editorBlock}
      className="w-full min-h-64 border border-gray-300 rounded p-4"
    />
  );
});

export default ContentEditor;
