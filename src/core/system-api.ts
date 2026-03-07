import { Router, Request, Response } from 'express';
import { GundamKernel } from './kernel';

// Fungsi ini menerima instance dari kernel agar bisa membaca data yang sedang berjalan
export function CoreSystemAPI(kernel: GundamKernel) {
    const router = Router();

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

        const success = kernel.activateModule(moduleName);

        if (success) {
            res.json({ message: `Striker Pack ${moduleName} activated successfully!` });
        } else {
            res.status(404).json({ message: `Module ${moduleName} not found or already active.` });
        }
    });

    return router;
}
