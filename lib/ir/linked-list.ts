import { IREdge, IRNode } from "../structures/interfaces";
import { IRLinkedList, IRDiagram, IRMetadata } from "../structures/types";

export const coreToLinkedList = (
  meta: IRMetadata,
  nodes: IRNode[]
): IRDiagram => {
  const diagram: IRLinkedList = {
    meta,
    nodes: nodes,
  };

  return diagram;
};

export function getEdgesFromLinkedList(diagram: IRLinkedList): IREdge[] {
  let edges: IREdge[] = [];

  for (let i = 0; i < diagram.nodes.length - 1; i++) {
    edges.push({
      parent: diagram.nodes[i].id,
      child: diagram.nodes[i + 1].id,
      index: i,
    });
  }

  return edges;
}
