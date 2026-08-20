<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' })

interface EntryListItem {
  id: number
  status: 'draft' | 'sealed' | 'revealed'
  title?: string
  revealAt: string | null
  createdAt: string
}

const { data: entries, refresh } = await useFetch<EntryListItem[]>('/api/diary')

function formatDate(value: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' })
}

async function removeEntry(id: number) {
  if (!confirm('Diesen Entwurf wirklich löschen?')) return
  await $fetch(`/api/diary/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="admin-panel">
    <h1>Tagebuch</h1>
    <NuxtLink to="/admin/tagebuch/neu" class="admin-button-link">Neuer Eintrag</NuxtLink>

    <ul class="admin-list">
      <li v-for="entry in entries" :key="entry.id" class="admin-list__item">
        <template v-if="entry.status === 'sealed'">
          <span class="admin-badge">🔒 Versiegelt</span>
          <span>Sichtbar ab {{ formatDate(entry.revealAt) }}</span>
        </template>
        <template v-else>
          <NuxtLink :to="`/admin/tagebuch/${entry.id}`"><strong>{{ entry.title }}</strong></NuxtLink>
          <span class="admin-badge">{{ entry.status === 'draft' ? 'Entwurf' : 'Freigeschaltet' }}</span>
          <div class="admin-list__actions">
            <button v-if="entry.status === 'draft'" type="button" @click="removeEntry(entry.id)">Löschen</button>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>
