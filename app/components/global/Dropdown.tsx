import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Fragment, JSX } from "react";

export default function Dropdown({
  name,
  data,
}: {
  name: string;
  data: {
    name: string;
    icon?: JSX.Element;
    onClick: () => void;
  }[];
}) {
  return (
    <Menu>
      <MenuButton className="px-2 py-1 text-xs rounded-md gap-1 hover:cursor-pointer flex items-center justify-center border border-zinc-200 whitespace-nowrap transition-all dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-white disabled:cursor-not-allowed disabled:opacity-50 data-open:opacity-75">
        {name}
        <ChevronDownIcon className="size-4" />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 z-50 origin-top-right rounded-lg border shadow-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm/6 text-black dark:text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        {data.map((item, index) => (
          <Fragment key={index}>
            {/* eslint-disable-next-line react/jsx-key */}
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 p-3 data-focus:bg-zinc-100 dark:data-focus:bg-zinc-900 cursor-pointer font-medium"
                onClick={item.onClick}
              >
                {item.icon}
                {item.name}
              </button>
            </MenuItem>
            {index < data.length - 1 && (
              <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
            )}
          </Fragment>
        ))}
      </MenuItems>
    </Menu>
  );
}
