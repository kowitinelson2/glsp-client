import { ContainerContext, DiagramConfiguration, GLSPClientContribution, GLSPTheiaFrontendModule } from "@eclipse-glsp/theia-integration";
import { GLSPDiagramLanguage } from "@eclipse-glsp/theia-integration/lib/common";
import { WLALanguage } from "../common/tasklist-language";
import { WLADiagramConfiguration } from "./diagram/wla-diagram-configuration";
import { WLAGLSPClientContribution } from "./wla-client-contribution";
import { CommandContribution, MenuContribution } from '@theia/core';
import { WlaNavigationCommandContribution, WlaNavigationMenuContribution } from "./diagram/wla-navigation-context-menu";
import { AutosysCommandContribution, AutosysMenuContribution } from "./diagram/wla-autosys-context-menu";

export class WLATheiaFrontendModule extends GLSPTheiaFrontendModule {
    readonly diagramLanguage: GLSPDiagramLanguage = WLALanguage;

    bindDiagramConfiguration(context: ContainerContext): void {
        context.bind(DiagramConfiguration).to(WLADiagramConfiguration);
    }

    override configure(context: ContainerContext): void {
        context.bind(CommandContribution).to(AutosysCommandContribution);
        context.bind(MenuContribution).to(AutosysMenuContribution);

        context.bind(CommandContribution).to(WlaNavigationCommandContribution);
        context.bind(MenuContribution).to(WlaNavigationMenuContribution);     
    }

    override bindGLSPClientContribution(context: ContainerContext): void {
        context.bind(GLSPClientContribution).to(WLAGLSPClientContribution);
    }
}

export default new WLATheiaFrontendModule();