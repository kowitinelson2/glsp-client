import { Action, hasBooleanProp, hasNumberProp, hasStringProp, RequestAction, ResponseAction } from "@eclipse-glsp/client";

export interface FetchDataRequestAction extends RequestAction<FetchDataResponseAction> {
    kind: typeof FetchDataRequestAction.KIND;
    dataType: string;
    limit: number;
    includeMetadata: boolean;
}

export namespace FetchDataRequestAction {
    export const KIND = 'fetchDataRequest';
    
    export function is(object: any): object is FetchDataRequestAction {
        return RequestAction.hasKind(object, KIND) && 
               hasStringProp(object, 'dataType') &&
               hasNumberProp(object, 'limit') &&
               hasBooleanProp(object, 'includeMetadata');
    }
    
    export function create(options: {
        dataType: string;
        limit?: number;
        includeMetadata?: boolean;
        requestId?: string;
    }): FetchDataRequestAction {
        return {
            kind: KIND,
            requestId: '',
            ...options,
            limit: options.limit ?? 10,
            includeMetadata: options.includeMetadata ?? false
        };
    }
}

// ========== RESPONSE ACTION ==========
export interface DataItem {
    id: string;
    name: string;
    type: string;
    timestamp: number;
}

export interface FetchDataResponseAction extends ResponseAction {
    kind: typeof FetchDataResponseAction.KIND;
    data?: DataItem[];
    metadata?: Record<string, any>;
    success: boolean;
    errorMessage?: string;
}

export namespace FetchDataResponseAction {
    export const KIND = 'fetchDataResponse';
    
    export function is(object: any): object is FetchDataResponseAction {
        return Action.hasKind(object, KIND) && hasBooleanProp(object, 'success');
    }
    
    export function create(options: {
        data?: DataItem[];
        metadata?: Record<string, any>;
        success: boolean;
        errorMessage?: string;
        responseId?: string;
    } = { success: false }): FetchDataResponseAction {
        return {
            kind: KIND,
            responseId: '',
            ...options
        };
    }
}
