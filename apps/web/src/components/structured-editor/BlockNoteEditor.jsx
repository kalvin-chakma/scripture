import { useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const BlockNoteEditor = ({ data, onChange, editorBlock, theme, editable = true }) => {
  const editor = useCreateBlockNote({
    initialContent: Array.isArray(data) && data.length > 0 ? data : undefined,
  });

  useEffect(() => {
    if (!editable) return;
    return editor.onChange(() => {
      onChange(editor.document);
    });
  }, [editor, onChange, editable]);

  return (
    <div
      id={editorBlock}
      className="w-full h-full min-h-full rounded p-2 bg-white text-gray-900 dark:bg-[#1f1f1f] dark:text-white/75"
    >
      <BlockNoteView editor={editor} editable={editable} theme={theme === "dark" ? "dark" : "light"} />
    </div>
  );
};

export default BlockNoteEditor;
