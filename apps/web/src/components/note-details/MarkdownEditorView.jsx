import { createPortal } from "react-dom";
import MarkdownEditor from "@uiw/react-markdown-editor";
import {
  markdownRemarkPlugins,
  markdownRemarkRehypeOptions,
  markdownRehypePlugins,
} from "../../note-editor/markdownPlugins";
import StatusIndicator from "./StatusIndicator";

export default function MarkdownEditorView({
  title,
  onTitleChange,
  createdAt,
  saveStatus,
  theme,
  markdown,
  onMarkdownChange,
  previewWidthPercent,
  editorWrapperRef,
  splitContainerEl,
  onDividerDragStart,
  isDividerDragging,
}) {
  return (
    <div className="w-full h-full flex flex-col dark:text-white dark:bg-[#1f1f1f]">
      <div className="flex flex-col items-center gap-1 px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
        <input
          value={title}
          onChange={onTitleChange}
          placeholder="Untitled"
          className="text-xl sm:text-2xl font-bold break-words bg-transparent border-none text-center w-full max-w-2xl focus:outline-none focus:ring-0 rounded-md px-2 py-0.5 hover:bg-gray-100 focus:bg-gray-100 dark:text-white dark:hover:bg-white/5 dark:focus:bg-white/5 transition-colors duration-150"
        />
        <div className="flex items-center gap-2 text-[0.7rem] sm:text-xs text-gray-600 dark:text-gray-400 font-semibold">
          <span>
            Note created on:{" "}
            {new Date(createdAt).toLocaleString("en-US", {
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

      <div
        ref={editorWrapperRef}
        className={`markdown-editor relative flex-1 min-h-0 ${
          theme === "dark" ? "dark" : "light"
        }`}
      >
        <MarkdownEditor
          height="100%"
          preview="live"
          visible={true}
          value={markdown}
          onChange={onMarkdownChange}
          previewWidth={`${previewWidthPercent}%`}
          previewProps={{
            remarkPlugins: markdownRemarkPlugins,
            remarkRehypeOptions: markdownRemarkRehypeOptions,
            rehypePlugins: markdownRehypePlugins,
          }}
        />
        {splitContainerEl &&
          createPortal(
            <div
              onMouseDown={onDividerDragStart}
              onTouchStart={onDividerDragStart}
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
    </div>
  );
}
