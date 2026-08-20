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
  <div>
    <span style="display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 14px">Bearbeiten</span>
    <h1 style="font-size: clamp(32px, 4.4vw, 52px); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 14px">Neuer Tagebuch-Eintrag</h1>
    <p style="font-size: 15.5px; line-height: 28px; margin: 0 0 56px; max-width: 52ch; color: var(--color-neutral-700)">
      Text und Bilder folgen im nächsten Schritt, nach dem Anlegen.
    </p>

    <form style="display: grid; grid-template-columns: minmax(0, 620px); gap: 20px" @submit.prevent="onSubmit">
      <div class="field">
        <label>Titel</label>
        <input v-model="title" class="input" type="text" required>
      </div>
      <div class="field">
        <label>Text</label>
        <textarea v-model="content" class="input" rows="10" required />
      </div>
      <p v-if="error" style="color: var(--color-accent-2-700); font-size: 14px; margin: 0">{{ error }}</p>
      <button class="btn btn-primary" type="submit" style="align-self: flex-start" :disabled="saving">
        {{ saving ? 'Speichert ...' : 'Anlegen' }}
      </button>
    </form>
  </div>
</template>
