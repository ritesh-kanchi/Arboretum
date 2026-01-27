"use client";
import { ArboretumMode } from "@/lib/types";
import { IRToMermaid } from "@/lib/outputs/mermaid";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { DownloadDropdown } from "../global/DownloadDropdown";
import { UnavailableOutput } from "./UnsupportedPreview";
import { IRDiagram } from "@/lib/structures/types";
import { ClickDropdown } from "../global/ClickDropdown";
import { CodeBracketIcon } from "@heroicons/react/16/solid";

export default function MermaidRenderer({
  diagram,
  mode,
}: {
  diagram: IRDiagram;
  mode: ArboretumMode;
}) {
  const mermaidGrammar = IRToMermaid(diagram);
  const chartRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<boolean>(false);

  if (diagram?.meta.type === "arr" || diagram?.meta.type === "2arr") {
    return (
      <UnavailableOutput text="Mermaid does not support array diagrams yet." />
    );
  }

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.innerHTML = "";
      mermaid.initialize({ startOnLoad: false });

      const timeoutId = setTimeout(() => {
        mermaid
          .render("mermaid-diagram", mermaidGrammar)
          .then(({ svg }) => {
            chartRef.current!.innerHTML = svg;

            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(
              chartRef.current!.querySelector("svg")!
            );

            setError(svgString.includes("Syntax error in text"));
          })
          .catch(() => {
            setError(true);
          });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [mermaidGrammar]);

  if (error) {
    return (
      <UnavailableOutput text="There was an error rendering the Mermaid diagram. Please check the syntax." />
    );
  }

  return (
    <div className="overflow-hidden w-full h-96 md:h-full relative border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <div className="flex items-center justify-center w-full h-full bg-white dark:bg-zinc-950">
        <div
          ref={chartRef}
          className={
            mode === "Preview"
              ? "mermaid h-full w-full items-center justify-center flex"
              : "mermaid"
          }
        >
          {mermaidGrammar}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex items-center justify-end space-x-2">
        <ClickDropdown
          text="Copy Mermaid Syntax"
          action="Copied!"
          items={[
            {
              icon: <CodeBracketIcon className="size-4" />,
              name: "Copy Mermaid Syntax",
              onClick: () => {
                navigator.clipboard.writeText(mermaidGrammar);
              },
            },
          ]}
        />
        <DownloadDropdown
          id="mermaid-diagram"
          filename={
            diagram && diagram.meta.title
              ? diagram.meta.title
              : "mermaid-diagram"
          }
          disabled={["PNG"]}
        >
          Download Diagram
        </DownloadDropdown>
      </div>
    </div>
  );
}
