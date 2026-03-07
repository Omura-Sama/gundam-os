import { Express } from 'express';
import { GundamModule } from '../../core/types';

export const FrontOfficeModule: GundamModule = {
    name: "Front Office (Optical Sensor Array)",
    version: "1.0.0",
    description: "Core reception and triage operations system.",
    category: "Logistics",
    weight: "Medium",
    installMessage: "Optical Sensor Array Installed.",
    install: (app: Express) => {
        // Mock installation, no real routes needed for this scenario
        console.log("[Front Office] Optical Sensor Array mounting complete.");
    }
};
