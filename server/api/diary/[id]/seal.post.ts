import { eq } from 'drizzle-orm'
import { useDb } from '../../../database/client'
import { diaryEntries } from '../../../database/schema'

// Versiegeln ist eine Einbahnstrasse: danach ist der Eintrag fuer niemanden
// mehr sichtbar oder bearbeitbar, bis das Reveal-Datum erreicht ist
// (siehe server/plugins/diary-scheduler.ts).
export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Ungueltige ID' })
  }

  const db = useDb()
  const [entry] = await db.select().from(diaryEntries).where(eq(diaryEntries.id, id)).limit(1)
  if (!entry || entry.status !== 'draft') {
    throw createError({ statusCode: 403, statusMessage: 'Nur Entwuerfe koennen versiegelt werden' })
  }

  const body = await readBody<{ revealAt?: string, notifyEmail?: string }>(event)
  const revealAt = body.revealAt ? new Date(body.revealAt) : null
  const notifyEmail = body.notifyEmail?.trim()

  if (!revealAt || Number.isNaN(revealAt.getTime()) || revealAt.getTime() <= Date.now()) {
    throw createError({ statusCode: 400, statusMessage: 'Reveal-Datum muss in der Zukunft liegen' })
  }
  if (notifyEmail && !notifyEmail.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Ungueltige E-Mail-Adresse' })
  }

  await db
    .update(diaryEntries)
    .set({ status: 'sealed', revealAt, notifyEmail: notifyEmail || null })
    .where(eq(diaryEntries.id, id))

  return { success: true }
})
