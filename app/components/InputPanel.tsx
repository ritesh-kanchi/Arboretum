import Select from "./global/Select";
import Button from "./global/Button";
import { useRouter } from "next/navigation";
import Toolbar from "./editor/Toolbar";
import DropdownButton from "./global/DropdownButton";
import { useLocalStorage } from "usehooks-ts";
import Pill from "./global/Pill";
import {
  CloseButton,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { ARBORETUM_INPUTS } from "@/lib/inputs/constants";
import { ArboretumInput, ArboretumInputExamples } from "@/lib/inputs/types";
import { IRMetadata, ArboretumStructure } from "@/lib/structures/types";
import { ArboretumDiagram } from "@/lib/types";
import { ArboretumOutput } from "@/lib/outputs/types";

export default function InputPanel({
  router,
  createQueryString,
  pathname,
  input,
  setInput,
  structure,
  setStructure,
  inputText,
  setInputText,
  output,
  setOutput,
  favorites,
  meta,
  setMetaDetails,
}: {
  router: ReturnType<typeof useRouter>;
  createQueryString: (name: string, value: string | null) => string;
  pathname: string;
  input: ArboretumInput;
  setInput: (input: ArboretumInput) => void;
  structure: ArboretumStructure;
  setStructure: (structure: ArboretumStructure) => void;
  inputText: string;
  setInputText: (inputText: string) => void;
  output: ArboretumOutput;
  setOutput: (output: ArboretumOutput) => void;
  favorites: ArboretumDiagram[];
  meta: IRMetadata;
  setMetaDetails: (meta: IRMetadata) => void;
}) {
  const [show, setShow] = useLocalStorage("arboretum-input-panel", true);

  return (
    <div
      role="tabpanel"
      aria-label="Input Panel"
      className="h-full w-full flex flex-col md:overflow-hidden col-span-1 md:col-span-3 self-start md:border-r border-zinc-200 dark:border-zinc-800"
    >
      <div className="w-full sticky top-0 z-10 self-start px-0 pt-4 md:px-4 bg-white dark:bg-zinc-950">
        <div className="flex items-center justify-between w-full border-b border-zinc-200 dark:border-zinc-800 pb-4 md:px-0 px-4">
          <h2 className="text-xl font-semibold dark:text-white">Input</h2>
          <div className="flex items-center justify-start gap-2">
            {!show ? (
              <>
                <Pill hiddenLarge={true}>
                  {input ? input.name : "No Input"}
                </Pill>
                <Pill hiddenLarge={true}>
                  {structure ? structure.name : "No Structure"}
                </Pill>
              </>
            ) : null}
            <DropdownButton panelName="Editor" show={show} setShow={setShow} />
          </div>
        </div>
      </div>
      <div
        className={`${
          show ? "" : "hidden md:block"
        } space-y-4 pt-2  border-b border-zinc-200 dark:border-zinc-800 pb-4`}
      >
        <div className="px-4 flex lg:flex-row lg:flex-nowrap flex-wrap items-end justify-start gap-2 md:gap-4">
          <div className="min-w-48 md:w-full">
            <Select
              label="Input Type"
              id="inputType"
              size="sm"
              onChange={(e) => {
                const newInput =
                  ARBORETUM_INPUTS.find(
                    (input) => input?.name === e.target.value
                  ) ?? null;
                setInput(newInput);

                const structuresCheck = newInput?.allowedStructures.find(
                  (s) => s?.type === structure?.type
                );

                if (structuresCheck === undefined || structuresCheck === null) {
                  setStructure(null);
                }

                router.replace(
                  `${pathname}?${createQueryString(
                    "i",
                    newInput?.type ?? null
                  )}`
                );
              }}
              value={input?.name}
            >
              <option value="">Choose an input</option>
              {ARBORETUM_INPUTS.map((input) =>
                input !== null ? (
                  <option key={input.name} value={input.name}>
                    {input.name}
                  </option>
                ) : null
              )}
            </Select>
          </div>
          <div className="min-w-48 md:w-full">
            <Select
              labelElement={<InfoPopover structure={structure} />}
              label="Structure Type"
              id="structureType"
              size="sm"
              onChange={(e) => {
                const newStructure =
                  input?.allowedStructures.find(
                    (structure) => structure?.type === e.target.value
                  ) ?? null;
                setStructure(newStructure);
                router.replace(
                  `${pathname}?${createQueryString(
                    "s",
                    newStructure?.type ?? null
                  )}`
                );
              }}
              value={structure?.type ?? ""}
              disabled={input === null}
            >
              {input !== null && input !== undefined ? (
                <>
                  <option value="">Choose a structure</option>
                  {input?.allowedStructures.map((structure) => (
                    <option key={structure?.type} value={structure?.type ?? ""}>
                      {structure?.name}
                    </option>
                  )) ?? null}
                </>
              ) : (
                <option value="">Choose an input</option>
              )}
            </Select>
          </div>
        </div>
        {input?.examples ? (
          <Examples
            router={router}
            pathname={pathname}
            examples={input?.examples}
            input={input}
            setInputText={setInputText}
            setStructure={setStructure}
            output={output}
          />
        ) : null}
      </div>

      <div
        className={`${
          show ? "flex" : "hidden md:flex"
        } h-full w-full flex-col space-y-4 pt-4 md:p-0`}
      >
        <div className="relative w-full h-full flex flex-col overflow-hidden">
          <textarea
            id="inputText"
            className="transition-colors duration-500 focus:outline-none focus:bg-zinc-50/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/25 dark:focus:bg-zinc-900/25 scheme-light-dark scroll-y-auto w-full h-96 md:h-full md:resize-none p-4 font-mono text-sm  dark:text-white"
            placeholder="Write your code here"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              router.replace(
                `${pathname}?${createQueryString(
                  "g",
                  encodeURIComponent(e.target.value)
                )}`
              );
            }}
          ></textarea>

          <Toolbar
            input={input}
            setInput={setInput}
            structure={structure}
            setStructure={setStructure}
            inputText={inputText}
            setInputText={setInputText}
            output={output}
            setOutput={setOutput}
            favorites={favorites}
            router={router}
            pathname={pathname}
            meta={meta}
            setMetaDetails={setMetaDetails}
          />
        </div>
      </div>
    </div>
  );
}

