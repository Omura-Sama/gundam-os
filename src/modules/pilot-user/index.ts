import { Express } from 'express';
import { GundamModule } from '../../core/types';
import pilotUserRoutes from './routes';

export const PilotUserModule: GundamModule = {
    name: 'Pilot-User (Multi-Core Co-Pilot System)',
    version: '2.0.0',
    description: "Hierarki otorisasi pengguna. Kemampuan mentransfer kendali antar Pilot/Co-Pilot dengan peran ganda yang saling tumpang tindih (G-Fighter mode).",
    category: "Core Engine",
    weight: "Heavy",
    autoStart: true,
    install: (app: Express) => {
        // Mount routes under /api/pilot prefix
        app.use('/api/pilot', pilotUserRoutes);
        console.log(`[MODULE] Pilot-Roster mounted at /api/pilot`);
    }
};
