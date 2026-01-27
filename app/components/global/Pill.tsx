export default function Pill({
  children,
  hiddenLarge,
}: {
  children: React.ReactNode;
  hiddenLarge: boolean;
}) {
  return (
    <div
      className={`text-xs font-medium border rounded-md border-zinc-200 dark:border-zinc-800 px-2 py-1 dark:text-white text-black whitespace-nowrap ${
        hiddenLarge ? "md:hidden" : ""
      }`}
    >
      {children}
    </div>
  );
}
