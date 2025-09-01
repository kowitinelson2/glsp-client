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

import { Point } from "@eclipse-glsp/client";

export function mapClassesToBoolean(arr: string[]): Record<string, boolean> {
    return Object.fromEntries(arr.map(item => [item, true]));
}

export function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export const isEven = (n: number): boolean => n % 2 === 0;

/**
 * Create a rounded-corner polyline path
 * @param pts polyline points
 * @param r corner radius
 */
export function roundedPolylinePath(pts: Point[], r: number): string {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;

    let d = `M ${pts[0].x},${pts[0].y}`;

    for (let i = 1; i < pts.length - 1; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const next = pts[i + 1];

        // vectors
        const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
        const v2 = { x: next.x - curr.x, y: next.y - curr.y };

        // normalize
        const len1 = Math.hypot(v1.x, v1.y);
        const len2 = Math.hypot(v2.x, v2.y);

        if (len1 === 0 || len2 === 0) continue;

        const u1 = { x: v1.x / len1, y: v1.y / len1 };
        const u2 = { x: v2.x / len2, y: v2.y / len2 };

        // trim points
        const p1 = { x: curr.x - u1.x * Math.min(r, len1 / 2), 
                     y: curr.y - u1.y * Math.min(r, len1 / 2) };
        const p2 = { x: curr.x + u2.x * Math.min(r, len2 / 2), 
                     y: curr.y + u2.y * Math.min(r, len2 / 2) };

        // line to p1
        d += ` L ${p1.x},${p1.y}`;

        // arc from p1 → p2, radius r
        const sweep = (u1.x * u2.y - u1.y * u2.x) < 0 ? 0 : 1;
        d += ` A ${r},${r} 0 0,${sweep} ${p2.x},${p2.y}`;
    }

    // line to last
    const last = pts[pts.length - 1];
    d += ` L ${last.x},${last.y}`;

    return d;
}
