import { IRDiagram, IRTree, IRLinkedList } from "@/lib/structures/types";
import { ArboretumMode } from "@/lib/types";
import { UnavailableOutput, UnsupportedPreview } from "./UnsupportedPreview";
import { IRNode } from "@/lib/structures/interfaces";
import { hierarchy, tree } from "d3-hierarchy";

import {
  ReactFlow,
  Handle,
  Position,
  NodeProps,
  NodeTypes,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { buildTree } from "@/lib/ir/tree";
import { PHANTOM_NODE_IDS } from "@/lib/constants";
import { getEdgesFromLinkedList } from "@/lib/ir/linked-list";

export default function ReactFlowRenderer({
  diagram,
  mode,
  url,
}: {
  diagram: IRDiagram;
  mode: ArboretumMode;
  url?: string;
}) {
  if (!diagram) {
    return null;
  }

  const { type } = diagram!.meta;

  return mode == "Embed" ? (
    <UnsupportedPreview url={url} />
  ) : type === "ll" ? (
    <LinkedListRenderer diagram={diagram as IRLinkedList} />
  ) : type === "tree" || type === "bt" ? (
    <TreeRenderer tree={diagram as IRTree} />
  ) : (
    <UnavailableOutput text="This diagram type is not supported in React Flow." />
  );
}

function LinkedListRenderer({ diagram }: { diagram: IRLinkedList }) {
  return (
    <div className="w-full h-96 md:h-full relative border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <ReactFlow
        nodes={diagram.nodes.map((node, i) => ({
          id: node.id,
          position: { x: i * 100, y: 0 },
          data: { label: node.value, id: node.id },
          type: "circle",
        }))}
        edges={getEdgesFromLinkedList(diagram).map((edge, i) => ({
          source: edge.parent,
          target: edge.child,
          id: `e-${edge.parent}-${edge.child}-${i}`,
          type: "default",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }))}
        fitView
        nodesDraggable={false}
        elementsSelectable={false}
        nodeTypes={
          {
            circle: ListCircleNode,
          } as NodeTypes
        }
      />
    </div>
  );
}

function ListCircleNode({ data }: NodeProps) {
  return (
    <div className="w-16 h-16 bg-white dark:bg-black border border-black dark:border-white rounded-full flex items-center justify-center text-sm font-semibold text-black dark:text-white">
      {typeof data.label === "string"
        ? data.label
        : String(data.label ?? "N/A")}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

function TreeCircleNode({ data }: NodeProps) {
  if (PHANTOM_NODE_IDS.includes(String(data.id).toLowerCase())) {
    return null;
  }

  return (
    <div className="w-16 h-16 bg-white dark:bg-black border border-black dark:border-white rounded-full flex items-center justify-center text-sm font-semibold text-black dark:text-white">
      {typeof data.label === "string"
        ? data.label
        : String(data.label ?? "N/A")}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function TreeRenderer({ tree }: { tree: IRTree }) {
  const builtTree = buildTree(tree);

  if (!builtTree) {
    return (
      <div>
        <p className="text-zinc-500">
          Unable to render tree: invalid or empty tree data.
        </p>
      </div>
    );
  }

  const { nodes, edges } = buildReactFlowFromTree(builtTree);

  return (
    <div className="w-full h-96 md:h-full relative border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        elementsSelectable={false}
        nodeTypes={
          {
            circle: TreeCircleNode,
          } as NodeTypes
        }
      />
    </div>
  );
}

function buildReactFlowFromTree(root: IRNode) {
  const rootNode = hierarchy<IRNode>(root);
  const layout = tree<IRNode>().nodeSize([100, 100])(rootNode);

  const rfNodes = layout.descendants().map((d) => ({
    id: d.data.id,
    position: { x: d.x, y: d.y },
    data: { label: d.data.value, id: d.data.id },
    type: "circle",
  }));
  const rfEdges = layout.links().map((link, i) => ({
    id: `e-${link.source.data.id}-${link.target.data.id}`,
    source: link.source.data.id,
    target: link.target.data.id,
    type: "default",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  }));

  return { nodes: rfNodes, edges: rfEdges };
}
