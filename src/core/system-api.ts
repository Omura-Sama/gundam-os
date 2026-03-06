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
            total_active: activeModules.length,
            data: activeModules
        });
    });

    return router;
}