function Examples({
  router,
  pathname,
  examples,
  input,
  setInputText,
  setStructure,
  output,
}: {
  router: ReturnType<typeof useRouter>;
  pathname: string;
  examples: ArboretumInputExamples;
  input: ArboretumInput;
  setInputText: (inputText: string) => void;
  setStructure: (structure: ArboretumStructure) => void;
  output: ArboretumOutput;
}) {
  return (
    <div className="flex flex-wrap items-center justify-start gap-2 px-4">
      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
        Try out some examples:
      </p>
      <div className="flex items-center justify-start gap-2">
        {Object.keys(examples).map((key) => (
          <Button
            key={key}
            onClick={() => {
              setStructure(examples[key].structure);
              setInputText(examples[key].text);
              const newPath = `${pathname.substring(
                0,
                pathname.indexOf("?")
              )}?g=${encodeURIComponent(examples[key].text)}&i=${
                input!.type
              }&s=${examples[key].structure!.type}${
                output ? `&o=${output!.type}` : ""
              }`;

              router.replace(newPath);
            }}
            size="sm"
          >
            {examples[key].structure?.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

function InfoPopover({ structure }: { structure: ArboretumStructure }) {
  if (!structure || !structure.information) {
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
            <h4 className="font-sans font-semibold">About {structure.name}s</h4>
            <CloseButton
              aria-label="Close"
              className="cursor-pointer rounded-full bg-white dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 ease-in-out"
            >
              <XMarkIcon className="h-5 w-5" />
            </CloseButton>
          </div>
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html:
                structure.information ||
                "No information available for this data structure.",
            }}
          />
        </>
      </PopoverPanel>
    </Popover>
  );
}
