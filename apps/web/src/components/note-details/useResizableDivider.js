import { useCallback, useEffect, useRef, useState } from "react";

// Draggable divider between the markdown editor and its live preview pane.
export default function useResizableDivider(isActive) {
  const [previewWidthPercent, setPreviewWidthPercent] = useState(50);
  const editorWrapperRef = useRef(null);
  const [splitContainerEl, setSplitContainerEl] = useState(null);
  const draggingRef = useRef(false);
  const [isDividerDragging, setIsDividerDragging] = useState(false);

  useEffect(() => {
    if (!isActive || !editorWrapperRef.current) return;
    const el = editorWrapperRef.current.querySelector(".md-editor-content");
    setSplitContainerEl(el || null);
  }, [isActive]);

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

  return {
    previewWidthPercent,
    editorWrapperRef,
    splitContainerEl,
    isDividerDragging,
    handleDividerDragStart,
  };
}
