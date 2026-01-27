import {
  IRDiagram,
  IRArray,
  IRTree,
  IRLinkedList,
} from "@/lib/structures/types";
import { UnavailableOutput, UnsupportedPreview } from "./UnsupportedPreview";
import {
  generateBrailleSvg,
  letterSpacing,
  generateBrailleText,
  dotSpacing,
  offset,
} from "./Braille";
import { buildPositionTree } from "@/lib/ir/tree";
import { PHANTOM_NODE_IDS } from "@/lib/constants";
import { DownloadDropdown } from "../global/DownloadDropdown";
import { Fragment } from "react";
import { ArboretumMode } from "@/lib/types";

const NODE_RADIUS = 30;
const STROKE_WIDTH = 2;

function fileNameFromDiagram(diagram: IRDiagram): string {
  if (!diagram || !diagram.meta || !diagram.meta.title) {
    return `tactile`;
  }

  return (
    diagram.meta.title.toLowerCase().replace(/\s+/g, "-") ||
    `tactile-${diagram.meta.type}`
  );
}

export default function TactileRenderer({
  diagram,
  mode,
}: {
  diagram: IRDiagram;
  mode: ArboretumMode;
}) {
  if (!diagram) {
    return null;
  }

  const { type } = diagram!.meta;

  return mode == "Embed" ? (
    <UnsupportedPreview />
  ) : (
    <div className="overflow-hidden w-full h-96 md:h-full relative border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <div className="flex items-center justify-center w-full h-full bg-white dark:bg-zinc-950">
        {(() => {
          switch (type) {
            case "ll":
              return (
                <LinkedListRenderer linkedList={diagram as IRLinkedList} />
              );
            case "tree":
            case "bt":
              return <TreeRenderer tree={diagram as IRTree} />;
            case "arr":
            case "2arr":
              return <ArrayRenderer array={diagram as IRArray} />;
            default:
              return null;
          }
        })()}
      </div>
      <div className="absolute bottom-4 right-4 flex items-center justify-end space-x-2">
        {type !== undefined &&
        ((diagram as IRTree).nodes?.length > 0 ||
          (diagram as IRLinkedList).nodes?.length > 0 ||
          (diagram as IRArray).elements?.length > 0) ? (
          <DownloadDropdown
            id="arboretum-tactile-svg"
            filename={fileNameFromDiagram(diagram)}
          >
            Download Tactile Representation
          </DownloadDropdown>
        ) : null}
      </div>
    </div>
  );
}

