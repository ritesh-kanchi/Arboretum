import { outputFromType, structureFromType } from "@/lib/func";
import { outputAllowsStructure } from "@/lib/outputs/func";
import { ArboretumOutput, IROutputType } from "@/lib/outputs/types";
import { IRDataStructureType, IRDiagram } from "@/lib/structures/types";
import { ArboretumMode } from "@/lib/types";
import ArboretumIcon from "@/public/arboretum-icon.svg";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import MermaidRenderer from "./output/MermaidRenderer";
import ReactFlowRenderer from "./output/ReactFlowRenderer";
import TableOutput from "./output/TableOutput";
import TactileRenderer from "./output/TactileRenderer";
import HTMLRenderer from "./output/navigable/HTMLRenderer";
import ComboOutput from "./output/ComboOutput";

export default function Previewer({
  diagram,
  output,
  mode,
  structureType,
  url,
}: {
  diagram: IRDiagram;
  output: ArboretumOutput;
  mode: ArboretumMode;
  structureType: IRDataStructureType;
  url?: string;
}) {
  const isAllowed = outputAllowsStructure(output?.type, structureType);
  if (structureType === null || structureType === "unknown") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center p-8 py-16 space-y-4 dark:text-white text-black">
        <Image
          src={ArboretumIcon}
          className="size-12"
          alt="Three abstract shapes side-by-side of different shades of green to represent trees and other plans in an arboretum."
        />
        <h2 className="font-semibold text-3xl">Arboretum Preview</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium text-center">
          Loading...
        </p>
      </div>
    );
  } else if (!isAllowed) {
    return (
      <OutputError structureType={structureType} outputType={output!.type} />
    );
  }

  switch (output?.type) {
    case "html":
      return <HTMLRenderer diagram={diagram} mode={mode} url={url} />;
    case "html-table":
      return <ComboOutput diagram={diagram} mode={mode} url={url} />;
    case "table":
      return <TableOutput diagram={diagram} mode={mode} url={url} />;
    case "mmd":
      return <MermaidRenderer diagram={diagram} mode={mode} />;
    case "tact":
      return <TactileRenderer diagram={diagram} mode={mode} />;
    case "rflow":
      return <ReactFlowRenderer diagram={diagram} mode={mode} url={url} />;
    default:
      return null;
  }
}

function OutputError({
  structureType,
  outputType,
}: {
  structureType: IRDataStructureType;
  outputType: IROutputType;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-8 py-16 space-y-4 dark:text-white text-black">
      <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500" />

      <h2 className="font-semibold text-3xl">Arboretum Preview</h2>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="py-1 px-2 text-sm font-medium rounded-lg border-yellow-500 border-dashed border-2">
          Structure: {structureFromType(structureType as string)?.name}
        </div>
        <div className="py-1 px-2 text-sm font-medium rounded-lg border-yellow-500 border-dashed border-2">
          Output: {outputFromType(outputType as string)?.name}
        </div>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium text-center">
        This output type does not support the selected structure. <br />
        Please choose a different output type or structure.
      </p>
    </div>
  );
}
