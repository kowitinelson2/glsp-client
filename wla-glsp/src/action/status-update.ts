import { Action, hasNumberProp, hasStringProp } from "@eclipse-glsp/client";

// ========== NOTIFICATION ACTION ==========
export interface StatusUpdateAction extends Action {
    kind: typeof StatusUpdateAction.KIND;
    status: string;
    message: string;
    progress: number;
}

export namespace StatusUpdateAction {
    export const KIND = 'statusUpdate';
    
    export function is(object: any): object is StatusUpdateAction {
        return Action.hasKind(object, KIND) && 
               hasStringProp(object, 'status') &&
               hasStringProp(object, 'message') &&
               hasNumberProp(object, 'progress');
    }
    
    export function create(options: {
        status: string;
        message: string;
        progress: number;
    }): StatusUpdateAction {
        return {
            kind: KIND,
            ...options
        };
    }
}