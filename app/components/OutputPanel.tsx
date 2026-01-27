import Previewer from "@/app/components/Previewer";
import { nameFromType } from "@/lib/func";
import { GetEdges, GetElements, GetNodes } from "@/lib/ir/core";
import { ARBORETUM_OUTPUTS } from "@/lib/outputs/constants";
import { ArboretumOutput } from "@/lib/outputs/types";
import { ArboretumStructure, IRDiagram } from "@/lib/structures/types";
import { ArboretumDiagram } from "@/lib/types";
import {
  CloseButton,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import PreviewError from "../preview/components/PreviewError";
import Button from "./global/Button";
import DropdownButton from "./global/DropdownButton";
import Pill from "./global/Pill";
import Select from "./global/Select";

export default function OutputPanel({
  router,
  createQueryString,
  pathname,
  structure,
  output,
  setOutput,
  generatedIR,
  encodedData,
  view,
  error,
}: {
  router: ReturnType<typeof useRouter>;
  createQueryString: (name: string, value: string | null) => string;
  pathname: string;
  structure: ArboretumStructure;
  output: ArboretumOutput;
  setOutput: (output: ArboretumOutput) => void;
  generatedIR: IRDiagram;
  encodedData: string;
  view: ArboretumDiagram;
  error: string;
}) {
  const [show, setShow] = useLocalStorage("arboretum-output-panel", true);

  const nodes = generatedIR ? GetNodes(generatedIR) : null;
  const edges = generatedIR ? GetEdges(generatedIR) : null;
  const elements = generatedIR ? GetElements(generatedIR) : null;

  return (
    <div
      role="tabpanel"
      aria-label="Output Panel"
      className="h-full w-full flex flex-col md:overflow-hidden col-span-1 md:col-span-5 self-start relative"
    >
      <div className="w-full sticky top-0 z-10 self-start px-0 pt-4 md:px-4 bg-white dark:bg-zinc-950">
        <div className="flex items-center justify-between w-full border-b border-zinc-200 dark:border-zinc-800 pb-4 md:px-0 px-4">
          <h2 className="text-xl font-semibold dark:text-white">Output</h2>
          <div className="flex items-center justify-start gap-2">
            {nodes ? (
              <Pill hiddenLarge={false}>
                {nodes} Node{nodes > 1 ? "s" : ""}
              </Pill>
            ) : null}
            {edges ? (
              <Pill hiddenLarge={false}>
                {edges} Edge{edges > 1 ? "s" : ""}
              </Pill>
            ) : null}
            {elements && elements.elements ? (
              <Pill hiddenLarge={false}>
                {elements.elements} Element{elements.elements > 1 ? "s" : ""}
              </Pill>
            ) : elements && elements.rows ? (
              <>
                <Pill hiddenLarge={false}>
                  {elements.rows} Row{elements.rows > 1 ? "s" : ""}
                </Pill>
                <Pill hiddenLarge={false}>
                  {elements.columns} Column{elements.columns > 1 ? "s" : ""}
                </Pill>
              </>
            ) : null}
            {!show ? (
              <Pill hiddenLarge={true}>
                {output ? output.name : "No Output"}
              </Pill>
            ) : null}
            <DropdownButton panelName="Output" show={show} setShow={setShow} />
          </div>
        </div>
      </div>
      <div className={`${show ? "" : "hidden md:block"} space-y-4 pt-2`}>
        <div className="px-4 border-b border-zinc-200 dark:border-zinc-800 pb-4 flex flex-wrap items-start justify-start gap-2 md:gap-4">
          <div className="min-w-48 w-full md:w-64">
            <Select
              labelElement={<InfoPopover output={output} />}
              label="Output Type"
              id="outputType"
              disabled={!structure}
              size="sm"
              onChange={(e) => {
                const newOutput =
                  ARBORETUM_OUTPUTS.find(
                    (output) => output?.type === e.target.value
                  ) ?? null;
                setOutput(newOutput);
                router.replace(
                  `${pathname}?${createQueryString("o", newOutput?.type ?? "")}`
                );
              }}
              value={output?.type ?? ""}
            >
              <option value="">Choose an output</option>
              {ARBORETUM_OUTPUTS.filter((output) =>
                output?.allowedStructures.includes(structure)
              ).map((output) =>
                output !== null ? (
                  <option key={output.type} value={output.type ?? ""}>
                    {output?.name}
                  </option>
                ) : null
              )}
            </Select>
          </div>
        </div>
      </div>
      <div
        className={`${
          show ? "flex" : "hidden md:flex"
        } h-full w-full pt-4 p-4 overflow-auto scheme-light-dark border-b md:border-b-0 border-zinc-200 dark:border-zinc-800`}
      >
        {output != null && generatedIR != null ? (
          <div className="w-full h-full text-black dark:text-white">
            <Previewer
              diagram={generatedIR}
              output={output}
              mode="Editor"
              structureType={generatedIR.meta.type}
            />
          </div>
        ) : (
          <PreviewError error={error} view={view} />
        )}
      </div>
      <div
        className={`flex fixed md:relative items-start space-x-16 justify-between bottom-0 right-0 w-full p-4 pt-[calc(1rem+2px)] z-10 bg-white dark:bg-zinc-950 border-y md:border-b-0 border-zinc-200 dark:border-zinc-800`}
      >
        <div className="flex items-baseline justify-start gap-2">
          <Pill hiddenLarge={false}>
            {structure?.type
              ? `${nameFromType(structure.type)} detected`
              : "No diagram detected"}
          </Pill>
        </div>
        <Button
          size="sm"
          onClick={() =>
            window.open(
              `${process.env.NEXT_PUBLIC_DOMAIN_URL}/preview${encodedData}`,
              "_blank"
            )
          }
        >
          Open in Preview <ArrowUpRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function InfoPopover({ output }: { output: ArboretumOutput }) {
  if (output === null) {
    return null;
  }

  return (
    <Popover className="relative text-white">
      <PopoverButton className="text-zinc-600 dark:text-zinc-300 px-2 py-1 text-xs rounded-md hover:cursor-pointer flex items-center justify-center border-0 border-zinc-200 whitespace-nowrap transition-all dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50">
        Learn more
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        transition
        className="shadow-xl data-closed:-translate-y-1 transition duration-200 ease-in-out data-closed:opacity-0 flex flex-col space-y-2 bg-white mt-4 relative w-sm dark:bg-zinc-950 border text-zinc-700 dark:text-white border-zinc-200 dark:border-zinc-800 rounded-xl p-4 z-50"
      >
        <>
          <div className="flex items-center justify-between">
            <h4 className="font-sans font-semibold">About {output.name}</h4>
            <CloseButton
              aria-label="Close"
              className="cursor-pointer rounded-full bg-white dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 ease-in-out"
            >
              <XMarkIcon className="h-5 w-5" />
            </CloseButton>
          </div>
          {output.information ? (
            <>
              {" "}
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html:
                    output.information ||
                    "No information available for this data structure.",
                }}
              />
              <hr
                className="border-zinc-200 dark:border-zinc-800"
                aria-hidden="true"
              />
            </>
          ) : null}
          <div className="font-semibold text-sm">Supported structures</div>
          <ul className="flex flex-wrap gap-2">
            {output.allowedStructures.map((structure, index) => (
              <li
                key={index}
                className="px-2 py-1 text-xs rounded-md border border-zinc-200 whitespace-nowrap gap-1 transition-all dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {structure?.name}
              </li>
            ))}
          </ul>
        </>
      </PopoverPanel>
    </Popover>
  );
}
