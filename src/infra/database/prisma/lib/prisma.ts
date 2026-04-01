import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined')
  }

  const url = new URL(connectionString)
  const schema = url.searchParams.get('schema') || 'public'

  url.searchParams.delete('schema')
  const cleanConnectionString = url.toString()

  const pool = new Pool({
    connectionString: cleanConnectionString,

    options: `-c search_path="${schema}"`,
  })

  const adapter = new PrismaPg(pool, { schema })

  return new PrismaClient({ adapter })
}

let prismaClient: PrismaClient | null = null

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    if (!prismaClient) {
      prismaClient = createPrismaClient()
    }

    return prismaClient[prop as keyof PrismaClient]
  },
}) as PrismaClient
