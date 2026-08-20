import { useDb } from '../../database/client'
import { travelDestinations } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const body = await readBody<{
    code?: string
    label?: string
    photoPath?: string
    description?: string
    isDream?: boolean
    sortOrder?: number
  }>(event)

  const label = body.label?.trim()
  if (!label) {
    throw createError({ statusCode: 400, statusMessage: 'Bezeichnung ist erforderlich' })
  }

  const [result] = await useDb().insert(travelDestinations).values({
    code: body.code?.trim().toUpperCase() ?? '',
    label,
    photoPath: body.photoPath ?? null,
    description: body.description?.trim() ?? null,
    isDream: body.isDream === true,
    sortOrder: Number.isInteger(body.sortOrder) ? body.sortOrder! : 0
  })

  return { success: true, id: result.insertId }
})
