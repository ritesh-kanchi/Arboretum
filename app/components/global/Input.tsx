import { ClipboardDocumentIcon } from "@heroicons/react/16/solid";
import Button from "./Button";

export default function Input({
  value,
  placeholder,
  readonly = false,
  fixedHeight = "",
  copyable = false,
  onChange,
}: {
  value: string;
  placeholder?: string;
  readonly?: boolean;
  fixedHeight?: string;
  copyable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      className={`relative w-full ${fixedHeight ? "" : "md:h-full"}`}
      style={{
        height: fixedHeight,
      }}
    >
      <input
        aria-label="Diagram Input"
        type="text"
        title="Enter your diagram input here"
        className={`scheme-light-dark border ${
          fixedHeight ? "" : "md:h-full"
        } scroll-y-auto w-full md:resize-none p-4 font-mono text-sm bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white border-zinc-200 rounded-xl`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readonly}
        style={{
          height: fixedHeight,
        }}
      />
      {copyable ? (
        <div className="absolute bottom-3 right-3">
          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(value);
            }}
          >
            <ClipboardDocumentIcon className="w-4 h-4 mr-1 text-zinc-500" />
            Copy
          </Button>
        </div>
      ) : null}
    </div>
  );
}
