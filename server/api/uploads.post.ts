export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const files = await readMultipartFormData(event)
  const file = files?.find(f => f.name === 'file')

  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'Keine Datei erhalten (Feldname "file")' })
  }

  const url = await savePublicImage(file)
  return { url }
})
