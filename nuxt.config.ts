// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', 'nuxt-auth-utils'],

  css: ['~/assets/css/broadsheet.css'],

  app: {
    head: {
      link: [
        // Phosphor-Icons (Hobbies-Icons, Login-Icon in der Nav) - genutzt auf Start- und Admin-Seiten
        { rel: 'stylesheet', href: 'https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/style.css' },
        // Editorial-Schrift fuer die neu gestaltete Startseite (siehe app/assets/css/broadsheet.css)
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap' }
      ]
    }
  },

  typescript: {
    strict: true,
    typeCheck: true
  }
})
