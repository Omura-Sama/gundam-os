import { Express } from 'express';

export interface GundamModule {
    name: string;
    version: string;
    install: (app: Express) => void;
}
