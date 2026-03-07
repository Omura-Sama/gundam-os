import { Express } from 'express';
import { GundamModule } from './types';
import fs from 'fs';
import path from 'path';

export class GundamKernel {
    private installedModules: Map<string, GundamModule> = new Map();
    private availableModules: Map<string, GundamModule> = new Map();
    private appInstance?: Express;

    // Fungsi install satu per satu
    register(module: GundamModule, app: Express) {
        if (this.installedModules.has(module.name)) return;

        console.log(`[SYSTEM] Initializing Module: ${module.name} v${module.version}...`);
        module.install(app);
        this.installedModules.set(module.name, module);
        this.availableModules.delete(module.name);
        console.log(`[SYSTEM] Module ${module.name} is Online! 🛡️`);
    }

    // Fungsi Auto-Scan Folder (Dynamic Loader/Discovery)
    async boot(app: Express) {
        this.appInstance = app;
        console.log("[SYSTEM] Scanning for Striker Packs in /modules...");
        const modulesPath = path.join(__dirname, '../modules');

        if (!fs.existsSync(modulesPath)) {
            console.log("[SYSTEM] No modules directory found. Running Core only.");
            return;
        }

        const folders = fs.readdirSync(modulesPath);

        for (const folder of folders) {
            const moduleDir = path.join(modulesPath, folder);

            if (fs.statSync(moduleDir).isDirectory()) {
                const indexPath = path.join(moduleDir, 'index.ts');

                if (fs.existsSync(indexPath)) {
                    try {
                        const importedModule = await import(indexPath);

                        for (const key in importedModule) {
                            const mod = importedModule[key] as GundamModule;
                            if (mod && mod.name && mod.version && typeof mod.install === 'function') {
                                if (mod.autoStart) {
                                    this.register(mod, app);
                                } else {
                                    this.availableModules.set(mod.name, mod);
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`[SYSTEM-ERROR] Failed to load equipment from ${folder}:`, error);
                    }
                }
            }
        }
    }

    activateModule(name: string): boolean {
        if (!this.appInstance) throw new Error("Core system not running.");

        const modToInstall = this.availableModules.get(name);
        if (!modToInstall) return false;

        this.register(modToInstall, this.appInstance);
        return true;
    }

    listModules() {
        return Array.from(this.installedModules.keys());
    }

    getModuleDetails() {
        const details: Array<{ name: string; version: string; description?: string; status: string }> = [];

        this.installedModules.forEach((mod) => {
            details.push({
                name: mod.name,
                version: mod.version,
                description: mod.description,
                status: 'Active 🟢'
            });
        });

        this.availableModules.forEach((mod) => {
            details.push({
                name: mod.name,
                version: mod.version,
                description: mod.description,
                status: 'Available 🟡'
            });
        });

        return details;
    }
}
