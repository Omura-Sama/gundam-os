import express from 'express';
import { GundamKernel } from './core/kernel';

const app = express();
const kernel = new GundamKernel();

async function powerOn() {
    console.log("--- SYSTEM START: GUNDAM OS ---");

    // Parse JSON body
    app.use(express.json());

    // Base System Radar (Layar Utama)
    app.get('/', (req, res) => {
        res.json({
            system: "GUNDAM-OS Base Master",
            status: "ONLINE",
            core_version: "1.0.0",
            message: "Awaiting pilot commands...",
            active_modules: kernel.listModules() // Tampilkan modul yang aktif di radar
        });
    });

    // Panggil fungsi Auto-Scan dari Kernel
    await kernel.boot(app);

    // Launch Server
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`[CORE] Gundam is standing at http://localhost:${PORT}`);
        console.log(`[CORE] Active Modules: ${kernel.listModules().join(', ')}`);
    });
}

powerOn();
