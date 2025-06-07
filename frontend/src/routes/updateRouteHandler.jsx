import React from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import MarkdownNoteEditor from "../note-editor/MarkdownNoteEditor";
import GeneralNoteEditor from "../note-editor/GeneralNoteEditor";

const updateRouteHandler = () => {
  const location = useLocation();
  const { noteType } = location.state || {};
  const { id, title } = useParams();

  if (!noteType) return <Navigate to="/home" />;

  const editorMap = {
    markdown: MarkdownNoteEditor,
    general: GeneralNoteEditor,
  };

  const EditorComponent =
    editorMap[noteType.toLowerCase()] || GeneralNoteEditor;

  return <EditorComponent />;
};

export default updateRouteHandler;
