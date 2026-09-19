import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { saveNote, getNote, updateNote } from "../services/api";
import HomeLoader from "../components/loaders/homeLoader";
import { RiArrowLeftSFill, RiSave2Fill } from "react-icons/ri";
import Button from "../components/ui/button";
import {
  markdownRemarkPlugins,
  markdownRemarkRehypeOptions,
  markdownRehypePlugins,
} from "./markdownPlugins";
import "./md.css";

const MarkdownNoteEditor = () => {
  document.title = "Scripture | Note";
  const navigate = useNavigate();
  const location = useLocation();
  const { id, title: paramTitle } = useParams();
  const { title: stateTitle, noteType } = location.state || {};

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState(
    stateTitle || decodeURIComponent(paramTitle || "")
  );
  const [markdown, setMarkdown] = useState("# Write your Markdown");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  // Draggable divider between the markdown editor and the preview pane
  const [previewWidthPercent, setPreviewWidthPercent] = useState(50);
  const editorWrapperRef = useRef(null);
  const [splitContainerEl, setSplitContainerEl] = useState(null);
  const draggingRef = useRef(false);
  const [isDividerDragging, setIsDividerDragging] = useState(false);

  useEffect(() => {
    if (!editorWrapperRef.current) return;
    const el = editorWrapperRef.current.querySelector(".md-editor-content");
    setSplitContainerEl(el || null);
  }, [loading]);

  const handleDividerDragStart = useCallback((e) => {
    e.preventDefault();
    draggingRef.current = true;
    setIsDividerDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      if (!draggingRef.current || !splitContainerEl) return;
      const rect = splitContainerEl.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const nextPreviewPercent = ((rect.right - clientX) / rect.width) * 100;
      setPreviewWidthPercent(Math.min(80, Math.max(20, nextPreviewPercent)));
    };
    const handleUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDividerDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [splitContainerEl]);

  // Fetch note for editing
  useEffect(() => {
    if (isEditMode) {
      const fetchNote = async () => {
        try {
          const response = await getNote();
          const notes = response.data.notes;
          const foundNote = notes.find((note) => note.id === id);

          if (foundNote) {
            setTitle(foundNote.title);
            setMarkdown(foundNote.content);
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

  const saveNoteHandler = async () => {
    try {
      setSaving(true);
      const payload = {
        title,
        content: markdown,
        noteType: noteType || "default",
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

  const handleMarkdownChange = useCallback((value) => setMarkdown(value), []);

  const markdownEditor = useMemo(
    () => (
      <MarkdownEditor
        height="85vh"
        preview="live"
        visible={true}
        value={markdown}
        onChange={handleMarkdownChange}
        previewWidth={`${previewWidthPercent}%`}
        previewProps={{
          remarkPlugins: markdownRemarkPlugins,
          remarkRehypeOptions: markdownRemarkRehypeOptions,
          rehypePlugins: markdownRehypePlugins,
        }}
      />
    ),
    [markdown, handleMarkdownChange, previewWidthPercent]
  );

  return (
    <div className="p-2 mx-auto dark:bg-[#1f1f1f] dark:text-white h-screen">
      <div className="flex justify-between items-center px-1 mb-1">
        <Button
          onClick={goBack}
          disabled={saving}
          className="flex items-center gap-0.5 text-black/60 text-sm rounded-lg border-none px-2 py-1 transition-colors duration-150 hover:text-black hover:bg-gray-100 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
        >
          <RiArrowLeftSFill className="w-5 h-5 dark:text-white/70 dark:hover:text-white" />
          <span>Back</span>
        </Button>

        <h1 className="text-2xl font-bold flex items-center">
            Markdown Note Editor Kalvin
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
          <RiSave2Fill className="w-5 h-5 " />
          {saving ? "Saving..." : "Save Note"}
        </Button>
      </div>
      {loading ? (
        <div className="text-center w-full text-lg text-gray-500">
          <HomeLoader />
        </div>
      ) : (
        <div className="w-full" ref={editorWrapperRef}>
          {markdownEditor}
          {splitContainerEl &&
            createPortal(
              <div
                onMouseDown={handleDividerDragStart}
                onTouchStart={handleDividerDragStart}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `calc(${100 - previewWidthPercent}% - 4px)`,
                  width: "8px",
                  cursor: "col-resize",
                  zIndex: 20,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: isDividerDragging ? "4px" : "0px",
                    height: "100%",
                    backgroundColor: isDividerDragging
                      ? "#3b82f6"
                      : "transparent",
                    transition: isDividerDragging
                      ? "none"
                      : "width 0.15s ease, background-color 0.15s ease",
                  }}
                />
              </div>,
              splitContainerEl
            )}
        </div>
      )}
    </div>
  );
};

export default MarkdownNoteEditor;
