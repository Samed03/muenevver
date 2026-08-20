import { eq } from 'drizzle-orm'
import { useDb } from '../../../database/client'
import { diaryEntries, diaryImages } from '../../../database/schema'
import { saveDiaryImage } from '../../../utils/uploads'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Ungueltige ID' })
  }

  const db = useDb()
  const [entry] = await db.select().from(diaryEntries).where(eq(diaryEntries.id, id)).limit(1)
  if (!entry || entry.status !== 'draft') {
    throw createError({ statusCode: 403, statusMessage: 'Bilder koennen nur bei Entwuerfen hinzugefuegt werden' })
  }

  const files = await readMultipartFormData(event)
  const file = files?.find(f => f.name === 'file')
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'Keine Datei erhalten (Feldname "file")' })
  }

  const path = await saveDiaryImage(file)
  const [result] = await db.insert(diaryImages).values({ diaryEntryId: id, path })

  return { success: true, id: result.insertId, path }
})
