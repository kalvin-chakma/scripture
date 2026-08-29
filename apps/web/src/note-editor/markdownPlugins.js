import remarkEmoji from "remark-emoji";
import remarkFlexibleMarkers from "remark-flexible-markers";
import { remarkDefinitionList, defListHastHandlers } from "remark-definition-list";

// Extra syntax @uiw's built-in remark-gfm + remark-github-blockquote-alert pipeline doesn't cover: definition lists, ==text== marks, :emoji: shortcodes.
export const markdownRemarkPlugins = [
  remarkDefinitionList,
  remarkFlexibleMarkers,
  remarkEmoji,
];

export const markdownRemarkRehypeOptions = {
  handlers: { ...defListHastHandlers },
};
