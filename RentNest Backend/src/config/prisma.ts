import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  var __prisma: PrismaClient | undefined;
  var __pool: Pool | undefined;
}

function createPrismaClient(): PrismaClient {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
    max: 5,
    idleTimeoutMillis: 30000,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  global.__pool = pool;
  return prisma;
}

const prisma: PrismaClient = global.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;
