// Formt den User-Typ von nuxt-auth-utils (siehe setUserSession-Aufrufe).
declare module '#auth-utils' {
  interface User {
    id: number
    email: string
    name: string
  }
}

export {}
