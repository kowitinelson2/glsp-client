import { BaseGLSPClientContribution } from "@eclipse-glsp/theia-integration";
import { EnvVariablesServer } from "@theia/core/lib/common/env-variables";
import { inject, injectable } from '@theia/core/shared/inversify';
import { WLALanguage } from "../common/tasklist-language";
import { Args, MaybePromise } from '@eclipse-glsp/client';

export interface WLAInitializeOptions {
    timestamp: Date;
    message: string;
}

@injectable()
export class WLAGLSPClientContribution extends BaseGLSPClientContribution {
    @inject(EnvVariablesServer)
    protected readonly envVariablesServer: EnvVariablesServer;

    readonly id = WLALanguage.contributionId;
    readonly fileExtensions = WLALanguage.fileExtensions;

    protected override createInitializeOptions(): MaybePromise<Args | undefined> {
        return {
            ['timestamp']: new Date().toString(),
            ['message']: 'Custom Options Available'
        };
    }
}