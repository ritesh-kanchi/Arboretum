import Button from "@/app/components/global/Button";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";
import { ArboretumDiagram } from "@/lib/types";
import {
  generateEncodedData,
  inputFromType,
  nameFromType,
  outputFromType,
  structureFromType,
} from "@/lib/func";
import Navbar from "@/app/components/Navbar";
import FavoriteButton from "@/app/components/editor/FavoriteButton";
import Select from "@/app/components/global/Select";
import { useRouter } from "next/navigation";
import Pill from "@/app/components/global/Pill";
import { autoDescription } from "@/lib/outputs/func";
import { IRDiagram } from "@/lib/structures/types";
import { ArboretumOutput } from "@/lib/outputs/types";
import { ARBORETUM_OUTPUTS } from "@/lib/outputs/constants";

export default function Sidebar({
  diagram,
  view,
  error,
  setOutput,
}: {
  diagram: IRDiagram;
  view: ArboretumDiagram;
  error: string;
  setOutput: (output: ArboretumOutput) => void;
}) {
  const isCompleteView =
    view.inputType &&
    view.structureType &&
    view.outputType &&
    view.inputText &&
    view.inputText !== "";

  return (
    <div
      role="tabpanel"
      aria-label="Preview Sidebar"
      className="relative shrink-0 xl:h-screen xl:w-96 bg-white dark:bg-zinc-950 xl:border-r border-b xl:border-b-0 border-r-0 border-zinc-200 dark:border-zinc-800"
    >
      <Navbar
        view={view}
        mode="Preview"
        encodedData={generateEncodedData(view)}
      />
      <div className="p-4 py-8 flex flex-col space-y-4">
        <h1 className="font-semibold text-2xl text-left">
          {isCompleteView
            ? view.title && view.title != ""
              ? view.title
              : `${nameFromType(view.structureType)} diagram`
            : "Incomplete view"}
        </h1>

        {isCompleteView ? (
          view.description && view.description != "" ? (
            <>
              <hr
                className="border-zinc-200 dark:border-zinc-800"
                aria-hidden="true"
              />
              <div className="space-y-2 text-left">
                <h2 className="font-semibold text-lg">Description</h2>
                <p className="leading-relaxed">{view.description}</p>
              </div>
            </>
          ) : diagram ? (
            <>
              <hr
                className="border-zinc-200 dark:border-zinc-800"
                aria-hidden="true"
              />
              <div className="space-y-2 text-left">
                <h2 className="font-semibold text-lg">Description</h2>
                <AutomaticDescription diagram={diagram} />
              </div>
            </>
          ) : null
        ) : (
          <p className="leading-relaxed">
            This Arboretum preview is missing some information. Please check the
            input, structure, and output to ensure they are all selected. You
            also may have problems with the input text.
          </p>
        )}
        <hr
          className="border-zinc-200 dark:border-zinc-800"
          aria-hidden="true"
        />
        <OutputSelection view={view} setOutput={setOutput} />
      </div>
      <Footer view={view} disabledRules={error != null || error != ""} />
    </div>
  );
}

function Details({ view }: { view: ArboretumDiagram }) {
  return (
    <div className="space-y-2 text-left">
      <h2 className="font-semibold text-lg">Details</h2>
      <div className="flex flex-wrap text-sm gap-2">
        {view.inputType ? (
          <Pill hiddenLarge={false}>
            Input: {inputFromType(view.inputType)!.name ?? "Missing"}
          </Pill>
        ) : null}
        {view.structureType ? (
          <Pill hiddenLarge={false}>
            Structure:{" "}
            {structureFromType(view.structureType)!.name ?? "Missing"}
          </Pill>
        ) : null}
        {view.outputType ? (
          <Pill hiddenLarge={false}>
            Output: {outputFromType(view.outputType)!.name ?? "Missing"}
          </Pill>
        ) : null}
      </div>
    </div>
  );
}

function OutputSelection({
  view,
  setOutput,
}: {
  view: ArboretumDiagram;
  setOutput: (output: ArboretumOutput) => void;
}) {
  const router = useRouter();
  // const [showOutputSelection, setOutputSelection] = useState(true);
  const showOutputSelection = true; // Always show for now, can be toggled later
  return (
    <div className="space-y-2 text-left">
      {/* <button
        className="flex items-center justify-between w-full cursor-pointer md:hover:opacity-75 transition-opacity"
        onClick={() => {
          setOutputSelection(!showOutputSelection);
        }}
        title={
          showOutputSelection
            ? "Hide Output Selection"
            : "Show Output Selection"
        }
        aria-label={
          showOutputSelection
            ? "Hide Output Selection"
            : "Show Output Selection"
        }
      >
        <h2 className="font-semibold text-lg">Output Selection</h2>
        <ChevronDownIcon
          className={`size-5  dark:text-white ${
            showOutputSelection ? "rotate-180" : "rotate-0"
          }`}
        />
      </button> */}
      <h2 className="font-semibold text-lg">Output Selection</h2>
      <div className={`${showOutputSelection ? "block" : "hidden"} space-y-2`}>
        <Select
          label="Output Type"
          id="outputType"
          onChange={(e) => {
            const newOutput =
              ARBORETUM_OUTPUTS.find(
                (output) => output?.type === e.target.value
              ) ?? null;
            setOutput(newOutput);
            router.replace(
              `${
                process.env.NEXT_PUBLIC_DOMAIN_URL
              }/preview${generateEncodedData({
                ...view,
                outputType: newOutput?.type ?? null,
              })}`
            );
          }}
          value={view.outputType ?? ""}
        >
          <option value="">Choose an output</option>
          {ARBORETUM_OUTPUTS.filter((output) =>
            output?.allowedStructures.find(
              (s) => s?.type === view.structureType
            )
          ).map((output) =>
            output !== null ? (
              <option key={output.type} value={output.type ?? ""}>
                {output?.name}
              </option>
            ) : null
          )}
        </Select>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Change the output to adjust the diagram, its properties, and how it is
          generated.
        </p>
      </div>
    </div>
  );
}

function Footer({
  view,
  disabledRules,
}: {
  view: ArboretumDiagram;
  disabledRules: boolean;
}) {
  const encodedData = generateEncodedData(view);

  return (
    <>
      <div className="fixed xl:absolute bottom-0 left-0 z-40 w-full p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-950">
        <div className="flex items-center justify-start space-x-2">
          <FavoriteButton view={view} disabledRules={disabledRules} />
          <Button
            size="sm"
            onClick={() => {
              window.open(
                `${process.env.NEXT_PUBLIC_DOMAIN_URL}${encodedData}`
              );
            }}
          >
            Open in Editor{" "}
            <ArrowUpRightIcon className="size-4 fill-zinc-500 dark:fill-zinc-400 ml-1" />
          </Button>
        </div>
      </div>
    </>
  );
}

function AutomaticDescription({ diagram }: { diagram: IRDiagram }) {
  return (
    <>
      <p className="leading-relaxed">{autoDescription(diagram)}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        This description was automatically generated based on the diagram.
      </p>
    </>
  );
}
