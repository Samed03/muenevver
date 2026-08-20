<script setup lang="ts">
const { user, clear } = useUserSession()
const route = useRoute()

const tabs = [
  { to: '/admin/profil', label: 'Profil' },
  { to: '/admin/hobbies', label: 'Hobbies' },
  { to: '/admin/reiseziele', label: 'Reiseziele' },
  { to: '/admin/tagebuch', label: 'Tagebuch' },
  { to: '/admin/nutzer', label: 'Nutzer' }
]

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  await navigateTo('/login')
}
</script>

<template>
  <div class="broadsheet-page">
    <nav class="nav" style="padding-inline: clamp(20px, 5vw, 72px); gap: 20px">
      <span class="nav-brand">Redaktion</span>
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        :style="{ color: isActive(tab.to) ? 'var(--color-accent-700)' : 'var(--color-neutral-800)', whiteSpace: 'nowrap' }"
      >
        {{ tab.label }}
      </NuxtLink>
      <span style="flex: 1" />
      <span v-if="user" style="font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700); white-space: nowrap">{{ user.name }}</span>
      <a href="/" target="_blank" rel="noopener" style="white-space: nowrap">Seite ansehen</a>
      <button class="btn btn-ghost" type="button" @click="logout">Abmelden</button>
    </nav>

    <div style="max-width: 1180px; margin: 0 auto; padding: 56px clamp(20px, 5vw, 72px) 84px">
      <slot />
    </div>
  </div>
</template>
