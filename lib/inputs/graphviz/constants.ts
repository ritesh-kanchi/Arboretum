export const GRAPHVIZ_BT_EXAMPLE = `digraph bt {
    node1[label="1"];
    node2[label="2"];
    node3[label="3"];

    node4[label="4"];
    node5[label="5"];
    node6[label="6"];
    node7[label="7"];

    node1->node2;
    node1->node3;

    node2->node4;
    node2->node5;

    node3->node6;
    node3->node7;
}`;

export const GRAPHVIZ_TREE_EXAMPLE = `digraph tree {
    node1[label="1"];
    node2[label="2"];
    node3[label="3"];
    node4[label="4"];
    node5[label="5"];
    node6[label="6"];


    node1->node2;
    node1->node3;

    node2->node4;
    node2->node5;
    node2->node6;
    node3->node7;
}`;

export const GRAPHVIZ_LL_EXAMPLE = `digraph ll {
    node1[label="1"];
    node2[label="2"];
    node3[label="3"];

    node1->node2;
    node2->node3;
}`;
