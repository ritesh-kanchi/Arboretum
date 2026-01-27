import { ArboretumStructure } from "../structures/types";

type InputOptionType = "Mermaid" | "GraphViz" | "Test" | "unknown";
export type IRInputType = "gv" | "mmd" | "unknown" | null;

export type ArboretumInput = {
  name: InputOptionType;
  type: IRInputType;
  allowedStructures: ArboretumStructure[];
  examples?: ArboretumInputExamples;
} | null;

export type ArboretumInputExamples = {
  [key: string]: {
    text: string;
    structure: ArboretumStructure;
  };
};