function ArrayRenderer({ array }: { array: IRArray }) {
  const is2DArray = array.meta.type === "2arr";

  if (array.elements.length === 0) {
    return (
      <UnavailableOutput text="This array is empty and cannot be rendered." />
    );
  }

  const width =
    50 +
    (is2DArray
      ? array.elements[0].children!.length * 100
      : array.elements.length * 100);
  const height = 50 + (is2DArray ? array.elements.length * 100 : 100);

  if (is2DArray) {
    return (
      <svg
        id="arboretum-tactile-svg"
        xmlns="http://www.w3.org/2000/svg"
        height={height}
        width={width}
        viewBox={`0 0 ${width} ${height}`}
      >
        {array.elements.map((element, index) => (
          <g key={`array-row-group-${index}`} transform="translate(50, 0)">
            {element.children
              ? element.children.map((child, childIndex) => (
                  <Fragment key={`array-element-group-${index}-${childIndex}`}>
                    <g>
                      <rect
                        key={`array-element-${index}-${childIndex}`}
                        x={childIndex * 100}
                        y={index * 100}
                        width="100"
                        height="100"
                        stroke="black"
                        fill="white"
                        className="fill-white stroke-black dark:fill-black dark:stroke-white"
                        strokeWidth={STROKE_WIDTH}
                      />
                      {child.value === ""
                        ? null
                        : (() => {
                            const cx = childIndex * 100 + 50;
                            const cy = index * 100 + 50;
                            const braille = generateBrailleText(child.value);
                            const brailleWidth = braille.length * letterSpacing;
                            const brailleCellHeight = 2 * dotSpacing;
                            const xStart = cx - brailleWidth / 2 + offset;
                            const yStart = cy - brailleCellHeight / 2 + offset;
                            return generateBrailleSvg(
                              child.value,
                              xStart,
                              yStart
                            ).map((svgElement, svgIndex) => (
                              <circle
                                key={`braille-${index}-${childIndex}-${svgIndex}`}
                                cx={svgElement.cx}
                                cy={svgElement.cy}
                                r={svgElement.r}
                                className="fill-black dark:fill-white"
                              />
                            ));
                          })()}
                    </g>
                  </Fragment>
                ))
              : null}
          </g>
        ))}
        {/* horizontal */}
        {array.elements[0].children!.map((element, index) => (
          <g key={`array-index-group-${index}`}>
            {generateBrailleSvg(
              `${index}`,
              50 + 50 + index * 100,
              height - 25
            ).map((svgElement, svgIndex) => (
              <circle
                key={`braille-index-${index}-${svgIndex}`}
                cx={svgElement.cx}
                cy={svgElement.cy}
                r={svgElement.r}
                className="fill-black dark:fill-white"
              />
            ))}
          </g>
        ))}
        {/* vertical */}
        {array.elements.map((element, index) => (
          <g key={`array-row-index-group-${index}`}>
            {generateBrailleSvg(`${index}`, 25, 45 + index * 100).map(
              (svgElement, svgIndex) => (
                <circle
                  key={`braille-row-index-${index}-${svgIndex}`}
                  cx={svgElement.cx}
                  cy={svgElement.cy}
                  r={svgElement.r}
                  className="fill-black dark:fill-white"
                />
              )
            )}
          </g>
        ))}
        {/* <circle cx="50" cy="5" r="5" className="fill-black dark:fill-white" /> */}
      </svg>
    );
  } else {
    return (
      <svg
        id="arboretum-tactile-svg"
        xmlns="http://www.w3.org/2000/svg"
        height={height}
        width={width}
        viewBox={`0 0 ${width} ${height}`}
      >
        {array.elements.map((element, index) => (
          <Fragment key={`array-element-${index}`}>
            <g>
              <rect
                key={`array-element-${index}`}
                x={index * 100}
                y="0"
                width="100"
                height="100"
                stroke="black"
                fill="white"
                className="fill-white stroke-black dark:fill-black dark:stroke-white"
                strokeWidth={STROKE_WIDTH}
              />
              {(() => {
                const cx = index * 100 + 50;
                const cy = 50;
                const braille = generateBrailleText(element.value);
                const brailleWidth = braille.length * letterSpacing;
                const brailleCellHeight = 2 * dotSpacing;
                const xStart = cx - brailleWidth / 2 + offset;
                const yStart = cy - brailleCellHeight / 2 + offset;
                return generateBrailleSvg(element.value, xStart, yStart).map(
                  (svgElement, svgIndex) => (
                    <circle
                      key={`braille-${index}-${svgIndex}`}
                      cx={svgElement.cx}
                      cy={svgElement.cy}
                      r={svgElement.r}
                      className="fill-black dark:fill-white"
                    />
                  )
                );
              })()}
            </g>
            <g>
              {generateBrailleSvg(`${index}`, 50 + index * 100, 120).map(
                (svgElement, svgIndex) => (
                  <circle
                    key={`braille-index-${index}-${svgIndex}`}
                    cx={svgElement.cx}
                    cy={svgElement.cy}
                    r={svgElement.r}
                    className="fill-black dark:fill-white"
                  />
                )
              )}
            </g>
          </Fragment>
        ))}
      </svg>
    );
  }
}

function LinkedListRenderer({ linkedList }: { linkedList: IRLinkedList }) {
  if (linkedList.nodes.length === 0) {
    return (
      <UnavailableOutput text="This linked list is empty and cannot be rendered." />
    );
  }

  return (
    <svg
      id="arboretum-tactile-svg"
      xmlns="http://www.w3.org/2000/svg"
      height="100"
      width={`${linkedList.nodes.length * 100}`}
      viewBox={`0 0 ${linkedList.nodes.length * 100} 100`}
    >
      <defs>
        <marker
          id="head"
          orient="auto"
          markerWidth="16"
          markerHeight="16"
          refX="6"
          refY="4"
          className="fill-black dark:fill-white"
        >
          <path d="M0,0 V8 L4,4 Z" />
        </marker>
      </defs>

      {linkedList.nodes.map((node, index) => (
        <g key={`node-group-${index}`} id={`node-${index}`}>
          <circle
            cx={index * 100 + 50}
            cy="50"
            r={NODE_RADIUS}
            stroke="black"
            fill="white"
            className="fill-white stroke-black dark:fill-black dark:stroke-white"
            strokeWidth={STROKE_WIDTH}
          />
          {(() => {
            const cx = index * 100 + 50;
            const cy = 50;
            const braille = generateBrailleText(node.value);
            const brailleWidth = braille.length * letterSpacing;
            const brailleCellHeight = 2 * dotSpacing; // 15
            const yStart = cy - brailleCellHeight / 2 + offset;
            const xStart = cx - brailleWidth / 2 + offset;
            return generateBrailleSvg(node.value, xStart, yStart).map(
              (svgElement, svgIndex) => (
                <circle
                  key={`braille-${index}-${svgIndex}`}
                  cx={svgElement.cx}
                  cy={svgElement.cy}
                  r={svgElement.r}
                  className="fill-black dark:fill-white"
                />
              )
            );
          })()}

          {index < linkedList.nodes.length - 1 && (
            <line
              key={`arrow-${index}`}
              x1={index * 100 + 80}
              y1="50"
              x2={index * 100 + 120}
              y2="50"
              stroke="black"
              strokeWidth={STROKE_WIDTH}
              className="stroke-black dark:stroke-white"
              markerEnd="url(#head)"
            />
          )}
        </g>
      ))}
    </svg>
  );
}

