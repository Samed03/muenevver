# Startet den kompletten lokalen Stack: MySQL + Adminer (Docker) und den Nuxt-Dev-Server.
# Aufruf:  .\start.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Docker-Binärpfad ergänzen, falls docker in dieser Session noch nicht im PATH ist
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    $dockerBin = "$env:ProgramFiles\Docker\Docker\resources\bin"
    if (Test-Path $dockerBin) {
        $env:Path = "$dockerBin;$env:Path"
    }
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker wurde nicht gefunden. Bitte Docker Desktop installieren/starten."
}

Write-Host "Starte MySQL + Adminer..." -ForegroundColor Cyan
docker compose up -d

Write-Host "Warte, bis MySQL bereit ist..." -ForegroundColor Cyan
$maxRetries = 30
for ($i = 0; $i -lt $maxRetries; $i++) {
    $status = docker inspect --format='{{.State.Health.Status}}' muenevver-db-1 2>$null
    if ($status -eq "healthy") { break }
    Start-Sleep -Seconds 2
}

Write-Host "Wende Datenbank-Migrationen an..." -ForegroundColor Cyan
npm run db:migrate

Write-Host "Uebernehme Basisinhalte (Profil/Hobbies/Reiseziele), falls noch leer..." -ForegroundColor Cyan
npm run db:seed

Write-Host "Starte Nuxt Dev-Server (http://localhost:3000)..." -ForegroundColor Cyan
Write-Host "Ersten Account einrichten unter http://localhost:3000/setup" -ForegroundColor Cyan
Write-Host "Adminer (DB-GUI) laeuft unter http://localhost:8081" -ForegroundColor Cyan
Write-Host "Zum Beenden: Strg+C, danach .\stop.ps1 ausfuehren" -ForegroundColor Yellow
npm run dev
