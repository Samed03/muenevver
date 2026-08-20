# syntax=docker/dockerfile:1
FROM node:24-alpine AS base
WORKDIR /app

# ---- Dependencies + Build ----
FROM base AS build
COPY package.json package-lock.json ./
# --ignore-scripts: "nuxt prepare" (postinstall) braucht den vollständigen Quellcode
# (nuxt.config.ts, app/, server/), der erst im nächsten Schritt kopiert wird.
# "nuxt build" macht die vollständige Generierung danach ohnehin selbst.
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# ---- Production Runtime ----
FROM base AS runtime
ENV NODE_ENV=production
COPY package.json package-lock.json ./
# --ignore-scripts: "nuxt prepare" wird zur Laufzeit nicht gebraucht (nur IDE-Typen)
RUN npm ci --omit=dev --ignore-scripts

# Nitro-Server-Bundle (fertig gebaute App)
COPY --from=build /app/.output ./.output

# Wird für "npm run db:migrate" auf dem Server benötigt (drizzle-kit + Schema)
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/server/database ./server/database

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
