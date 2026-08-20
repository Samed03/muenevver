import { createReadStream, existsSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { publicUploadsDir } from '../../../utils/uploads'

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif'
}

export default defineEventHandler((event) => {
  // basename() schneidet jegliches "../" heraus - es kann nichts ausserhalb von publicUploadsDir gelesen werden.
  const name = basename(getRouterParam(event, 'name') || '')
  const path = resolve(publicUploadsDir, name)

  if (!existsSync(path)) {
    throw createError({ statusCode: 404, statusMessage: 'Nicht gefunden' })
  }

  const ext = name.split('.').pop() || ''
  setHeader(event, 'Content-Type', CONTENT_TYPES[ext] || 'application/octet-stream')
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  return sendStream(event, createReadStream(path))
})
