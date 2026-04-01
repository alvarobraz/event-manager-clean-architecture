import { config } from 'dotenv'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

config({ path: resolve(process.cwd(), '.env'), override: true })

function generateDatabaseURL(schemaId: string) {
  const urlString = process.env.DATABASE_URL

  if (!urlString) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(urlString)
  url.searchParams.set('schema', schemaId)

  return url.toString()
}

export default {
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schemaHash = randomUUID()
    const databaseUrl = generateDatabaseURL(schemaHash)

    process.env.DATABASE_URL = databaseUrl

    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: databaseUrl },
    })

    return {
      async teardown() {
        const pool = new Pool({ connectionString: databaseUrl })
        const adapter = new PrismaPg(pool)
        const prismaTeardown = new PrismaClient({ adapter })

        await prismaTeardown.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schemaHash}" CASCADE`,
        )

        await prismaTeardown.$disconnect()
        await pool.end()
      },
    }
  },
}
