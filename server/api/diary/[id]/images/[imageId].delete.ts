import { unlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import { and, eq } from 'drizzle-orm'
import { useDb } from '../../../../database/client'
import { diaryEntries, diaryImages } from '../../../../database/schema'
import { diaryUploadsDir } from '../../../../utils/uploads'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const id = Number(getRouterParam(event, 'id'))
  const imageId = Number(getRouterParam(event, 'imageId'))
  if (!Number.isInteger(id) || !Number.isInteger(imageId)) {
    throw createError({ statusCode: 400, statusMessage: 'Ungueltige ID' })
  }

  const db = useDb()
  const [entry] = await db.select().from(diaryEntries).where(eq(diaryEntries.id, id)).limit(1)
  if (!entry || entry.status !== 'draft') {
    throw createError({ statusCode: 403, statusMessage: 'Bilder koennen nur bei Entwuerfen entfernt werden' })
  }

  const [image] = await db
    .select()
    .from(diaryImages)
    .where(and(eq(diaryImages.id, imageId), eq(diaryImages.diaryEntryId, id)))
    .limit(1)
  if (!image) {
    throw createError({ statusCode: 404, statusMessage: 'Nicht gefunden' })
  }

  await unlink(resolve(diaryUploadsDir, image.path)).catch(() => {})
  await db.delete(diaryImages).where(eq(diaryImages.id, imageId))

  return { success: true }
})
