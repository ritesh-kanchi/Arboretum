"use client";

import { buildPositionTree, buildTree, getNodePosition } from "@/lib/ir/tree";
import { IRTree } from "@/lib/structures/types";
import { IRNode } from "@/lib/structures/interfaces";

import TreeView, { flattenTree, NodeId } from "react-accessible-treeview";
import { IFlatMetadata } from "react-accessible-treeview/dist/TreeView/utils";
import { PHANTOM_NODE_IDS } from "@/lib/constants";

import "./styles.css";

interface ITreeNode<M extends IFlatMetadata = IFlatMetadata> {
  id?: NodeId;
  name: string;
  isBranch?: boolean;
  children?: ITreeNode<M>[];
  metadata?: M;
}

export default function TreeOutput({ tree }: { tree: IRTree }) {
  const builtTree = buildTree(tree);

  if (builtTree === null) {
    return null;
  }

  const treeToFlat = (node: IRNode): ITreeNode<IFlatMetadata> => {
    let data: any = {
      name: node.id,
      metadata: {
        id: node.id,
        value: node.value,
      },
      children:
        node.children && node.children.length > 0
          ? node.children
              .filter(
                (node) => !PHANTOM_NODE_IDS.includes(node.id.toLowerCase()),
              )
              .map((child) => treeToFlat(child))
          : undefined,
    };

    return data;
  };

  const data = flattenTree({
    name: "",
    children: [treeToFlat(builtTree)],
  });

  const positionBuiltTree = buildPositionTree(tree, [125, 125]);
  const positionNodes = positionBuiltTree.descendants();

  const xValues = positionNodes
    .map((n) => n.x)
    .filter((x): x is number => x !== undefined);
  const yValues = positionNodes
    .map((n) => n.y)
    .filter((y): y is number => y !== undefined);

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  const padding = 50;
  const treeWidth = maxX - minX;
  const treeHeight = maxY - minY;

  const offsetX = padding - minX;
  const offsetY = padding - minY;

  return (
    <div className="w-full h-full overflow-auto py-8">
      <div
        className="w-full h-full relative flex items-center justify-center"
        style={{
          minWidth: treeWidth + padding * 2,
          minHeight: treeHeight + padding * 2,
        }}
      >
        <svg
          style={{
            width: treeWidth + padding * 2,
            height: treeHeight + padding * 2,
          }}
          aria-hidden="true"
          className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
              className="fill-zinc-300 dark:fill-zinc-700"
            >
              <polygon points="0 0, 10 3.5, 0 7" />
            </marker>
          </defs>
          {tree.edges
            .filter(
              (edge) =>
                !PHANTOM_NODE_IDS.includes(edge.parent.toLowerCase()) &&
                !PHANTOM_NODE_IDS.includes(edge.child.toLowerCase()),
            )
            .map((edge, index) => {
              const parentNode = positionNodes.find(
                (n: any) => n.data?.id === edge.parent,
              );
              const childNode = positionNodes.find(
                (n: any) => n.data?.id === edge.child,
              );

              if (
                !parentNode ||
                !childNode ||
                !parentNode.data ||
                !childNode.data
              )
                return null;

              const x1 = (parentNode.x ?? 0) + offsetX;
              const y1 = (parentNode.y ?? 0) + offsetY;
              const x2 = (childNode.x ?? 0) + offsetX;
              const y2 = (childNode.y ?? 0) + offsetY;

              return (
                <line
                  key={`edge-${edge.parent}-${edge.child}-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="stroke-zinc-300 dark:stroke-zinc-700"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
        </svg>
        <div
          style={{
            width: treeWidth + padding * 2,
            height: treeHeight + padding * 2,
          }}
        >
          <TreeView
            data={data}
            propagateCollapse={true}
            className="relative"
            aria-label={`${tree.meta.type === "bt" ? "Binary Tree" : "Tree"}`}
            nodeRenderer={({
              element,
              getNodeProps,
              level,
              isSelected,
              isHalfSelected,
              isBranch,
            }) => {
              const hierarchyNode = positionNodes.find(
                (pNode) => pNode.data?.id === element.name,
              );

              if (!hierarchyNode || !hierarchyNode.data) return null;

              const x = (hierarchyNode.x ?? 0) + offsetX;
              const y = (hierarchyNode.y ?? 0) + offsetY;

              return (
                <div
                  {...getNodeProps()}
                  style={{
                    left: x - 48,
                    top: y - 48,
                  }}
                  aria-label={
                    level === 1
                      ? `Root Node : ${element.metadata?.value}`
                      : tree.meta.type === "bt"
                        ? `Node: ${element.metadata?.value}, ${getNodePosition(
                            tree,
                            String(element.metadata?.id ?? ""),
                          )} Child`
                        : `Node: ${element.metadata?.value}`
                  }
                  className={`arbornode outline-0 ring-0 absolute w-24 h-24 bg-white border flex flex-col text-center items-center justify-center border-zinc-200 dark:border-zinc-800 rounded-full dark:bg-zinc-950 dark:text-white`}
                >
                  {element.metadata?.value}
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
