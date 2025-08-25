/** @jsx svg */
import { getSubType, GLabel, isEdgeLayoutable, IViewArgs, RenderingContext, setAttr, ShapeView } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { h, VNode } from 'snabbdom';
import { mapClassesToBoolean } from '../helper';

@injectable()
export class CustomLabelView extends ShapeView {
    override render(label: Readonly<GLabel>, context: RenderingContext, args?: IViewArgs): VNode | undefined {
        if(!isEdgeLayoutable(label) && !this.isVisible(label, context)) {
            return undefined;
        }

        const classes: string[] = [...(label as any).args['styleClasses'] ?? []];

        const vnode = h('text', {
                class: {
                    ...mapClassesToBoolean(classes)
                }
            }, label.text);

        const subType = getSubType(label);
        if(subType) {
            setAttr(vnode, 'class', subType);
        }

        return vnode;
    }
    
}