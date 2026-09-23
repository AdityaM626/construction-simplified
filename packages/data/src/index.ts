import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';

export { PrismaClient } from './generated/prisma/client.js';

export function createDataClient(connectionString = process.env.DATABASE_URL): PrismaClient {
  if (!connectionString) {
    throw new Error('DATABASE_URL is required for PostgreSQL persistence');
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}
