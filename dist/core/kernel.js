"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GundamKernel = void 0;
class GundamKernel {
    installedModules = new Map();
    register(module, app) {
        console.log(`[SYSTEM] Initializing Module: ${module.name} v${module.version}...`);
        module.install(app);
        this.installedModules.set(module.name, module);
        console.log(`[SYSTEM] Module ${module.name} is Online! 🛡️`);
    }
    listModules() {
        return Array.from(this.installedModules.keys());
    }
}
exports.GundamKernel = GundamKernel;
