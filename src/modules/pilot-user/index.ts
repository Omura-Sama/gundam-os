import { Express } from 'express';
import { GundamModule } from '../../core/types';
import pilotUserRoutes from './routes';

export const PilotUserModule: GundamModule = {
    name: 'Pilot-Roster',
    version: '1.0.0',
    description: "Core roster module managing Pilot authentication and HR security.",
    autoStart: true,
    install: (app: Express) => {
        // Mount routes under /api/pilot prefix
        app.use('/api/pilot', pilotUserRoutes);
        console.log(`[MODULE] Pilot-Roster mounted at /api/pilot`);
    }
};
