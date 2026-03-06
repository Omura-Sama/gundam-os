"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kernel_1 = require("./core/kernel");
const registry_1 = require("./core/registry");
const app = (0, express_1.default)();
const kernel = new kernel_1.GundamKernel();
console.log("--- SYSTEM START: GUNDAM OS ---");
// Parse JSON body
app.use(express_1.default.json());
// Base System Radar
app.get('/', (req, res) => {
    res.json({
        system: "GUNDAM-OS Base Master",
        status: "ONLINE",
        core_version: "1.0.0",
        message: "Awaiting pilot commands..."
    });
});
// Install all Striker Packs from Registry
registry_1.ModuleRegistry.forEach(module => {
    kernel.register(module, app);
});
// Launch Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`[CORE] Gundam is standing at http://localhost:${PORT}`);
    console.log(`[CORE] Active Modules: ${kernel.listModules().join(', ')}`);
});
