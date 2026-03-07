import { Express } from 'express';

export interface GundamModule {
    name: string;
    version: string;
    description?: string;
    status?: 'Active' | 'Available' | 'Error';
    autoStart?: boolean;
    install: (app: Express) => void;
}
