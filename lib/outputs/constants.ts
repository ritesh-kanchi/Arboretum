import { ARBORETUM_STRUCTURES } from "../structures/constants";
import { ArboretumOutput } from "./types";

export const ARBORETUM_OUTPUTS: ArboretumOutput[] = [
  {
    name: "Navigable",
    type: "html",
    allowedStructures: ARBORETUM_STRUCTURES,
    information:
      "HTML structure underpinned by screen reader-friendly interactive elements.",
  },
  {
    name: "Navigable / Tabular",
    type: "html-table",
    allowedStructures: [ARBORETUM_STRUCTURES[0], ARBORETUM_STRUCTURES[3]],
    information:
      "A combination of the Navigable and Tabular outputs, allowing for joint exploration.",
  },
  {
    name: "Tabular",
    type: "table",
    allowedStructures: ARBORETUM_STRUCTURES,
    information:
      "A screen reader-friendly table representation of the data structure.",
  },
  {
    name: "Tactile",
    type: "tact",
    allowedStructures: ARBORETUM_STRUCTURES,
    information:
      "Tactile rendering only supports elements with positive, integer values. Large numbers may not fit within the tactile representation.",
  },
  {
    name: "Mermaid",
    type: "mmd",
    allowedStructures: ARBORETUM_STRUCTURES,
    information:
      "A diagram generated using the Mermaid syntax, viewable in compatible editors.",
  },
];
