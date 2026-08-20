import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

function createDb() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'DATABASE_URL ist nicht konfiguriert' })
  }

  const pool = mysql.createPool(databaseUrl)
  return drizzle(pool, { schema, mode: 'default' })
}

let db: ReturnType<typeof createDb> | undefined

export function useDb() {
  if (!db) db = createDb()
  return db
}
