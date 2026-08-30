export default function Eyebrow({ children, className = "" }) {
  return (
    <p
      className={`text-[11px] font-mono font-semibold tracking-wider ${className}`}
    >
      {children}
    </p>
  );
}
