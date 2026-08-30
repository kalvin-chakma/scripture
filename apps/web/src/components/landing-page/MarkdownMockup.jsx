import MockupWindow from "./MockupWindow";

export default function MarkdownMockup() {
  return (
    <MockupWindow>
      <div className="flex h-56 text-xs">
        <div className="flex-1 p-4 space-y-2 font-mono text-gray-600 dark:text-gray-300">
          <p className="text-blue-600 dark:text-blue-400"># Heading 1</p>
          <p>**Bold** and *italic*</p>
          <p>~~Strikethrough~~ and `code`</p>
          <p className="text-blue-600 dark:text-blue-400 mt-3">- List item one</p>
          <p>- List item two</p>
        </div>
        <div className="w-1 my-3 rounded-full bg-blue-500/70" />
        <div className="flex-1 p-4 space-y-2 overflow-hidden">
          <h3 className="text-lg font-bold">Heading 1</h3>
          <p>
            <strong>Bold</strong> and <em>italic</em>
          </p>
          <p>
            <span className="line-through opacity-60">Strikethrough</span>{" "}
            and{" "}
            <code className="bg-gray-100 dark:bg-white/10 rounded px-1">
              code
            </code>
          </p>
          <ul className="list-disc list-inside">
            <li>List item one</li>
            <li>List item two</li>
          </ul>
        </div>
      </div>
    </MockupWindow>
  );
}
