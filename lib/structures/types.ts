import { IRArrayElement, IREdge, IRNode } from "./interfaces";

export type IRMetadata = {
  title: string;
  type: IRDataStructureType;
  description: string;
};

export type IRDataStructureType =
  | "bt"
  | "ll"
  | "arr"
  | "2arr"
  | "tree"
  | "unknown"
  | null;

export type ArboretumStructure = {
  name: string;
  type: IRDataStructureType;
  alternativeTypes?: string[];
  information?: string;
} | null;

export type IRDiagram = IRBareDiagram | IRLinkedList | IRArray | IRTree | null;

export type IRBareDiagram = {
  meta: IRMetadata;
};

export type IRLinkedList = IRBareDiagram & {
  nodes: IRNode[];
};

export type IRArray = IRBareDiagram & { elements: IRArrayElement[] };

export type IRTree = IRBareDiagram & {
  edges: IREdge[];
  nodes: IRNode[];
};
