import { Express } from 'express';

export interface GundamModule {
    name: string;
    version: string;
    description?: string;
    category?: string;
    weight?: 'Light' | 'Medium' | 'Heavy';
    status?: 'Active' | 'Available' | 'Error';
    autoStart?: boolean;
    installMessage?: string;
    install: (app: Express) => void;
}
