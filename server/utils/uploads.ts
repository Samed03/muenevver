import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Persistenter, vom Docker-Image unabhaengiger Ordner (siehe docker-compose.*.yml: als Volume gemountet).
// "public" (Hobbies-/Reiseziel-Fotos) ist oeffentlich abrufbar, "diary" nur fuer eingeloggte Nutzer
// und nur solange der zugehoerige Tagebuch-Eintrag nicht versiegelt ist.
const baseDir = resolve(process.env.UPLOADS_DIR || '.data/uploads')
export const publicUploadsDir = resolve(baseDir, 'public')
export const diaryUploadsDir = resolve(baseDir, 'diary')

const ALLOWED_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif'
}

const MAX_BYTES = 8 * 1024 * 1024

async function saveImage(dir: string, file: { type?: string, data: Buffer }) {
  const ext = file.type ? ALLOWED_MIME[file.type] : undefined
  if (!ext) {
    throw createError({ statusCode: 400, statusMessage: 'Nur PNG, JPEG, WEBP oder GIF erlaubt' })
  }
  if (file.data.length > MAX_BYTES) {
    throw createError({ statusCode: 400, statusMessage: 'Datei zu gross (max. 8 MB)' })
  }

  await mkdir(dir, { recursive: true })
  const name = `${randomUUID()}.${ext}`
  await writeFile(resolve(dir, name), file.data)
  return name
}

export async function savePublicImage(file: { type?: string, data: Buffer }) {
  const name = await saveImage(publicUploadsDir, file)
  return `/api/uploads/public/${name}`
}

export async function saveDiaryImage(file: { type?: string, data: Buffer }) {
  return saveImage(diaryUploadsDir, file)
}
