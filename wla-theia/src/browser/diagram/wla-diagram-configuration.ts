import { ContainerConfiguration } from '@eclipse-glsp/sprotty';
import { GLSPDiagramConfiguration } from '@eclipse-glsp/theia-integration';
import { Container, injectable } from '@theia/core/shared/inversify';
import { WLALanguage } from '../../common/tasklist-language';
import { initializeWLADiagramContainer } from 'wla-glsp';

@injectable()
export class WLADiagramConfiguration extends GLSPDiagramConfiguration {
    readonly diagramType: string = WLALanguage.diagramType;

    override configureContainer(container: Container, ...containerConfiguration: ContainerConfiguration): void {
        initializeWLADiagramContainer(container, ...containerConfiguration);
    }
    
}
