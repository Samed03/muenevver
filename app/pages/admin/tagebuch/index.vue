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
  <div style="max-width: 820px">
    <span style="display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 14px">Bearbeiten</span>
    <h1 style="font-size: clamp(32px, 4.4vw, 52px); line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 14px">Tagebuch</h1>
    <p style="font-size: 15.5px; line-height: 28px; margin: 0 0 56px; max-width: 52ch; color: var(--color-neutral-700)">
      Private Einträge, versiegelt bis zum gewählten Datum.
    </p>

    <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 56px">
      <NuxtLink to="/admin/tagebuch/neu" class="btn btn-primary">Neuer Eintrag</NuxtLink>
      <span style="font-size: 13px; color: var(--color-neutral-700)">Einträge bleiben versiegelt, bis ihr Datum erreicht ist.</span>
    </div>

    <div style="display: grid; gap: 42px">
      <article v-for="entry in entries" :key="entry.id" style="display: grid; grid-template-columns: 28px minmax(0, 1fr) auto; gap: 5px 15px; align-items: baseline">
        <template v-if="entry.status === 'sealed'">
          <i class="ph-duotone ph-lock-simple" aria-hidden="true" style="font-size: 22px; color: var(--color-accent)" />
          <div>
            <h3 style="font-size: 20px; line-height: 28px; margin: 0; color: var(--color-neutral-700)">Versiegelt</h3>
            <p style="font-size: 15.5px; line-height: 28px; margin: 0; color: var(--color-neutral-700); font-feature-settings: 'tnum' 1">Sichtbar ab {{ formatDate(entry.revealAt) }}</p>
          </div>
          <span />
        </template>
        <template v-else>
          <i class="ph-duotone ph-notebook" aria-hidden="true" style="font-size: 22px; color: var(--color-accent-2)" />
          <div>
            <h3 style="font-size: 20px; line-height: 28px; margin: 0">{{ entry.title }}</h3>
            <p style="font-size: 15.5px; line-height: 28px; margin: 0; color: var(--color-neutral-700); font-feature-settings: 'tnum' 1">
              {{ entry.status === 'draft' ? 'Entwurf' : 'Freigeschaltet' }} · {{ formatDate(entry.createdAt) }}
            </p>
          </div>
          <div style="display: flex; gap: 10px; white-space: nowrap">
            <NuxtLink :to="`/admin/tagebuch/${entry.id}`" class="btn btn-ghost">Öffnen</NuxtLink>
            <button v-if="entry.status === 'draft'" class="btn btn-ghost" type="button" style="color: var(--color-accent-2-700)" @click="removeEntry(entry.id)">Löschen</button>
          </div>
        </template>
      </article>
    </div>
  </div>
</template>
