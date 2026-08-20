<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

const { data: profile } = await useFetch('/api/profile')

const form = reactive({
  heroTitle: profile.value?.heroTitle ?? '',
  heroSubtitle: profile.value?.heroSubtitle ?? '',
  aboutText: profile.value?.aboutText ?? '',
  contactEmail: profile.value?.contactEmail ?? ''
})

const saving = ref(false)
const message = ref('')

async function onSubmit() {
  saving.value = true
  message.value = ''
  try {
    await $fetch('/api/profile', { method: 'PUT', body: form })
    message.value = 'Gespeichert.'
  } catch (err) {
    message.value = errorMessage(err, 'Fehler beim Speichern')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-panel">
    <h1>Profil</h1>
    <form class="admin-form" @submit.prevent="onSubmit">
      <label>
        Hero-Titel
        <input v-model="form.heroTitle" type="text" required>
      </label>
      <label>
        Hero-Untertitel
        <input v-model="form.heroSubtitle" type="text" required>
      </label>
      <label>
        Über-mich-Text
        <textarea v-model="form.aboutText" rows="6" required />
      </label>
      <label>
        Kontakt-E-Mail
        <input v-model="form.contactEmail" type="email" required>
      </label>
      <p v-if="message" class="admin-message">{{ message }}</p>
      <button type="submit" :disabled="saving">{{ saving ? 'Speichert ...' : 'Speichern' }}</button>
    </form>
  </div>
</template>
