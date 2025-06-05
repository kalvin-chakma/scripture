import { useEffect, useRef, memo } from "react";
import EditorJS from "@editorjs/editorjs";
import tools from "./tools";

const ContentEditor = memo(({ data, onChange, editorBlock, theme }) => {
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
      className={`w-full h-full min-h-full border rounded p-2 ${
        theme === "dark"
          ? "border-gray-600 bg-[#171717] text-white/75"
          : "border-gray-300 bg-white text-gray-900"
      }`}
    />
  );
});

export default ContentEditor;
