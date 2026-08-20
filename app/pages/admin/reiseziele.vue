<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

interface Destination {
  id: number
  code: string
  label: string
  photoPath: string | null
  description: string | null
  isDream: boolean
  sortOrder: number
}

const { data: destinations, refresh } = await useFetch<Destination[]>('/api/travel-destinations')

const newDestination = reactive({ code: '', label: '', description: '', isDream: false })
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

async function saveDescription(dest: Destination) {
  await $fetch(`/api/travel-destinations/${dest.id}`, { method: 'PUT', body: dest })
}

async function addDestination() {
  if (!newDestination.label) return
  await $fetch('/api/travel-destinations', { method: 'POST', body: newDestination })
  newDestination.code = ''
  newDestination.label = ''
  newDestination.description = ''
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
  <div>
    <span style="display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 14px">Bearbeiten</span>
    <h1 style="font-size: clamp(32px, 4.4vw, 52px); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 14px">Reiseziele</h1>
    <p style="font-size: 15.5px; line-height: 28px; margin: 0 0 56px; max-width: 52ch; color: var(--color-neutral-700)">
      Fotos hochladen. Ein Ziel kann als Traumreiseziel markiert sein.
    </p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 42px clamp(20px, 3vw, 40px)">
      <figure v-for="dest in destinations" :key="dest.id" style="margin: 0">
        <div class="halftone" style="aspect-ratio: 4 / 3">
          <img v-if="dest.photoPath" :src="dest.photoPath" :alt="dest.label">
          <div v-else class="halftone-placeholder">Foto {{ dest.label }}</div>
        </div>
        <figcaption style="display: flex; align-items: baseline; gap: 10px; margin-top: 14px">
          <span style="font-size: 12px; letter-spacing: 0.14em; color: var(--color-accent-700)">{{ dest.code }}</span>
          <span style="font-size: 18px; line-height: 28px; font-weight: 600">{{ dest.label }}</span>
        </figcaption>
        <textarea
          v-if="dest.isDream"
          v-model="dest.description"
          class="input"
          placeholder="Beschreibung (nur beim Traumreiseziel sichtbar)"
          rows="2"
          style="margin-top: 10px"
          @blur="saveDescription(dest)"
        />
        <div style="display: flex; align-items: baseline; gap: 15px; margin-top: 5px">
          <span v-if="dest.isDream" class="tag tag-accent-2">Traumreiseziel</span>
          <span style="flex: 1" />
          <label class="btn btn-ghost" style="cursor: pointer; padding-inline: 0">
            Foto
            <input type="file" accept="image/*" style="display: none" :disabled="uploading" @change="uploadPhoto(dest.id, $event)">
          </label>
          <button class="btn btn-ghost" type="button" style="color: var(--color-accent-2-700); padding-inline: 0" @click="removeDestination(dest.id)">Löschen</button>
        </div>
      </figure>
    </div>

    <h2 style="font-size: 24px; line-height: 28px; margin: 84px 0 28px">Neues Reiseziel</h2>
    <form style="display: flex; flex-wrap: wrap; gap: 15px 20px; align-items: flex-end; max-width: 900px" @submit.prevent="addDestination">
      <div class="field" style="width: 150px">
        <label>Länderkürzel</label>
        <input v-model="newDestination.code" class="input" type="text" maxlength="4" placeholder="JP" style="text-transform: uppercase">
      </div>
      <div class="field" style="flex: 1; min-width: 220px">
        <label>Bezeichnung</label>
        <input v-model="newDestination.label" class="input" type="text" placeholder="Japan" required>
      </div>
      <label style="display: flex; align-items: center; gap: 10px; font-size: 15px; padding-bottom: 8px; white-space: nowrap">
        <input v-model="newDestination.isDream" type="checkbox" style="accent-color: var(--color-accent); width: 16px; height: 16px">
        Traumreiseziel
      </label>
      <button class="btn btn-primary" type="submit">Hinzufügen</button>
    </form>
  </div>
</template>
