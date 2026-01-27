import { ARBORETUM_INPUTS } from "./inputs/constants";
import { ArboretumInput } from "./inputs/types";
import { ARBORETUM_OUTPUTS } from "./outputs/constants";
import { ArboretumOutput } from "./outputs/types";
import { ARBORETUM_STRUCTURES } from "./structures/constants";
import { IRDataStructureType, ArboretumStructure } from "./structures/types";
import { ArboretumDiagram } from "./types";

export const checkFunctionValidity = (func: void) => {
  return typeof func !== "undefined";
};

export const nameFromType = (type: IRDataStructureType): string => {
  return ARBORETUM_STRUCTURES.find((s) => s!.type === type)?.name ?? "";
};

export const structureFromType = (type: string): ArboretumStructure => {
  return (
    ARBORETUM_STRUCTURES.find(
      (s) =>
        s!.type!.toLowerCase() === type.toLowerCase() ||
        s!.alternativeTypes?.includes(type.toLowerCase())
    ) ?? null
  );
};

export const inputFromType = (type: string): ArboretumInput => {
  return (
    ARBORETUM_INPUTS.find(
      (i) => i!.type!.toLowerCase() === type.toLowerCase()
    ) ?? null
  );
};

export const outputFromType = (type: string): ArboretumOutput => {
  return (
    ARBORETUM_OUTPUTS.find(
      (o) => o!.type!.toLowerCase() === type.toLowerCase()
    ) ?? null
  );
};

export function generateEncodedData(view: ArboretumDiagram) {
  let data = "";
  let symbol = "?";

  if (view.title) {
    data += `${symbol}t=${encodeURIComponent(view.title)}`;
    symbol = "&";
  }

  if (view.description) {
    data += `${symbol}d=${encodeURIComponent(view.description)}`;
    symbol = "&";
  }

  if (view.inputText) {
    data += `${symbol}g=${encodeURIComponent(view.inputText)}`;
    symbol = "&";
  }
  if (view.inputType) {
    data += `${symbol}i=${view.inputType}`;
    symbol = "&";
  }
  if (view.structureType) {
    data += `${symbol}s=${view.structureType}`;
    symbol = "&";
  }
  if (view.outputType) {
    data += `${symbol}o=${view.outputType}`;
    symbol = "&";
  }
  return data;
}

function convertToFileName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50); // Limit to 50 characters
}

export function elementToImage(
  type: "svg" | "png",
  elementId: string,
  name: string,
  pngScaleFactor = 2
) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    return;
  }

  const filename = name ? convertToFileName(name) : "arboretum-download";

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(element);

  if (type === "svg") {
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else if (type === "png") {
    // TODO: figure out how to handle PNG downloads properly, mermaid is being fussy

    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleFactor = pngScaleFactor; // 1x = original size
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        alert("Failed to create canvas context.");
        return;
      }

      ctx.scale(scaleFactor, scaleFactor);
      ctx.drawImage(img, 0, 0);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      alert("Failed to load image for download.");
      URL.revokeObjectURL(url);
    };
  }
}
