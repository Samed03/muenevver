import { eq } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string, password?: string }>(event)
  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'E-Mail und Passwort erforderlich' })
  }

  const [user] = await useDb().select().from(users).where(eq(users.email, email)).limit(1)

  // Bewusst dieselbe Fehlermeldung fuer "kein Account" und "falsches Passwort",
  // damit sich nicht per Timing/Antwort erraten laesst, welche E-Mails existieren.
  const invalid = () => createError({ statusCode: 401, statusMessage: 'E-Mail oder Passwort falsch' })

  if (!user) throw invalid()

  const valid = await verifyPassword(user.passwordHash, password)
  if (!valid) throw invalid()

  await setUserSession(event, {
    user: { id: user.id, email: user.email, name: user.name }
  })

  return { success: true }
})
