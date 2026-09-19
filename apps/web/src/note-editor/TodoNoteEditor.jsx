import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getNote, saveNote, updateNote } from "../services/api";
import Button from "../components/ui/button";
import { RiArrowLeftSFill, RiSave2Fill } from "react-icons/ri";
import { IoAddOutline, IoTrashOutline } from "react-icons/io5";
import HomeLoader from "../components/loaders/homeLoader";

let idCounter = 0;
const makeItemId = () => `todo-${Date.now()}-${idCounter++}`;
const emptyItem = () => ({ id: makeItemId(), text: "", done: false });

const TodoNoteEditor = () => {
  document.title = "Scripture | Note";
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);
  const { title: stateTitle, noteType: stateNoteType } = location.state || {};

  const [title, setTitle] = useState(stateTitle || "Untitled");
  const [noteType] = useState(stateNoteType || "todo");
  const [items, setItems] = useState([emptyItem()]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchNote = async () => {
        try {
          const response = await getNote();
          const notes = response.data.notes;
          const foundNote = notes.find((note) => note.id === id);

          if (foundNote) {
            setTitle(foundNote.title);
            const parsed = JSON.parse(foundNote.content || "[]");
            setItems(
              Array.isArray(parsed) && parsed.length
                ? parsed.map((item) => ({ ...item, id: item.id || makeItemId() }))
                : [emptyItem()]
            );
          } else {
            console.warn("Note not found");
          }
        } catch (error) {
          console.error("Failed to fetch note:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchNote();
    }
  }, [id, isEditMode]);

  const updateItem = (itemId, changes) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...changes } : item))
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (itemId) =>
    setItems((prev) =>
      prev.length > 1 ? prev.filter((item) => item.id !== itemId) : prev
    );

  const saveNoteHandler = async () => {
    try {
      setSaving(true);
      const cleanedItems = items.filter((item) => item.text.trim() !== "");
      const payload = {
        title,
        content: JSON.stringify(cleanedItems.length ? cleanedItems : items),
        noteType,
      };

      if (isEditMode) {
        await updateNote(id, payload);
      } else {
        await saveNote(payload);
      }

      alert("Note saved!");
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Error saving note:",
        error.response?.data || error.message
      );
      alert("Error saving note.");
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => navigate(-1);

  return (
    <div className="max-w-3xl mx-auto p-5 dark:bg-[#1f1f1f] dark:text-white h-screen">
      <div className="flex justify-between items-center px-1 mb-4">
        <Button
          onClick={goBack}
          disabled={saving}
          className="flex items-center gap-0.5 text-black/60 text-sm rounded-lg border-none px-2 py-1 transition-colors duration-150 hover:text-black hover:bg-gray-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
        >
          <RiArrowLeftSFill className="w-5 h-5 dark:text-white/70 dark:hover:text-white" />
          <span>Back</span>
        </Button>

        <h1 className="text-2xl font-bold flex items-center">
           To-do Note Editor
        </h1>

        <Button
          onClick={saveNoteHandler}
          disabled={saving}
          className={`flex items-center gap-1.5 text-white px-4 text-xs py-1.5 rounded-lg shadow-sm transition-all duration-150 ${
            saving
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 hover:shadow-md"
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
        <div className="bg-white dark:bg-[#1f1f1f] p-4 space-y-4">
          <input
            type="text"
            className="w-full text-lg font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none py-1 dark:text-white"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={(e) => updateItem(item.id, { done: e.target.checked })}
                  className="w-4 h-4 flex-shrink-0"
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(item.id, { text: e.target.value })}
                  placeholder="To-do item"
                  className={`flex-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none py-1 dark:text-white ${
                    item.done ? "line-through text-gray-400 dark:text-gray-500" : ""
                  }`}
                />
                <Button
                  variant="unstyled"
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <IoTrashOutline className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="unstyled"
            onClick={addItem}
            className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            <IoAddOutline className="w-4 h-4 mr-1" />
            Add item
          </Button>
        </div>
      )}
    </div>
  );
};

export default TodoNoteEditor;
