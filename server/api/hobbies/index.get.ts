import { asc } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { hobbies } from '../../database/schema'

export default defineEventHandler(async () => {
  return useDb().select().from(hobbies).orderBy(asc(hobbies.sortOrder), asc(hobbies.id))
})
