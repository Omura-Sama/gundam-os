import { Express } from 'express';
import { GundamModule } from '../../core/types';
import beamRifleRoutes from './routes';

export const BeamRifleModule: GundamModule = {
    name: "Beam Rifle (Sales Point)",
    version: "1.0.0",
    description: "Sub-sistem Weaponry Control. Menembakkan transaksi langsung ke target Point of Sales (Kasir).",
    category: "Armament / Transaction",
    weight: "Light",
    installMessage: "Beam Rifle Calibrated.",
    install: (app: Express) => {
        // Mount routes under /api/beam-rifle prefix
        app.use('/api/beam-rifle', beamRifleRoutes);
    }
};
