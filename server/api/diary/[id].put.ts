import { eq } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { diaryEntries } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Ungueltige ID' })
  }

  const db = useDb()
  const [entry] = await db.select().from(diaryEntries).where(eq(diaryEntries.id, id)).limit(1)
  if (!entry || entry.status !== 'draft') {
    throw createError({ statusCode: 403, statusMessage: 'Nur Entwuerfe koennen bearbeitet werden' })
  }

  const body = await readBody<{ title?: string, content?: string }>(event)
  const title = body.title?.trim()
  const content = body.content?.trim()

  if (!title || !content) {
    throw createError({ statusCode: 400, statusMessage: 'Titel und Text sind erforderlich' })
  }

  await db.update(diaryEntries).set({ title, content }).where(eq(diaryEntries.id, id))
  return { success: true }
})
