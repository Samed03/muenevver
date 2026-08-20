import { eq } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { diaryEntries, diaryImages } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Ungueltige ID' })
  }

  const db = useDb()
  const [entry] = await db.select().from(diaryEntries).where(eq(diaryEntries.id, id)).limit(1)

  // Versiegelte Eintraege: 404 statt 403, damit auch aus der Fehlerantwort
  // nicht ablesbar ist, dass darunter tatsaechlich Inhalt liegt.
  if (!entry || entry.status === 'sealed') {
    throw createError({ statusCode: 404, statusMessage: 'Nicht gefunden' })
  }

  const images = await db.select().from(diaryImages).where(eq(diaryImages.diaryEntryId, id))
  return { ...entry, images }
})
