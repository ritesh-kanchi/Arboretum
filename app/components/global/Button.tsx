import { ReactNode } from "react";

export default function Button({
  type = "button",
  className,
  onClick,
  size = "base",
  disabled,
  children,
  outlined = true,
}: {
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
  size?: "sm" | "base";
  disabled?: boolean;
  children?: ReactNode;
  outlined?: boolean;
}) {
  const styles = {
    base: "px-3 py-1.5 text-sm rounded-lg",
    sm: "px-2 py-1 text-xs rounded-md",
  };

  return (
    <button
      type={type}
      className={`${
        size === "sm" ? styles.sm : styles.base
      } hover:cursor-pointer flex items-center justify-center ${
        outlined ? "border" : "border-0"
      } border-zinc-200 whitespace-nowrap gap-1 transition-all dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-white disabled:cursor-not-allowed disabled:opacity-50${
        className ? ` ${className}` : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
