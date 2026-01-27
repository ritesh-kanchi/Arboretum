/* eslint-disable @typescript-eslint/no-explicit-any */
import { nameFromType } from "@/lib/func";
import { IREdge, IRNode } from "@/lib/structures/interfaces";
import { nodeDiagramGeneration, treeDiagramGeneration } from "@/lib/ir/core";
import {
  IRDiagram,
  IRMetadata,
  ArboretumStructure,
} from "@/lib/structures/types";
import { ClusterStatementASTNode } from "ts-graphviz/ast";

export const graphVizToIR = (
  ast: ClusterStatementASTNode[],
  metadata: IRMetadata,
  structure: ArboretumStructure
): IRDiagram => {
  const meta: IRMetadata = {
    title:
      metadata.title !== "" ? metadata.title : nameFromType(structure!.type),
    type: structure!.type,
    description: metadata.description !== "" ? metadata.description : "",
  };

  let irDiagram: IRDiagram = {
    meta,
  };

  const nodes = ast
    .filter((node: ClusterStatementASTNode) => node.type === "Node")
    .map((node: any) => {
      return {
        id: node.id.value,
        type: node.type,
        text:
          node.children.length > 0
            ? node.children.find((c: any) => c.key.value === "label").value
                .value
            : null,
      };
    });

  const edges = ast
    .filter((node: ClusterStatementASTNode) => node.type === "Edge")
    .map((node: any) => {
      return {
        from: node.targets[0].id.value,
        to: node.targets[1].id.value,
      };
    });

  const { nodes: irNodes, edges: irEdges } = graphVizNodeEdgeConversion(
    nodes,
    edges
  );

  if (!structure || !structure.type) {
    throw new Error("Invalid structure type");
  }

  if (structure.type === "tree" || structure.type === "bt") {
    irDiagram = treeDiagramGeneration(
      irDiagram.meta.type,
      irNodes,
      irEdges,
      meta
    );
  } else if (structure.type === "ll") {
    irDiagram = nodeDiagramGeneration(
      irDiagram.meta.type,
      irNodes,
      irEdges,
      meta
    );
  }

  return irDiagram;
};

const graphVizNodeEdgeConversion = (
  gvVertices: any[],
  gvEdges: any[]
): { nodes: IRNode[]; edges: IREdge[] } => {
  const nodes: IRNode[] = [];
  const edges: IREdge[] = [];

  for (const vertex of gvVertices) {
    const { id, text } = vertex;

    nodes.push({
      id,
      value: text,
    });
  }

  for (const edge of gvEdges) {
    const { from: parent, to: child } = edge;

    edges.push({
      parent,
      child,
    });
  }

  return { nodes, edges };
};
