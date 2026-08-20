<script setup lang="ts">
definePageMeta({ layout: false })

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
  <div class="broadsheet-page">
    <div style="max-width: 1180px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 72px)">
      <div style="display: flex; justify-content: space-between; align-items: baseline; padding: 28px 0 0; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700)">
        <span>Münevver Arslan</span>
        <NuxtLink to="/" style="letter-spacing: 0.08em">Zurück zur Seite</NuxtLink>
      </div>

      <div style="display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 42px clamp(28px, 6vw, 96px); align-items: center; min-height: 72vh">
        <div>
          <span style="display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 14px">Redaktion</span>
          <h1 style="font-size: clamp(40px, 6vw, 72px); line-height: 1.06; letter-spacing: -0.02em; margin: 0 0 0 -0.035em">
            <span class="cmyk-head" style="display: block">
              <span class="paper">Einrichten</span>
              <span class="plate plate-c" aria-hidden="true">Einrichten</span>
              <span class="plate plate-m" aria-hidden="true">Einrichten</span>
              <span class="plate plate-y" aria-hidden="true">Einrichten</span>
            </span>
          </h1>
          <p style="font-size: 16px; line-height: 28px; margin: 42px 0 0; max-width: 34ch; color: var(--color-neutral-800)">
            Der erste Account für die Redaktion. Weitere lassen sich später unter Nutzer anlegen.
          </p>
        </div>

        <form style="display: flex; flex-direction: column; gap: 20px; max-width: 420px; width: 100%" @submit.prevent="onSubmit">
          <div class="field">
            <label for="setup-name">Name</label>
            <input id="setup-name" v-model="name" class="input" type="text" required autocomplete="name">
          </div>
          <div class="field">
            <label for="setup-mail">E-Mail</label>
            <input id="setup-mail" v-model="email" class="input" type="email" required autocomplete="username" placeholder="dein@name.de">
          </div>
          <div class="field">
            <label for="setup-pass">Passwort (mind. 8 Zeichen)</label>
            <input id="setup-pass" v-model="password" class="input" type="password" required minlength="8" autocomplete="new-password" placeholder="••••••••">
          </div>
          <p v-if="error" style="color: var(--color-accent-2-700); font-size: 14px; margin: 0">{{ error }}</p>
          <button class="btn btn-primary" type="submit" style="align-self: flex-start" :disabled="loading">
            {{ loading ? 'Einen Moment ...' : 'Account anlegen' }}
          </button>
        </form>
      </div>

      <footer style="padding: 28px 0 42px; font-size: 13px; color: var(--color-neutral-700)">© {{ new Date().getFullYear() }} Münevver Arslan</footer>
    </div>
  </div>
</template>
