# Startet einen lokalen Server fuer die statische Seite.
# Aufruf:  .\start.ps1
# Danach im Browser: http://localhost:5000

Set-Location $PSScriptRoot

Write-Host "Starte lokalen Server auf http://localhost:5000 ..." -ForegroundColor Cyan
Write-Host "Zum Beenden: Strg+C" -ForegroundColor Yellow

npx --yes serve . -l 5000
