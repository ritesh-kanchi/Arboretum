"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "./global/Button";
import { ArboretumMode, ArboretumDiagram } from "@/lib/types";

import dynamic from "next/dynamic";

const ShareDialog = dynamic(() => import("./dialogs/ShareDialog"), {
  ssr: false,
});

import ArboretumIcon from "@/public/arboretum-icon.svg";
import Image from "next/image";

export default function Navbar({
  view,
  mode,
  encodedData,
}: {
  view: ArboretumDiagram;
  mode: ArboretumMode;
  encodedData: string;
}) {
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);

  return (
    <>
      <nav className="p-4 h-14 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-start space-x-2">
          <Link
            href="/"
            className="flex items-center justify-start text-black dark:text-white md:hover:opacity-75"
          >
            <Image
              src={ArboretumIcon}
              className="size-6 mr-2"
              alt="Three abstract shapes side-by-side of different shades of green to represent trees and other plants in an arboretum."
            />
            <div className="-space-y-1.5">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {mode}
              </p>
              <h1 className="text-lg font-semibold items-center">Arboretum</h1>
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button size="sm" onClick={() => setShowShareDialog(true)}>
            Share
          </Button>
        </div>
      </nav>
      <ShareDialog
        encodedData={encodedData}
        isOpen={showShareDialog}
        close={() => setShowShareDialog(false)}
        view={view}
        disabled={
          view.inputText === "" ||
          !view.inputType ||
          !view.structureType ||
          !view.outputType
        }
      />
    </>
  );
}
