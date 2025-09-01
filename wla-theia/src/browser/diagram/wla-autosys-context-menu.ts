import { Action, hasBooleanProp, hasStringProp, RequestAction, ResponseAction} from '@eclipse-glsp/client';
import { GLSPDiagramWidget } from '@eclipse-glsp/theia-integration';
import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from '@theia/core';
import { ApplicationShell, CommonMenus, LabelProvider } from '@theia/core/lib/browser';
import { inject, injectable } from '@theia/core/shared/inversify';
import { OpenFileDialogProps } from '@theia/filesystem/lib/browser';
import { FileDialogService } from '@theia/filesystem/lib/browser/file-dialog/file-dialog-service';

@injectable()
export class AutosysCommandContribution implements CommandContribution {
    @inject(ApplicationShell) protected readonly shell: ApplicationShell;
    
    @inject(FileDialogService) protected readonly fileDialogService: FileDialogService;

    @inject(MessageService) protected messageService: MessageService;

    @inject(LabelProvider) protected labelProvider: LabelProvider;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(GenerateAutosysCommand, {
            execute: async() => {
                const props: OpenFileDialogProps = {
                    title: 'Select JIL or ZIP file',
                    canSelectFiles: true,
                    canSelectFolders: false,
                    canSelectMany: false,
                    filters: {
                        'Autosys files': ['zip', 'jil']
                    }
                };

                const fileStat = await this.fileDialogService.showOpenDialog(props);
                if(fileStat) {
                    const sourceUri = fileStat.path.toString();

                    //console.log(`Num of shells: ${this.shell.widgets.length}`);

                    const diagramWidget = this.shell.widgets.find(widget => widget instanceof GLSPDiagramWidget) as GLSPDiagramWidget | undefined;

                    let progress;                  

                    try {
                        progress = await this.messageService
                            .showProgress({
                                text: `Generating groups and diagrams from ${sourceUri}`
                            });
                        
                        progress.report({
                            message: "First step completed",
                            work: { done: 40, total: 100 },
                        });

                        let response: GenerateAutosysResponseAction | undefined = undefined;

                        if(diagramWidget) {
                            response = await diagramWidget.actionDispatcher.request(GenerateAutosysRequestAction.create(sourceUri));
                        } else {
                            console.error("No diagram widget");
                        }            
                                
                        progress.report({
                            message: "Complete",
                            work: { done: 100, total: 100 },
                        });

                        if(response) {
                            response.success ? console.log("GOOD WORK") : console.log("FAILURE");
                            console.log(response.message);
                        } else {
                            console.error("No Response");
                        }

                    } catch (error) {
                        console.error('Error during processing:', error);
                        // Progress will be automatically cancelled if an error occurs
                    } finally {
                        progress?.cancel();
                    }
                }
                
                
            }
        })
    }
}

@injectable()
export class AutosysMenuContribution implements MenuContribution {
    static readonly NAVIGATION = CommonMenus.FILE;

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(AutosysMenuContribution.NAVIGATION.concat('n'), {
            commandId: GenerateAutosysCommand.id,
            label: GenerateAutosysCommand.label
        });
    }
}

export const GenerateAutosysCommand: Command = {
    id: 'autosys.generate',
    label: 'Generate Autosys Files ...',
};

export interface GenerateAutosysRequestAction extends RequestAction<GenerateAutosysResponseAction> {
    kind: typeof GenerateAutosysRequestAction.KIND;
    sourceUri: string;  // path to the file or workspace
}

export namespace GenerateAutosysRequestAction {
    export const KIND = 'generateAutosysRequest';

    export function is(object: any): object is GenerateAutosysRequestAction {
        return RequestAction.hasKind(object, KIND) &&
            hasStringProp(object, 'sourceUri');
    }

    export function create(sourceUri: string): GenerateAutosysRequestAction {
        return { kind: KIND, requestId: '', sourceUri};
    }
}

export interface GenerateAutosysResponseAction extends ResponseAction {
    kind: typeof GenerateAutosysResponseAction.KIND;
    success: boolean;
    message?: string;   
}

export namespace GenerateAutosysResponseAction {
    export const KIND = 'generateAutosysResponse';

    export function is(object: any): object is GenerateAutosysResponseAction {
        return Action.hasKind(object, KIND) && hasBooleanProp(object, 'success');
    }

    export function create(options: 
        { 
            success: boolean, 
            message?: string,
            responseId?: string,
        } = { success: true}): GenerateAutosysResponseAction {
        return {
            kind: KIND,
            responseId: '',
            ...options 
        };
    }
}

