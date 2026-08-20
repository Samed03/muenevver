<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

interface Destination {
  id: number
  flagEmoji: string
  label: string
  photoPath: string | null
  isDream: boolean
  sortOrder: number
}

const { data: destinations, refresh } = await useFetch<Destination[]>('/api/travel-destinations')

const newDestination = reactive({ flagEmoji: '', label: '', isDream: false })
const uploading = ref(false)

async function uploadPhoto(id: number, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const body = new FormData()
    body.append('file', file)
    const { url } = await $fetch<{ url: string }>('/api/uploads', { method: 'POST', body })
    await $fetch(`/api/travel-destinations/${id}`, {
      method: 'PUT',
      body: { ...destinations.value!.find(d => d.id === id), photoPath: url }
    })
    await refresh()
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function addDestination() {
  if (!newDestination.label) return
  await $fetch('/api/travel-destinations', { method: 'POST', body: newDestination })
  newDestination.flagEmoji = ''
  newDestination.label = ''
  newDestination.isDream = false
  await refresh()
}

async function removeDestination(id: number) {
  if (!confirm('Dieses Reiseziel wirklich löschen?')) return
  await $fetch(`/api/travel-destinations/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="admin-panel">
    <h1>Reiseziele</h1>

    <ul class="admin-list admin-list--grid">
      <li v-for="dest in destinations" :key="dest.id" class="admin-list__item">
        <div class="admin-list__photo">
          <img v-if="dest.photoPath" :src="dest.photoPath" :alt="dest.label">
          <span v-else>Kein Foto</span>
        </div>
        <strong>{{ dest.flagEmoji }} {{ dest.label }}</strong>
        <span v-if="dest.isDream" class="admin-badge">Traumreiseziel</span>
        <label class="admin-list__upload">
          Foto hochladen
          <input type="file" accept="image/*" :disabled="uploading" @change="uploadPhoto(dest.id, $event)">
        </label>
        <div class="admin-list__actions">
          <button type="button" @click="removeDestination(dest.id)">Löschen</button>
        </div>
      </li>
    </ul>

    <h2>Neues Reiseziel</h2>
    <form class="admin-form admin-form--inline" @submit.prevent="addDestination">
      <input v-model="newDestination.flagEmoji" placeholder="Flagge (Emoji)" maxlength="8">
      <input v-model="newDestination.label" placeholder="Bezeichnung" required>
      <label><input v-model="newDestination.isDream" type="checkbox"> Traumreiseziel</label>
      <button type="submit">Hinzufügen</button>
    </form>
  </div>
</template>
