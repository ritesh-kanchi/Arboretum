export const MERMAID_BT_EXAMPLE = `flowchart TD
accTitle: Binary Tree Example
A((1))
    A -->B((2))
        B --> C((3))
        B --> D((4))
    A -->E((5))
        E --> F((6))
`;

export const MERMAID_LL_EXAMPLE = `flowchart LR
accTitle: Linked List Example
    A((1)) -->B((2)) --> C((3))
`;

export const MERMAID_ARR_EXAMPLE = `block-beta
    a["1"] b["2"] c["3"]
`;

export const MERMAID_TWO_ARR_EXAMPLE = `block-beta
columns 3
    a["1"] b["2"] c["3"]
    d["4"] e["5"] f["6"]
`;

export const MERMAID_TREE_EXAMPLE = `flowchart TD
accTitle: Tree Example
A((1))
    A -->B((2))
        B --> C((3))
        B --> D((4))
        B --> E((5))
    A -->F((6))
        F --> G((7))
        F --> H((8))
        F --> I((9))
`;
