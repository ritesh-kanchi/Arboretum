import { IRArrayElement } from "../structures/interfaces";
import { IRArray, IRDiagram, IRMetadata } from "../structures/types";

export const coreToArray = (
  elements: IRArrayElement[],
  meta: IRMetadata
): IRDiagram => {
  const diagram: IRArray = {
    meta,
    elements,
  };

  return diagram;
};

export const coreTo2DArray = (
  elements: IRArrayElement[],
  meta: IRMetadata
): IRDiagram => {
  const diagram: IRArray = {
    meta,
    elements,
  };

  return diagram;
};
