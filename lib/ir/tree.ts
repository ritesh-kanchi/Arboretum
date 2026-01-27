import { hierarchy, HierarchyNode, tree } from "d3-hierarchy";
import { IREdge, IRNode } from "../structures/interfaces";
import { IRTree, IRDiagram, IRMetadata } from "../structures/types";
import { PHANTOM_NODE_IDS } from "../constants";

export const coreToTree = (
  nodes: IRNode[],
  edges: IREdge[],
  meta: IRMetadata
): IRDiagram => {
  // remove duplicate edges
  const uniqueEdges = new Map<string, IREdge>();
  edges.forEach((edge) => {
    const key = `${edge.parent}-${edge.child}`;
    if (!uniqueEdges.has(key)) {
      uniqueEdges.set(key, edge);
    }
  });
  edges = Array.from(uniqueEdges.values());

  // remove duplicate nodes
  const uniqueNodes = new Map<string, IRNode>();
  nodes.forEach((node) => {
    if (!uniqueNodes.has(node.id)) {
      uniqueNodes.set(node.id, node);
    }
  });
  nodes = Array.from(uniqueNodes.values());

  // remove edges that are cycling back to the same node
  edges = edges.filter((edge) => edge.parent !== edge.child);

  // remove nodes that are not connected to any edge
  const connectedNodeIds = new Set(
    edges.map((edge) => edge.parent).concat(edges.map((edge) => edge.child))
  );
  nodes = nodes.filter((node) => connectedNodeIds.has(node.id));

  const diagram: IRTree = {
    meta,
    edges,
    nodes,
  };

  return diagram;
};

export function buildTree(diagram: IRTree): IRNode | null {
  if (!diagram || !diagram.nodes || !diagram.edges) {
    return null;
  }

  // Clone nodes into a map so we can safely mutate children without shared references
  const nodeMap = new Map<string, IRNode>();
  for (const node of diagram.nodes) {
    nodeMap.set(node.id, { ...node, children: [] });
  }

  // Assign children according to edges
  for (const edge of diagram.edges) {
    const parentNode = nodeMap.get(edge.parent);
    const childNode = nodeMap.get(edge.child);

    if (parentNode && childNode) {
      parentNode.children!.push(childNode);
    }
  }

  const root = diagram.nodes.find(
    (node) => !diagram.edges.some((edge) => edge.child === node.id)
  );

  const completedRoot = root ? nodeMap.get(root.id) : null;

  if (completedRoot && diagram.meta.type === "bt") {
    const addNullChildren = (node: IRNode) => {
      if (node.children && node.children.length === 1) {
        node.children.push({ id: "null", value: "", children: [] });
      }
      node.children?.forEach(addNullChildren);
    };
    addNullChildren(completedRoot);
  }

  const addDepth = (node: IRNode | null, currentDepth: number = 0): void => {
    if (!node) return;
    node.depth = currentDepth;
    if (node.children) {
      node.children.forEach((child) => addDepth(child, currentDepth + 1));
    }
  };

  addDepth(completedRoot || null);

  return completedRoot
    ? { ...completedRoot, children: completedRoot.children ?? [] }
    : null;
}

export function unbuildTree(node: IRNode | null, meta: IRMetadata): IRTree {
  if (!node) {
    return {
      meta: meta || { title: "", type: "bt", description: "" },
      edges: [],
      nodes: [],
    };
  }

  const nodes: IRNode[] = [];
  const edges: IREdge[] = [];

  const traverse = (currentNode: IRNode | null, parentId?: string) => {
    if (!currentNode) return;

    nodes.push({ ...currentNode, children: undefined });

    if (parentId) {
      edges.push({
        parent: parentId,
        child: currentNode.id,
      });
    }

    currentNode.children?.forEach((child) => traverse(child, currentNode.id));
  };

  traverse(node);

  return coreToTree(
    nodes,
    edges,
    meta || { title: "", type: "bt", description: "" }
  ) as IRTree;
}

export function getTreeDetails(tree: IRNode | null): {
  depth: number;
  breadth: number;
  nodeCount: number;
} {
  if (!tree) {
    return { depth: 0, breadth: 0, nodeCount: 0 };
  }

  let depth = 0;
  let nodeCount = 0;
  const breadthMap = new Map<number, number>();

  const visited = new Set<string>();

  function traverse(node: IRNode | null, currentDepth: number) {
    if (!node || visited.has(node.id)) return;

    visited.add(node.id);
    nodeCount++;
    depth = Math.max(depth, currentDepth);
    breadthMap.set(currentDepth, (breadthMap.get(currentDepth) || 0) + 1);

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        traverse(child, currentDepth + 1);
      }
    }
  }

  traverse(tree, 1);
  const breadth = Math.max(...breadthMap.values());

  return { depth, breadth, nodeCount };
}

export function buildPositionTree(
  diagram: IRTree,
  nodeSize: [number, number] = [100, 100]
): HierarchyNode<IRNode | null> {
  const builtTree = buildTree(diagram);
  const structured = hierarchy<IRNode | null>(builtTree);

  const layout = tree<IRNode | null>().nodeSize(nodeSize)(structured);

  return layout;
}

// Tree traversal algorithms
export const traverseInOrder = (
  node: IRNode | null,
  result: IRNode[] = []
): IRNode[] => {
  if (!node || node.id === "null") return result;

  // For binary trees: left, root, right
  if (node.children && node.children.length > 0) {
    traverseInOrder(node.children[0], result); // left child
  }
  result.push(node); // visit root
  if (node.children && node.children.length > 1) {
    traverseInOrder(node.children[1], result); // right child
  }

  return result;
};

export const traversePreOrder = (
  node: IRNode | null,
  result: IRNode[] = []
): IRNode[] => {
  if (!node || node.id === "null") return result;

  // Root, left, right
  result.push(node); // visit root first
  if (node.children) {
    for (const child of node.children) {
      traversePreOrder(child, result);
    }
  }

  return result;
};

export const traversePostOrder = (
  node: IRNode | null,
  result: IRNode[] = []
): IRNode[] => {
  if (!node || node.id === "null") return result;

  // Left, right, root
  if (node.children) {
    for (const child of node.children) {
      traversePostOrder(child, result);
    }
  }
  result.push(node); // visit root last

  return result;
};

export const getNodePosition = (diagram: IRTree, nodeId: string) => {
  if (
    diagram.meta.type !== "bt" ||
    PHANTOM_NODE_IDS.includes(nodeId.toLowerCase())
  ) {
    return "N/A";
  }

  const edge = diagram.edges.find((edge) => edge.child === nodeId);
  if (!edge || diagram.meta.type !== "bt") return "Root";

  const parentEdges = diagram.edges.filter(
    (e) => e.parent === edge.parent && e.child !== "null"
  );
  if (parentEdges.length === 1) return "Left";

  // Use the order in which edges appear (insertion order)
  const nodeIndex = parentEdges.findIndex((e) => e.child === nodeId);

  return nodeIndex === 0 ? "Left" : "Right";
};
