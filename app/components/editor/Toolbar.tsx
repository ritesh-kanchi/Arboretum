import {
  generateEncodedData,
  inputFromType,
  outputFromType,
  structureFromType,
} from "@/lib/func";
import Select from "../global/Select";
import { useRouter } from "next/navigation";
import FavoriteButton from "./FavoriteButton";
import { ArboretumInput } from "@/lib/inputs/types";
import { IRMetadata, ArboretumStructure } from "@/lib/structures/types";
import { ArboretumOutput } from "@/lib/outputs/types";
import { ArboretumDiagram } from "@/lib/types";

export default function Toolbar({
  input,
  setInput,
  structure,
  setStructure,
  inputText,
  setInputText,
  output,
  setOutput,
  favorites,
  router,
  pathname,
  meta,
  setMetaDetails,
}: {
  input: ArboretumInput;
  setInput: (input: ArboretumInput) => void;
  structure: ArboretumStructure;
  setStructure: (structure: ArboretumStructure) => void;
  inputText: string;
  setInputText: (inputText: string) => void;
  output: ArboretumOutput;
  setOutput: (output: ArboretumOutput) => void;
  favorites: ArboretumDiagram[];
  router: ReturnType<typeof useRouter>;
  pathname: string;
  meta: IRMetadata;
  setMetaDetails: (meta: IRMetadata) => void;
}) {
  return (
    <div className="p-4 w-full border-y md:border-b-0 border-zinc-200 dark:border-zinc-800 ">
      <div className="flex items-center justify-start gap-2">
        <FavoriteButton
          view={{
            title: meta.title ?? null,
            description: meta.description ?? null,
            inputText: inputText,
            inputType: input?.type ?? null,
            structureType: structure?.type ?? null,
            outputType: output?.type ?? null,
          }}
        />
        <div className="flex flex-col justify-end gap-2 min-w-48 md:w-full">
          <label htmlFor="favorites" className="sr-only">
            Favorites
          </label>
          <Select
            id="favorites"
            size="sm"
            hide={true}
            value={
              !(
                input == null ||
                structure == null ||
                inputText.length === 0 ||
                inputText === "" ||
                output == null
              )
                ? favorites.findIndex((f) => {
                    return (
                      f.inputText === inputText &&
                      f.inputType === input!.type &&
                      f.structureType === structure!.type &&
                      f.outputType === output!.type
                    );
                  }) ?? ""
                : ""
            }
            onChange={(e) => {
              if (!isNaN(parseInt(e.target.value))) {
                const favorite: ArboretumDiagram =
                  favorites[parseInt(e.target.value)];

                const newInput = inputFromType(favorite.inputType as string);
                setInput(newInput);

                const newStructure = structureFromType(
                  favorite.structureType as string
                );
                setStructure(newStructure);

                setInputText(favorite.inputText);

                const newOutput = outputFromType(favorite.outputType as string);
                setOutput(newOutput);

                setMetaDetails({
                  title: favorite.title ?? "",
                  description: favorite.description ?? "",
                  type: newStructure?.type ?? "unknown",
                });

                router.replace(
                  `${process.env.NEXT_PUBLIC_DOMAIN_URL}${generateEncodedData({
                    title: favorite.title,
                    description: favorite.description,
                    ...favorite,
                  })}`
                );
              }
            }}
          >
            <option value={""}>Choose a favorite</option>
            {favorites.map((favorite, index) => (
              <option key={index} value={index}>
                {favorite.title
                  ? `${favorite.title} (
                  ${new Date(favorite.timestamp!).toLocaleString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })})`
                  : new Date(favorite.timestamp!).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}{" "}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
