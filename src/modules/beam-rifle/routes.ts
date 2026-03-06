import { Router, Request, Response } from 'express';

const router = Router();

// Endpoint status senjata
router.get('/status', (req: Request, res: Response) => {
    res.json({ status: 'Weapon Armed & Ready!', power: '100%' });
});

// Endpoint untuk tembakan (contoh transaksi/action)
router.post('/fire', (req: Request, res: Response) => {
    res.json({ action: 'PEW PEW PEW!', target: 'Destroyed' });
});

export default router;
