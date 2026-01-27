import { ArboretumStructure } from "./types";

export const ARBORETUM_STRUCTURES: ArboretumStructure[] = [
  {
    name: "Binary Tree",
    type: "bt",
    information:
      'If a binary tree node has only one child, Arboretum shows it as a left child. To have only a right child, set the left child\'s ID to <code class="code-element">NULL</code>.',
  },
  {
    name: "Tree",
    type: "tree",
    information:
      'You can create empty, invisible nodes by setting the ID to <code class="code-element">NULL</code>. This is useful for creating specific positions in the tree without displaying them.',
  },
  {
    name: "Linked List",
    type: "ll",
  },
  {
    name: "Array",
    type: "arr",
  },
  {
    name: "2D Array",
    type: "2arr",
    information:
      "Elements fill from top to bottom, then left to right, based on the number of columns.",
  },
];
