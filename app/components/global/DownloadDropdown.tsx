import { PhotoIcon } from "@heroicons/react/16/solid";
import Dropdown from "./Dropdown";
import { elementToImage } from "@/lib/func";

export function DownloadDropdown({
  children,
  id,
  filename,
  pngScaleFactor = 2,
  disabled = [],
}: {
  children?: React.ReactNode;
  id: string;
  filename: string;
  pngScaleFactor?: number;
  disabled?: string[];
}) {
  return (
    <Dropdown
      name={children as string}
      data={[
        {
          icon: (
            <PhotoIcon className="size-4 fill-zinc-500 dark:fill-zinc-400" />
          ),
          name: "PNG",
          onClick: () => elementToImage("png", id, filename, pngScaleFactor),
        },
        {
          icon: (
            <PhotoIcon className="size-4 fill-zinc-500 dark:fill-zinc-400" />
          ),
          name: "SVG",
          onClick: () => elementToImage("svg", id, filename, pngScaleFactor),
        },
      ].filter((o) => !disabled.includes(o.name))}
    />
  );
}
