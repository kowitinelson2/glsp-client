import { Expandable, expandFeature, GNode, RectangularNode } from "@eclipse-glsp/client";

export class ClusterNode extends RectangularNode implements Expandable {
    static override readonly DEFAULT_FEATURES = [
    ...GNode.DEFAULT_FEATURES,
    expandFeature,
  ];
  expanded = false; // initially the node is collapsed
}