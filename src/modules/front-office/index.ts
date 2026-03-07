import { Express } from 'express';
import { GundamModule } from '../../core/types';

export const FrontOfficeModule: GundamModule = {
    name: "Front Office (Main Camera & Sensor Array)",
    version: "1.0.0",
    description: "Mendeteksi leads, mengawasi pergerakan musuh, dan memindai medan tempur operasional bisnis (CRM & Interaksi Pasien).",
    category: "Logistics",
    weight: "Medium",
    installMessage: "Optical Sensor Array Installed.",
    install: (app: Express) => {
        // Mock installation, no real routes needed for this scenario
        console.log("[Front Office] Optical Sensor Array mounting complete.");
    }
};
