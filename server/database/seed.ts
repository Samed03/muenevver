// Einmaliger Seed: uebernimmt den bisherigen statischen Inhalt in die DB,
// damit beim Umstieg auf die Verwaltung nichts verloren geht.
// Aufruf: npm run db:seed (idempotent - macht nichts, wenn schon Daten da sind).
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

try {
  process.loadEnvFile()
} catch {
  // .env ist optional (z.B. auf dem Server, wo DATABASE_URL schon in der Umgebung steht)
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL ist nicht gesetzt (siehe .env.example)')
}

async function main() {
  const pool = mysql.createPool(process.env.DATABASE_URL!)
  const db = drizzle(pool, { schema, mode: 'default' })

  const existingProfile = await db.select().from(schema.profile)
  if (existingProfile.length === 0) {
    await db.insert(schema.profile).values({
      id: 1,
      heroTitle: 'Münevver Arslan',
      heroSubtitle: 'Master-Studentin der Soziologie an der Universität Bielefeld',
      aboutHeadline: 'Soziologie, ein Journal und ein Koffer, der selten lange steht',
      aboutText:
        'Ich bin 26 Jahre alt, verheiratet und studiere Soziologie im Master an der Universität '
        + 'Bielefeld. Wenn ich nicht gerade lerne, findet man mich meistens mit einer guten Serie, '
        + 'meinem Journal, einem Diamond-Painting-Bild oder auf Reisen.',
      contactEmail: 'toktas-m@hotmail.de'
    })
    console.log('Profil angelegt.')
  }

  const existingHobbies = await db.select().from(schema.hobbies)
  if (existingHobbies.length === 0) {
    await db.insert(schema.hobbies).values([
      { icon: 'television-simple', title: 'Serien', description: 'Immer auf der Suche nach der nächsten guten Serie.', sortOrder: 0 },
      { icon: 'notebook', title: 'Journaling', description: 'Gedanken, Momente und Erinnerungen im Journal festhalten.', sortOrder: 1 },
      { icon: 'airplane-tilt', title: 'Reisen', description: 'Neue Orte, Kulturen und Perspektiven entdecken.', sortOrder: 2 },
      { icon: 'diamond', title: 'Diamond Painting', description: 'Geduldige, entspannende Handarbeit, Stück für Stück.', sortOrder: 3 }
    ])
    console.log('Hobbies angelegt.')
  }

  const existingTravel = await db.select().from(schema.travelDestinations)
  if (existingTravel.length === 0) {
    await db.insert(schema.travelDestinations).values([
      { code: 'ES', label: 'Spanien', sortOrder: 0 },
      { code: 'IT', label: 'Italien', sortOrder: 1 },
      { code: 'NL', label: 'Niederlande', sortOrder: 2 },
      { code: 'MA', label: 'Marokko', sortOrder: 3 },
      { code: 'HU', label: 'Ungarn', sortOrder: 4 },
      { code: 'TR', label: 'Türkei', sortOrder: 5 },
      { code: 'MC', label: 'Monaco', sortOrder: 6 },
      { code: 'FR', label: 'Frankreich', sortOrder: 7 },
      { code: 'CH', label: 'Schweiz', sortOrder: 8 },
      {
        code: 'JP',
        label: 'Japan & Westasien',
        description: 'Noch nicht gestempelt. Steht ganz oben auf der Liste.',
        isDream: true,
        sortOrder: 9
      }
    ])
    console.log('Reiseziele angelegt.')
  }

  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
