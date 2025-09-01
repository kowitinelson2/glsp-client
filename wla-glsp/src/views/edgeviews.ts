/********************************************************************************
 * Copyright (c) 2025 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
/** @jsx svg */
import { angleOfPoint, GEdge, getSubType, Point, PolylineEdgeView, setClass, toDegrees, RenderingContext} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { h, VNode } from 'snabbdom';

/* EDGE */
@injectable()
export class DependencyView extends PolylineEdgeView {
    arrowLength = 10;
    arrowWidth = 8;

    override render(edge: Readonly<GEdge>, context: RenderingContext): VNode | undefined {
        if (!edge || !context) {
            return undefined;
        }

        const classes: string[] = [...(edge as any).args['styleClasses'] ?? []];

        const subType: string = getSubType(edge);

        const router = this.edgeRouterRegistry.get(edge.routerKind);
        if (!router) {
            return undefined;
        }


        const route = router.route(edge);

        if (!route || route.length === 0)
            {return this.renderDanglingEdge('Cannot compute route', edge, context);}

        const depLine = this.renderLine(edge, route, context);

        classes
            .forEach(name => {
                setClass(depLine, `edge-${name}`, true);
                setClass(depLine, 'edge-selected', edge.selected);
                setClass(depLine, 'edge-mouseover', edge.hoverFeedback);
            });

        const vnode = h('g.sprotty-edge', {
            class: {
                mouseover: edge.hoverFeedback
            }
        }, [
            depLine
        ]);

        const children = context.renderChildren(edge, { route });

        if (vnode.children) {
            if(subType === 'arrow') {
                const additionals = this.renderAdditionals(edge, route, context);
                vnode.children.push(...additionals);
            }
            vnode.children.push(...children);
        }

        return vnode;
    }

    protected override renderAdditionals(edge: GEdge, segments: Point[], context: RenderingContext): VNode[] {
        const classes: string[] = [...(edge as any).args['styleClasses'] ?? []];

        const p2 = segments[segments.length - 1];
        let p1: Point;
        let index = segments.length - 2;
        do {
            p1 = segments[index];
            index--;
        } while (index >= 0 && this.maxDistance(p1, p2) < this.arrowLength);

        const vnode = h('path', {
            attrs: {
                d: `M -1.5,0 L ${this.arrowLength},-${this.arrowWidth / 2} L ${this.arrowLength},${this.arrowWidth / 2} Z`,
                transform: `rotate(${toDegrees(angleOfPoint({ x: p1.x - p2.x, y: p1.y - p2.y }))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`
            },
            class: {
                ...Object.fromEntries(classes.map(name => [`arrow-${name}`, true]))
            }
        });
        return [vnode];
    }

    protected maxDistance(a: Point, b: Point): number {
        return Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
    }
}
