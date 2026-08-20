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
  <div>
    <span style="display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 14px">Bearbeiten</span>
    <h1 style="font-size: clamp(32px, 4.4vw, 52px); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 14px">Nutzer</h1>
    <p style="font-size: 15.5px; line-height: 28px; margin: 0 0 56px; max-width: 52ch; color: var(--color-neutral-700)">
      Wer sich in die Redaktion einloggen darf.
    </p>

    <table class="table" style="width: 100%; max-width: 900px">
      <thead>
        <tr><th style="text-align: left">Name</th><th style="text-align: left">E-Mail</th><th style="text-align: right">Aktion</th></tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>
            <span style="font-family: var(--font-heading); font-weight: 600">{{ u.name }}</span>
            <span v-if="u.id === currentUser?.id" class="tag tag-accent" style="margin-left: 10px">Du</span>
          </td>
          <td>{{ u.email }}</td>
          <td style="text-align: right">
            <button v-if="u.id !== currentUser?.id" class="btn btn-ghost" type="button" style="color: var(--color-accent-2-700)" @click="removeUser(u.id)">Löschen</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h2 style="font-size: 24px; line-height: 28px; margin: 84px 0 28px">Neuen Account anlegen</h2>
    <form style="display: flex; flex-wrap: wrap; gap: 15px 20px; align-items: flex-end; max-width: 900px" @submit.prevent="addUser">
      <div class="field" style="width: 200px">
        <label>Name</label>
        <input v-model="newUser.name" class="input" type="text" placeholder="Vor- und Nachname" required>
      </div>
      <div class="field" style="flex: 1; min-width: 220px">
        <label>E-Mail</label>
        <input v-model="newUser.email" class="input" type="email" placeholder="name@mail.de" required>
      </div>
      <div class="field" style="width: 220px">
        <label>Passwort</label>
        <input v-model="newUser.password" class="input" type="password" placeholder="mind. 8 Zeichen" minlength="8" required>
      </div>
      <button class="btn btn-primary" type="submit">Anlegen</button>
    </form>
    <p v-if="error" style="color: var(--color-accent-2-700); font-size: 14px">{{ error }}</p>
  </div>
</template>
