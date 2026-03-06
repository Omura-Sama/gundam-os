import { Application } from 'express';

export interface GundamModule {
    name: string;
    version: string;
    init(app: Application): void;
}
