import { useDb } from '../../database/client'
import { users } from '../../database/schema'

// Neue Accounts (z.B. Partner) koennen nur von bereits eingeloggten Nutzern
// angelegt werden - keine oeffentliche Registrierung.
export default defineEventHandler(async (event) => {
  await requireUserSession(event)

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

  try {
    await useDb().insert(users).values({ email, passwordHash, name })
  } catch {
    throw createError({ statusCode: 409, statusMessage: 'E-Mail-Adresse ist bereits registriert' })
  }

  return { success: true }
})
