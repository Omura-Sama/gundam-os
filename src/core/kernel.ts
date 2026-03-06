import { Express } from 'express';
import { GundamModule } from './types';
import fs from 'fs';
import path from 'path';

export class GundamKernel {
    private installedModules: Map<string, GundamModule> = new Map();

    // Fungsi install satu per satu
    register(module: GundamModule, app: Express) {
        console.log(`[SYSTEM] Initializing Module: ${module.name} v${module.version}...`);
        module.install(app);
        this.installedModules.set(module.name, module);
        console.log(`[SYSTEM] Module ${module.name} is Online! 🛡️`);
    }

    // Fungsi Auto-Scan Folder (Dynamic Loader)
    async boot(app: Express) {
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
                        // Import file index.ts secara dinamis
                        const importedModule = await import(indexPath);

                        // Cari object yang sesuai dengan interface GundamModule
                        for (const key in importedModule) {
                            const mod = importedModule[key];
                            if (mod && mod.name && mod.version && typeof mod.install === 'function') {
                                this.register(mod as GundamModule, app);
                            }
                        }
                    } catch (error) {
                        console.error(`[SYSTEM-ERROR] Failed to load equipment from ${folder}:`, error);
                    }
                }
            }
        }
    }

    listModules() {
        return Array.from(this.installedModules.keys());
    }

    getModuleDetails() {
        const details: Array<{ name: string; version: string; status: string }> = [];
        this.installedModules.forEach((mod) => {
            details.push({
                name: mod.name,
                version: mod.version,
                status: 'Online 🟢'
            });
        });
        return details;
    }
}
