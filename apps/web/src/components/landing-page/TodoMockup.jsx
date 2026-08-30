import { HiCheck } from "react-icons/hi2";
import { IoAddOutline, IoTrashOutline } from "react-icons/io5";
import MockupWindow from "./MockupWindow";

export default function TodoMockup() {
  const rows = [
    { text: "Write the roadmap doc", done: false },
    { text: "Reply to design feedback", done: false },
    { text: "Fix the split-view divider bug", done: true },
    { text: "Ship the beta build", done: true },
    { text: "Backup the database", done: false },
  ];
  return (
    <MockupWindow>
      <div className="p-4 text-xs">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-white/5"
          >
            {row.done ? (
              <span className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center shrink-0">
                <HiCheck className="w-3 h-3 text-white" />
              </span>
            ) : (
              <span className="w-4 h-4 rounded border border-gray-300 dark:border-white/20 shrink-0" />
            )}
            <span
              className={`flex-1 ${
                row.done
                  ? "line-through text-gray-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {row.text}
            </span>
            <IoTrashOutline className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 shrink-0" />
          </div>
        ))}
        <div className="flex items-center gap-1 pt-2 text-gray-400">
          <IoAddOutline className="w-3.5 h-3.5" />
          <span>Add item</span>
        </div>
      </div>
    </MockupWindow>
  );
}
