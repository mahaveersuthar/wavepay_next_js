export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-3xl dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
