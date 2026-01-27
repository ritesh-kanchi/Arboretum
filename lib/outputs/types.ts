import { ArboretumStructure } from "../structures/types";

export type IROutputType =
  | "html"
  | "mmd"
  | "table"
  | "tact"
  | "rflow"
  | "unknown"
  | "ordering"
  | "html-table"
  | null;

export type ArboretumOutput = {
  name: string;
  type: IROutputType;
  allowedStructures: ArboretumStructure[];
  information?: string;
} | null;
