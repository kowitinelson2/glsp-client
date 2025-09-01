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

import { GNode, IView, IViewArgs, RenderingContext, ShapeView } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { h, VNode } from 'snabbdom';
import { isEven, mapClassesToBoolean } from '../helper';
import { ClusterNode } from '../model';

@injectable()
export class BoxView extends ShapeView {
    override render(model: Readonly<GNode>, context: RenderingContext, args?: IViewArgs): VNode | undefined {
        if(!this.isVisible(model, context)) {
            return undefined;
        }

        const width = Math.max(model.size?.width, 0);
        const height = Math.max(model.size?.height, 0);

        const vnode = h('g', [
            this.createBoxFaces(width, height)
        ]);

        const children = context.renderChildren(model);
        if(vnode.children) {
            vnode.children.push(...children);
        }

        return vnode;

    }

    private createBoxFaces(width: number, height: number): VNode {
        const strokeWidth = 2;
        const angle = 4;

        const frontFace = `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`;
        const upperFace = `M 0 0 L ${angle} -${angle} L ${width + angle} -${angle} L ${width} 0 Z`;
        const rightFace = `M ${width} ${height} L ${width + angle} ${height - angle} L ${width + angle} -${angle}`;

        const faceAttrs = (d: string) => ({
            attrs: {
                d,
                stroke: 'black',
                'stroke-linejoin': 'round',
                'stroke-width': strokeWidth
            },
            style: {
                fill: '#ffffff'
            }
        });

        return h('g', [
            h('path', faceAttrs(upperFace)),
            h('path', faceAttrs(rightFace)),
            h('path', faceAttrs(frontFace))
            
        ]);
    }
}

/* JOB NODE */

@injectable()
export class JobNodeView extends ShapeView {
    render(node: Readonly<GNode>, context: RenderingContext, args?: IViewArgs): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }

        const classes: string[] = [...(node as any).args['styleClasses'] ?? []];

        const width = Math.max(node.size?.width, 0);
        const height = Math.max(node.size?.height, 0);

        const vnode = h('g', [
            h('a', {attrs: {href: '#', 'xlink:title': ''}}, [
                h('rect',{
                    attrs: {
                        x: 0,
                        y: 0,
                        width: width,
                        height: height,
                        rx: 2,
                        ry: 2
                    },
                    class: {
                        'job-mouseover': node.hoverFeedback,
                        'job-selected': node.selected,
                        ...mapClassesToBoolean(classes)
                    }
                }),
                //this.renderOrCondition(node),
                ...context.renderChildren(node)
            ])
        ]);

        return vnode;
    }

    // private renderOrCondition(node: GNode): VNode {
    //     const height = Math.max(node.size?.height, 0);
    //     const padding = 1;
    //     const leftWidth = 16;
    //     const leftHeight = height - (padding * 2);
    //     const lx = padding;
    //     const ly = padding;

    //     const leftPath = `M ${lx} ${ly} L ${lx + leftWidth} ${ly} L ${lx + leftWidth} ${ly + leftHeight} L ${lx} ${ly + leftHeight} Z`;
    //     const orConditionvnode = h('path', {
    //         attrs: {
    //             d: leftPath
    //         },
    //         style: {
    //             fill: (node as any).hasOrCondition ? 'pink' : '#ffffff00'
    //         }
    //     });

    //     return orConditionvnode;
    // }
}

@injectable()
export class SimpleView extends ShapeView {
    render(node: Readonly<GNode>, context: RenderingContext, args?: IViewArgs): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }

        const classes: string[] = [...(node as any).args['styleClasses'] ?? []];

        const width = Math.max(node.size?.width, 0);
        const height = Math.max(node.size?.height, 0);

        const vnode = h('g', [
            h('rect',{
                attrs: {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height
                },
                class: {
                    ...mapClassesToBoolean(classes)
                }
            }),
            ...context.renderChildren(node)
        ]);

        return vnode;
    }
}

/* PARENT - holds all the elements*/

@injectable()
export class ParentNodeView implements IView {
    render(model: Readonly<GNode>, context: RenderingContext): VNode | undefined {
        const width = Math.max(model.size?.width, 0);
        const height = Math.max(model.size?.height, 0);

        const vnode = h('g', [
            h('polygon', {
                attrs: {
                    points: `0,0 ${width},0 ${width},${height} 0,${height}`
                },
                style: {
                    fill: 'url(#dot-grid)'
                }
            })
        ]);

        const children = context.renderChildren(model);
        if(vnode.children) {
            vnode.children.push(...children);
        }

        return vnode;
    }
}

/* CLUSTER */

@injectable()
export class ClusterView extends ShapeView {
    render(node: Readonly<ClusterNode>, context: RenderingContext, args?: IViewArgs): VNode | undefined {
        if(!this.isVisible(node, context)) {
            return undefined;
        }

        const width = Math.max(node.size?.width, 0);
        const height = Math.max(node.size?.height, 0);

        let level: number = 0;
        level = (node as any).args['level'] as number;

        const vnode = h('g', [
            h('rect', {
                attrs: {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    fill: isEven(level) ? '#f0f0ff' : '#f8f8ff',
                    rx: 3,
                    ry: 3
                },
                style: {
                    stroke: 'black',
                    'stroke-width': '1'
                },
                class: {
                    'job-selected': node.selected,
                    'job-mouseover': node.hoverFeedback
                }
            })
        ]);

        const children = context.renderChildren(node);
        if(vnode.children) {
            vnode.children.push(...children);
        }

        return vnode;
    }
}

/* SUBGRAPH */

@injectable()
export class SubGraphView extends ShapeView {
    tabWidth = 42;
    tabHeight = 22;
    // padding = 4;
    fileSlant = 8;

    render(node: Readonly<GNode>, context: RenderingContext, args?: IViewArgs): VNode | undefined {
        if(!this.isVisible(node, context)) {
            return undefined;
        }

        const width = Math.max(node.size?.width, 0);
        const height = Math.max(node.size?.height, 0);

        const fileShapePath: string = this.getFileShape(width, height);

        const vnode = h('g', [
            // Folder shape
            h('path', {
                attrs: {
                    d: fileShapePath,
                    'stroke-linejoin': 'round',
                    'stroke-width': '1',
                    stroke: 'black'
                },
                style: {
                    fill: 'white'
                },
                class: {
                    'job-selected': node.selected,
                    'job-mouseover': node.hoverFeedback
                }
            })
        ]);

        const children = context.renderChildren(node);
        if(vnode.children) {
            vnode.children.push(...children);
        }

        return vnode;
    }

    protected getFileShape(width: number, height: number): string {
        return `
            M 0 0
            L ${width - this.tabWidth} 0
            L ${width - this.tabWidth + this.fileSlant} -${this.tabHeight}
            L ${width} -${this.tabHeight}
            L ${width} ${height}
            L 0 ${height}
            Z
        `;
    }
}
