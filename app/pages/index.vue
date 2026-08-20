<script setup lang="ts">
interface Profile {
  heroTitle: string
  heroSubtitle: string
  aboutText: string
  contactEmail: string
}
interface Hobby { id: number, icon: string, title: string, description: string }
interface Destination { id: number, flagEmoji: string, label: string, photoPath: string | null, isDream: boolean }

const { data: profile } = await useFetch<Profile>('/api/profile')
const { data: hobbies } = await useFetch<Hobby[]>('/api/hobbies')
const { data: destinations } = await useFetch<Destination[]>('/api/travel-destinations')

const regularDestinations = computed(() => (destinations.value ?? []).filter(d => !d.isDream))
const dreamDestination = computed(() => (destinations.value ?? []).find(d => d.isDream))
</script>

<template>
  <div>
    <section id="top" class="hero">
      <h1>{{ profile?.heroTitle }}</h1>
      <p>{{ profile?.heroSubtitle }}</p>
    </section>

    <section id="ueber-mich" class="section">
      <h2>Über mich</h2>
      <p>{{ profile?.aboutText }}</p>
    </section>

    <section id="hobbies" class="section section--alt">
      <h2>Hobbies</h2>
      <div class="cards">
        <article v-for="hobby in hobbies" :key="hobby.id" class="card">
          <span class="card__icon">{{ hobby.icon }}</span>
          <h3>{{ hobby.title }}</h3>
          <p>{{ hobby.description }}</p>
        </article>
      </div>
    </section>

    <section id="reisen" class="section">
      <h2>Bisherige Reiseziele</h2>
      <p class="section__intro">Ein paar Orte, an denen ich schon war</p>
      <div class="travel-grid">
        <article v-for="dest in regularDestinations" :key="dest.id" class="travel-card">
          <div class="travel-card__photo">
            <img v-if="dest.photoPath" :src="dest.photoPath" :alt="dest.label">
            <template v-else>Foto hinzufügen</template>
          </div>
          <p class="travel-card__label">{{ dest.flagEmoji }} {{ dest.label }}</p>
        </article>
      </div>

      <template v-if="dreamDestination">
        <h2 class="dream-heading">Traumreiseziel</h2>
        <article class="travel-card travel-card--dream">
          <div class="travel-card__photo">
            <img v-if="dreamDestination.photoPath" :src="dreamDestination.photoPath" :alt="dreamDestination.label">
            <template v-else>Foto hinzufügen</template>
          </div>
          <p class="travel-card__label">{{ dreamDestination.flagEmoji }} {{ dreamDestination.label }}</p>
        </article>
      </template>
    </section>

    <section id="kontakt" class="section section--alt">
      <h2>Kontakt</h2>
      <p>Erreichbar unter: <a :href="`mailto:${profile?.contactEmail}`">{{ profile?.contactEmail }}</a></p>
    </section>
  </div>
</template>
