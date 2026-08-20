import { eq } from 'drizzle-orm'
import { useDb } from '../database/client'
import { profile } from '../database/schema'

// Oeffentlich: liefert die Inhalte fuer die Startseite.
export default defineEventHandler(async () => {
  const [row] = await useDb().select().from(profile).where(eq(profile.id, 1)).limit(1)
  return row ?? null
})
