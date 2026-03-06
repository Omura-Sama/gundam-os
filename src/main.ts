import express from 'express';
import { GundamKernel } from './core/kernel';
import { ModuleRegistry } from './core/registry';

const app = express();
const kernel = new GundamKernel();

console.log("--- SYSTEM START: GUNDAM OS ---");

// Parse JSON body
app.use(express.json());

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
ModuleRegistry.forEach(module => {
    kernel.register(module, app);
});

// Launch Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`[CORE] Gundam is standing at http://localhost:${PORT}`);
    console.log(`[CORE] Active Modules: ${kernel.listModules().join(', ')}`);
});
