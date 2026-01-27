import { PHANTOM_NODE_IDS } from "../constants";
import { IRArrayElement, IREdge, IRNode } from "../structures/interfaces";
import {
  IRTree,
  IRDiagram,
  IRMetadata,
  IRDataStructureType,
  IRLinkedList,
  IRArray,
} from "../structures/types";
import { coreTo2DArray, coreToArray } from "./arr";
import { coreToLinkedList, getEdgesFromLinkedList } from "./linked-list";
import { coreToTree } from "./tree";

export const nodeDiagramGeneration = (
  type: IRDataStructureType,
  nodes: IRNode[],
  edges: IREdge[],
  meta: IRMetadata
): IRDiagram => {
  switch (type) {
    case "ll":
      return coreToLinkedList(meta, nodes);
    default:
      break;
  }

  return {
    meta,
  };
};

export const treeDiagramGeneration = (
  type: IRDataStructureType,
  nodes: IRNode[],
  edges: IREdge[],
  meta: IRMetadata
): IRDiagram => {
  switch (type) {
    case "bt":
    case "tree":
      return coreToTree(nodes, edges, meta);
    default:
      break;
  }

  return {
    meta,
  };
};

export const elementDiagramGeneration = (
  type: IRDataStructureType,
  elements: IRArrayElement[],
  meta: IRMetadata
): IRDiagram => {
  switch (type) {
    case "arr":
      return coreToArray(elements, meta);
    case "2arr":
      return coreTo2DArray(elements, meta);
    default:
      break;
  }

  return {
    meta,
  };
};

export function GetNodes(generatedIR: IRDiagram) {
  if (generatedIR == null) {
    return null;
  }
  if (generatedIR.meta.type === "tree" || generatedIR.meta.type === "bt") {
    return (generatedIR as IRTree).nodes?.filter(
      (node) => !PHANTOM_NODE_IDS.includes(node.id.toLowerCase())
    ).length;
  } else if (generatedIR.meta.type === "ll") {
    return (generatedIR as IRLinkedList).nodes.length;
  }
  return null;
}

export function GetEdges(generatedIR: IRDiagram) {
  if (generatedIR == null) {
    return null;
  }
  if (generatedIR.meta.type === "tree" || generatedIR.meta.type === "bt") {
    return (generatedIR as IRTree).edges?.filter(
      (edge) =>
        !PHANTOM_NODE_IDS.includes(edge.child.toLowerCase()) &&
        !PHANTOM_NODE_IDS.includes(edge.parent.toLowerCase())
    ).length;
  } else if (generatedIR.meta.type === "ll") {
    return getEdgesFromLinkedList(generatedIR as IRLinkedList).length;
  }
  return null;
}

export function GetElements(generatedIR: IRDiagram) {
  if (generatedIR == null) {
    return null;
  }

  if (generatedIR.meta.type === "arr") {
    return {
      elements: (generatedIR as IRArray).elements.length,
    };
  } else if (generatedIR.meta.type === "2arr") {
    return {
      rows: (generatedIR as IRArray).elements.length,
      columns: (generatedIR as IRArray).elements[0].children!.length,
    };
  }

  return null;
}
