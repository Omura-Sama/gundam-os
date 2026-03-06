"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kernel_1 = require("./core/kernel");
const system_api_1 = require("./core/system-api"); // <-- Import baru
const app = (0, express_1.default)();
const kernel = new kernel_1.GundamKernel();
async function powerOn() {
    console.log("--- SYSTEM START: GUNDAM OS ---");
    app.use(express_1.default.json()); // Pastikan body-parser aktif
    // 1. Radar Layar Utama
    app.get('/', (req, res) => {
        res.json({
            system: "GUNDAM-OS Base Master",
            status: "ONLINE",
            core_version: "1.0.0",
            message: "Awaiting pilot commands...",
        });
    });
    // 2. Auto-Scan Module (Dynamic Loader)
    await kernel.boot(app);
    // 3. Pasang API Pusat Kontrol (The Cockpit)
    // Ini kita daftarkan SETELAH kernel boot agar bisa membaca modul yang terpasang
    app.use('/api/core', (0, system_api_1.CoreSystemAPI)(kernel));
    // 4. Launch Server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`[CORE] Gundam is standing at http://localhost:${PORT}`);
        console.log(`[CORE] Tactical HUD is ready at /api/core/modules`);
    });
}
powerOn();
