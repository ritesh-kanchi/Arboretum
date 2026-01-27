"use client";
import { ArboretumMode } from "@/lib/types";
import { UnavailableOutput } from "./UnsupportedPreview";
import { IRArray, IRDiagram, IRTree } from "@/lib/structures/types";
import ArrayOutput from "./navigable/ArrayOutput";
import TreeOutput from "./navigable/TreeOutput";
import TableOutput from "./TableOutput";
import { useSearchParams } from "next/navigation";

export default function ComboOutput({
  diagram,
  mode,
  url,
}: {
  diagram: IRDiagram;
  mode: ArboretumMode;
  url?: string;
}) {
  if (!diagram) {
    return (
      <UnavailableOutput text="The ordering output is only available for trees." />
    );
  }

  const { type } = diagram!.meta;
  const searchParams = useSearchParams();
  const counterbalance: boolean = searchParams.get("cb")
    ? searchParams.get("cb") === "true"
      ? true
      : false
    : true;

  return (
    <div className="w-full h-full flex flex-col">
      {/* <p>The counter is {counterbalance}</p> */}
      {counterbalance ? (
        <>
          <div className="w-full flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <TableOutput diagram={diagram} mode={mode} url={url} />
          </div>
          <div className="w-full h-full">
            {type === "arr" ? (
              <ArrayOutput array={diagram as IRArray} />
            ) : type === "tree" || type === "bt" ? (
              <TreeOutput tree={diagram as IRTree} />
            ) : (
              <UnavailableOutput text="This diagram type is not supported in HTML output." />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="w-full">
            {type === "arr" ? (
              <ArrayOutput array={diagram as IRArray} />
            ) : type === "tree" || type === "bt" ? (
              <TreeOutput tree={diagram as IRTree} />
            ) : (
              <UnavailableOutput text="This diagram type is not supported in HTML output." />
            )}
          </div>
          <div className="w-full flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <TableOutput diagram={diagram} mode={mode} url={url} />
          </div>
        </>
      )}
    </div>
  );
}
