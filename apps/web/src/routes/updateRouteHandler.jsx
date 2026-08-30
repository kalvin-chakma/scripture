import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import MarkdownNoteEditor from "../note-editor/MarkdownNoteEditor";
import StructuredNoteEditor from "../note-editor/StructuredNoteEditor";
import TodoNoteEditor from "../note-editor/TodoNoteEditor";

const editorMap = {
  markdown: MarkdownNoteEditor,
  structured: StructuredNoteEditor,
  todo: TodoNoteEditor,
};

const UpdateRouteHandler = () => {
  const location = useLocation();
  const { noteType } = location.state || {};

  if (!noteType) return <Navigate to="/dashboard" />;

  const EditorComponent =
    editorMap[noteType.toLowerCase()] || StructuredNoteEditor;

  return <EditorComponent />;
};

export default UpdateRouteHandler;
