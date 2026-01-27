import { IRInputType } from "./inputs/types";
import { IROutputType } from "./outputs/types";
import { IRDataStructureType } from "./structures/types";

export type ArboretumMode = "Preview" | "Embed" | "Editor" | "Study";

// A transportable type for everything that is needed to generate a diagram
export type ArboretumDiagram = {
  title?: string;
  description?: string;
  timestamp?: Date;
  inputType: IRInputType;
  structureType: IRDataStructureType;
  outputType: IROutputType;
  inputText: string;
};

export type TreeTraversalType = "in" | "pre" | "post";
