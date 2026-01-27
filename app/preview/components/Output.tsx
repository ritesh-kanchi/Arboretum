import Previewer from "@/app/components/Previewer";
import { IRDiagram } from "@/lib/structures/types";
import { ArboretumOutput } from "@/lib/outputs/types";

export default function Output({
  generatedIR,
  output,
}: {
  generatedIR: IRDiagram;
  output: ArboretumOutput;
}) {
  return (
    <div
      className={`w-full xl:h-full relative transition-colors dark:bg-zinc-950 bg-white`}
    >
      <div className="w-full xl:h-full  md:flex md:flex-col md:justify-center md:items-center p-4 md:overflow-y-auto overflow-x-auto">
        <Previewer
          diagram={generatedIR}
          output={output}
          mode="Preview"
          structureType={generatedIR?.meta.type ?? "unknown"}
        />
      </div>
    </div>
  );
}
