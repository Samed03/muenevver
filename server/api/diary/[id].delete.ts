import { unlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import { eq } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { diaryEntries, diaryImages } from '../../database/schema'
import { diaryUploadsDir } from '../../utils/uploads'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Ungueltige ID' })
  }

  const db = useDb()
  const [entry] = await db.select().from(diaryEntries).where(eq(diaryEntries.id, id)).limit(1)
  if (!entry || entry.status !== 'draft') {
    throw createError({ statusCode: 403, statusMessage: 'Nur Entwuerfe koennen geloescht werden' })
  }

  const images = await db.select().from(diaryImages).where(eq(diaryImages.diaryEntryId, id))
  await Promise.all(images.map(img => unlink(resolve(diaryUploadsDir, img.path)).catch(() => {})))

  await db.delete(diaryImages).where(eq(diaryImages.diaryEntryId, id))
  await db.delete(diaryEntries).where(eq(diaryEntries.id, id))

  return { success: true }
})
