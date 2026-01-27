import { ARBORETUM_STRUCTURES } from "../structures/constants";
import {
  GRAPHVIZ_BT_EXAMPLE,
  GRAPHVIZ_LL_EXAMPLE,
  GRAPHVIZ_TREE_EXAMPLE,
} from "./graphviz/constants";
import {
  MERMAID_ARR_EXAMPLE,
  MERMAID_BT_EXAMPLE,
  MERMAID_LL_EXAMPLE,
  MERMAID_TREE_EXAMPLE,
  MERMAID_TWO_ARR_EXAMPLE,
} from "./mermaid/constants";
import { ArboretumInput } from "./types";

export const ARBORETUM_INPUTS: ArboretumInput[] = [
  {
    name: "GraphViz",
    type: "gv",
    allowedStructures: [
      ARBORETUM_STRUCTURES[0],
      ARBORETUM_STRUCTURES[1],
      ARBORETUM_STRUCTURES[2],
    ],
    examples: {
      bt: {
        text: GRAPHVIZ_BT_EXAMPLE,
        structure: ARBORETUM_STRUCTURES[0],
      },
      tree: {
        text: GRAPHVIZ_TREE_EXAMPLE,
        structure: ARBORETUM_STRUCTURES[1],
      },
      ll: {
        text: GRAPHVIZ_LL_EXAMPLE,
        structure: ARBORETUM_STRUCTURES[2],
      },
    },
  },
  {
    name: "Mermaid",
    type: "mmd",
    allowedStructures: [...ARBORETUM_STRUCTURES],
    examples: {
      bt: {
        text: MERMAID_BT_EXAMPLE,
        structure: ARBORETUM_STRUCTURES[0],
      },
      tree: {
        text: MERMAID_TREE_EXAMPLE,
        structure: ARBORETUM_STRUCTURES[1],
      },
      ll: {
        text: MERMAID_LL_EXAMPLE,
        structure: ARBORETUM_STRUCTURES[2],
      },
      arr: {
        text: MERMAID_ARR_EXAMPLE,
        structure: ARBORETUM_STRUCTURES[3],
      },
      "2arr": {
        text: MERMAID_TWO_ARR_EXAMPLE,
        structure: ARBORETUM_STRUCTURES[4],
      },
    },
  },
];
