import { Action, CollapseExpandAction, GLSPActionDispatcher, IActionHandler, Operation, TYPES } from "@eclipse-glsp/client";
import { inject, injectable } from "inversify";

export interface ExpandCollapseOperation extends Operation {
    kind: typeof ExpandCollapseOperation.KIND;
    expandIds: string[];
    collapseIds: string[];

}

export namespace ExpandCollapseOperation {
    export const KIND = "expand-collapse-operation";

    export function create(expandIds: string[], collapseIds: string[]): ExpandCollapseOperation {
        return {
            kind: KIND,
            isOperation: true,
            expandIds: expandIds,
            collapseIds: collapseIds
        };
    }
}

@injectable()
export class ExpandHandler implements IActionHandler {

    @inject(TYPES.IActionDispatcher) protected actionDispatcher: GLSPActionDispatcher;

    handle(action: Action): void {
        switch (action.kind) {
            case CollapseExpandAction.KIND:
                const collapseExpand = action as CollapseExpandAction;
                this.actionDispatcher.dispatch(ExpandCollapseOperation.create(collapseExpand.expandIds, collapseExpand.collapseIds));
                break;
        }
    }
}