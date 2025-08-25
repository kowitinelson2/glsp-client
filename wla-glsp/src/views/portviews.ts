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
import { GPort, ShapeView, RenderingContext} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { h, VNode } from 'snabbdom';

//setAttr, ATTR_BBOX_ELEMENT 

/* PORT */
@injectable()
export class PortViewWithLabel extends ShapeView {
    render(node: Readonly<GPort>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }

        const width = Math.max(node.size?.width, 0);
        const height = Math.max(node.size?.height, 0);

        const classes: string[] = [...(node as any).args['styleClasses'] ?? []];

        const vnode = h('rect', {
            attrs: {
                x: 0,
                y: 0,
                width: width,
                height: height,
                rx: 1,
                ry: 1
            },
            class: {
                'mouseover': node.hoverFeedback,
                'selected': node.selected,
                ...Object.fromEntries(classes.map(name => [`port-${name}`, true]))
            }
        });

        return h('g', [vnode, ...context.renderChildren(node)]);
    }
}
