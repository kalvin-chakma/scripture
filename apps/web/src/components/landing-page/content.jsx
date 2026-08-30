import {
  HiOutlineDocumentText,
  HiOutlineRectangleGroup,
  HiOutlineListBullet,
  HiOutlineBolt,
  HiOutlineCodeBracket,
  HiOutlineSparkles,
  HiOutlineSwatch,
} from "react-icons/hi2";
import { RiDraggable, RiCheckboxCircleFill } from "react-icons/ri";
import MarkdownMockup from "./MarkdownMockup";
import StructuredMockup from "./StructuredMockup";
import TodoMockup from "./TodoMockup";

export const navLinks = [
  { label: "Markdown", href: "#markdown" },
  { label: "Structured", href: "#structured" },
  { label: "To-Dos", href: "#todos" },
];

export const strip = [
  {
    icon: HiOutlineDocumentText,
    title: "Markdown Notes",
    desc: "Write in Markdown with a live, resizable preview pane.",
    href: "#markdown",
  },
  {
    icon: HiOutlineRectangleGroup,
    title: "Structured Notes",
    desc: "Rich, block-based docs for everything Markdown isn't.",
    href: "#structured",
  },
  {
    icon: HiOutlineListBullet,
    title: "To-Do Lists",
    desc: "Simple checklists that autosave as you go.",
    href: "#todos",
  },
];

export const sections = [
  {
    id: "markdown",
    eyebrow: "#01 — MARKDOWN NOTES",
    eyebrowColor: "text-blue-600 dark:text-blue-400",
    heading: (
      <>
        Write in Markdown,
        <br />
        preview it live.
      </>
    ),
    items: [
      {
        icon: HiOutlineBolt,
        title: "Live split preview",
        desc: "Your rendered note updates side by side with the source as you type.",
        active: true,
      },
      {
        icon: RiDraggable,
        title: "Drag-to-resize divider",
        desc: "Pull the divider between editor and preview to give either pane more room.",
        active: false,
      },
      {
        icon: HiOutlineCodeBracket,
        title: "Extra syntax",
        desc: "Definition lists, inline highlights, and emoji shortcodes, on top of GitHub-flavored Markdown.",
        active: false,
      },
    ],
    mockup: "markdown",
  },
  {
    id: "structured",
    eyebrow: "#02 — STRUCTURED NOTES",
    eyebrowColor: "text-emerald-600 dark:text-emerald-400",
    heading: (
      <>
        Block-based docs
        <br />
        for everything else.
      </>
    ),
    items: [
      {
        icon: HiOutlineRectangleGroup,
        title: "Block editor",
        desc: "Headings, lists, and rich content blocks you can rearrange freely.",
        active: true,
      },
      {
        icon: RiDraggable,
        title: "Drag to reorder",
        desc: "Move any block up or down without touching the surrounding layout.",
        active: false,
      },
      {
        icon: HiOutlineSwatch,
        title: "Light & dark themes",
        desc: "Every block renders cleanly whichever theme you're working in.",
        active: false,
      },
    ],
    mockup: "structured",
  },
  {
    id: "todos",
    eyebrow: "#03 — TASKS & TO-DOS",
    eyebrowColor: "text-orange-600 dark:text-orange-400",
    heading: (
      <>
        Checklists that
        <br />
        stay in sync.
      </>
    ),
    items: [
      {
        icon: HiOutlineListBullet,
        title: "Inline checklists",
        desc: "Add, check off, and remove items without leaving the note.",
        active: true,
      },
      {
        icon: HiOutlineSparkles,
        title: "Debounced autosave",
        desc: "Every change is saved quietly in the background, no save button needed.",
        active: false,
      },
      {
        icon: RiCheckboxCircleFill,
        title: "Done, not gone",
        desc: "Completed items stay visible, struck through, until you clear them.",
        active: false,
      },
    ],
    mockup: "todos",
  },
];

export const principles = [
  "Built to feel instant. No spinners between typing and seeing your note rendered.",
  "One editor for every shape of note — prose, structured blocks, or a checklist.",
  "Notes stay grouped by type automatically, no folders to manage by hand.",
];

export const mockups = {
  markdown: MarkdownMockup,
  structured: StructuredMockup,
  todos: TodoMockup,
};
