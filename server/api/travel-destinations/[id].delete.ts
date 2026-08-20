import { eq } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { travelDestinations } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Ungueltige ID' })
  }

  await useDb().delete(travelDestinations).where(eq(travelDestinations.id, id))
  return { success: true }
})
