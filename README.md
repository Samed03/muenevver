# muenevver

Persönliche Seite von Münevver Arslan. Nuxt-App mit MySQL (Drizzle-ORM) und
Docker, analog zum [vue-playground](../vue-playground)-Projekt aufgebaut,
damit sich Inhalte künftig über eine Datenbank statt im Code pflegen lassen.

Aktueller Stand: das technische Gerüst (Nuxt, DB-Anbindung, Docker, Deploy).
Welche Inhalte konkret über die Datenbank verwaltbar werden (z.B. Reiseziele,
Hobbies), folgt in einem nächsten Schritt – bisher stehen sie noch als
statischer Vue-Code in `app/pages/index.vue`.

## Lokale Entwicklung

Voraussetzung: Docker Desktop läuft.

```powershell
npm install
cp .env.example .env
.\start.ps1
```

Das startet MySQL + [Adminer](http://localhost:8081) (DB-GUI) in Docker,
wendet Migrationen an und startet den Nuxt-Dev-Server auf
http://localhost:3000.

Beenden mit `Strg+C`, danach `.\stop.ps1` (Datenbank-Daten bleiben im
Docker-Volume erhalten; `.\stop.ps1 -DeleteData` löscht sie).

## Struktur

- `app/` – Vue-Komponenten, Seiten, Layout, Styles
- `server/database/` – Drizzle-Schema + DB-Client
- `server/api/` – Server-Routen (aktuell nur `/api/health` als DB-Smoketest)
- `drizzle.config.ts` – Konfiguration für `npm run db:generate` / `db:migrate` / `db:studio`
- `docker-compose.yml` – lokaler Dev-Stack (MySQL + Adminer)
- `docker-compose.prod.yml` – Produktiv-Stack (App + MySQL), läuft auf dem Server als eigener Container

## Deployment

Bei jedem Push auf `main` baut GitHub Actions ein Docker-Image, pusht es nach
GHCR und deployt es auf den Server nach `/opt/muenevver`
(`.github/workflows/deploy.yml`).

Der Server hostet daneben auch das `vue-playground`-Projekt; ein gemeinsamer
Caddy-Reverse-Proxy (im vue-playground-Repo) leitet
`muenevver.samedarslan.de` an den hier laufenden App-Container weiter, über
ein gemeinsames externes Docker-Netzwerk `caddy-shared`. Einmalig auf dem
Server einzurichten (siehe auch `.env.production.example`):

```bash
docker network create caddy-shared
mkdir -p /opt/muenevver
# .env unter /opt/muenevver/.env anlegen, siehe .env.production.example
```

Benötigte GitHub-Secrets (wie im vue-playground-Repo): `SERVER_HOST`,
`SERVER_USER`, `SERVER_SSH_KEY`.
