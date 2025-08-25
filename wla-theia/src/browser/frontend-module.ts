import { ContainerContext, DiagramConfiguration, GLSPClientContribution, GLSPTheiaFrontendModule } from "@eclipse-glsp/theia-integration";
import { GLSPDiagramLanguage } from "@eclipse-glsp/theia-integration/lib/common";
import { WLALanguage } from "../common/tasklist-language";
import { WLADiagramConfiguration } from "./diagram/wla-diagram-configuration";
import { WLAGLSPClientContribution } from "./wla-client-contribution";

export class WLATheiaFrontendModule extends GLSPTheiaFrontendModule {
    readonly diagramLanguage: GLSPDiagramLanguage = WLALanguage;

    bindDiagramConfiguration(context: ContainerContext): void {
        context.bind(DiagramConfiguration).to(WLADiagramConfiguration);
    }

    override bindGLSPClientContribution(context: ContainerContext): void {
        context.bind(GLSPClientContribution).to(WLAGLSPClientContribution);
    }
}

export default new WLATheiaFrontendModule();