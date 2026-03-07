import { Router, Request, Response } from 'express';
import { GundamKernel } from './kernel';
import os from 'os';

// Fungsi ini menerima instance dari kernel agar bisa membaca data yang sedang berjalan
export function CoreSystemAPI(kernel: GundamKernel) {
    const router = Router();

    // Endpoint: Core OS Health Telemetry
    router.get('/health', (req: Request, res: Response) => {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memoryUsageRatio = (usedMem / totalMem) * 100;

        // Mendapatkan Load CPU 1 Menit terakhir
        const loadAvg = os.loadavg();

        res.json({
            message: "Tactical HUD: Core Vital Signs",
            data: {
                uptime: process.uptime(),
                cpuLoad: loadAvg[0], // 1 minute load average
                memory: {
                    total: totalMem,
                    free: freeMem,
                    used: usedMem,
                    usagePercent: memoryUsageRatio.toFixed(2)
                }
            }
        });
    });

    // Endpoint Tactical HUD: Melihat daftar persenjataan/modul yang aktif
    // TODO: Integrasikan dengan middleware JWT Auth (isSuperAdmin) di sini nantinya
    router.get('/modules', (req: Request, res: Response) => {
        const activeModules = kernel.getModuleDetails();

        res.json({
            message: "Tactical HUD: Module Status Report",
            total_modules: activeModules.length,
            data: activeModules
        });
    });

    router.post('/modules/install', (req: Request, res: Response) => {
        const { moduleName } = req.body;

        if (!moduleName) {
            return res.status(400).json({ message: "Module name required." });
        }

        const result = kernel.activateModule(moduleName);

        if (result.success) {
            res.json({
                message: `Striker Pack ${moduleName} activated successfully!`,
                installMessage: result.installMessage
            });
        } else {
            res.status(404).json({ message: `Module ${moduleName} not found or already active.` });
        }
    });

    return router;
}
