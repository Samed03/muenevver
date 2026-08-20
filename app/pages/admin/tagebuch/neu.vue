<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

const title = ref('')
const content = ref('')
const error = ref('')
const saving = ref(false)

async function onSubmit() {
  saving.value = true
  error.value = ''
  try {
    const { id } = await $fetch<{ success: boolean, id: number }>('/api/diary', {
      method: 'POST',
      body: { title: title.value, content: content.value }
    })
    await navigateTo(`/admin/tagebuch/${id}`)
  } catch (err) {
    error.value = errorMessage(err, 'Fehler beim Anlegen')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="admin-panel">
    <h1>Neuer Tagebuch-Eintrag</h1>
    <form class="admin-form" @submit.prevent="onSubmit">
      <label>
        Titel
        <input v-model="title" type="text" required>
      </label>
      <label>
        Text
        <textarea v-model="content" rows="10" required />
      </label>
      <p v-if="error" class="auth-error">{{ error }}</p>
      <button type="submit" :disabled="saving">{{ saving ? 'Speichert ...' : 'Anlegen' }}</button>
    </form>
  </div>
</template>
