import { defineConfig } from 'drizzle-kit'

try {
  process.loadEnvFile()
} catch {
  // .env ist optional, z. B. wenn DATABASE_URL bereits über die Umgebung gesetzt ist (Server-Deployment)
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL ist nicht gesetzt (siehe .env.example)')
}

export default defineConfig({
  dialect: 'mysql',
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
})
