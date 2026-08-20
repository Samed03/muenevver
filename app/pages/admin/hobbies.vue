<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

interface Hobby { id: number, icon: string, title: string, description: string, sortOrder: number }

const { data: hobbies, refresh } = await useFetch<Hobby[]>('/api/hobbies')

const newHobby = reactive({ icon: '', title: '', description: '' })
const editingId = ref<number | null>(null)
const editForm = reactive({ icon: '', title: '', description: '' })

async function addHobby() {
  if (!newHobby.icon || !newHobby.title || !newHobby.description) return
  await $fetch('/api/hobbies', { method: 'POST', body: newHobby })
  newHobby.icon = ''
  newHobby.title = ''
  newHobby.description = ''
  await refresh()
}

function startEdit(hobby: Hobby) {
  editingId.value = hobby.id
  editForm.icon = hobby.icon
  editForm.title = hobby.title
  editForm.description = hobby.description
}

async function saveEdit(id: number) {
  await $fetch(`/api/hobbies/${id}`, { method: 'PUT', body: editForm })
  editingId.value = null
  await refresh()
}

async function removeHobby(id: number) {
  if (!confirm('Dieses Hobby wirklich löschen?')) return
  await $fetch(`/api/hobbies/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div>
    <span style="display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 14px">Bearbeiten</span>
    <h1 style="font-size: clamp(32px, 4.4vw, 52px); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 14px">Hobbies</h1>
    <p style="font-size: 15.5px; line-height: 28px; margin: 0 0 56px; max-width: 52ch; color: var(--color-neutral-700)">
      Karten auf der Startseite — Icon, Titel und ein Satz Beschreibung.
    </p>

    <div style="display: grid; gap: 42px; max-width: 900px">
      <div v-for="hobby in hobbies" :key="hobby.id">
        <template v-if="editingId === hobby.id">
          <div style="display: flex; flex-wrap: wrap; gap: 15px 20px; align-items: flex-end">
            <div class="field" style="width: 200px">
              <label>Icon (Phosphor)</label>
              <input v-model="editForm.icon" class="input" type="text">
            </div>
            <div class="field" style="width: 200px">
              <label>Titel</label>
              <input v-model="editForm.title" class="input" type="text">
            </div>
            <div class="field" style="flex: 1; min-width: 240px">
              <label>Beschreibung</label>
              <input v-model="editForm.description" class="input" type="text">
            </div>
            <button class="btn btn-primary" type="button" @click="saveEdit(hobby.id)">Speichern</button>
            <button class="btn btn-ghost" type="button" @click="editingId = null">Abbrechen</button>
          </div>
        </template>
        <template v-else>
          <div style="display: grid; grid-template-columns: 36px minmax(0, 1fr) auto; gap: 5px 20px; align-items: baseline">
            <i :class="`ph-duotone ph-${hobby.icon}`" aria-hidden="true" style="font-size: 26px; color: var(--color-accent)" />
            <div>
              <h3 style="font-size: 20px; line-height: 28px; margin: 0">{{ hobby.title }}</h3>
              <p style="font-size: 15.5px; line-height: 28px; margin: 0; color: var(--color-neutral-800)">{{ hobby.description }}</p>
            </div>
            <div style="display: flex; gap: 10px; white-space: nowrap">
              <button class="btn btn-ghost" type="button" @click="startEdit(hobby)">Bearbeiten</button>
              <button class="btn btn-ghost" type="button" style="color: var(--color-accent-2-700)" @click="removeHobby(hobby.id)">Löschen</button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <h2 style="font-size: 24px; line-height: 28px; margin: 84px 0 28px">Neues Hobby</h2>
    <form style="display: flex; flex-wrap: wrap; gap: 15px 20px; align-items: flex-end; max-width: 900px" @submit.prevent="addHobby">
      <div class="field" style="width: 200px">
        <label>Icon (Phosphor, z.B. book-open)</label>
        <input v-model="newHobby.icon" class="input" type="text" required>
      </div>
      <div class="field" style="width: 200px">
        <label>Titel</label>
        <input v-model="newHobby.title" class="input" type="text" placeholder="Lesen" required>
      </div>
      <div class="field" style="flex: 1; min-width: 240px">
        <label>Beschreibung</label>
        <input v-model="newHobby.description" class="input" type="text" placeholder="Kurz beschreiben" required>
      </div>
      <button class="btn btn-primary" type="submit">Hinzufügen</button>
    </form>
  </div>
</template>
