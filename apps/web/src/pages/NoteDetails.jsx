import { useParams } from "react-router-dom";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getNote, updateNote } from "../services/api";
import MarkdownEditor from "@uiw/react-markdown-editor";
import BlockNoteEditor from "../components/general-editor/BlockNoteEditor";
import Loader from "../components/loaders/Loader";
import { useTheme } from "next-themes";
import { IoAddOutline, IoTrashOutline } from "react-icons/io5";
import useNoteViewStore from "../store/useNoteViewStore";
import "../note-editor/md.css";

let todoIdCounter = 0;
const makeTodoId = () => `todo-${Date.now()}-${todoIdCounter++}`;
const emptyTodoItem = () => ({ id: makeTodoId(), text: "", done: false });

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

  // Drag-to-resize the markdown source/preview split. The library renders
  // both panes with plain inline widths (no drag handle of its own), so we
  // mutate them directly by DOM query instead of piping every mousemove
  // through React state - that's what keeps the drag smooth.
  const editorSplitRef = useRef(null);
  const [splitPercent, setSplitPercent] = useState(() => {
    const stored = Number(localStorage.getItem("md-editor-split"));
    return Number.isFinite(stored) && stored >= 20 && stored <= 80 ? stored : 50;
  });
  const [dividerTop, setDividerTop] = useState(0);

  const applySplit = useCallback((percent) => {
    const wrap = editorSplitRef.current;
    if (!wrap) return;
    const editorPane = wrap.querySelector(".md-editor-content-editor");
    const previewPane = wrap.querySelector(".md-editor-preview");
    if (editorPane) editorPane.style.width = `${percent}%`;
    if (previewPane) previewPane.style.width = `${100 - percent}%`;
  }, []);

  const measureDividerTop = useCallback(() => {
    const wrap = editorSplitRef.current;
    if (!wrap) return;
    const content = wrap.querySelector(".md-editor-content");
    if (!content) return;
    setDividerTop(content.getBoundingClientRect().top - wrap.getBoundingClientRect().top);
  }, []);

  const isMarkdownEditing = note?.noteType === "markdown" && isEditing;

  useLayoutEffect(() => {
    if (!isMarkdownEditing) return;
    applySplit(splitPercent);
    measureDividerTop();

    const wrap = editorSplitRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measureDividerTop);
    observer.observe(wrap);
    return () => observer.disconnect();
    // Only re-run when the split editor mounts/unmounts - the drag handler
    // below applies further width changes imperatively.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMarkdownEditing]);

  // The read-only render can be hundreds of nodes for a long note; @uiw's
  // Markdown component isn't memoized internally, so it re-parses the whole
  // document on every re-render. Memoize it on content alone so a theme
  // toggle (which re-renders this page) doesn't also trigger a full re-parse.
  const markdownPreview = useMemo(
    () => (
      <MarkdownEditor.Markdown
        source={markdown}
        className="prose dark:prose-invert max-w-none"
      />
    ),
    [markdown]
  );

  const handleDividerPointerDown = useCallback(
    (e) => {
      e.preventDefault();
      const wrap = editorSplitRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      let current = splitPercent;

      const onMove = (moveEvent) => {
        let percent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
        percent = Math.min(80, Math.max(20, percent));
        current = percent;
        applySplit(percent);
        setSplitPercent(percent);
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        localStorage.setItem("md-editor-split", String(current));
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [applySplit, splitPercent]
  );

  if (!note)
    return (
      <div>
        <Loader />
      </div>
    );

  const statusIndicator = saveStatus !== "idle" && (
    <span
      className={
        saveStatus === "error"
          ? "text-red-500"
          : "text-gray-400 dark:text-gray-500"
      }
    >
      &bull;{" "}
      {saveStatus === "saving"
        ? "Saving…"
        : saveStatus === "saved"
        ? "Saved"
        : "Failed to save"}
    </span>
  );

  // Editing a markdown note gets the full width/height of the page - a
  // code editor needs the room. Viewing it (and every other note type)
  // uses the narrow, document-style layout below.
  if (isMarkdownEditing) {
    return (
      <div className="w-full h-full flex flex-col dark:text-white dark:bg-[#1f1f1f]">
        <div className="flex flex-col items-center gap-1 px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
          <input
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="text-xl sm:text-2xl font-bold break-words bg-transparent border-none text-center w-full max-w-2xl focus:outline-none focus:ring-0 rounded-md px-2 py-0.5 hover:bg-gray-100 focus:bg-gray-100 dark:text-white dark:hover:bg-white/5 dark:focus:bg-white/5 transition-colors duration-150"
          />
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
            {statusIndicator}
          </div>
        </div>

        <div
          ref={editorSplitRef}
          className={`markdown-editor relative flex-1 min-h-0 ${
            theme === "dark" ? "dark" : "light"
          }`}
        >
          <MarkdownEditor
            height="100%"
            preview="live"
            visible={true}
            value={markdown}
            onChange={handleMarkdownChange}
          />
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize editor and preview"
            onPointerDown={handleDividerPointerDown}
            style={{ top: dividerTop, left: `calc(${splitPercent}% - 4px)` }}
            className="absolute bottom-0 z-20 flex w-2 touch-none justify-center group/divider cursor-col-resize"
          >
            <div className="h-full w-px bg-gray-300 transition-colors duration-150 group-hover/divider:bg-blue-400 group-active/divider:bg-blue-500 dark:bg-neutral-700 dark:group-hover/divider:bg-blue-500" />
          </div>
        </div>
      </div>
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
          {statusIndicator}
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
          <div className="space-y-1 max-w-2xl mx-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 group">
                <input
                  type="checkbox"
                  checked={item.done}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    isEditing && updateItem(item.id, { done: e.target.checked })
                  }
                  className="w-4 h-4 flex-shrink-0"
                />
                {isEditing ? (
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateItem(item.id, { text: e.target.value })}
                    placeholder="To-do item"
                    className={`flex-1 bg-transparent border-b border-transparent focus:border-gray-200 dark:focus:border-gray-700 focus:outline-none py-1 dark:text-white ${
                      item.done ? "line-through text-gray-400 dark:text-gray-500" : ""
                    }`}
                  />
                ) : (
                  <span
                    className={`flex-1 py-1 dark:text-white ${
                      item.done ? "line-through text-gray-400 dark:text-gray-500" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                )}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity duration-150 dark:text-gray-600"
                  >
                    <IoTrashOutline className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {isEditing && (
              <button
                type="button"
                onClick={addItem}
                className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-150 mt-2"
              >
                <IoAddOutline className="w-4 h-4 mr-1" />
                Add item
              </button>
            )}
          </div>
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
