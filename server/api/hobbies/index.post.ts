import { useDb } from '../../database/client'
import { hobbies } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const body = await readBody<{ icon?: string, title?: string, description?: string, sortOrder?: number }>(event)
  const icon = body.icon?.trim()
  const title = body.title?.trim()
  const description = body.description?.trim()

  if (!icon || !title || !description) {
    throw createError({ statusCode: 400, statusMessage: 'Icon, Titel und Beschreibung sind erforderlich' })
  }

  const [result] = await useDb().insert(hobbies).values({
    icon,
    title,
    description,
    sortOrder: Number.isInteger(body.sortOrder) ? body.sortOrder! : 0
  })

  return { success: true, id: result.insertId }
})
