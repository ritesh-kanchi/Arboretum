"use client";

import {
  generateEncodedData,
  inputFromType,
  outputFromType,
  structureFromType,
} from "@/lib/func";
import { graphVizParsing } from "@/lib/inputs/graphviz/parsing";
import { mermaidParsing } from "@/lib/inputs/mermaid/parsing";
import { ArboretumInput } from "@/lib/inputs/types";
import { ArboretumStructure, IRDiagram } from "@/lib/structures/types";
import { IROutputType, ArboretumOutput } from "@/lib/outputs/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Output from "../preview/components/Output";
import PreviewError from "../preview/components/PreviewError";
import { ArboretumDiagram } from "@/lib/types";
import { useRouter } from "next/navigation";
import Select from "../components/global/Select";
import { ARBORETUM_OUTPUTS } from "@/lib/outputs/constants";

const ALLOWED_OUTPUTS: IROutputType[] = ["html", "tact"];

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="w-screen min-h-screen xl:h-screen xl:overflow-hidden flex flex-col self-start bg-white dark:bg-zinc-950 text-black dark:text-white relative" />
      }
    >
      <Study />
    </Suspense>
  );
}

function Study({}) {
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
      : null,
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
            setGeneratedIR,
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
            setGeneratedIR,
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
        <Sidebar view={currentView} diagram={generatedIR} />
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
        {/* <OutputSelection view={currentView} setOutput={setOutput} /> */}
      </div>
    </div>
  );
}

function OutputSelection({
  view,
  setOutput,
}: {
  view: ArboretumDiagram;
  setOutput: (output: ArboretumOutput) => void;
}) {
  const router = useRouter();

  return (
    <div
      aria-hidden="true"
      className={`fixed bottom-0 w-full border-t md:border-0 border-zinc-200 dark:border-zinc-800 md:bg-transparent md:dark:bg-transparent bg-white dark:bg-zinc-950 p-4 ${
        view.outputType === "tact"
          ? "bottom-0 md:right-64 md:bottom-4"
          : "bottom-0 md:right-0"
      } flex items-center justify-end`}
    >
      <div className={`space-y-2 max-w-48`}>
        <Select
          size="sm"
          label="Output Type"
          id="outputType"
          onChange={(e) => {
            const newOutput =
              ARBORETUM_OUTPUTS.find(
                (output) => output?.type === e.target.value,
              ) ?? null;
            setOutput(newOutput);
            router.replace(
              `${process.env.NEXT_PUBLIC_DOMAIN_URL}/study${generateEncodedData(
                {
                  ...view,
                  outputType: newOutput?.type ?? null,
                },
              )}`,
            );
          }}
          value={view.outputType ?? ""}
        >
          <option value="">Choose an output</option>
          {ARBORETUM_OUTPUTS.filter((output) =>
            output?.allowedStructures.find(
              (s) => s?.type === view.structureType,
            ),
          )
            .filter(
              (output) =>
                output && ALLOWED_OUTPUTS.includes(output.type as IROutputType),
            )
            .map((output) =>
              output !== null ? (
                <option key={output.type} value={output.type ?? ""}>
                  {output?.name}
                </option>
              ) : null,
            )}
        </Select>
      </div>
    </div>
  );
}
