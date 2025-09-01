import { Expandable, expandFeature, GModelElement, GNode, RectangularNode } from "@eclipse-glsp/client";

export class ClusterNode extends RectangularNode implements Expandable {
    static override readonly DEFAULT_FEATURES = [
    ...GNode.DEFAULT_FEATURES,
    expandFeature,
  ];
  expanded = false; // initially the node is collapsed
}

export function isJobNode(element: GModelElement): element is GNode {
  return (element instanceof GNode && element.type === 'node:job') || false;
}