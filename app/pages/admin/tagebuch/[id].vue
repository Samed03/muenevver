<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

interface DiaryImage { id: number, path: string }
interface Entry {
  id: number
  title: string
  content: string
  status: 'draft' | 'sealed' | 'revealed'
  images: DiaryImage[]
}

const route = useRoute()
const id = Number(route.params.id)

const { data: entry, refresh } = await useFetch<Entry>(`/api/diary/${id}`)

const title = ref(entry.value?.title ?? '')
const content = ref(entry.value?.content ?? '')
const saving = ref(false)
const message = ref('')
const uploading = ref(false)

const revealAt = ref('')
const notifyEmail = ref('')
const sealing = ref(false)
const sealError = ref('')

async function save() {
  saving.value = true
  message.value = ''
  try {
    await $fetch(`/api/diary/${id}`, { method: 'PUT', body: { title: title.value, content: content.value } })
    message.value = 'Gespeichert.'
  } catch (err) {
    message.value = errorMessage(err, 'Fehler beim Speichern')
  } finally {
    saving.value = false
  }
}

async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const body = new FormData()
    body.append('file', file)
    await $fetch(`/api/diary/${id}/images`, { method: 'POST', body })
    await refresh()
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function removeImage(imageId: number) {
  await $fetch(`/api/diary/${id}/images/${imageId}`, { method: 'DELETE' })
  await refresh()
}

async function seal() {
  sealError.value = ''
  if (!revealAt.value) {
    sealError.value = 'Bitte ein Datum angeben.'
    return
  }
  if (!confirm('Nach dem Versiegeln ist dieser Eintrag bis zum Reveal-Datum für niemanden mehr sichtbar oder bearbeitbar - auch nicht für dich. Fortfahren?')) {
    return
  }

  sealing.value = true
  try {
    await $fetch(`/api/diary/${id}/seal`, {
      method: 'POST',
      body: { revealAt: new Date(revealAt.value).toISOString(), notifyEmail: notifyEmail.value || undefined }
    })
    await navigateTo('/admin/tagebuch')
  } catch (err) {
    sealError.value = errorMessage(err, 'Fehler beim Versiegeln')
  } finally {
    sealing.value = false
  }
}
</script>

<template>
  <div style="max-width: 620px">
    <span style="display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 14px">Bearbeiten</span>

    <template v-if="entry?.status === 'draft'">
      <h1 style="font-size: clamp(32px, 4.4vw, 52px); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 42px">Eintrag bearbeiten</h1>

      <form style="display: grid; gap: 20px" @submit.prevent="save">
        <div class="field">
          <label>Titel</label>
          <input v-model="title" class="input" type="text" required>
        </div>
        <div class="field">
          <label>Text</label>
          <textarea v-model="content" class="input" rows="10" required />
        </div>
        <p v-if="message" style="font-size: 13px; color: var(--color-neutral-700); margin: 0">{{ message }}</p>
        <button class="btn btn-primary" type="submit" style="align-self: flex-start" :disabled="saving">{{ saving ? 'Speichert ...' : 'Speichern' }}</button>
      </form>

      <h2 style="font-size: 24px; line-height: 28px; margin: 56px 0 20px">Bilder</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px">
        <div v-for="img in entry.images" :key="img.id">
          <div class="halftone" style="aspect-ratio: 4 / 3">
            <img :src="`/api/diary-images/${img.path}`" alt="">
          </div>
          <button class="btn btn-ghost" type="button" style="color: var(--color-accent-2-700); padding-inline: 0; margin-top: 5px" @click="removeImage(img.id)">Löschen</button>
        </div>
      </div>
      <label class="btn btn-ghost" style="cursor: pointer; margin-top: 15px; display: inline-flex">
        {{ uploading ? 'Lädt hoch ...' : 'Bild hochladen' }}
        <input type="file" accept="image/*" style="display: none" :disabled="uploading" @change="uploadImage">
      </label>

      <h2 style="font-size: 24px; line-height: 28px; margin: 56px 0 14px">Versiegeln</h2>
      <p style="font-size: 15px; line-height: 26px; margin: 0 0 20px; color: var(--color-neutral-700)">
        Danach ist dieser Eintrag für niemanden mehr sichtbar oder bearbeitbar - auch nicht für dich -
        bis zum angegebenen Datum. Optional wird an diesem Datum eine Benachrichtigungsmail verschickt.
      </p>
      <form style="display: grid; gap: 20px" @submit.prevent="seal">
        <div class="field">
          <label>Sichtbar ab</label>
          <input v-model="revealAt" class="input" type="datetime-local" required>
        </div>
        <div class="field">
          <label>Mail-Benachrichtigung an (optional)</label>
          <input v-model="notifyEmail" class="input" type="email" placeholder="z.B. deine E-Mail-Adresse">
        </div>
        <p v-if="sealError" style="color: var(--color-accent-2-700); font-size: 14px; margin: 0">{{ sealError }}</p>
        <button class="btn btn-primary" type="submit" style="align-self: flex-start" :disabled="sealing">{{ sealing ? 'Versiegelt ...' : 'Versiegeln' }}</button>
      </form>
    </template>

    <template v-else-if="entry?.status === 'revealed'">
      <h1 style="font-size: clamp(32px, 4.4vw, 52px); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 28px">{{ entry.title }}</h1>
      <p style="font-size: 16px; line-height: 28px; white-space: pre-wrap; color: var(--color-neutral-900)">{{ entry.content }}</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; margin-top: 28px">
        <div v-for="img in entry.images" :key="img.id" class="halftone" style="aspect-ratio: 4 / 3">
          <img :src="`/api/diary-images/${img.path}`" alt="">
        </div>
      </div>
    </template>

    <template v-else>
      <p style="color: var(--color-neutral-700)">Dieser Eintrag ist versiegelt oder existiert nicht.</p>
    </template>
  </div>
</template>
