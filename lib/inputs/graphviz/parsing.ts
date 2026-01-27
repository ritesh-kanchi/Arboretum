import { DotASTNode, parse } from "ts-graphviz/ast";
import { graphVizToIR } from "./conversion";
import {
  IRDiagram,
  IRMetadata,
  ArboretumStructure,
} from "@/lib/structures/types";

export async function graphVizParsing(
  inputText: string,
  structure: ArboretumStructure,
  metadata: IRMetadata,
  setError: (error: string) => void,
  setGeneratedIR: (ir: IRDiagram) => void
) {
  try {
    const result = await parseGraphVizDiagram(
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

const parseGraphVizDiagram = async (
  text: string,
  structure: ArboretumStructure,
  metadata: IRMetadata,
  setError: (error: string) => void
): Promise<IRDiagram> => {
  try {
    const ast: DotASTNode = parse(text);
    if (structure) {
      const ir = await graphVizToIR(
        ast.children[0].children,
        metadata,
        structure
      );
      setError("");
      return ir;
    } else {
      setError("No structure selected");
      return null;
    }
  } catch (e) {
    // console.error(e);
    setError(JSON.stringify(e));
    if (text !== "") {
      setError(JSON.stringify(e));
    }
  }
  setError("Invalid GraphViz diagram");
  return null;
};
