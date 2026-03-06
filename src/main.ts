import express from 'express';
import { GundamKernel } from './core/kernel';
import { CoreSystemAPI } from './core/system-api'; // <-- Import baru

const app = express();
const kernel = new GundamKernel();

async function powerOn() {
    console.log("--- SYSTEM START: GUNDAM OS ---");
    app.use(express.json()); // Pastikan body-parser aktif

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
    app.use('/api/core', CoreSystemAPI(kernel));

    // 4. Launch Server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`[CORE] Gundam is standing at http://localhost:${PORT}`);
        console.log(`[CORE] Tactical HUD is ready at /api/core/modules`);
    });
}

powerOn();
