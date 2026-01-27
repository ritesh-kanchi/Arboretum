"use client";

import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarFill } from "@heroicons/react/24/solid";

import { ArboretumDiagram } from "@/lib/types";
import Button from "../global/Button";
import { useLocalStorage } from "usehooks-ts";

export default function FavoriteButton({
  view,
  disabledRules = false,
}: {
  view: ArboretumDiagram;
  disabledRules?: boolean;
}) {
  const [favorites, setFavorites] = useLocalStorage<ArboretumDiagram[]>(
    "arboretum-favorites",
    []
  );

  const disabled =
    (disabledRules && !view.inputText) ||
    view.inputText === "" ||
    !view.inputType ||
    !view.structureType ||
    !view.outputType;

  return (
    <Button
      size="sm"
      onClick={() => {
        const newFavorite: ArboretumDiagram = {
          title: view.title,
          description: view.description,
          timestamp: new Date(),
          inputType: view.inputType,
          inputText: view.inputText,
          structureType: view.structureType,
          outputType: view.outputType,
        };

        if (
          favorites.find((f) => {
            return (
              f.inputText === newFavorite.inputText &&
              f.inputType === newFavorite.inputType &&
              f.structureType === newFavorite.structureType &&
              f.outputType === newFavorite.outputType
            );
          })
        ) {
          setFavorites(
            favorites.filter((f) => {
              return (
                f.inputText !== newFavorite.inputText ||
                f.inputType !== newFavorite.inputType ||
                f.structureType !== newFavorite.structureType ||
                f.outputType !== newFavorite.outputType
              );
            })
          );
          return;
        }

        if (favorites.length >= 5) {
          favorites.pop();
        }

        setFavorites([...favorites, newFavorite]);
      }}
      // size="sm"
      disabled={disabled}
    >
      {!disabled ? (
        favorites.find((f) => {
          return (
            f.inputText === view.inputText &&
            f.inputType === view.inputType &&
            f.structureType === view.structureType &&
            f.outputType === view.outputType &&
            f.title === view.title &&
            f.description === view.description
          );
        }) ? (
          <>
            <StarFill className="w-4 h-4 mr-1 text-zinc-500" /> Remove
          </>
        ) : (
          <>
            <StarOutline className="w-4 h-4 mr-1 text-zinc-500" /> Favorite{" "}
          </>
        )
      ) : (
        <>
          <StarOutline className="w-4 h-4 mr-1 text-zinc-500" /> Favorite{" "}
        </>
      )}
    </Button>
  );
}
