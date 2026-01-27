"use client";

import { Suspense, useEffect, useState } from "react";

import Navbar from "./components/Navbar";

import { ArboretumInput } from "@/lib/inputs/types";
import {
  ArboretumStructure,
  IRDiagram,
  IRMetadata,
} from "@/lib/structures/types";
import { ArboretumOutput } from "@/lib/outputs/types";

import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  generateEncodedData,
  inputFromType,
  outputFromType,
  structureFromType,
} from "@/lib/func";
import { useLocalStorage } from "usehooks-ts";
import { mermaidParsing } from "@/lib/inputs/mermaid/parsing";
import { graphVizParsing } from "@/lib/inputs/graphviz/parsing";
import InputPanel from "./components/InputPanel";
import OutputPanel from "./components/OutputPanel";
import DetailsPanel from "./components/DetailsPanel";
import { ArboretumDiagram } from "@/lib/types";

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    return params.toString();
  };

  const [input, setInput] = useState<ArboretumInput>(
    searchParams.get("i")
      ? inputFromType(searchParams.get("i") as string)
      : null
  );

  const [structure, setStructure] = useState<ArboretumStructure>(
    searchParams.get("s")
      ? structureFromType(searchParams.get("s") as string)
      : null
  );

  const [output, setOutput] = useState<ArboretumOutput>(
    searchParams.get("o")
      ? outputFromType(searchParams.get("o") as string)
      : null
  );

  const [inputText, setInputText] = useState<string>(
    searchParams.get("g")
      ? decodeURIComponent((searchParams.get("g") as string) ?? "")
      : ""
  );

  const [favorites, setFavorites] = useLocalStorage<ArboretumDiagram[]>(
    "arboretum-favorites",
    []
  );

  const [error, setError] = useState<string>("");

  const [generatedIR, setGeneratedIR] = useState<IRDiagram>(null);

  const [metaDetails, setMetaDetails] = useState<IRMetadata>({
    title: searchParams.get("t") ?? "",
    type: "unknown",
    description: searchParams.get("d") ?? "",
  });

  useEffect(() => {
    switch (input?.name) {
      case "Mermaid":
        setGeneratedIR(null);
        setError("");
        mermaidParsing(
          inputText,
          structure,
          metaDetails,
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
          metaDetails,
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
  }, [
    input,
    inputText,
    searchParams,
    metaDetails,
    setInputText,
    structure,
    setGeneratedIR,
  ]);

  const currentView: ArboretumDiagram = {
    inputText: inputText,
    inputType: input?.type ?? null,
    structureType: structure?.type ?? null,
    outputType: output?.type ?? null,
    title: generatedIR ? generatedIR.meta.title : metaDetails.title,
    description: generatedIR
      ? generatedIR.meta.description
      : metaDetails.description,
  };

  const encodedData = generateEncodedData(currentView);

  return (
    <>
      <div className="w-screen min-h-screen pb-16 md:pb-0 md:h-screen md:overflow-hidden flex flex-col self-start bg-white dark:bg-zinc-950 relative">
        <Navbar view={currentView} mode="Editor" encodedData={encodedData} />
        <div className="h-full md:h-[calc(100vh-3.5rem)]">
          <div className="md:grid h-full grid-cols-1 md:grid-cols-10">
            <InputPanel
              router={router}
              createQueryString={createQueryString}
              pathname={pathname}
              input={input}
              setInput={setInput}
              structure={structure}
              setStructure={setStructure}
              inputText={inputText}
              setInputText={setInputText}
              output={output}
              setOutput={setOutput}
              favorites={favorites}
              meta={
                generatedIR
                  ? generatedIR.meta ?? {
                      title: "",
                      type: "unknown",
                      description: "",
                    }
                  : metaDetails
              }
              setMetaDetails={setMetaDetails}
            />
            <OutputPanel
              router={router}
              createQueryString={createQueryString}
              pathname={pathname}
              structure={structure}
              output={output}
              setOutput={setOutput}
              generatedIR={generatedIR}
              encodedData={encodedData}
              view={currentView}
              error={error}
            />
            <DetailsPanel
              generatedIR={generatedIR}
              metaDetails={metaDetails}
              setMetaDetails={setMetaDetails}
            />
          </div>
        </div>
        {error ? (
          <div className="fixed right-2 bottom-2 bg-red-500 text-white px-3 py-2 rounded-lg max-w-sm z-50 flex items-center justify-start gap-1 shadow-xl">
            <ExclamationTriangleIcon className="size-5" />{" "}
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : null}
      </div>
    </>
  );
}
