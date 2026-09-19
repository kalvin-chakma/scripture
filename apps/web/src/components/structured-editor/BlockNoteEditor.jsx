import { useEffect } from "react";
import { BlockNoteSchema, combineByGroup } from "@blocknote/core";
import { filterSuggestionItems } from "@blocknote/core/extensions";
import * as locales from "@blocknote/core/locales";
import {
  createReactInlineMathSpec,
  createReactMathBlockSpec,
  getMathBlockTypeSelectItems,
  getMathSlashMenuItems,
  locales as mathLocales,
} from "@blocknote/math-block";
import {
  blockTypeSelectItems,
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

// Adds a math block (e.g. `$$\frac{a}{b}$$`) and inline math (`$x^2$`) to the default
// schema, so equations/fractions can be typed via slash menu or toolbar and render as
// real math (not literal text) - matching what Notion-style paste/typing produces.
const schema = BlockNoteSchema.create().extend({
  blockSpecs: {
    mathBlock: createReactMathBlockSpec(),
  },
  inlineContentSpecs: {
    math: createReactInlineMathSpec(),
  },
});

const BlockNoteEditor = ({ data, onChange, editorBlock, theme, editable = true }) => {
  const editor = useCreateBlockNote({
    schema,
    dictionary: {
      ...locales.en,
      math: mathLocales.en,
    },
    initialContent: Array.isArray(data) && data.length > 0 ? data : undefined,
  });
  if (typeof window !== "undefined") window.__bnEditor = editor;

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
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={theme === "dark" ? "dark" : "light"}
        slashMenu={false}
        formattingToolbar={false}
      >
        <FormattingToolbarController
          formattingToolbar={() => (
            <FormattingToolbar
              blockTypeSelectItems={[
                ...blockTypeSelectItems(editor.dictionary),
                ...getMathBlockTypeSelectItems(editor),
              ]}
            />
          )}
        />
        <SuggestionMenuController
          triggerCharacter="/"
          getItems={async (query) =>
            filterSuggestionItems(
              combineByGroup(
                getDefaultReactSlashMenuItems(editor),
                getMathSlashMenuItems(editor)
              ),
              query
            )
          }
        />
      </BlockNoteView>
    </div>
  );
};

export default BlockNoteEditor;
