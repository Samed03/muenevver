import { asc } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { travelDestinations } from '../../database/schema'

export default defineEventHandler(async () => {
  return useDb()
    .select()
    .from(travelDestinations)
    .orderBy(asc(travelDestinations.sortOrder), asc(travelDestinations.id))
})
