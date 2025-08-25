import { getPort, GLSPSocketServerContribution, GLSPSocketServerContributionOptions } from '@eclipse-glsp/theia-integration/lib/node';
import { injectable } from '@theia/core/shared/inversify';
import { join, resolve } from 'path';
import { WLALanguage } from '../common/tasklist-language';

export const DEFAULT_PORT = 0;
export const PORT_ARG_KEY = 'WLA_GLSP';
export const LOG_DIR = join(__dirname, '..', '..', 'logs');
const JAR_FILE = resolve(
    join(__dirname, '..', '..', '..', '..', 'glsp-server', 'target', 'org.eclipse.glsp.example.javaemf-2.3.0-glsp.jar')
);

@injectable()
export class WLAGLSPServerContribution extends GLSPSocketServerContribution {
    readonly id = WLALanguage.contributionId;

    createContributionOptions(): Partial<GLSPSocketServerContributionOptions> {
        return {
            executable: JAR_FILE,
            additionalArgs: ['--consoleLog', 'true', '--fileLog', 'true', '--logDir', LOG_DIR],
            socketConnectionOptions: {
                port: getPort(PORT_ARG_KEY, DEFAULT_PORT)
            }
        };
    }

    protected override processLogInfo(line: string): void {
        super.processLogInfo(line);
        console.info(`${this.id}: ${line}`);
    }
}
