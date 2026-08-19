# muenevver

Einfache statische Webseite (HTML/CSS/JS, keine Build-Tools, keine Abhängigkeiten).

## Lokal ansehen

Einfach `index.html` im Browser öffnen, oder mit einem einfachen lokalen Server:

```bash
npx serve .
```

## Struktur

- `index.html` – Seiteninhalt
- `style.css` – Styling (unterstützt hell/dunkel automatisch)
- `script.js` – minimales JavaScript

## Deployment

Noch nicht eingerichtet. Diese Seite kann später über Caddy auf demselben Server
wie andere Projekte laufen (nur Dateien kopieren, kein eigener Container nötig).
