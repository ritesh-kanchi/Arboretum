/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  IRDiagram,
  IRMetadata,
  ArboretumStructure,
} from "@/lib/structures/types";

import { checkFunctionValidity, nameFromType } from "../../func";

import { IRNode, IREdge, IRArrayElement } from "../../structures/interfaces";
import {
  elementDiagramGeneration,
  nodeDiagramGeneration,
  treeDiagramGeneration,
} from "../../ir/core";
import { MermaidBlock, MermaidEdge, MermaidVertice } from "./types";

export const mermaidToIR = (
  parser: any,
  metadata: IRMetadata,
  structure: ArboretumStructure
): IRDiagram => {
  let title: string =
    metadata.title !== "" ? metadata.title : nameFromType(structure!.type);
  let description: string =
    metadata.description !== "" ? metadata.description : "";

  if (checkFunctionValidity(parser.getAccTitle)) {
    title = parser.getAccTitle();
  } else if (checkFunctionValidity(parser.getDiagramTitle)) {
    title = parser.getDiagramTitle();
  }

  if (title == "") {
    title =
      metadata.title !== "" ? metadata.title : nameFromType(structure!.type);
  }

  title = title.trim();

  if (checkFunctionValidity(parser.getAccDescription)) {
    description = parser.getAccDescription();
  } else if (checkFunctionValidity(parser.getDiagramDescription)) {
    description = parser.getDiagramDescription();
  }

  if (description == "") {
    description = metadata.description !== "" ? metadata.description : "";
  }

  if (description == "" && title == "") {
    title =
      metadata.title !== "" ? metadata.title : nameFromType(structure!.type);
  }

  const meta: IRMetadata = {
    title,
    type: structure!.type,
    description,
  };

  let irDiagram: IRDiagram = {
    meta,
  };

  switch (structure?.type) {
    case "ll":
      const vertices: MermaidVertice[] = Array.from(
        parser.getVertices(),
        ([name, value]) => ({
          name,
          value,
        })
      );
      const edges: MermaidEdge[] = parser.getEdges();

      const { nodes: irNodes, edges: irEdges } = mermaidNodeEdgeConversion(
        vertices,
        edges
      );

      irDiagram = nodeDiagramGeneration(
        irDiagram.meta.type,
        irNodes,
        irEdges,
        meta
      );

      break;
    case "arr":
    case "2arr":
      let blocks: MermaidBlock[] = parser.getBlocksFlat();
      let columns: number = -1;

      if (blocks[0].columns !== -1 && blocks[0].columns !== 1) {
        columns = blocks[0].columns;
        irDiagram.meta.type = "2arr";
      } else {
        columns = 1;
        irDiagram.meta.type = "arr";
      }
      blocks = blocks.slice(1);

      if (columns >= blocks.length) {
        columns = 1;
        irDiagram.meta.type = "arr";
      }

      const elements: IRArrayElement[] = mermaidBlockConversion(
        blocks,
        columns
      );

      irDiagram = elementDiagramGeneration(irDiagram.meta.type, elements, meta);

      break;
    case "tree":
    case "bt":
      const treeVertices: MermaidVertice[] = Array.from(
        parser.getVertices(),
        ([name, value]) => ({
          name,
          value,
        })
      );

      const treeEdges: MermaidEdge[] = parser.getEdges();

      const { nodes: irTreeNodes, edges: irTreeEdges } = mermaidTreeConversion(
        treeVertices,
        treeEdges
      );

      irDiagram = treeDiagramGeneration(
        irDiagram.meta.type,
        irTreeNodes,
        irTreeEdges,
        meta
      );

      break;
    default:
  }

  return irDiagram;
};

const mermaidNodeEdgeConversion = (
  merVertices: MermaidVertice[],
  merEdges: MermaidEdge[]
): { nodes: IRNode[]; edges: IREdge[] } => {
  const nodes: IRNode[] = [];
  const edges: IREdge[] = [];

  for (const vertex of merVertices) {
    const { labelType, text, styles, type: shapeType } = vertex.value;

    nodes.push({
      id: vertex.name,
      value: text,
      labelType,
      shapeType,
      styles,
    });
  }

  for (const edge of merEdges) {
    const { start: parent, end: child, labelType, text, type: edgeType } = edge;

    edges.push({
      parent,
      child,
      edgeType,
      labelType,
    });
  }

  return {
    nodes,
    edges,
  };
};

const mermaidBlockConversion = (
  merBlocks: MermaidBlock[],
  columns: number
): IRArrayElement[] => {
  const elements: IRArrayElement[] = [];
  if (columns === 1) {
    for (const block of merBlocks) {
      const { id, label, type: shapeType } = block;

      elements.push({
        id,
        value: label,
        shapeType,
      });
    }
  } else {
    const elementsPerRow = columns;
    const rows = Math.ceil(merBlocks.length / elementsPerRow);

    for (let i = 0; i < rows; i++) {
      const rowElements = merBlocks.slice(
        i * elementsPerRow,
        i * elementsPerRow + elementsPerRow
      );

      const row: IRArrayElement = {
        id: `row-${i}`,
        value: i.toString(),
        shapeType: "row",
        children: [],
      };

      for (const block of rowElements) {
        const { id, label, type: shapeType } = block;

        if (!row.children) {
          row.children = [];
        }

        row.children.push({
          id,
          value: label,
          shapeType,
        });
      }

      elements.push(row);
    }
  }

  return elements;
};

const mermaidTreeConversion = (
  merVertices: MermaidVertice[],
  merEdges: MermaidEdge[]
): { nodes: IRNode[]; edges: IREdge[] } => {
  let nodes: IRNode[] = [];
  let edges: IREdge[] = [];

  for (const vertex of merVertices) {
    const { labelType, text, styles, type: shapeType } = vertex.value;

    nodes.push({
      id: vertex.name,
      value: text,
      labelType,
      shapeType,
      styles,
      children: [],
    });
  }

  for (const edge of merEdges) {
    const { start: parent, end: child, labelType, text, type: edgeType } = edge;

    edges.push({
      parent,
      child,
      index: edges.filter((e) => e.parent === parent).length,
      text,
      edgeType,
      labelType,
    });
  }

  return {
    nodes,
    edges,
  };
};
