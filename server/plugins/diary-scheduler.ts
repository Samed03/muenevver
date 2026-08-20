import { and, eq, lte } from 'drizzle-orm'
import { useDb } from '../database/client'
import { diaryEntries } from '../database/schema'
import { sendEmail } from '../utils/email'

const CHECK_INTERVAL_MS = 60_000

async function revealDueEntries() {
  const db = useDb()
  const due = await db
    .select()
    .from(diaryEntries)
    .where(and(eq(diaryEntries.status, 'sealed'), lte(diaryEntries.revealAt, new Date())))

  for (const entry of due) {
    await db.update(diaryEntries).set({ status: 'revealed' }).where(eq(diaryEntries.id, entry.id))

    if (entry.notifyEmail) {
      await sendEmail({
        to: entry.notifyEmail,
        subject: `Tagebuch-Eintrag freigeschaltet: ${entry.title}`,
        html: `<p>Der Tagebuch-Eintrag <strong>${entry.title}</strong> ist jetzt sichtbar.</p>`
      }).catch(err => console.error('[diary-scheduler] Mail-Versand fehlgeschlagen:', err))

      await db.update(diaryEntries).set({ sentAt: new Date() }).where(eq(diaryEntries.id, entry.id))
    }
  }
}

// Laeuft im selben Node-Prozess wie die App - kein separater Cron-Job auf dem Server noetig.
export default defineNitroPlugin(() => {
  setInterval(() => {
    revealDueEntries().catch(err => console.error('[diary-scheduler] Fehler:', err))
  }, CHECK_INTERVAL_MS)
})
