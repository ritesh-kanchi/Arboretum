import {
  IRArray,
  IRDiagram,
  IRLinkedList,
  IRTree,
} from "@/lib/structures/types";
import { ArboretumMode } from "@/lib/types";
import TableOutput from "../TableOutput";
import { UnavailableOutput } from "../UnsupportedPreview";
import ArrayOutput from "./ArrayOutput";
import TreeOutput from "./TreeOutput";

export default function HTMLRenderer({
  diagram,
  mode,
  url,
}: {
  diagram: IRDiagram;
  mode: ArboretumMode;
  url?: string;
}) {
  if (!diagram) {
    return (
      <UnavailableOutput text="The ordering output is only available for trees." />
    );
  }

  const { type } = diagram!.meta;

  return (
    <div className="w-full h-full flex flex-col">
      {type === "ll" ? (
        <LinkedListRenderer list={diagram as IRLinkedList} />
      ) : type === "arr" || type === "2arr" ? (
        <ArrayOutput array={diagram as IRArray} />
      ) : type === "tree" || type === "bt" ? (
        <TreeOutput tree={diagram as IRTree} />
      ) : (
        <UnavailableOutput text="This diagram type is not supported in HTML output." />
      )}
    </div>
  );
}

function LinkedListRenderer({ list }: { list: IRLinkedList }) {
  const nodeWidth = 96; // w-24 = 96px
  const nodeSpacing = 120;
  const totalWidth =
    list.nodes.length * nodeSpacing - (nodeSpacing - nodeWidth);
  const totalHeight = nodeWidth;

  return (
    <div className="w-full h-full overflow-x-auto overflow-y-auto py-8">
      <div
        className="w-full h-full relative flex items-center justify-center"
        style={{ minWidth: totalWidth, minHeight: totalHeight }}
      >
        <div
          role="list"
          className="relative"
          style={{
            width: totalWidth,
            height: totalHeight,
          }}
        >
          {list.nodes.slice(0, -1).map((node, index) => {
            const x1 = index * nodeSpacing + nodeWidth / 2;
            const y1 = nodeWidth / 2;
            const x2 = (index + 1) * nodeSpacing + nodeWidth / 2;
            const y2 = nodeWidth / 2;

            return (
              <svg
                key={`edge-${node.id}-${list.nodes[index + 1].id}-${index}`}
                className="absolute pointer-events-none"
                style={{
                  left: Math.min(x1, x2) - 1,
                  top: Math.min(y1, y2) - 1,
                  width: Math.abs(x2 - x1) + 2,
                  height: Math.abs(y2 - y1) + 2,
                }}
              >
                <line
                  x1={x1 - Math.min(x1, x2) + 1}
                  y1={y1 - Math.min(y1, y2) + 1}
                  x2={x2 - Math.min(x1, x2) + 1}
                  y2={y2 - Math.min(y1, y2) + 1}
                  className="stroke-zinc-200 dark:stroke-zinc-800"
                  strokeWidth={2}
                />
              </svg>
            );
          })}
          {list.nodes.map((node, index) => (
            <div
              key={`traversal-node-${node.id}-${index}`}
              className={`absolute w-24 h-24 font-semibold text-lg bg-white border flex flex-col text-center items-center justify-center border-zinc-200 dark:border-zinc-800 rounded-full dark:bg-zinc-950 dark:text-white`}
              role="listitem"
              aria-label={`Node ${node.value}, position ${index + 1}`}
              tabIndex={0}
              style={{
                left: index * nodeSpacing,
                top: 0,
              }}
            >
              {node.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
