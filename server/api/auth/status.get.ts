import { count } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { users } from '../../database/schema'

// Oeffentlich abfragbar: wird nur genutzt, um zu entscheiden, ob die
// Einrichtungsseite (erster Account) oder der Login gezeigt wird.
export default defineEventHandler(async () => {
  const [row] = await useDb().select({ value: count() }).from(users)
  return { hasUsers: (row?.value ?? 0) > 0 }
})
