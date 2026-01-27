export type MermaidVertice = {
  name: string;
  value: {
    classes: string[];
    domId: string;
    id: string;
    labelType: string;
    props: object;
    styles: string[];
    text: string;
    type: string;
  };
};

export type MermaidEdge = {
  start: string;
  end: string;
  labelType: string;
  length: number;
  stroke: string;
  text: string;
  type: string;
};

export type MermaidBlock = {
  directions: string | undefined;
  id: string;
  label: string;
  type: string;
  widthInColumns: number;
  columns: number | -1;
};
