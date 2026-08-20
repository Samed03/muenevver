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
  <div class="admin-panel">
    <template v-if="entry?.status === 'draft'">
      <h1>Eintrag bearbeiten</h1>
      <form class="admin-form" @submit.prevent="save">
        <label>
          Titel
          <input v-model="title" type="text" required>
        </label>
        <label>
          Text
          <textarea v-model="content" rows="10" required />
        </label>
        <p v-if="message" class="admin-message">{{ message }}</p>
        <button type="submit" :disabled="saving">{{ saving ? 'Speichert ...' : 'Speichern' }}</button>
      </form>

      <h2>Bilder</h2>
      <div class="admin-list admin-list--grid">
        <div v-for="img in entry.images" :key="img.id" class="admin-list__item">
          <div class="admin-list__photo">
            <img :src="`/api/diary-images/${img.path}`" alt="">
          </div>
          <button type="button" @click="removeImage(img.id)">Löschen</button>
        </div>
      </div>
      <label class="admin-list__upload">
        Bild hochladen
        <input type="file" accept="image/*" :disabled="uploading" @change="uploadImage">
      </label>

      <h2>Versiegeln</h2>
      <p>
        Danach ist dieser Eintrag für niemanden mehr sichtbar oder bearbeitbar - auch nicht für dich -
        bis zum angegebenen Datum. Optional wird an diesem Datum eine Benachrichtigungsmail verschickt.
      </p>
      <form class="admin-form" @submit.prevent="seal">
        <label>
          Sichtbar ab
          <input v-model="revealAt" type="datetime-local" required>
        </label>
        <label>
          Mail-Benachrichtigung an (optional)
          <input v-model="notifyEmail" type="email" placeholder="z.B. deine E-Mail-Adresse">
        </label>
        <p v-if="sealError" class="auth-error">{{ sealError }}</p>
        <button type="submit" :disabled="sealing">{{ sealing ? 'Versiegelt ...' : 'Versiegeln' }}</button>
      </form>
    </template>

    <template v-else-if="entry?.status === 'revealed'">
      <h1>{{ entry.title }}</h1>
      <p class="diary-content">{{ entry.content }}</p>
      <div class="admin-list admin-list--grid">
        <div v-for="img in entry.images" :key="img.id" class="admin-list__photo">
          <img :src="`/api/diary-images/${img.path}`" alt="">
        </div>
      </div>
    </template>

    <template v-else>
      <p>Dieser Eintrag ist versiegelt oder existiert nicht.</p>
    </template>
  </div>
</template>
