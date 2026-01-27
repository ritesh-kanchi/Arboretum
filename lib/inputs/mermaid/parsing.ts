import { mermaidToIR } from "./conversion";
import mermaid from "mermaid";
import {
  IRDiagram,
  IRMetadata,
  ArboretumStructure,
} from "@/lib/structures/types";

export async function mermaidParsing(
  inputText: string,
  structure: ArboretumStructure,
  metadata: IRMetadata,
  setError: (error: string) => void,
  setGeneratedIR: (ir: IRDiagram) => void
) {
  mermaid.initialize({
    startOnLoad: true,
    theme: "default",
    securityLevel: "loose",
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
    },
  });

  try {
    const result: IRDiagram = await parseMermaidDiagram(
      inputText,
      structure,
      metadata,
      setError
    );
    if (result !== null) {
      setGeneratedIR(result);
    }
  } catch (e) {
    setError(JSON.stringify(e));
  }
}

const parseMermaidDiagram = async (
  text: string,
  structure: ArboretumStructure,
  metadata: IRMetadata,
  setError: (error: string) => void
): Promise<IRDiagram> => {
  if (structure === null) {
    setError("No structure selected");
    return null;
  }
  if (await mermaid.parse(text, { suppressErrors: true })) {
    try {
      const diagram = await mermaid.mermaidAPI.getDiagramFromText(text);
      const ir = mermaidToIR(diagram.db, metadata, structure);
      setError("");

      return ir;
    } catch (e) {
      setError(JSON.stringify(e));
      if (text !== "") {
        setError(JSON.stringify(e));
      }
    }
  }

  setError("Invalid Mermaid diagram");
  return null;
};
