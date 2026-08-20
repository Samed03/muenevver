<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

interface User { id: number, email: string, name: string, createdAt: string }

const { data: users, refresh } = await useFetch<User[]>('/api/users')
const { user: currentUser } = useUserSession()

const newUser = reactive({ name: '', email: '', password: '' })
const error = ref('')

async function addUser() {
  error.value = ''
  try {
    await $fetch('/api/users', { method: 'POST', body: newUser })
    newUser.name = ''
    newUser.email = ''
    newUser.password = ''
    await refresh()
  } catch (err) {
    error.value = errorMessage(err, 'Fehler beim Anlegen')
  }
}

async function removeUser(id: number) {
  if (!confirm('Diesen Account wirklich löschen?')) return
  try {
    await $fetch(`/api/users/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err) {
    error.value = errorMessage(err, 'Fehler beim Löschen')
  }
}
</script>

<template>
  <div class="admin-panel">
    <h1>Nutzer</h1>

    <ul class="admin-list">
      <li v-for="u in users" :key="u.id" class="admin-list__item">
        <strong>{{ u.name }}</strong>
        <span>{{ u.email }}</span>
        <div class="admin-list__actions">
          <button v-if="u.id !== currentUser?.id" type="button" @click="removeUser(u.id)">Löschen</button>
          <span v-else class="admin-badge">Du</span>
        </div>
      </li>
    </ul>

    <h2>Neuen Account anlegen</h2>
    <form class="admin-form admin-form--inline" @submit.prevent="addUser">
      <input v-model="newUser.name" placeholder="Name" required>
      <input v-model="newUser.email" type="email" placeholder="E-Mail" required>
      <input v-model="newUser.password" type="password" placeholder="Passwort (mind. 8 Zeichen)" minlength="8" required>
      <button type="submit">Anlegen</button>
    </form>
    <p v-if="error" class="auth-error">{{ error }}</p>
  </div>
</template>
