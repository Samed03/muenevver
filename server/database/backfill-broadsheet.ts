// Einmaliges Backfill-Skript fuer die Broadsheet-Redesign-Migration:
// bestehende Zeilen (aus der Zeit vor dem Redesign) auf die neuen Felder ueberfuehren.
// Idempotent: aendert nur Zeilen, die noch den alten/leeren Zustand haben.
// Aufruf: npx tsx server/database/backfill-broadsheet.ts
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

try {
  process.loadEnvFile()
} catch {
  // optional
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL ist nicht gesetzt')
}

const ICON_MAP: Record<string, string> = {
  '📺': 'television-simple',
  '📓': 'notebook',
  '✈️': 'airplane-tilt',
  '💎': 'diamond'
}

const CODE_MAP: Record<string, string> = {
  '🇪🇸': 'ES',
  '🇮🇹': 'IT',
  '🇳🇱': 'NL',
  '🇲🇦': 'MA',
  '🇭🇺': 'HU',
  '🇹🇷': 'TR',
  '🇲🇨': 'MC',
  '🇫🇷': 'FR',
  '🇨🇭': 'CH',
  '🇯🇵': 'JP'
}

const ABOUT_HEADLINE = 'Soziologie, ein Journal und ein Koffer, der selten lange steht'
const DREAM_DESCRIPTION = 'Noch nicht gestempelt. Steht ganz oben auf der Liste.'

async function main() {
  const pool = mysql.createPool(process.env.DATABASE_URL!)
  const db = drizzle(pool, { schema, mode: 'default' })

  const hobbies = await db.select().from(schema.hobbies)
  for (const hobby of hobbies) {
    const mapped = ICON_MAP[hobby.icon]
    if (mapped) {
      await db.update(schema.hobbies).set({ icon: mapped }).where(eq(schema.hobbies.id, hobby.id))
      console.log(`Hobby #${hobby.id}: Icon "${hobby.icon}" -> "${mapped}"`)
    }
  }

  const destinations = await db.select().from(schema.travelDestinations)
  for (const dest of destinations) {
    const mapped = CODE_MAP[dest.flagEmoji]
    if (mapped && !dest.code) {
      const values: Partial<typeof dest> = { code: mapped }
      if (dest.isDream && !dest.description) values.description = DREAM_DESCRIPTION
      await db.update(schema.travelDestinations).set(values).where(eq(schema.travelDestinations.id, dest.id))
      console.log(`Reiseziel #${dest.id} (${dest.label}): Code "${mapped}"`)
    }
  }

  const [profile] = await db.select().from(schema.profile).where(eq(schema.profile.id, 1))
  if (profile && !profile.aboutHeadline) {
    await db.update(schema.profile).set({ aboutHeadline: ABOUT_HEADLINE }).where(eq(schema.profile.id, 1))
    console.log('Profil: Editorial-Überschrift gesetzt.')
  }

  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
