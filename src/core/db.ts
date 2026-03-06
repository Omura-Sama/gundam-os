import { PrismaClient } from '@prisma/client';

// Singleton Prisma instance for the entire application
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
