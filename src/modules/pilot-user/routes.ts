import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'gundam_os_secret_key_123'; // Replace with strong env variable later

// [CREATE] Register a new Pilot (User)
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name, password, role } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.coreUser.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: role || 'STAFF'
            }
        });

        res.status(201).json({
            message: 'Pilot registered successfully',
            user: { id: newUser.id, email: newUser.email, role: newUser.role }
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({ message: 'Email already exists in roster' });
            return;
        }
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// [AUTH] Pilot Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.coreUser.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials: Pilot not found' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials: Password mismatch' });
            return;
        }

        // Issue JWT Token
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days expiration
        };
        const token = jwt.encode(payload, SECRET_KEY);

        res.json({ message: 'Login successful', token, role: user.role });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// [READ] View all Pilots (Requires Auth / Admin - TBD middleware)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    const users = await prisma.coreUser.findMany({
        select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    res.json(users);
});

export default router;
