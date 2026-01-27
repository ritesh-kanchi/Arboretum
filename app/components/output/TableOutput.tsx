import {
  IRDiagram,
  IRArray,
  IRTree,
  IRLinkedList,
} from "@/lib/structures/types";
import { ArboretumMode } from "@/lib/types";
import { UnsupportedPreview, UnavailableOutput } from "./UnsupportedPreview";
import { PHANTOM_NODE_IDS } from "@/lib/constants";
import { buildTree, getNodePosition, traversePreOrder } from "@/lib/ir/tree";
import React from "react";

export default function TableOutput({
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
  ) : // <div className="w-full">
  type === "ll" ? (
    <LinkedListRenderer diagram={diagram as IRLinkedList} />
  ) : type === "arr" ? (
    <ArrayRenderer array={diagram as IRArray} />
  ) : type === "2arr" ? (
    <TwoDArrayRenderer array={diagram as IRArray} />
  ) : type === "tree" || type === "bt" ? (
    <TreeRenderer diagram={diagram as IRTree} />
  ) : (
    <UnavailableOutput text="This diagram type is not supported in Table output." />
  );
  // </div>
}

function Ltd({
  children,
  id,
  data,
}: {
  children: React.ReactNode;
  id?: string;
  data?: any;
}) {
  return <td>{children}</td>;
}

function TreeRenderer({ diagram }: { diagram: IRTree }) {
  // Preorder table
  // const filteredNodes = (
  //   diagram.meta.type === "bt"
  //     ? traversePreOrder(buildTree(diagram))
  //     : diagram.nodes
  // ).filter((node) => !PHANTOM_NODE_IDS.includes(node.id.toLowerCase()));

  const filteredNodes = diagram.nodes.filter(
    (node) => !PHANTOM_NODE_IDS.includes(node.id.toLowerCase()),
  );
  const filteredEdges = diagram.edges.filter(
    (edge) =>
      !PHANTOM_NODE_IDS.includes(edge.child.toLowerCase()) &&
      !PHANTOM_NODE_IDS.includes(edge.parent.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Nodes</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Value</th>
              <th>Parent</th>
              {diagram.meta.type === "bt" ? (
                <>
                  <th>Position</th>
                  <th>Left Child</th>
                  <th>Right Child</th>
                </>
              ) : (
                <th>Children</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredNodes.map((node, i) => {
              const parent = filteredEdges.find(
                (edge) => edge.child === node.id,
              )?.parent;

              let leftChild = null,
                rightChild = null;

              if (diagram.meta.type === "bt") {
                leftChild = filteredEdges
                  .filter((edge) => edge.parent === node.id)
                  .map((edge) => edge.child)[0];
                rightChild = filteredEdges
                  .filter((edge) => edge.parent === node.id)
                  .map((edge) => edge.child)[1];
              }

              return (
                <tr key={node.id} id={node.id}>
                  <Ltd
                    id={`tree-value-${i}`}
                    data={{
                      col: "value",
                      value: node.value,
                    }}
                  >
                    {node.value}
                  </Ltd>
                  <Ltd
                    id={`tree-parent-${i}`}
                    data={{
                      col: "parent",
                      value:
                        diagram.nodes.find((n) => n.id === parent)?.value ??
                        "None",
                    }}
                  >
                    {diagram.nodes.find((n) => n.id === parent)?.value ??
                      "None"}
                  </Ltd>
                  {diagram.meta.type === "bt" ? (
                    <>
                      <Ltd
                        id={`tree-position-${i}`}
                        data={{
                          col: "position",
                          value: getNodePosition(diagram, node.id),
                        }}
                      >
                        {getNodePosition(diagram, node.id)}
                      </Ltd>
                      <Ltd
                        id={`tree-left-child-${i}`}
                        data={{
                          col: "left child",
                          value:
                            diagram.nodes.find((n) => n.id === leftChild)
                              ?.value ?? "None",
                        }}
                      >
                        {diagram.nodes.find((n) => n.id === leftChild)?.value ??
                          "None"}
                      </Ltd>
                      <Ltd
                        id={`tree-right-child-${i}`}
                        data={{
                          col: "right child",
                          value:
                            diagram.nodes.find((n) => n.id === rightChild)
                              ?.value ?? "None",
                        }}
                      >
                        {diagram.nodes.find((n) => n.id === rightChild)
                          ?.value ?? "None"}
                      </Ltd>
                    </>
                  ) : (
                    <Ltd
                      id={`tree-children-${i}`}
                      data={{
                        col: "children",
                        value:
                          diagram.edges
                            .filter((edge) => edge.parent === node.id)
                            .map((edge) => edge.child)
                            .join(", ") || "None",
                      }}
                    >
                      {diagram.edges
                        .filter((edge) => edge.parent === node.id)
                        .map((edge) => edge.child)
                        .join(", ") || "None"}
                    </Ltd>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LinkedListRenderer({ diagram }: { diagram: IRLinkedList }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Nodes</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Position</th>
              <th>Value</th>
              <th>Next Element</th>
            </tr>
          </thead>
          <tbody>
            {diagram.nodes.map((node, index) => (
              <tr key={index}>
                <Ltd>{index + 1}</Ltd>
                <Ltd>{node.value}</Ltd>
                <Ltd>{diagram.nodes[index + 1]?.value ?? "None"}</Ltd>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ArrayRenderer({ array }: { array: IRArray }) {
  return (
    <div className="w-full space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Array Elements</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Index</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {array.elements.map((element, index) => (
                <tr key={element.id} id={element.id}>
                  <Ltd
                    id={`arr-index-${index}`}
                    data={{ col: "index", value: index }}
                  >
                    {index}
                  </Ltd>
                  <Ltd
                    id={`arr-value-${index}`}
                    data={{ col: "value", value: element.value }}
                  >
                    {element.value}
                  </Ltd>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TwoDArrayRenderer({ array }: { array: IRArray }) {
  return (
    <div className="w-full space-y-8">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">2D Array Elements</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Row</th>
                <th>Col</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {array.elements.map((element, index) =>
                element.children?.map((child, j) => (
                  <tr key={j}>
                    <Ltd>{index}</Ltd>
                    <Ltd>{j}</Ltd>
                    <Ltd>{child.value}</Ltd>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
