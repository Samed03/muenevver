<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

interface Hobby { id: number, icon: string, title: string, description: string, sortOrder: number }

const { data: hobbies, refresh } = await useFetch<Hobby[]>('/api/hobbies')

const newHobby = reactive({ icon: '', title: '', description: '' })
const editingId = ref<number | null>(null)
const editForm = reactive({ icon: '', title: '', description: '' })
const message = ref('')

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
  <div class="admin-panel">
    <h1>Hobbies</h1>

    <ul class="admin-list">
      <li v-for="hobby in hobbies" :key="hobby.id" class="admin-list__item">
        <template v-if="editingId === hobby.id">
          <input v-model="editForm.icon" class="admin-list__icon-input" maxlength="4">
          <input v-model="editForm.title" class="admin-list__title-input">
          <textarea v-model="editForm.description" rows="2" />
          <div class="admin-list__actions">
            <button type="button" @click="saveEdit(hobby.id)">Speichern</button>
            <button type="button" @click="editingId = null">Abbrechen</button>
          </div>
        </template>
        <template v-else>
          <span class="admin-list__icon">{{ hobby.icon }}</span>
          <strong>{{ hobby.title }}</strong>
          <p>{{ hobby.description }}</p>
          <div class="admin-list__actions">
            <button type="button" @click="startEdit(hobby)">Bearbeiten</button>
            <button type="button" @click="removeHobby(hobby.id)">Löschen</button>
          </div>
        </template>
      </li>
    </ul>

    <h2>Neues Hobby</h2>
    <form class="admin-form admin-form--inline" @submit.prevent="addHobby">
      <input v-model="newHobby.icon" placeholder="Icon (Emoji)" maxlength="4" required>
      <input v-model="newHobby.title" placeholder="Titel" required>
      <input v-model="newHobby.description" placeholder="Beschreibung" required>
      <button type="submit">Hinzufügen</button>
    </form>
    <p v-if="message" class="admin-message">{{ message }}</p>
  </div>
</template>
