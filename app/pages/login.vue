<script setup lang="ts">
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const { fetch: refreshSession } = useUserSession()

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { email: email.value, password: password.value } })
    await refreshSession()
    await navigateTo('/admin')
  } catch (err) {
    error.value = errorMessage(err, 'Login fehlgeschlagen')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <form class="auth-form" @submit.prevent="onSubmit">
      <h1>Anmelden</h1>
      <label>
        E-Mail
        <input v-model="email" type="email" required autocomplete="username">
      </label>
      <label>
        Passwort
        <input v-model="password" type="password" required autocomplete="current-password">
      </label>
      <p v-if="error" class="auth-error">{{ error }}</p>
      <button type="submit" :disabled="loading">{{ loading ? 'Einen Moment ...' : 'Anmelden' }}</button>
    </form>
  </div>
</template>
