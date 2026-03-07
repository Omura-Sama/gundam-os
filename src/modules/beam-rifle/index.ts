import { Express } from 'express';
import { GundamModule } from '../../core/types';
import beamRifleRoutes from './routes';

export const BeamRifleModule: GundamModule = {
    name: "BeamRifle-Testing",
    version: "1.0.0",
    description: "Weapon module for handling external tactical sales operations.",
    install: (app: Express) => {
        // Mount routes under /api/beam-rifle prefix
        app.use('/api/beam-rifle', beamRifleRoutes);
    }
};
