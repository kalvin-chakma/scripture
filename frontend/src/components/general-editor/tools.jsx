import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import ImageTool from "@editorjs/image";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import Embed from "@editorjs/embed";
import Delimiter from "@editorjs/delimiter";
import Marker from "@editorjs/marker";
import Warning from "@editorjs/warning";
import RawTool from "@editorjs/raw";
import InlineCode from "@editorjs/inline-code";

const tools = {
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: "Enter a header",
      levels: [1, 2, 3, 4],
      defaultLevel: 2,
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
  },
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: "/uploadFile",
        byUrl: "/fetchUrl",
      },
    },
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  code: CodeTool,
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        coub: true,
        codepen: true,
      },
    },
  },
  delimiter: Delimiter,
  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
    config: {
      titlePlaceholder: "Title",
      messagePlaceholder: "Message",
    },
  },
  raw: RawTool,
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+C",
  },
};

export default tools;
