import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService, QuickInputService } from '@theia/core';
import { ApplicationShell } from '@theia/core/lib/browser';
import { inject, injectable } from '@theia/core/shared/inversify';
import { WebSocketConnectionSource } from '@theia/core/lib/browser/messaging/ws-connection-source';
import { GLSPCommandHandler, GLSPContextMenu } from '@eclipse-glsp/theia-integration';
import { NavigateAction } from '@eclipse-glsp/client';
import { isJobNode } from 'wla-glsp/lib/model';

export namespace WlaNavigationCommands {
    export const NEXT_NODE = 'glsp-wla-next-node';
    export const PREVIOUS_NODE = 'glsp-wla-previous-node';
}

const reconnectCommand: Command = {
    id: 'test.reconnect',
    label: 'Test frontend reconnect'
};

@injectable()
export class WlaNavigationCommandContribution implements CommandContribution {
    @inject(ApplicationShell) protected readonly shell: ApplicationShell;

    @inject(WebSocketConnectionSource) protected connectionProvider: WebSocketConnectionSource;

    @inject(QuickInputService) protected readonly quickInputService: QuickInputService;

    @inject(MessageService) protected readonly messageService: MessageService;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(
            { id: WlaNavigationCommands.NEXT_NODE, label: 'Go to Next Node' },
            new GLSPCommandHandler(this.shell, {
                actions: () => [NavigateAction.create('next')],
                isEnabled: context => context.selectedElements.filter(isJobNode).length === 1
            })
        );
        commands.registerCommand(
            { id: WlaNavigationCommands.PREVIOUS_NODE, label: 'Go to Previous Node' },
            new GLSPCommandHandler(this.shell, {
                actions: () => [NavigateAction.create('previous')],
                isEnabled: context => context.selectedElements.filter(isJobNode).length === 1
            })
        );
        commands.registerCommand(reconnectCommand, {
            execute: async () => {
                const timeoutString = await this.quickInputService.input({
                    value: '500',
                    validateInput: input => Promise.resolve(Number.parseInt(input, 10) === undefined ? 'not an integer' : undefined)
                });
                if (timeoutString) {
                    (this.connectionProvider as any).socket.disconnect();
                    setTimeout(
                        () => {
                            (this.connectionProvider as any).socket.connect();
                        },
                        Number.parseInt(timeoutString, 10)
                    );
                }
            }
        });
    }
}

@injectable()
export class WlaNavigationMenuContribution implements MenuContribution {
    static readonly NAVIGATION = GLSPContextMenu.MENU_PATH.concat('navigate');

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(WlaNavigationMenuContribution.NAVIGATION.concat('n'), {
            commandId: WlaNavigationCommands.NEXT_NODE,
            label: 'Next node'
        });
        menus.registerMenuAction(WlaNavigationMenuContribution.NAVIGATION.concat('n'), {
            commandId: WlaNavigationCommands.PREVIOUS_NODE, 
            label: 'Previous node'
        });
    }
    
}