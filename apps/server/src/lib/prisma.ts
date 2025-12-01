import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object to prevent
// exhausting your database connection limit in serverless environments.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma

