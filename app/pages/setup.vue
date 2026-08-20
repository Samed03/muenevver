<script setup lang="ts">
const { data: status } = await useFetch('/api/auth/status')
if (status.value?.hasUsers) {
  await navigateTo('/login')
}

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const { fetch: refreshSession } = useUserSession()

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/setup', {
      method: 'POST',
      body: { name: name.value, email: email.value, password: password.value }
    })
    await refreshSession()
    await navigateTo('/admin')
  } catch (err) {
    error.value = errorMessage(err, 'Einrichtung fehlgeschlagen')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <form class="auth-form" @submit.prevent="onSubmit">
      <h1>Ersten Account einrichten</h1>
      <label>
        Name
        <input v-model="name" type="text" required autocomplete="name">
      </label>
      <label>
        E-Mail
        <input v-model="email" type="email" required autocomplete="username">
      </label>
      <label>
        Passwort (mind. 8 Zeichen)
        <input v-model="password" type="password" required minlength="8" autocomplete="new-password">
      </label>
      <p v-if="error" class="auth-error">{{ error }}</p>
      <button type="submit" :disabled="loading">{{ loading ? 'Einen Moment ...' : 'Account anlegen' }}</button>
    </form>
  </div>
</template>
