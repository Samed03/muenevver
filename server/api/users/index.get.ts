import { useDb } from '../../database/client'
import { users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  return useDb()
    .select({ id: users.id, email: users.email, name: users.name, createdAt: users.createdAt })
    .from(users)
})
