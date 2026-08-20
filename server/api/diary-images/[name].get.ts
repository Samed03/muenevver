import { createReadStream, existsSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { eq } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { diaryEntries, diaryImages } from '../../database/schema'
import { diaryUploadsDir } from '../../utils/uploads'

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif'
}

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  // basename() schneidet jegliches "../" heraus.
  const name = basename(getRouterParam(event, 'name') || '')

  const db = useDb()
  const [image] = await db.select().from(diaryImages).where(eq(diaryImages.path, name)).limit(1)
  if (!image) {
    throw createError({ statusCode: 404, statusMessage: 'Nicht gefunden' })
  }

  const [entry] = await db.select().from(diaryEntries).where(eq(diaryEntries.id, image.diaryEntryId)).limit(1)
  if (!entry || entry.status === 'sealed') {
    throw createError({ statusCode: 404, statusMessage: 'Nicht gefunden' })
  }

  const path = resolve(diaryUploadsDir, name)
  if (!existsSync(path)) {
    throw createError({ statusCode: 404, statusMessage: 'Nicht gefunden' })
  }

  const ext = name.split('.').pop() || ''
  setHeader(event, 'Content-Type', CONTENT_TYPES[ext] || 'application/octet-stream')
  return sendStream(event, createReadStream(path))
})
