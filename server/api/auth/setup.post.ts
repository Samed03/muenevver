import { count } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { users } from '../../database/schema'

// Einmalige Einrichtung des ersten Accounts. Funktioniert nur, solange
// noch kein Nutzer existiert - danach immer 403 (keine offene Registrierung).
export default defineEventHandler(async (event) => {
  const db = useDb()

  const [row] = await db.select({ value: count() }).from(users)
  if ((row?.value ?? 0) > 0) {
    throw createError({ statusCode: 403, statusMessage: 'Einrichtung bereits abgeschlossen' })
  }

  const body = await readBody<{ email?: string, password?: string, name?: string }>(event)
  const email = body.email?.trim().toLowerCase()
  const password = body.password
  const name = body.name?.trim()

  if (!email || !email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Gueltige E-Mail-Adresse erforderlich' })
  }
  if (!password || password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Passwort muss mindestens 8 Zeichen haben' })
  }
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Name erforderlich' })
  }

  const passwordHash = await hashPassword(password)
  const [result] = await db.insert(users).values({ email, passwordHash, name })

  await setUserSession(event, {
    user: { id: result.insertId, email, name }
  })

  return { success: true }
})
