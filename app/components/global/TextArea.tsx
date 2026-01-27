import { ClipboardDocumentIcon } from "@heroicons/react/16/solid";
import Button from "./Button";

export default function TextArea({
  id,
  value,
  placeholder,
  readonly = false,
  fixedHeight = "",
  copyable = false,
  border = true,
  onChange,
}: {
  id: string;
  value: string;
  placeholder?: string;
  readonly?: boolean;
  fixedHeight?: string;
  copyable?: boolean;
  border?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div
      className={`relative w-full ${fixedHeight ? "" : "md:h-full"}`}
      style={{
        height: fixedHeight,
      }}
    >
      <textarea
        id={id}
        className={`scheme-light-dark ${
          border ? "border dark:border-zinc-800 border-zinc-200 rounded-xl" : ""
        } ${
          fixedHeight ? "" : "h-64 md:h-full"
        } scroll-y-auto w-full md:resize-none p-4 font-mono text-sm bg-white dark:bg-zinc-950 dark:text-white`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readonly}
        style={{
          height: fixedHeight,
        }}
      ></textarea>
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
