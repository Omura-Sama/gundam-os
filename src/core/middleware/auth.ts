import { Request, Response, NextFunction } from 'express';
import jwt from 'jwt-simple';

const SECRET_KEY = process.env.JWT_SECRET || 'gundam_os_secret_key_123';

// Extend Express Request type to include user payload
export interface AuthRequest extends Request {
    user?: any;
}

export const AuthGuard = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'Unauthorized: No Pilot ID (Token) provided' });
        return;
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        res.status(401).json({ message: 'Unauthorized: Invalid Token Format' });
        return;
    }

    const token = tokenParts[1];

    try {
        const decoded = jwt.decode(token, SECRET_KEY);
        req.user = decoded; // Inject decoded user payload into the request
        next();
    } catch (error: any) {
        if (error.message === 'Token expired') {
            res.status(401).json({ message: 'Unauthorized: Pilot Token has expired' });
        } else {
            res.status(401).json({ message: 'Unauthorized: Invalid or Corrupted Token' });
        }
    }
};
