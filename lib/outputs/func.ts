import { PHANTOM_NODE_IDS } from "../constants";
import { outputFromType } from "../func";
import {
  IRArray,
  IRDataStructureType,
  IRDiagram,
  IRLinkedList,
  IRTree,
} from "../structures/types";
import { IROutputType } from "./types";

export function generateLinkedListDescription(diagram: IRLinkedList): string {
  return `This linked list contains ${
    diagram.nodes.length
  } nodes. The head node is ${diagram.nodes[0].value}, and the tail node is ${
    diagram.nodes[diagram.nodes.length - 1].value
  }.`;
}

export function generateTreeDescription(diagram: IRTree): string {
  const filteredNodes = diagram.nodes.filter(
    (n) => !PHANTOM_NODE_IDS.includes(n.id.toLowerCase())
  );
  const filteredEdges = diagram.edges.filter(
    (e) =>
      !PHANTOM_NODE_IDS.includes(e.child.toLowerCase()) &&
      !PHANTOM_NODE_IDS.includes(e.parent.toLowerCase())
  );

  return `This ${diagram.meta.type === "bt" ? "binary " : ""}
  tree contains ${filteredNodes.length} nodes and ${
    filteredEdges.length
  } edges. The root node is ${filteredNodes[0].value}.`;
}

export function generateArrayDescription(diagram: IRArray): string {
  if (diagram.meta.type === "2arr") {
    const firstRow = diagram.elements[0];
    const columns =
      firstRow && Array.isArray(firstRow.children)
        ? firstRow.children.length
        : 0;
    return `This 2D array is arranged in a grid of ${diagram.elements.length} rows and ${columns} columns.`;
  }

  return `This array contains ${
    diagram.elements.length
  } elements. The first element is ${
    diagram.elements[0].value
  }, and the last element is ${
    diagram.elements[diagram.elements.length - 1].value
  }.`;
}

export const autoDescription = (diagram: IRDiagram) => {
  switch (diagram!.meta.type) {
    case "ll":
      return generateLinkedListDescription(diagram as IRLinkedList);
    case "bt":
    case "tree":
      return generateTreeDescription(diagram as IRTree);
    case "arr":
    case "2arr":
      return generateArrayDescription(diagram as IRArray);
    default:
      return "";
  }
};

export const outputAllowsStructure = (
  ouputType?: IROutputType,
  structureType?: IRDataStructureType
): boolean => {
  if (!ouputType || !structureType) return false;

  const output = outputFromType(ouputType as string);
  if (!output || !output.allowedStructures) return false;

  return output?.allowedStructures.some((s) => s?.type === structureType);
};
