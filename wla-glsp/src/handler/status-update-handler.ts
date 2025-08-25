import { Action, IActionHandler } from "@eclipse-glsp/client";
import { StatusUpdateAction } from "../action/status-update";
import { injectable } from 'inversify';

@injectable()
export class StatusUpdateHandler implements IActionHandler {
    
    handle(action: StatusUpdateAction): void | Action {
        if (StatusUpdateAction.is(action)) {
            this.handleStatusUpdate(action);
        }
    }
    
    private handleStatusUpdate(action: StatusUpdateAction): void {
        console.log(`Status: ${action.status} | ${action.message} | Progress: ${action.progress}%`);
        
        switch (action.status) {
            case 'processing':
                this.showProcessingIndicator(action.message, action.progress);
                break;
            case 'completed':
                this.hideProcessingIndicator();
                this.showSuccessMessage(action.message);
                break;
            case 'error':
                this.hideProcessingIndicator();
                this.showErrorMessage(action.message);
                break;
        }
    }
    
    private showProcessingIndicator(message: string, progress: number): void {
        // Implement progress indicator UI
        console.log(`Processing: ${message} (${progress}%)`);
    }
    
    private hideProcessingIndicator(): void {
        // Hide progress indicator
        console.log('Processing completed, hiding indicator');
    }
    
    private showSuccessMessage(message: string): void {
        // Show success notification
        console.log(`Success: ${message}`);
    }
    
    private showErrorMessage(message: string): void {
        // Show error notification
        console.error(`Error: ${message}`);
    }
}