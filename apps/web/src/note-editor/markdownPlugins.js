import remarkEmoji from "remark-emoji";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { remarkDefinitionList, defListHastHandlers } from "remark-definition-list";
import "katex/dist/katex.min.css";

// Extra syntax @uiw's built-in remark-gfm + remark-github-blockquote-alert pipeline doesn't cover:
// definition lists, ==text== marks, :emoji: shortcodes, and $inline$ / $$block$$ LaTeX math (fractions,
// equations, etc).
export const markdownRemarkPlugins = [
  remarkDefinitionList,
  remarkFlexibleMarkers,
  remarkEmoji,
  remarkMath,
];

// strict: false / throwOnError: false so a malformed or partially-typed equation renders inline
// (KaTeX's own error output) instead of crashing the whole preview while the user is mid-edit.
export const markdownRehypePlugins = [
  [rehypeKatex, { strict: false, throwOnError: false }],
];

export const markdownRemarkRehypeOptions = {
  handlers: { ...defListHastHandlers },
};
