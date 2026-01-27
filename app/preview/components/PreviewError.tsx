import { ArboretumDiagram } from "@/lib/types";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import ArboretumIcon from "@/public/arboretum-icon.svg";
import { inputFromType, outputFromType, structureFromType } from "@/lib/func";

export default function PreviewError({
  error,
  view,
}: {
  error: string | null;
  view: ArboretumDiagram;
}) {
  const missing = new Map([
    ["text", view.inputText == null || view.inputText === ""],
    ["input", view.inputType == null],
    ["structure", view.structureType == null],
    ["output", view.outputType == null],
  ]);

  const count =
    (missing.get("text") ? 1 : 0) +
    (missing.get("input") ? 1 : 0) +
    (missing.get("structure") ? 1 : 0) +
    (missing.get("output") ? 1 : 0) +
    (error != null && error !== "" ? 1 : 0);

  const color =
    count == 0
      ? {
          text: "text-zinc-500",
          border: "border-zinc-200 dark:border-zinc-800",
        }
      : count == 1
      ? {
          text: "text-yellow-500",
          border: "border-yellow-500 border-dashed border-2",
        }
      : {
          text: "text-red-500",
          border: "border-red-500 border-dashed border-2",
        };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-8 py-16 space-y-4 dark:text-white text-black">
      {count != 4 && (error != null || error != "" || count != 0) ? (
        <ExclamationTriangleIcon className={`w-12 h-12 ${color.text}`} />
      ) : (
        <Image
          src={ArboretumIcon}
          className="size-12"
          alt="Three abstract shapes side-by-side of different shades of green to represent trees and other plans in an arboretum."
        />
      )}

      <h2 className="font-semibold text-3xl">Arboretum Preview</h2>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div
          className={`py-1 px-2 text-sm font-medium rounded-lg  ${
            view.inputType || count == 4
              ? "border-zinc-200 dark:border-zinc-800 border"
              : color.border
          }`}
        >
          Input:{" "}
          {view.inputType ? inputFromType(view.inputType)?.name : "Missing"}
        </div>
        <div
          className={`py-1 px-2 text-sm font-medium rounded-lg  ${
            view.structureType || count == 4
              ? "border-zinc-200 dark:border-zinc-800 border"
              : color.border
          }`}
        >
          Structure:{" "}
          {view.structureType
            ? structureFromType(view.structureType)?.name
            : "Missing"}
        </div>
        <div
          className={`py-1 px-2 text-sm font-medium rounded-lg  ${
            view.outputType || count == 4
              ? "border-zinc-200 dark:border-zinc-800 border"
              : color.border
          }`}
        >
          Output:{" "}
          {view.outputType ? outputFromType(view.outputType)?.name : "Missing"}
        </div>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium text-center">
        {error != "" && error != null
          ? error
          : view.inputText && view.inputText !== "" && count == 0
          ? "Previewing..."
          : missing.get("text")
          ? "The title or input text is missing or invalid. Use the editor to provide a valid grammar."
          : "This view is missing some information."}
      </p>
    </div>
  );
}
