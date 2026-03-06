import { Router, Request, Response } from 'express';
import { AuthGuard, AuthRequest } from '../../core/middleware/auth';

const router = Router();

// Endpoint status senjata (Public)
router.get('/status', (req: Request, res: Response) => {
    res.json({ status: 'Weapon Armed & Ready!', power: '100%' });
});

// Endpoint untuk tembakan (Protected Action)
router.post('/fire', AuthGuard, (req: AuthRequest, res: Response) => {
    const pilotName = req.user?.name || req.user?.email || 'Unknown Pilot';
    res.json({
        action: 'PEW PEW PEW!',
        target: 'Destroyed',
        firedBy: pilotName
    });
});

export default router;
