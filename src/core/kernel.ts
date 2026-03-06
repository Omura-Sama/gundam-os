import express, { Application } from 'express';
import { GundamModule } from './types';

export class GundamKernel {
    public app: Application;
    private modules: Map<string, GundamModule> = new Map();

    constructor() {
        this.app = express();
        this.app.use(express.json());
    }

    public registerModule(module: GundamModule): void {
        if (this.modules.has(module.name)) {
            console.warn(`Module ${module.name} is already registered.`);
            return;
        }

        module.init(this.app);
        this.modules.set(module.name, module);
        console.log(`[kernel] Striker Pack loaded: ${module.name} (v${module.version})`);
    }

    public boot(port: number = 3000): void {
        this.app.listen(port, () => {
            console.log(`[kernel] Gundam-OS launched. Listening on port ${port}`);
        });
    }
}
