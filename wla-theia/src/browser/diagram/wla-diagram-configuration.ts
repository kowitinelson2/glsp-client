import { ContainerConfiguration } from '@eclipse-glsp/sprotty';
import { Container, injectable } from '@theia/core/shared/inversify';
import { WLALanguage } from '../../common/tasklist-language';
//import { initializeWLADiagramContainer } from '../../../../wla-glsp/src/wla-diagram-module';
import { initializeWLADiagramContainer } from 'wla-glsp';
import { GLSPDiagramConfiguration } from '@eclipse-glsp/theia-integration';

@injectable()
export class WLADiagramConfiguration extends GLSPDiagramConfiguration {
    readonly diagramType: string = WLALanguage.diagramType;

    override configureContainer(container: Container, ...containerConfiguration: ContainerConfiguration): void {
        initializeWLADiagramContainer(container, ...containerConfiguration);
    }
    
}