function TreeRenderer({ tree }: { tree: IRTree }) {
  if (tree.nodes.length === 0) {
    return (
      <UnavailableOutput text="This tree is empty and cannot be rendered." />
    );
  }

  const positionBuiltTree = buildPositionTree(tree);
  const nodes = positionBuiltTree.descendants();
  const edges = positionBuiltTree.links();

  const xValues = nodes
    .map((n) => n.x)
    .filter((x): x is number => x !== undefined);
  const yValues = nodes
    .map((n) => n.y)
    .filter((y): y is number => y !== undefined);

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  const padding = 50;
  const treeWidth = maxX - minX;
  const treeHeight = maxY - minY;

  const width = treeWidth + padding * 2;
  const height = treeHeight + padding * 2;

  const offsetX = (width - treeWidth) / 2 - minX;
  const offsetY = (height - treeHeight) / 2 - minY;

  return (
    <svg
      id="arboretum-tactile-svg"
      xmlns="http://www.w3.org/2000/svg"
      height={`${height}`}
      width={`${width}`}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <marker
          id="head"
          viewBox="0 0 10 10"
          refX={35}
          refY="5"
          markerWidth="12"
          markerHeight="12"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L10,5 L0,10 Z" fill="currentColor" />
        </marker>
      </defs>
      <g transform={`translate(${offsetX}, ${offsetY})`}>
        <g id="edges">
          {edges
            .filter(
              (edge) =>
                !PHANTOM_NODE_IDS.includes(
                  edge.source.data?.id.toLowerCase() || ""
                ) &&
                !PHANTOM_NODE_IDS.includes(
                  edge.target.data?.id.toLowerCase() || ""
                )
            )
            .map((edge, idx) => (
              <line
                key={idx}
                x1={edge.source.x}
                y1={edge.source.y}
                x2={edge.target.x}
                y2={edge.target.y}
                style={{ stroke: "currentColor" }}
                className="text-black dark:text-white"
                strokeWidth={2}
                markerEnd="url(#head)"
              />
            ))}
        </g>
        <g id="nodes">
          {nodes
            .filter(
              (node) =>
                !PHANTOM_NODE_IDS.includes(node.data?.id.toLowerCase() || "")
            )
            .map((node, idx) => (
              <g key={idx} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  r={NODE_RADIUS}
                  stroke="black"
                  fill="white"
                  className="fill-white stroke-black dark:fill-black dark:stroke-white"
                  strokeWidth={STROKE_WIDTH}
                />
                {(() => {
                  const cx = 0;
                  const cy = 0;
                  const braille = generateBrailleText(node.data!.value);
                  const brailleWidth = braille.length * letterSpacing;
                  const brailleCellHeight = 2 * dotSpacing;
                  const yStart = cy - brailleCellHeight / 2 + offset;
                  const xStart = cx - brailleWidth / 2 + offset;
                  return generateBrailleSvg(
                    node.data!.value,
                    xStart,
                    yStart
                  ).map((svgElement, svgIndex) => (
                    <circle
                      key={`braille-${idx}-${svgIndex}`}
                      cx={svgElement.cx}
                      cy={svgElement.cy}
                      r={svgElement.r}
                      className="fill-black dark:fill-white"
                    />
                  ));
                })()}
              </g>
            ))}
        </g>
      </g>
    </svg>
  );
}
