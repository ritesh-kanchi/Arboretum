import Image from "next/image";
import ArboretumIcon from "@/public/arboretum-icon.svg";

export function UnsupportedPreview({ url }: { url?: string }) {
  return (
    <div
      className={`p-0 -mt-8 flex flex-col text-center justify-center w-full h-screen items-center space-y-4 dark:text-white`}
    >
      <Image
        src={ArboretumIcon}
        className="size-12"
        alt="Three abstract shapes side-by-side of different shades of green to represent trees and other plans in an arboretum."
      />
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl">Arboretum Preview</h1>
        <p className="text-zinc-500 text-lg font-medium">
          This output is unsupported.
        </p>
        {url ? (
          <a
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            className="inline-block bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:text-white dark:border-zinc-800 px-2.5 py-1.5 rounded-lg font-medium cursor-pointer"
          >
            Open in a new tab
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function UnavailableOutput({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-zinc-600 dark:text-zinc-400 font-medium">
        {text || "This is unavailable."}
      </p>
    </div>
  );
}
