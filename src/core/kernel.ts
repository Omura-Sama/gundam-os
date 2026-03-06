import { Express } from 'express';
import { GundamModule } from './types';

export class GundamKernel {
    private installedModules: Map<string, GundamModule> = new Map();

    register(module: GundamModule, app: Express) {
        console.log(`[SYSTEM] Initializing Module: ${module.name} v${module.version}...`);
        module.install(app);
        this.installedModules.set(module.name, module);
        console.log(`[SYSTEM] Module ${module.name} is Online! 🛡️`);
    }

    listModules() {
        return Array.from(this.installedModules.keys());
    }
}
