import { sql } from 'drizzle-orm'
import { useDb } from '../database/client'

// Einfacher Smoke-Test fuer die DB-Verbindung: GET /api/health
export default defineEventHandler(async () => {
  await useDb().execute(sql`select 1`)
  return { status: 'ok' }
})
