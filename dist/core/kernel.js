"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GundamKernel = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class GundamKernel {
    installedModules = new Map();
    // Fungsi install satu per satu
    register(module, app) {
        console.log(`[SYSTEM] Initializing Module: ${module.name} v${module.version}...`);
        module.install(app);
        this.installedModules.set(module.name, module);
        console.log(`[SYSTEM] Module ${module.name} is Online! 🛡️`);
    }
    // Fungsi Auto-Scan Folder (Dynamic Loader)
    async boot(app) {
        console.log("[SYSTEM] Scanning for Striker Packs in /modules...");
        const modulesPath = path_1.default.join(__dirname, '../modules');
        if (!fs_1.default.existsSync(modulesPath)) {
            console.log("[SYSTEM] No modules directory found. Running Core only.");
            return;
        }
        const folders = fs_1.default.readdirSync(modulesPath);
        for (const folder of folders) {
            const moduleDir = path_1.default.join(modulesPath, folder);
            if (fs_1.default.statSync(moduleDir).isDirectory()) {
                const indexPath = path_1.default.join(moduleDir, 'index.ts');
                if (fs_1.default.existsSync(indexPath)) {
                    try {
                        // Import file index.ts secara dinamis
                        const importedModule = await Promise.resolve(`${indexPath}`).then(s => __importStar(require(s)));
                        // Cari object yang sesuai dengan interface GundamModule
                        for (const key in importedModule) {
                            const mod = importedModule[key];
                            if (mod && mod.name && mod.version && typeof mod.install === 'function') {
                                this.register(mod, app);
                            }
                        }
                    }
                    catch (error) {
                        console.error(`[SYSTEM-ERROR] Failed to load equipment from ${folder}:`, error);
                    }
                }
            }
        }
    }
    listModules() {
        return Array.from(this.installedModules.keys());
    }
}
exports.GundamKernel = GundamKernel;
