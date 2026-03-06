import { Application } from 'express';

import { PrismaClient } from '@prisma/client';

export interface GundamModule {
    name: string;
    version: string;
    // Inject Express app and Prisma instance to Striker Packs
    init(app: Application, db?: PrismaClient): void;
}
