import { bindAsService, GLSPServerContribution } from '@eclipse-glsp/theia-integration/lib/node';
import { ContainerModule } from '@theia/core/shared/inversify';
import { WLAGLSPServerContribution } from './glsp-server-contribution';

export default new ContainerModule(bind => {
    bindAsService(bind, GLSPServerContribution, WLAGLSPServerContribution);
});

