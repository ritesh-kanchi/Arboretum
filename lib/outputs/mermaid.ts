import { PHANTOM_NODE_IDS } from "../constants";
import { IRNode } from "../structures/interfaces";
import { buildTree } from "../ir/tree";
import { IRArray, IRDiagram, IRLinkedList, IRTree } from "../structures/types";

export const IRToMermaid = (diagram: IRDiagram): string => {
  if (diagram !== null) {
    switch (diagram?.meta.type) {
      case "ll":
        return IRToLinkedListMermaid(diagram as IRLinkedList);
      case "arr":
        return IRToArrayMermaid(diagram as IRArray);
      case "2arr":
        return IRTo2DArrayMermaid(diagram as IRArray);
      case "bt":
      case "tree":
        return IRToTreeMermaid(diagram as IRTree);
      default:
        return "No support for this diagram type yet";
    }
  }

  return "";
};

const getNodeShapeStyles = (
  shapeType: string
): {
  start: string;
  end: string;
} => {
  switch (shapeType) {
    case "circle":
      return {
        start: "((",
        end: "))",
      };
    case "round":
      return {
        start: "(",
        end: ")",
      };
    case "cylinder":
      return {
        start: "[(",
        end: ")]",
      };
    case "subroutine":
      return {
        start: "[[",
        end: "]]",
      };
    default:
      return {
        start: "[",
        end: "]",
      };
  }
};

const IRToTreeMermaid = (diagram: IRTree): string => {
  const description = diagram?.meta.description
    ? diagram.meta.description.replace(/\n/g, "\\n")
    : "";

  let text = `flowchart TD
  accTitle: ${diagram?.meta.title}${
    description && description !== "" ? `\naccDescr: ${description}` : ""
  }
`;

  const hasPhantomNodes = diagram.nodes.some((node: IRNode) =>
    PHANTOM_NODE_IDS.includes(node.id.toLowerCase())
  );

  const root = buildTree(diagram);

  const endStyles: string[] = [];
  // let addHiddenStyle = hasPhantomNodes;

  const queue = [root];
  let node: IRNode | null | undefined;
  let i = 0;
  while (queue.length > 0) {
    node = queue.shift();
    if (node) {
      if (root == node) {
        const shapeStyles = getNodeShapeStyles(node.shapeType ?? "circle");
        text += `\t${node.id}${shapeStyles.start}${node.value}${shapeStyles.end}\n`;
      }

      if (node.children) {
        if (node.children.length === 1 && diagram.meta.type === "bt") {
          // addHiddenStyle = true;
          const child = node.children[0];
          const shapeStyles = getNodeShapeStyles(child.shapeType ?? "circle");
          text += `\t${node.id} --> ${child.id}${shapeStyles.start}${child.value}${shapeStyles.end}\n`;
          text += `\t${node.id} --> NULL:::hidden\n`;
          endStyles.push(
            `linkStyle ${
              countInstancesOf(text, "-->") - 1
            } fill:none,stroke:none;`
          );
          queue.push(child);
        } else {
          for (const child of node.children) {
            const shapeStyles = getNodeShapeStyles(child.shapeType ?? "circle");

            // if (diagram.meta.type === "bt") {
            if (PHANTOM_NODE_IDS.includes(child.id.toLowerCase())) {
              text += `\t${node.id} --> ${child.id}:::hidden\n`;
              endStyles.push(
                `linkStyle ${
                  countInstancesOf(text, "-->") - 1
                } fill:none,stroke:none;`
              );
            } else {
              text += `\t${node.id} --> ${child.id}${shapeStyles.start}${child.value}${shapeStyles.end}\n`;
            }
            // } else {
            //   text += `\t${node.id} --> ${child.id}${shapeStyles.start}${child.value}${shapeStyles.end}\n`;
            // }
            queue.push(child);
          }
        }
      }
      i += 1;
    }
  }

  if (endStyles.length > 0) {
    text += `\n${endStyles.join("\n")}`;
  }
  return text;
};

function countInstancesOf(text: string, search: string): number {
  return text.split(search).length - 1;
}

const IRToLinkedListMermaid = (diagram: IRLinkedList): string => {
  let diagramText = "";

  for (let i = 0; i < diagram.nodes.length; i++) {
    const node = diagram.nodes[i];
    const shapeStyles = getNodeShapeStyles(node.shapeType ?? "circle");
    diagramText += `${node.id}${shapeStyles.start}${node.value}${shapeStyles.end}`;
    if (i < diagram.nodes.length - 1) {
      diagramText += ` --> `;
    }
  }

  let text = `flowchart LR
  accTitle: ${diagram.meta.title}${
    diagram?.meta.description ? `\naccDescr: ${diagram?.meta.description}` : ""
  }
  ${diagramText}
`;

  return text;
};

const IRToArrayMermaid = (diagram: IRArray): string => {
  let text = `block-beta\n`;

  for (const element of diagram.elements) {
    text += ` ${element.id}["${element.value}"]`;
  }

  return text;
};

const IRTo2DArrayMermaid = (diagram: IRArray): string => {
  let text = "";
  let columns = 0;

  for (const element of diagram.elements) {
    let curColumn = 0;
    if (element.children) {
      for (const child of element.children) {
        text += ` ${child.id}["${child.value}"]`;
        curColumn += 1;
      }
    }
    text += `\n`;
    columns = Math.max(columns, curColumn);
  }

  text = `block-beta\ncolumns ${columns}\n` + text;

  return text;
};
