import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { ReactNode } from "react";

export default function Select({
  id,
  onChange,
  value,
  label,
  disabled,
  children,
  size = "base",
  labelElement,
  required,
  hide,
}: {
  id?: string;
  onChange: (e: any) => void;
  value?: string | number;
  label?: string;
  disabled?: boolean;
  children: ReactNode;
  size?: "sm" | "base";
  labelElement?: ReactNode;
  required?: boolean;
  hide?: boolean;
}) {
  const styles = {
    base: {
      select: "p-2 text-sm",
      arrow: "h-4 w-4 text-zinc-500 absolute top-3 right-3",
    },
    sm: {
      select: "p-1.5 h-7 text-xs",
      arrow: "h-4 w-4 text-zinc-500 absolute top-1.5 right-2",
    },
  };

  return (
    <>
      {/* {label && id ? ( */}
      {hide ? null : (
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={id} className="text-xs font-semibold dark:text-white">
            {label}
          </label>
          {labelElement ? labelElement : null}
        </div>
      )}
      <div className={`relative ${label && id ? "mt-1" : ""}`}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-required={required}
          className={`${
            size == "sm" ? styles.sm.select : styles.base.select
          } appearance-none cursor-pointer w-full border border-zinc-200 dark:border-zinc-800 md:hover:bg-zinc-50 md:dark:hover:bg-zinc-900/50 bg-zinc-50 dark:bg-zinc-900 dark:text-white rounded-md font-medium disabled:cursor-not-allowed disabled:opacity-50 transition-all`}
        >
          {children}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className={`${
            size == "sm" ? styles.sm.arrow : styles.base.arrow
          } text-zinc-500 absolute pointer-events-none`}
        />
      </div>
    </>
  );
}
