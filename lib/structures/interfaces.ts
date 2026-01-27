export interface IRNode {
  id: string; // or string, depending on your node identifiers
  value: string; // the value the node holds
  styles?: string[]; // styles to apply to the node
  labelType?: string; // type of label
  shapeType?: string; // shape of the node
  children?: IRNode[]; // children of the node
  parent?: IRNode | null; // parent of the node
  depth?: number; // depth of the node in the tree
}

export interface IREdge {
  parent: string; // ID of the parent node
  child: string; // ID of the child node
  index?: number; // index of the child in the parent's children array
  text?: string; // text to display on the edge
  labelType?: string; // type of label
  edgeType?: string; // shape of the edge
}

export interface IRArrayElement {
  id: string; // or string, depending on your node identifiers
  value: string; // the value the node holds
  shapeType?: string; // shape of the node
  children?: IRArrayElement[]; // children of the node
}
