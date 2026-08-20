import { eq } from 'drizzle-orm'
import { useDb } from '../database/client'
import { profile } from '../database/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const body = await readBody<{
    heroTitle?: string
    heroSubtitle?: string
    aboutHeadline?: string
    aboutText?: string
    portraitPath?: string | null
    contactEmail?: string
  }>(event)

  const heroTitle = body.heroTitle?.trim()
  const heroSubtitle = body.heroSubtitle?.trim()
  const aboutHeadline = body.aboutHeadline?.trim()
  const aboutText = body.aboutText?.trim()
  const contactEmail = body.contactEmail?.trim()

  if (!heroTitle || !heroSubtitle || !aboutHeadline || !aboutText || !contactEmail) {
    throw createError({ statusCode: 400, statusMessage: 'Alle Felder sind erforderlich' })
  }

  await useDb()
    .update(profile)
    .set({ heroTitle, heroSubtitle, aboutHeadline, aboutText, portraitPath: body.portraitPath ?? null, contactEmail })
    .where(eq(profile.id, 1))

  return { success: true }
})
