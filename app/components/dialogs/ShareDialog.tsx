import {
  Dialog,
  DialogPanel,
  DialogTitle,
  CloseButton,
} from "@headlessui/react";
import Button from "../global/Button";
import TextArea from "../global/TextArea";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  ExclamationTriangleIcon,
  PencilSquareIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/16/solid";
import QRCode from "react-qr-code";
import { ArboretumDiagram } from "@/lib/types";
import { inputFromType, outputFromType, structureFromType } from "@/lib/func";
import { DownloadDropdown } from "../global/DownloadDropdown";
import { ClickDropdown } from "../global/ClickDropdown";

export default function ShareDialog({
  encodedData,
  isOpen,
  close,
  view,
  disabled,
}: {
  encodedData: string;
  isOpen: boolean;
  close: () => void;
  view: ArboretumDiagram;
  disabled: boolean;
}) {
  const missing = new Map([
    ["text", view.inputText == null || view.inputText === ""],
    ["input", view.inputType == null],
    ["structure", view.structureType == null],
    ["output", view.outputType == null],
  ]);

  const iframeCode = `<iframe src="${process.env.NEXT_PUBLIC_DOMAIN_URL}/embed${encodedData}" width="100%" height="100%" style="border: none;"></iframe>`;

  // const qrRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-hidden"
      onClose={close}
    >
      <div className="fixed inset-0 z-20 w-screen overflow-y-auto bg-black/25">
        <div className="space-y-4 md:space-y-0 md:flex min-h-full items-center justify-center p-4 md:space-x-8 overflow-y-auto">
          <DialogPanel
            transition
            className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 duration-100 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <div className="w-full md:max-w-2xl rounded-2xl bg-white dark:bg-zinc-950 space-y-4 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white p-6">
              <div className="flex items-center justify-between">
                <DialogTitle as="h3" className="text-xl font-semibold">
                  Share Arboretum Diagram
                </DialogTitle>
                <CloseButton
                  aria-label="Close"
                  className="cursor-pointer rounded-full bg-white dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 ease-in-out"
                  onClick={close}
                >
                  <XMarkIcon className="size-5" />
                </CloseButton>
              </div>
              <CurrentOptions missing={missing} view={view} />
              <hr
                className="w-full border-zinc-200 dark:border-zinc-800"
                aria-hidden="true"
              />
              <div className="space-y-4">
                <div className="space-y-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Link</h4>
                        <ClickDropdown
                          text="Copy Link"
                          action="Copied!"
                          items={[
                            {
                              icon: <PencilSquareIcon className="h-5 w-5" />,
                              name: "Edit Link",
                              onClick: () => {
                                navigator.clipboard.writeText(
                                  `${process.env.NEXT_PUBLIC_DOMAIN_URL}/edit${encodedData}`
                                );
                              },
                            },
                            {
                              icon: (
                                <PresentationChartBarIcon className="h-5 w-5" />
                              ),
                              name: "Preview Link",
                              onClick: () => {
                                navigator.clipboard.writeText(
                                  `${process.env.NEXT_PUBLIC_DOMAIN_URL}/preview${encodedData}`
                                );
                              },
                            },
                          ]}
                        />
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        Share a preview or edit link of your Arboretum view.
                      </p>
                    </div>
                    <hr
                      className="w-full border-zinc-200 dark:border-zinc-800"
                      aria-hidden="true"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">QR Code </h4>
                        <DownloadDropdown
                          id="arboretum-qr-code"
                          filename={view.title ? view.title : "arboretum-qr"}
                          pngScaleFactor={4}
                        >
                          Download QR Code
                        </DownloadDropdown>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">
                        Share your Arboretum view with anyone using the QR code.
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 hidden md:block">
                    <div className="border border-zinc-200 dark:border-zinc-800">
                      {/* <div ref={qrRef}> */}
                      <QRCode
                        id="arboretum-qr-code"
                        value={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/preview${encodedData}`}
                        style={{ width: "100%", height: "100%" }}
                      />
                      {/* </div> */}
                    </div>
                  </div>
                </div>
                <hr
                  className="w-full border-zinc-200 dark:border-zinc-800"
                  aria-hidden="true"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">iFrame</h4>
                    <Button
                      size="sm"
                      disabled={disabled}
                      onClick={() => navigator.clipboard.writeText(iframeCode)}
                    >
                      Copy iFrame Code
                    </Button>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Embed this Arboretum view in your website or application.
                  </p>
                  <TextArea
                    id="iframe-code"
                    fixedHeight="10rem"
                    value={
                      disabled
                        ? "iFrames can only be generated when all fields are filled."
                        : iframeCode
                    }
                    readonly={true}
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:max-w-sm rounded-2xl bg-white dark:bg-zinc-950 space-y-4 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white p-6">
              <DialogTitle as="h4" className="text-lg font-semibold">
                iFrame Preview
              </DialogTitle>
              <hr
                className="w-full border-zinc-200 dark:border-zinc-800"
                aria-hidden="true"
              />
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                This is how your iFrame will look like when embedded in your
                website.
              </p>

              <div
                dangerouslySetInnerHTML={{
                  __html: iframeCode,
                }}
                className="w-full aspect-square border border-zinc-200 dark:border-zinc-800"
              ></div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

function CurrentOptions({
  missing,
  view,
}: {
  missing: Map<string, boolean>;
  view: ArboretumDiagram;
}) {
  return (
    <div className="flex flex-wrap text-sm gap-2">
      {view.inputType ? (
        <div className="py-1 px-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-lg">
          Input: {inputFromType(view.inputType)!.name ?? "Missing"}
        </div>
      ) : null}
      {view.structureType ? (
        <div className="py-1 px-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-lg">
          Structure: {structureFromType(view.structureType)!.name ?? "Missing"}
        </div>
      ) : null}
      {view.outputType ? (
        <div className="py-1 px-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-lg ">
          Output: {outputFromType(view.outputType)!.name ?? "Missing"}
        </div>
      ) : null}
      {Array.from(missing).map(([key, value]) =>
        value ? (
          <p
            key={key}
            className="inline-flex items-center justify-start text-xs gap-x-1 border-yellow-600 dark:border-yellow-500 font-medium px-2 py-1 rounded-lg border-dashed border-2"
          >
            <ExclamationTriangleIcon className="size-4 text-yellow-600 dark:text-yellow-500" />
            Missing {key}
          </p>
        ) : null
      )}
    </div>
  );
}
