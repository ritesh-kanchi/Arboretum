"use client";

import { inputFromType, outputFromType, structureFromType } from "@/lib/func";
import { graphVizParsing } from "@/lib/inputs/graphviz/parsing";
import { mermaidParsing } from "@/lib/inputs/mermaid/parsing";
import { ArboretumInput } from "@/lib/inputs/types";
import { ArboretumStructure, IRDiagram } from "@/lib/structures/types";
import { ArboretumOutput } from "@/lib/outputs/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Output from "./components/Output";
import PreviewError from "./components/PreviewError";
import { ArboretumDiagram } from "@/lib/types";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="w-screen min-h-screen xl:h-screen xl:overflow-hidden flex flex-col self-start bg-white dark:bg-zinc-950 text-black dark:text-white relative" />
      }
    >
      <Preview />
    </Suspense>
  );
}

function Preview({}) {
  const searchParams = useSearchParams();

  const inputText = searchParams.get("g") || "";

  const title = searchParams.get("t") || "";
  const description = searchParams.get("d") || "";

  const input: ArboretumInput = searchParams.get("i")
    ? inputFromType(searchParams.get("i") as string)
    : null;
  const structure: ArboretumStructure = searchParams.get("s")
    ? structureFromType(searchParams.get("s") as string)
    : null;

  const [output, setOutput] = useState<ArboretumOutput>(
    searchParams.get("o")
      ? outputFromType(searchParams.get("o") as string)
      : null
  );

  const [generatedIR, setGeneratedIR] = useState<IRDiagram>(null);

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (input && structure && output && inputText && inputText != "") {
      switch (input?.name) {
        case "Mermaid":
          setGeneratedIR(null);
          setError("");
          mermaidParsing(
            inputText,
            structure,
            {
              title: searchParams.get("t") || "",
              description: searchParams.get("d") || "",
              type: structure.type,
            },
            setError,
            setGeneratedIR
          );
          break;
        case "GraphViz":
          setGeneratedIR(null);
          setError("");
          graphVizParsing(
            inputText,
            structure,
            {
              title: searchParams.get("t") || "",
              description: searchParams.get("d") || "",
              type: structure.type,
            },
            setError,
            setGeneratedIR
          );
          break;
        case "Test":
          setGeneratedIR(null);
          setError("");
          break;
        default:
          break;
      }
    }
  }, [input, inputText, output, searchParams, structure, setGeneratedIR]);

  const currentView: ArboretumDiagram = {
    title: title,
    description: description,
    inputText: inputText,
    inputType: input ? input.type : null,
    structureType: structure ? structure.type : null,
    outputType: output ? output.type : null,
  };

  return (
    <div className="w-screen min-h-screen xl:h-screen xl:overflow-hidden pb-16 md:pb-0 flex flex-col self-start bg-white dark:bg-zinc-950 text-black dark:text-white relative">
      <div className="relative xl:flex xl:flex-row items-start justify-start w-full h-full">
        <Sidebar
          view={currentView}
          diagram={generatedIR}
          error={error}
          setOutput={setOutput}
        />
        {input &&
        output &&
        structure &&
        inputText &&
        inputText !== "" &&
        (error == null || error == "") ? (
          <Output generatedIR={generatedIR} output={output} />
        ) : (
          <PreviewError error={error} view={currentView} />
        )}
      </div>
    </div>
  );
}
