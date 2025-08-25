import { Action, IActionHandler } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { DataItem, FetchDataResponseAction } from '../action/fetch-data';

@injectable()
export class FetchDataResponseHandler implements IActionHandler {
    
    handle(action: FetchDataResponseAction): void | Action {
        if (FetchDataResponseAction.is(action)) {
            this.handleFetchDataResponse(action);
        }
    }
    
    private handleFetchDataResponse(action: FetchDataResponseAction): void {
        if (action.success && action.data) {
            console.log('Data fetch successful:', action.data);
            console.log('Items received:', action.data.length);
            
            if (action.metadata) {
                console.log('Metadata:', action.metadata);
            }
            
            // Update UI or application state
            this.updateDataDisplay(action.data);
        } else {
            console.error('Data fetch failed:', action.errorMessage);
            this.showError(action.errorMessage || 'Unknown error occurred');
        }
    }
    
    private updateDataDisplay(data: DataItem[]): void {
        // Implement UI update logic here
        console.log('Updating data display with:', data.map(item => item.name).join(', '));
    }
    
    private showError(message: string): void {
        // Implement error display logic here
        console.error('Error to display:', message);
    }
}

