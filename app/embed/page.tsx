"use client";

import { mermaidParsing } from "@/lib/inputs/mermaid/parsing";
import { ArboretumInput } from "@/lib/inputs/types";
import { ArboretumStructure, IRDiagram } from "@/lib/structures/types";
import { ArboretumOutput } from "@/lib/outputs/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  generateEncodedData,
  inputFromType,
  outputFromType,
  structureFromType,
} from "@/lib/func";
import { graphVizParsing } from "@/lib/inputs/graphviz/parsing";
import Previewer from "../components/Previewer";
import {
  CubeTransparentIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/16/solid";

import ArboretumIcon from "@/public/arboretum-icon.svg";
import Image from "next/image";
import { autoDescription } from "@/lib/outputs/func";

export default function Page() {
  return (
    <div className="bg-white dark:bg-zinc-950">
      <Suspense
        fallback={
          <div className="p-24 flex flex-col text-center justify-center w-full h-screen items-center space-y-2">
            <CubeTransparentIcon className="size-6 text-zinc-500 shrink-0" />
            <h1 className="font-semibold text-lg dark:text-white">
              Arboretum Preview
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Loading...
            </p>
          </div>
        }
      >
        <Embed />
      </Suspense>
    </div>
  );
}

function Embed() {
  const [size, setSize] = useState({
    width: 1000,
    height: 10000,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  const output: ArboretumOutput = searchParams.get("o")
    ? outputFromType(searchParams.get("o") as string)
    : null;

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
              title: "",
              description: "",
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
              title: "",
              description: "",
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
  }, [input, inputText, searchParams, structure, setGeneratedIR]);

  if (
    input &&
    structure &&
    output &&
    inputText &&
    inputText != "" &&
    generatedIR !== null
  ) {
    const url = `${
      process.env.NEXT_PUBLIC_DOMAIN_URL
    }/preview${generateEncodedData({
      inputText: inputText,
      inputType: input.type,
      structureType: structure.type,
      outputType: output.type,
      description: description,
      title: title,
    })}`;

    if (size.width > 250 && size.height > 250) {
      return (
        <>
          <div className="w-screen h-screen overflow-auto">
            <div className="scale-75">
              <Previewer
                diagram={generatedIR}
                output={output}
                mode="Embed"
                url={url}
                structureType={generatedIR?.meta.type ?? "unknown"}
              />
            </div>
          </div>
          <a
            href={url}
            target="_blank"
            className="fixed top-0 right-0 p-2 z-10 shrink-0 text-xs rounded-bl-lg hover:cursor-pointer flex items-center justify-center border-l border-b border-zinc-200 whitespace-nowrap transition-all dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Image
              src={ArboretumIcon}
              className="size-5"
              alt="Three abstract shapes side-by-side of different shades of green to represent trees and other plans in an arboretum."
            />
          </a>
          <div className="fixed bottom-0 left-0 p-2 bg-white dark:bg-zinc-950 w-full border-t border-zinc-200 dark:border-zinc-800">
            <div className="space-y-1">
              <h1 className="text-sm font-semibold dark:text-white">
                {title ? title : generatedIR.meta.title}
              </h1>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {description != "" ? description : autoDescription(generatedIR)}
              </p>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className="p-8 flex flex-col text-center justify-center w-full h-screen items-center space-y-2">
          <CubeTransparentIcon className="size-6 text-blue-500 shrink-0" />

          <h1 className="font-semibold text-lg">Arboretum Preview</h1>

          <p className="text-zinc-500 text-sm">
            Increase the size of the window to see the preview.
          </p>
          <a
            href={`${
              process.env.NEXT_PUBLIC_DOMAIN_URL
            }/preview${generateEncodedData({
              inputText: inputText,
              inputType: input.type,
              structureType: structure.type,
              outputType: output.type,
            })}`}
            target="_blank"
            className="fixed top-0 right-0 p-2 z-10 shrink-0 text-xs rounded-bl-lg hover:cursor-pointer flex items-center justify-center border-l border-b border-zinc-200 whitespace-nowrap transition-all dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Image
              src={ArboretumIcon}
              className="size-5"
              alt="Three abstract shapes side-by-side of different shades of green to represent trees and other plans in an arboretum."
            />
          </a>
        </div>
      );
    }
  } else {
    return (
      <div className="p-8 flex flex-col text-center justify-center w-full h-screen items-center space-y-2">
        {input &&
        structure &&
        output &&
        inputText &&
        inputText != "" &&
        !error ? (
          <Image
            src={ArboretumIcon}
            className="size-6"
            alt="Three abstract shapes side-by-side of different shades of green to represent trees and other plans in an arboretum."
          />
        ) : (
          <ExclamationTriangleIcon
            className={`size-6 ${
              error ? "text-red-500" : "text-yellow-500"
            } shrink-0`}
          />
        )}
        <h1 className="font-semibold text-lg dark:text-white">
          Arboretum Preview
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="py-1 px-2 text-sm font-medium border rounded-lg border-zinc-200 dark:border-zinc-800 dark:text-white">
            Input: {input ? input.name : "Missing"}
          </div>
          <div className="py-1 px-2 text-sm font-medium border rounded-lg border-zinc-200 dark:border-zinc-800 dark:text-white">
            Structure: {structure ? structure.name : "Missing"}
          </div>
          <div className="py-1 px-2 text-sm font-medium border rounded-lg border-zinc-200 dark:border-zinc-800 dark:text-white">
            Output: {output ? output.name : "Missing"}
          </div>
        </div>
        {error ? (
          <p className="text-red-500 text-sm font-medium">{error}</p>
        ) : (
          <p className="text-zinc-500 text-sm">
            {inputText
              ? "Previewing..."
              : "Enter a valid grammar for a provided output."}
          </p>
        )}
      </div>
    );
  }
}
