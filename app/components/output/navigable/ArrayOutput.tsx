import { IRArray } from "@/lib/structures/types";

export default function ArrayOutput({ array }: { array: IRArray }) {
  const is2DArray = array.meta.type === "2arr";

  if (is2DArray) {
    return (
      <div className="w-full overflow-x-auto py-8">
        <ol>
          {array.elements.map((row, i) => (
            <li key={i} id={`${i}`}>
              <ol
                className="flex items-center justify-center"
                role="list"
                aria-label={`Row ${i}`}
              >
                {row.children?.map((cell, j) => (
                  <li
                    key={j}
                    tabIndex={0}
                    className="border whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-lg font-semibold bg-white dark:bg-zinc-950 dark:text-white text-black text-center w-24 h-24 px-2 py-1 flex items-center justify-center"
                  >
                    Row {i}, Col {j}, {cell.value}
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  // 1D array
  return (
    <div className="w-full overflow-x-auto py-8">
      <ol className="flex items-center justify-center" aria-label="Array">
        {array.elements.map((element, i) => (
          <li
            key={i}
            id={`${i}`}
            className="border whitespace-nowrap border-zinc-200 text-balance text-sm font-semibold dark:border-zinc-800 bg-white dark:bg-zinc-950 dark:text-white text-black text-center w-24 h-24 flex items-center justify-center px-2 py-1"
          >
            Index {i}, {element.value}
          </li>
        ))}
      </ol>
    </div>
  );
}
