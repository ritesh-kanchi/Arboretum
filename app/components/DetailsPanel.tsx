"use client";

import DropdownButton from "./global/DropdownButton";
import { useLocalStorage } from "usehooks-ts";
import Pill from "./global/Pill";
import { IRDiagram, IRMetadata } from "@/lib/structures/types";

export default function DetailsPanel({
  generatedIR,
  metaDetails,
  setMetaDetails,
}: {
  generatedIR: IRDiagram;
  metaDetails: IRMetadata;
  setMetaDetails: (metaDetails: IRMetadata) => void;
}) {
  const [show, setShow] = useLocalStorage("arboretum-details-panel", true);

  return (
    <div
      role="tabpanel"
      aria-label="Details Panel"
      className="h-full w-full flex flex-col md:overflow-hidden col-span-1 md:col-span-2 self-start md:border-l border-zinc-200 dark:border-zinc-800"
    >
      <div className="w-full sticky top-0 z-10 self-start px-0 pt-4 md:px-4 bg-white dark:bg-zinc-950">
        <div className="flex items-center justify-between w-full border-b border-zinc-200 dark:border-zinc-800 pb-4 md:px-0 px-4">
          <h2 className="text-xl font-semibold dark:text-white">Details</h2>
          <div className="flex items-center justify-start gap-2">
            {!show ? (
              <>
                {generatedIR || metaDetails ? (
                  <Pill hiddenLarge={true}>
                    {generatedIR?.meta.title || metaDetails.title
                      ? "Metadata"
                      : "No Metadata"}
                  </Pill>
                ) : null}
              </>
            ) : null}
            <DropdownButton panelName="Editor" show={show} setShow={setShow} />
          </div>
        </div>
      </div>
      <div
        className={`${
          show ? "flex" : "hidden md:flex"
        } h-full w-full flex-col space-y-4 p-4 overflow-y-auto scheme-light-dark`}
      >
        <h3 className="font-semibold dark:text-white text-left">
          Edit Metadata
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-xs font-semibold dark:text-white block"
              htmlFor="title"
            >
              Title
            </label>
            <input
              aria-label="Diagram Title"
              id="title"
              value={metaDetails.title}
              className="w-full p-2 text-sm bg-zinc-50 dark:bg-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-md"
              type="text"
              placeholder="Enter a title"
              onChange={(e) => {
                setMetaDetails({
                  ...metaDetails,
                  title: e.target.value,
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-xs font-semibold dark:text-white block"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              aria-label="Diagram Description"
              id="description"
              value={metaDetails.description}
              className="w-full p-2 text-sm bg-zinc-50 dark:bg-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-md"
              rows={4}
              placeholder="Enter a description"
              onChange={(e) => {
                setMetaDetails({
                  ...metaDetails,
                  description: e.target.value,
                });
              }}
            />
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 -mt-2">
            If your input type has its own metadata properties, they will be
            used instead. Descriptions will be automatically generated if no
            metadata is provided.
          </p>
        </div>
        <hr
          className="w-full border-zinc-200 dark:border-zinc-800"
          aria-hidden="true"
        />
        <div className="space-y-2 pb-8">
          <label
            className="text-sm font-semibold dark:text-white block"
            htmlFor="jr"
            aria-label="JSON Representation"
          >
            JSON Representation
          </label>
          <textarea
            id="jr"
            value={
              generatedIR
                ? JSON.stringify(generatedIR, null, 2)
                : "No generated representation"
            }
            className="font-mono w-full h-full p-4 text-xs dark:bg-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg"
            readOnly
            placeholder="Generated IR"
            rows={20}
          />
        </div>
      </div>
    </div>
  );
}
