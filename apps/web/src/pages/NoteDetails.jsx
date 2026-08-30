import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getNote, updateNote } from "../services/api";
import MarkdownEditor from "@uiw/react-markdown-editor";
import BlockNoteEditor from "../components/structured-editor/BlockNoteEditor";
import Loader from "../components/loaders/Loader";
import { useTheme } from "next-themes";
import useNoteViewStore from "../store/useNoteViewStore";
import {
  markdownRemarkPlugins,
  markdownRemarkRehypeOptions,
} from "../note-editor/markdownPlugins";
import "../note-editor/md.css";
import useResizableDivider from "../components/note-details/useResizableDivider";
import MarkdownEditorView from "../components/note-details/MarkdownEditorView";
import StatusIndicator from "../components/note-details/StatusIndicator";
import TodoList from "../components/note-details/TodoList";
import { emptyTodoItem, makeTodoId } from "../components/note-details/todoUtils";

export default function NoteDetails() {
  document.title = "Scripture | Note";
  const { theme } = useTheme();
  const { id } = useParams();
  const { isEditing, setIsEditing } = useNoteViewStore();

  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [items, setItems] = useState([]);
  const [editorData, setEditorData] = useState([]);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error

  // Holds the latest title/content so the debounced save always writes the
  // most recent edit, without re-creating the debounce on every keystroke.
  const draftRef = useRef({ title: "", content: "" });
  const loadedRef = useRef(false);
  const saveTimeoutRef = useRef(null);

  const isMarkdownEditing = note?.noteType === "markdown" && isEditing;

  const {
    previewWidthPercent,
    editorWrapperRef,
    splitContainerEl,
    isDividerDragging,
    handleDividerDragStart,
  } = useResizableDivider(isMarkdownEditing);

  // Every note opens in the read-only rendering view; editing only starts
  // once the Navbar's Edit button is clicked.
  useEffect(() => {
    setIsEditing(false);
  }, [id, setIsEditing]);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await getNote();
        const notes = response.data.notes;
        const foundNote = notes.find((n) => n.id === id);

        if (foundNote) {
          setNote(foundNote);
          setTitle(foundNote.title);

          if (foundNote.noteType === "markdown") {
            setMarkdown(foundNote.content || "");
          } else if (foundNote.noteType === "todo") {
            const parsed = JSON.parse(foundNote.content || "[]");
            setItems(
              Array.isArray(parsed) && parsed.length
                ? parsed.map((item) => ({ ...item, id: item.id || makeTodoId() }))
                : [emptyTodoItem()]
            );
          } else {
            setEditorData(JSON.parse(foundNote.content || "[]"));
          }

          draftRef.current = { title: foundNote.title, content: foundNote.content };
          loadedRef.current = true;
        } else {
          console.warn("Note not found");
        }
      } catch (error) {
        console.error("Failed to fetch note:", error);
      }
    };

    fetchNote();
  }, [id]);

  useEffect(() => () => clearTimeout(saveTimeoutRef.current), []);

  const persist = useCallback(
    (patch) => {
      if (!note || !loadedRef.current) return;
      draftRef.current = { ...draftRef.current, ...patch };
      setSaveStatus("saving");

      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await updateNote(id, {
            title: draftRef.current.title,
            content: draftRef.current.content,
            noteType: note.noteType,
          });
          setSaveStatus("saved");
        } catch (error) {
          console.error("Failed to save note:", error);
          setSaveStatus("error");
        }
      }, 900);
    },
    [id, note]
  );

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    persist({ title: value });
  };

  const handleMarkdownChange = useCallback(
    (value) => {
      setMarkdown(value);
      persist({ content: value });
    },
    [persist]
  );

  const handleEditorChange = useCallback(
    (data) => {
      setEditorData(data);
      persist({ content: JSON.stringify(data) });
    },
    [persist]
  );

  const persistItems = useCallback(
    (nextItems) => {
      const cleaned = nextItems.filter((item) => item.text.trim() !== "");
      persist({ content: JSON.stringify(cleaned.length ? cleaned : nextItems) });
    },
    [persist]
  );

  const updateItem = (itemId, changes) => {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === itemId ? { ...item, ...changes } : item
      );
      persistItems(next);
      return next;
    });
  };

  const addItem = () => {
    setItems((prev) => {
      const next = [...prev, emptyTodoItem()];
      persistItems(next);
      return next;
    });
  };

  const removeItem = (itemId) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((item) => item.id !== itemId);
      persistItems(next);
      return next;
    });
  };

  // The read-only render can be hundreds of nodes for a long note; @uiw's
  // Markdown component isn't memoized internally, so it re-parses the whole
  // document on every re-render. Memoize it on content alone so a theme
  // toggle (which re-renders this page) doesn't also trigger a full re-parse.
  const markdownPreview = useMemo(
    () => (
      <MarkdownEditor.Markdown
        source={markdown}
        className="prose dark:prose-invert max-w-none"
        remarkPlugins={markdownRemarkPlugins}
        remarkRehypeOptions={markdownRemarkRehypeOptions}
      />
    ),
    [markdown]
  );

  if (!note)
    return (
      <div>
        <Loader />
      </div>
    );

  // Editing a markdown note gets the full width/height of the page - a
  // code editor needs the room. Viewing it (and every other note type)
  // uses the narrow, document-style layout below.
  if (isMarkdownEditing) {
    return (
      <MarkdownEditorView
        title={title}
        onTitleChange={handleTitleChange}
        createdAt={note.createdAt}
        saveStatus={saveStatus}
        theme={theme}
        markdown={markdown}
        onMarkdownChange={handleMarkdownChange}
        previewWidthPercent={previewWidthPercent}
        editorWrapperRef={editorWrapperRef}
        splitContainerEl={splitContainerEl}
        onDividerDragStart={handleDividerDragStart}
        isDividerDragging={isDividerDragging}
      />
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto w-screen h-screen dark:bg-[#1f1f1f]">
      <div className="flex flex-col items-center gap-2 mb-6 text-center">
        {isEditing ? (
          <input
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="text-xl sm:text-2xl font-bold break-words bg-transparent border-none text-center w-full max-w-2xl focus:outline-none focus:ring-0 rounded-md px-2 py-0.5 hover:bg-gray-100 focus:bg-gray-100 dark:text-white dark:hover:bg-white/5 dark:focus:bg-white/5 transition-colors duration-150"
          />
        ) : (
          <div className="text-xl sm:text-2xl font-bold break-words dark:text-white">
            Title: {title}
          </div>
        )}
        <div className="flex items-center gap-2 text-[0.7rem] sm:text-xs text-gray-600 dark:text-gray-400 font-semibold">
          <span>
            Note created on:{" "}
            {new Date(note.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </span>
          <StatusIndicator status={saveStatus} />
        </div>
      </div>

      <div className="w-full overflow-auto">
        {note.noteType === "markdown" ? (
          <div
            className={`markdown-preview ${theme === "dark" ? "dark" : "light"}`}
          >
            {markdownPreview}
          </div>
        ) : note.noteType === "todo" ? (
          <TodoList
            items={items}
            isEditing={isEditing}
            onUpdateItem={updateItem}
            onAddItem={addItem}
            onRemoveItem={removeItem}
          />
        ) : (
          <BlockNoteEditor
            data={editorData}
            onChange={handleEditorChange}
            editorBlock="blocknote-container"
            theme={theme}
            editable={isEditing}
          />
        )}
      </div>
    </div>
  );
}
