<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

const { data: profile, refresh } = await useFetch('/api/profile')

const form = reactive({
  heroTitle: profile.value?.heroTitle ?? '',
  heroSubtitle: profile.value?.heroSubtitle ?? '',
  aboutHeadline: profile.value?.aboutHeadline ?? '',
  aboutText: profile.value?.aboutText ?? '',
  portraitPath: profile.value?.portraitPath ?? null as string | null,
  contactEmail: profile.value?.contactEmail ?? ''
})

const saving = ref(false)
const uploading = ref(false)
const savedAt = ref<string | null>(null)
const error = ref('')

async function uploadPortrait(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const body = new FormData()
    body.append('file', file)
    const { url } = await $fetch<{ url: string }>('/api/uploads', { method: 'POST', body })
    form.portraitPath = url
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function onSubmit() {
  saving.value = true
  error.value = ''
  try {
    await $fetch('/api/profile', { method: 'PUT', body: form })
    savedAt.value = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    await refresh()
  } catch (err) {
    error.value = errorMessage(err, 'Fehler beim Speichern')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <span style="display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 14px">Bearbeiten</span>
    <h1 style="font-size: clamp(32px, 4.4vw, 52px); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 14px">Profil</h1>
    <p style="font-size: 15.5px; line-height: 28px; margin: 0 0 56px; max-width: 52ch; color: var(--color-neutral-700)">
      Titel, Untertitel, Über-mich-Text und Kontaktadresse der Startseite.
    </p>

    <form style="display: grid; grid-template-columns: minmax(0, 620px); gap: 20px" @submit.prevent="onSubmit">
      <div class="field">
        <label for="p-titel">Hero-Titel</label>
        <input id="p-titel" v-model="form.heroTitle" class="input" type="text" required>
      </div>
      <div class="field">
        <label for="p-sub">Hero-Untertitel</label>
        <input id="p-sub" v-model="form.heroSubtitle" class="input" type="text" required>
      </div>
      <div class="field">
        <label for="p-headline">Editorial-Überschrift (über dem Über-mich-Text)</label>
        <input id="p-headline" v-model="form.aboutHeadline" class="input" type="text" required>
      </div>
      <div class="field">
        <label for="p-about">Über-mich-Text</label>
        <textarea id="p-about" v-model="form.aboutText" class="input" rows="6" required />
      </div>
      <div class="field">
        <label>Porträtfoto</label>
        <div style="display: flex; align-items: center; gap: 20px">
          <div class="halftone" style="width: 96px; aspect-ratio: 4 / 5; flex: none">
            <img v-if="form.portraitPath" :src="form.portraitPath" alt="Porträt">
            <div v-else class="halftone-placeholder" style="font-size: 11px">Kein Foto</div>
          </div>
          <label class="btn btn-ghost" style="cursor: pointer">
            {{ uploading ? 'Lädt hoch ...' : 'Foto hochladen' }}
            <input type="file" accept="image/*" style="display: none" :disabled="uploading" @change="uploadPortrait">
          </label>
        </div>
      </div>
      <div class="field">
        <label for="p-mail">Kontakt-E-Mail</label>
        <input id="p-mail" v-model="form.contactEmail" class="input" type="email" required>
      </div>
      <div style="display: flex; gap: 20px; align-items: center; margin-top: 14px">
        <button class="btn btn-primary" type="submit" :disabled="saving">{{ saving ? 'Speichert ...' : 'Speichern' }}</button>
        <span v-if="savedAt" style="font-size: 13px; color: var(--color-neutral-700)">Zuletzt gespeichert: heute, {{ savedAt }}</span>
        <span v-if="error" style="font-size: 13px; color: var(--color-accent-2-700)">{{ error }}</span>
      </div>
    </form>
  </div>
</template>
