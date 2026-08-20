<script setup lang="ts">
definePageMeta({ layout: false })

interface Profile {
  heroTitle: string
  heroSubtitle: string
  aboutHeadline: string
  aboutText: string
  portraitPath: string | null
  contactEmail: string
}
interface Hobby { id: number, icon: string, title: string, description: string }
interface Destination {
  id: number
  code: string
  label: string
  photoPath: string | null
  description: string | null
  isDream: boolean
}

const { data: profile } = await useFetch<Profile>('/api/profile')
const { data: hobbies } = await useFetch<Hobby[]>('/api/hobbies')
const { data: destinations } = await useFetch<Destination[]>('/api/travel-destinations')

const regularDestinations = computed(() => (destinations.value ?? []).filter(d => !d.isDream))
const dreamDestination = computed(() => (destinations.value ?? []).find(d => d.isDream))

// Der Hero-Titel ("Münevver Arslan") wird fuer den zweizeiligen Druckplatten-Effekt
// am ersten Leerzeichen in Vor- und Nachname aufgeteilt.
const heroLines = computed(() => {
  const title = profile.value?.heroTitle ?? ''
  const spaceIndex = title.indexOf(' ')
  if (spaceIndex === -1) return [title]
  return [title.slice(0, spaceIndex), title.slice(spaceIndex + 1)]
})

const GERMAN_NUMBERS = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf']
function countLabel(count: number, singular: string, plural: string, singularArticle: string) {
  if (count === 1) return `${singularArticle} ${singular}`
  const word = GERMAN_NUMBERS[count] ?? String(count)
  return `${word.charAt(0).toUpperCase()}${word.slice(1)} ${plural}`
}
const laenderLabel = computed(() => countLabel(regularDestinations.value.length, 'Land', 'Länder', 'Ein'))
const leidenschaftenLabel = computed(() => countLabel(hobbies.value?.length ?? 0, 'Leidenschaft', 'Leidenschaften', 'Eine'))
</script>

