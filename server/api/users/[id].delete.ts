import { count, eq } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Ungueltige ID' })
  }

  if (id === user.id) {
    throw createError({ statusCode: 400, statusMessage: 'Der eigene Account kann hier nicht geloescht werden' })
  }

  const db = useDb()
  const [row] = await db.select({ value: count() }).from(users)
  if ((row?.value ?? 0) <= 1) {
    throw createError({ statusCode: 400, statusMessage: 'Der letzte Account kann nicht geloescht werden' })
  }

  await db.delete(users).where(eq(users.id, id))
  return { success: true }
})
