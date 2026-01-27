import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // async redirects() {
  //   return [
  //     {
  //       source: "/paper/array-outputs",
  //       destination:
  //         "/preview?t=Array%20Output%20Representations&d=A%20comparison%20of%20three%20output%20representations%20for%20an%20array%20containing%20the%20values%2037%2C%202%2C%20and%205.%20First%2C%20the%20tabular%20lists%20the%20index%20and%20value%20pairs.%20Next%2C%20the%20navigable%20shows%20three%20adjacent%20boxes%2C%20each%20containing%20an%20index%20and%20value.%20Last%2C%20the%20tactile%20shows%20three%20adjacent%20boxes%2C%20each%20containing%20a%20value%2C%20with%20the%20index%20below%20the%20box%20using%20Braille%20dots.&g=block-beta%0A%20%20%20%20a%5B%2237%22%5D%20b%5B%222%22%5D%20c%5B%225%22%5D%0A&i=mmd&s=arr&o=html-table",
  //       permanent: false,
  //     },
  //     {
  //       source: "/paper/tree-outputs",
  //       destination:
  //         "/preview?t=Trees%20Output%20Representations&d=A%20comparison%20of%20three%20different%20representations%20for%20a%20binary%20tree%20data%20structure.%20First%2C%20the%20tabular%20has%20columns%20for%20node%20%22Value%22%2C%20%22Parent%22%2C%20%22Position%22%2C%20%22Left%20Child%22%2C%20and%20%22Right%20Child%22.%20Next%2C%20the%20navigable%20shows%20the%20tree%20as%20a%20series%20of%20line-connected%20circles%2C%20with%20the%20values%20inside.%20Finally%2C%20a%20tactile%20displays%20the%20same%20tree%20structure%20with%20thicker%20strokes%20in%20black%2C%20but%20represents%20the%20nodes%20and%20their%20values%20using%20Braille%20dots.&g=flowchart%20TD%0AA((3))%0A%20%20%20%20A%20--%3EB((1))%0A%20%20%20%20%20%20%20%20B%20--%3E%20C((0))%0A%20%20%20%20%20%20%20%20B%20--%3E%20D((2))%0A%20%20%20%20A%20--%3EE((6))%0A%20%20%20%20%20%20%20%20E%20--%3E%20F((4))%0A&i=mmd&s=bt&o=html-table",
  //       permanent: false,
  //     },
  //   ];
  // },
};

export default nextConfig;
