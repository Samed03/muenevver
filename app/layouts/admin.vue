<script setup lang="ts">
const { user, clear } = useUserSession()

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  await navigateTo('/login')
}
</script>

<template>
  <div class="admin">
    <header class="admin__header">
      <nav class="admin__nav">
        <NuxtLink to="/admin/profil">Profil</NuxtLink>
        <NuxtLink to="/admin/hobbies">Hobbies</NuxtLink>
        <NuxtLink to="/admin/reiseziele">Reiseziele</NuxtLink>
        <NuxtLink to="/admin/tagebuch">Tagebuch</NuxtLink>
        <NuxtLink to="/admin/nutzer">Nutzer</NuxtLink>
      </nav>
      <div class="admin__user">
        <span v-if="user">{{ user.name }}</span>
        <a href="/" target="_blank" rel="noopener">Seite ansehen</a>
        <button type="button" @click="logout">Abmelden</button>
      </div>
    </header>
    <main class="admin__content">
      <slot />
    </main>
  </div>
</template>
