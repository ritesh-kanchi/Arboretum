const scale = 3;
export const dotSpacing = 2.5 * scale;
export const letterSpacing = 5 * scale + 2;
const dotSize = 0.75 * scale;
export const offset = 5;

// from: https://github.com/Zwettekop/BrailleToSVG

const brailleToShape: { [key: string]: string } = {
  " ": " ",
  "\n": "\n",
  "⠁": "1",
  "⠃": "12",
  "⠉": "14",
  "⠙": "145",
  "⠑": "15",
  "⠋": "124",
  "⠛": "1245",
  "⠓": "125",
  "⠊": "24",
  "⠚": "245",
  "⠅": "13",
  "⠇": "123",
  "⠍": "134",
  "⠝": "1345",
  "⠕": "135",
  "⠏": "1234",
  "⠟": "12345",
  "⠗": "1235",
  "⠎": "234",
  "⠞": "2345",
  "⠥": "136",
  "⠧": "1236",
  "⠺": "2456",
  "⠭": "1346",
  "⠽": "13456",
  "⠵": "1356",
  "⠼": "3456",
  "⠂": "2",
  "⠒": "25",
  "⠲": "256",
  "⠦": "236",
  "⠖": "235",
  "⠐⠣": "5 126",
  "⠐⠜": "5 345",
  "⠸⠌": "456 34",
  "⠸⠡": "456 16",
  "⠤": "36",
};

const textToBraille: { [key: string]: string } = {
  " ": " ",
  "\n": "\n",
  a: "⠁",
  b: "⠃",
  c: "⠉",
  d: "⠙",
  e: "⠑",
  f: "⠋",
  g: "⠛",
  h: "⠓",
  i: "⠊",
  j: "⠚",
  k: "⠅",
  l: "⠇",
  m: "⠍",
  n: "⠝",
  o: "⠕",
  p: "⠏",
  q: "⠟",
  r: "⠗",
  s: "⠎",
  t: "⠞",
  u: "⠥",
  v: "⠧",
  w: "⠺",
  x: "⠭",
  y: "⠽",
  z: "⠵",
  "#": "⠼",
  "1": "⠁",
  "2": "⠃",
  "3": "⠉",
  "4": "⠙",
  "5": "⠑",
  "6": "⠋",
  "7": "⠛",
  "8": "⠓",
  "9": "⠊",
  "0": "⠚",
  ",": "⠂",
  ":": "⠒",
  ".": "⠲",
  "?": "⠦",
  "!": "⠖",
  "(": "⠐⠣",
  ")": "⠐⠜",
  "/": "⠸⠌",
  "": "⠸⠡",
  "-": "⠤",
};

export function generateBrailleText(text: string): string {
  let res = "";
  for (let c of text.toLowerCase()) {
    if (textToBraille.hasOwnProperty(c)) res += c;
  }
  let brailleText = res;
  res = "";
  for (let c of brailleText) res += textToBraille[c];
  return res;
}

export function generateBrailleSvg(
  text: string,
  xStart: number,
  yStart: number
): {
  cx: number;
  cy: number;
  r: number;
}[] {
  const svg = [];

  let invoer = generateBrailleText(text.trim());
  let res = "";
  for (let c of invoer) if (brailleToShape.hasOwnProperty(c)) res += c;

  invoer = res;

  let x = xStart;
  let y = yStart;

  for (let c of invoer) {
    let shape = brailleToShape[c];
    for (let dot of shape) {
      let dotNum = parseInt(dot);
      const circle = {
        cx: x + (dotNum > 3 ? dotSpacing : 0),
        cy: y + ((dotNum - 1) % 3) * dotSpacing,
        r: dotSize,
      };
      svg.push(circle);
    }
    x += letterSpacing;
  }

  return svg;
}
