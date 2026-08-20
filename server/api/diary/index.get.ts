import { desc } from 'drizzle-orm'
import { useDb } from '../../database/client'
import { diaryEntries } from '../../database/schema'

// Gemeinsames Tagebuch fuer alle eingeloggten Accounts.
// Versiegelte, noch nicht faellige Eintraege werden nur mit Minimal-Infos
// gelistet (nie Titel/Inhalt) - das gilt auch fuer den Ersteller selbst.
export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const rows = await useDb().select().from(diaryEntries).orderBy(desc(diaryEntries.createdAt))

  return rows.map((row) => {
    if (row.status === 'sealed') {
      return { id: row.id, status: row.status, revealAt: row.revealAt, createdAt: row.createdAt }
    }
    return row
  })
})
