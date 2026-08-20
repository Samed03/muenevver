import { eq } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { hobbies } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Ungueltige ID' })
  }

  const body = await readBody<{ icon?: string, title?: string, description?: string, sortOrder?: number }>(event)
  const icon = body.icon?.trim()
  const title = body.title?.trim()
  const description = body.description?.trim()

  if (!icon || !title || !description) {
    throw createError({ statusCode: 400, statusMessage: 'Icon, Titel und Beschreibung sind erforderlich' })
  }

  await useDb()
    .update(hobbies)
    .set({ icon, title, description, sortOrder: Number.isInteger(body.sortOrder) ? body.sortOrder : undefined })
    .where(eq(hobbies.id, id))

  return { success: true }
})
