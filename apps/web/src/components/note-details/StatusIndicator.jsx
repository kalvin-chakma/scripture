export default function StatusIndicator({ status }) {
  if (status === "idle") return null;

  return (
    <span
      className={
        status === "error"
          ? "text-red-500"
          : "text-gray-400 dark:text-gray-500"
      }
    >
      &bull;{" "}
      {status === "saving"
        ? "Saving…"
        : status === "saved"
        ? "Saved"
        : "Failed to save"}
    </span>
  );
}
