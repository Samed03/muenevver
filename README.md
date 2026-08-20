# muenevver

Persönliche Seite von Münevver Arslan. Nuxt-App mit MySQL (Drizzle-ORM) und
Docker, analog zum [vue-playground](../vue-playground)-Projekt aufgebaut.
Alle Inhalte der Startseite (Hero, Über mich, Hobbies, Reiseziele, Kontakt)
werden über einen Login-geschützten Admin-Bereich verwaltet, dazu kommt ein
gemeinsames Tagebuch mit "Zeitkapsel"-Funktion.

## Lokale Entwicklung

Voraussetzung: Docker Desktop läuft.

```powershell
npm install
cp .env.example .env
.\start.ps1
```

Das startet MySQL + [Adminer](http://localhost:8081) (DB-GUI) in Docker,
wendet Migrationen an, übernimmt die Basisinhalte (Profil/Hobbies/Reiseziele)
in die DB und startet den Nuxt-Dev-Server auf http://localhost:3000.

Ersten Account anlegen unter http://localhost:3000/setup, danach Login unter
`/login` und Admin-Bereich unter `/admin`.

Beenden mit `Strg+C`, danach `.\stop.ps1` (Datenbank-Daten bleiben im
Docker-Volume erhalten; `.\stop.ps1 -DeleteData` löscht sie).

## Funktionen

- **Admin-Bereich** (`/admin`, Login erforderlich): Profil-Text, Hobbies und
  Reiseziele (inkl. Fotos) verwalten, weitere Accounts anlegen.
- **Login**: mehrere gleichberechtigte Accounts möglich (z.B. für den
  Partner), keine offene Registrierung – der erste Account wird einmalig
  über `/setup` angelegt (funktioniert nur, solange noch kein Account
  existiert), weitere über `/admin/nutzer`.
- **Tagebuch** (`/admin/tagebuch`): Einträge mit Text und Bildern, für alle
  eingeloggten Accounts gemeinsam sichtbar. Ein Eintrag kann *versiegelt*
  werden (Datum + optionale Benachrichtigungs-Mail): danach ist er für
  niemanden mehr sichtbar oder bearbeitbar – auch nicht für die Ersteller
  selbst – bis das Datum erreicht ist. Das prüft ein Hintergrund-Scheduler
  im selben Prozess automatisch jede Minute (`server/plugins/diary-scheduler.ts`).

## Struktur

- `app/` – Vue-Komponenten, Seiten (inkl. `/login`, `/setup`, `/admin/**`), Layouts, Styles
- `server/database/` – Drizzle-Schema, DB-Client, Seed-Skript (`npm run db:seed`)
- `server/api/` – Server-Routen (Profil/Hobbies/Reiseziele/Uploads/Auth/Nutzer/Tagebuch)
- `server/plugins/diary-scheduler.ts` – schaltet fällige Tagebuch-Einträge frei, verschickt ggf. Mail
- `server/utils/uploads.ts` – Bild-Speicherung auf Disk (öffentlich vs. privat/Tagebuch getrennt)
- `server/utils/email.ts` – Mail-Versand über die Resend-API
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
ein gemeinsames externes Docker-Netzwerk `caddy-shared`.

Einmalig auf dem Server einzurichten (siehe auch `.env.production.example`):

```bash
docker network create caddy-shared
mkdir -p /opt/muenevver
# .env unter /opt/muenevver/.env anlegen, siehe .env.production.example
```

In der `.env` auf dem Server zusätzlich zu den bisherigen DB-Werten nötig:

- `NUXT_SESSION_PASSWORD` – mind. 32 zufällige Zeichen (`openssl rand -hex 32`), geheim halten
- `RESEND_API_KEY` / `RESEND_FROM` – für die Tagebuch-Benachrichtigungsmails
  (Account auf [resend.com](https://resend.com); ohne verifizierte eigene
  Domain kann Resend ggf. nur an die eigene Account-Mail zustellen – dafür
  in Resend eine Domain wie `samedarslan.de` hinzufügen und die angezeigten
  DNS-Einträge beim Domain-Provider setzen)

Benötigte GitHub-Secrets (wie im vue-playground-Repo): `SERVER_HOST`,
`SERVER_USER`, `SERVER_SSH_KEY`.

Hochgeladene Bilder liegen im Docker-Volume `uploads-data` (siehe
`docker-compose.prod.yml`) und überleben damit Deploys/Neustarts.
