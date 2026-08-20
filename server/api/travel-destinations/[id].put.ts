import { eq } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { travelDestinations } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Ungueltige ID' })
  }

  const body = await readBody<{
    flagEmoji?: string
    label?: string
    photoPath?: string | null
    isDream?: boolean
    sortOrder?: number
  }>(event)

  const label = body.label?.trim()
  if (!label) {
    throw createError({ statusCode: 400, statusMessage: 'Bezeichnung ist erforderlich' })
  }

  await useDb()
    .update(travelDestinations)
    .set({
      flagEmoji: body.flagEmoji?.trim() ?? '',
      label,
      photoPath: body.photoPath ?? null,
      isDream: body.isDream === true,
      sortOrder: Number.isInteger(body.sortOrder) ? body.sortOrder : undefined
    })
    .where(eq(travelDestinations.id, id))

  return { success: true }
})
