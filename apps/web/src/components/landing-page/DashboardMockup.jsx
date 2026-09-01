import {
  HiOutlineDocumentText,
  HiOutlineRectangleGroup,
  HiOutlineListBullet,
} from "react-icons/hi2";

const dashboardColumns = [
  {
    label: "Markdown",
    icon: HiOutlineDocumentText,
    rows: ["Meeting notes", "Reading list", "API cheat sheet"],
  },
  {
    label: "Structured",
    icon: HiOutlineRectangleGroup,
    rows: ["Project roadmap", "Onboarding checklist"],
  },
  {
    label: "To-Do",
    icon: HiOutlineListBullet,
    rows: ["Ship the beta", "Backup the database", "Reply to feedback"],
  },
];

export default function DashboardMockup({ className = "" }) {
  return (
    <div className={`grid grid-cols-3 gap-3 text-xs ${className}`}>
      {dashboardColumns.map((col) => {
        const ColIcon = col.icon;
        return (
          <div key={col.label}>
            <div className="flex items-center justify-center gap-1.5 pb-2 mb-2 border-b border-gray-200 dark:border-neutral-800">
              <p className="font-bold uppercase text-[10px] tracking-wider dark:text-white">
                {col.label}
              </p>
              <span className="text-[9px] font-semibold px-1.5 rounded-full bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400">
                {col.rows.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {col.rows.map((row) => (
                <div
                  key={row}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800/80 px-2 py-1.5"
                >
                  <ColIcon className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="truncate dark:text-gray-200">{row}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
