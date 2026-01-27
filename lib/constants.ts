import { TreeTraversalType } from "./types";

export const PHANTOM_NODE_IDS = ["null"];

export const TREE_TRAVERSAL_ALGORITHMS: {
  name: string;
  value: TreeTraversalType;
}[] = [
  { name: "Pre-order", value: "pre" },
  { name: "In-order", value: "in" },
  { name: "Post-order", value: "post" },
];
