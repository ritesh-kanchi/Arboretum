import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function DropdownButton({
  panelName,
  show,
  setShow,
}: {
  panelName: string;
  show: boolean;
  setShow: (arg0: boolean) => void;
}) {
  return (
    <button
      className="md:hidden cursor-pointer rounded-full bg-white dark:bg-zinc-900 text-black dark:text-white p-1 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 ease-in-out"
      onClick={() => {
        setShow(!show);
      }}
      title={show ? `Hide ${panelName}` : `Show ${panelName}`}
      aria-label={show ? `Hide ${panelName}` : `Show ${panelName}`}
    >
      <ChevronDownIcon
        className={`size-5 ${show ? "rotate-0" : "rotate-180"}`}
      />
    </button>
  );
}