<template>
  <div class="broadsheet-page">
    <div style="max-width: 1180px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 72px)">

      <nav class="nav">
        <span class="nav-brand">{{ profile?.heroTitle }}</span>
        <a href="#ueber-mich">Über mich</a>
        <a href="#hobbies">Hobbies</a>
        <a href="#reisen">Reisen</a>
        <a href="#kontakt">Kontakt</a>
        <NuxtLink to="/login" title="Anmelden" aria-label="Anmelden" style="display: inline-flex; align-items: center; font-size: 18px; color: var(--color-neutral-700)">
          <i class="ph-duotone ph-lock-simple" aria-hidden="true" />
        </NuxtLink>
      </nav>

      <header style="padding: 80px 0 64px">
        <h1 style="font-size: clamp(48px, 8vw, 104px); line-height: 1.06; letter-spacing: -0.02em; margin: 0 0 0 -0.035em">
          <span v-for="(line, i) in heroLines" :key="i" class="cmyk-head" style="display: block">
            <span class="paper">{{ line }}</span>
            <span class="plate plate-c" aria-hidden="true">{{ line }}</span>
            <span class="plate plate-m" aria-hidden="true">{{ line }}</span>
            <span class="plate plate-y" aria-hidden="true">{{ line }}</span>
          </span>
        </h1>
        <p style="font-size: 19px; line-height: 32px; max-width: 40ch; margin: 32px 0 0; color: var(--color-neutral-800)">
          {{ profile?.heroSubtitle }}
        </p>
      </header>

      <section aria-label="Auf einen Blick" style="padding-bottom: 64px">
        <hr style="height: 5px; border: 0; border-top: 2px solid var(--color-text); border-bottom: 1px solid var(--color-text); margin: 0">
        <p style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 14px 28px; margin: 0; padding: 14px 0; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700)">
          <span>Bielefeld</span>
          <span>Soziologie, M.A.</span>
          <span>{{ laenderLabel }}</span>
          <span>{{ leidenschaftenLabel }}</span>
        </p>
        <hr style="height: 0; border: 0; border-top: 1px solid var(--color-text); margin: 0">
      </section>

      <section id="ueber-mich" style="display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 28px clamp(28px, 6vw, 96px); align-items: start; padding-bottom: 84px">
        <div>
          <span style="display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 14px">Über mich</span>
          <h2 style="font-size: clamp(28px, 3.4vw, 40px); line-height: 1.15; letter-spacing: -0.015em">{{ profile?.aboutHeadline }}</h2>
          <p style="font-size: 17px; line-height: 30px; max-width: 56ch; margin: 26px 0 0; color: var(--color-neutral-900); text-align: justify; hyphens: auto">{{ profile?.aboutText }}</p>
        </div>
        <figure class="halftone" style="aspect-ratio: 4 / 5">
          <img v-if="profile?.portraitPath" :src="profile.portraitPath" alt="Porträtfoto von Münevver">
          <div v-else class="halftone-placeholder">Porträtfoto</div>
        </figure>
      </section>

      <section id="hobbies" style="padding-bottom: 84px">
        <span style="display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 24px">Hobbies</span>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 36px clamp(28px, 4vw, 64px)">
          <div v-for="h in hobbies" :key="h.id">
            <i :class="`ph-duotone ph-${h.icon}`" aria-hidden="true" style="font-size: 30px; color: var(--color-accent); display: block; margin-bottom: 12px" />
            <h3 style="font-size: 22px; line-height: 28px">{{ h.title }}</h3>
            <p style="font-size: 15.5px; line-height: 28px; margin: 12px 0 0; color: var(--color-neutral-800)">{{ h.description }}</p>
          </div>
        </div>
      </section>

      <section id="reisen" style="padding-bottom: 84px">
        <span style="display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-neutral-700); margin-bottom: 14px">Bisherige Reiseziele</span>
        <h2 style="font-size: clamp(28px, 3.4vw, 40px); line-height: 1.15; letter-spacing: -0.015em">Ein paar Orte, an denen ich schon war</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 36px clamp(20px, 3vw, 40px); margin-top: 48px">
          <figure v-for="d in regularDestinations" :key="d.id">
            <div class="halftone" style="aspect-ratio: 4 / 3">
              <img v-if="d.photoPath" :src="d.photoPath" :alt="d.label">
              <div v-else class="halftone-placeholder">Foto {{ d.label }}</div>
            </div>
            <figcaption style="display: flex; align-items: baseline; gap: 10px; margin-top: 12px">
              <span style="font-size: 12px; letter-spacing: 0.14em; color: var(--color-accent-700); font-feature-settings: 'tnum' 1">{{ d.code }}</span>
              <span style="font-size: 19px; line-height: 28px; font-weight: 600">{{ d.label }}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section v-if="dreamDestination" aria-label="Traumreiseziel" style="display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 28px clamp(28px, 5vw, 96px); align-items: center; padding-bottom: 84px">
        <div>
          <span style="display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-accent-2-700); margin-bottom: 14px">Traumreiseziel</span>
          <h2 style="font-size: clamp(32px, 4vw, 52px); line-height: 1.1; letter-spacing: -0.015em">{{ dreamDestination.label }}</h2>
          <p v-if="dreamDestination.description" style="font-size: 16px; line-height: 28px; margin: 24px 0 0; max-width: 40ch; color: var(--color-neutral-800)">{{ dreamDestination.description }}</p>
        </div>
        <figure class="halftone" style="aspect-ratio: 3 / 2">
          <img v-if="dreamDestination.photoPath" :src="dreamDestination.photoPath" :alt="dreamDestination.label">
          <div v-else class="halftone-placeholder">Foto {{ dreamDestination.label }}</div>
        </figure>
      </section>

      <section id="kontakt" style="padding-bottom: 64px">
        <h2 style="font-size: clamp(28px, 3.4vw, 40px); line-height: 1.15; letter-spacing: -0.015em">Kontakt</h2>
        <p style="font-size: 17px; line-height: 30px; margin: 24px 0 0; max-width: 46ch; color: var(--color-neutral-800)">Für Nachrichten, Fragen oder Reisetipps — am liebsten per Mail.</p>
        <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 24px">
          <a class="btn btn-primary" :href="`mailto:${profile?.contactEmail}`">{{ profile?.contactEmail }}</a>
        </div>
      </section>

      <footer style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 14px; padding: 24px 0 48px; font-size: 13px; color: var(--color-neutral-700); border-top: 1px solid var(--color-divider)">
        <span>© {{ new Date().getFullYear() }} {{ profile?.heroTitle }}</span>
        <NuxtLink to="/login" style="color: var(--color-neutral-700)">Anmelden</NuxtLink>
      </footer>

    </div>
  </div>
</template>
