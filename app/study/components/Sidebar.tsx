import { ArboretumDiagram } from "@/lib/types";
import { nameFromType } from "@/lib/func";
import ArboretumIcon from "@/public/arboretum-icon.svg";
import { autoDescription } from "@/lib/outputs/func";
import { IRDiagram } from "@/lib/structures/types";

import Image from "next/image";

export default function Sidebar({
  diagram,
  view,
}: {
  diagram: IRDiagram;
  view: ArboretumDiagram;
}) {
  const isCompleteView =
    view.inputType &&
    view.structureType &&
    view.outputType &&
    view.inputText &&
    view.inputText !== "";

  return (
    <div
      role="tabpanel"
      aria-label="Preview Sidebar"
      className="relative shrink-0 xl:h-screen xl:w-96 bg-white dark:bg-zinc-950 xl:border-r border-b xl:border-b-0 border-r-0 border-zinc-200 dark:border-zinc-800"
    >
      <nav className="p-4 h-14 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-start space-x-2">
          <Image
            src={ArboretumIcon}
            className="size-6 mr-2"
            alt="Three abstract shapes side-by-side of different shades of green to represent trees and other plans in an arboretum."
          />
          <h1 className="text-lg font-semibold items-center">Arboretum</h1>
        </div>
      </nav>
      <div className="p-4 py-8 flex flex-col space-y-4">
        <h1 className="font-semibold text-2xl text-left">
          {isCompleteView
            ? view.title && view.title != ""
              ? view.title
              : `${nameFromType(view.structureType)} diagram`
            : "Incomplete view"}
        </h1>

        {isCompleteView ? (
          view.description && view.description != "" ? (
            <>
              <hr
                className="border-zinc-200 dark:border-zinc-800"
                aria-hidden="true"
              />
              <div className="space-y-2 text-left">
                <h2 className="font-semibold text-lg">Description</h2>
                <p className="leading-relaxed">{view.description}</p>
              </div>
            </>
          ) : diagram ? (
            <>
              <hr
                className="border-zinc-200 dark:border-zinc-800"
                aria-hidden="true"
              />
              <div className="space-y-2 text-left">
                <h2 className="font-semibold text-lg">Description</h2>
                <AutomaticDescription diagram={diagram} />
              </div>
            </>
          ) : null
        ) : (
          <p className="leading-relaxed">
            This Arboretum preview is missing some information. Please check the
            input, structure, and output to ensure they are all selected. You
            also may have problems with the input text.
          </p>
        )}
      </div>
    </div>
  );
}

function AutomaticDescription({ diagram }: { diagram: IRDiagram }) {
  return (
    <>
      <p className="leading-relaxed">{autoDescription(diagram)}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        This description was automatically generated based on the diagram.
      </p>
    </>
  );
}
