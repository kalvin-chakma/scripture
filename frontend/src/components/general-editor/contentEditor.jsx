import { useEffect, useRef, memo } from "react";
import EditorJS from "@editorjs/editorjs";
import tools from "./tools";
import "./style.css";

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
      className={
        "w-full h-full min-h-full rounded p-2 bg-white text-gray-900  dark:bg-[#0d1117]  dark:text-white/75"
      }
    />
  );
});

export default ContentEditor;
