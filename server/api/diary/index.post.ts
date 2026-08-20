import { useDb } from '../../database/client'
import { diaryEntries } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const body = await readBody<{ title?: string, content?: string }>(event)
  const title = body.title?.trim()
  const content = body.content?.trim()

  if (!title || !content) {
    throw createError({ statusCode: 400, statusMessage: 'Titel und Text sind erforderlich' })
  }

  const [result] = await useDb().insert(diaryEntries).values({
    title,
    content,
    status: 'draft',
    createdBy: user.id
  })

  return { success: true, id: result.insertId }
})
