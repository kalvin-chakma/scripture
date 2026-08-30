export default function MockupWindow({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#242424] overflow-hidden shadow-sm ${className}`}
    >
      <div className="h-8 flex items-center gap-1.5 px-3 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
      </div>
      {children}
    </div>
  );
}
