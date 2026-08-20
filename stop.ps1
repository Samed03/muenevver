# Stoppt MySQL + Adminer wieder. Datenbank-Daten bleiben erhalten (Docker-Volume).
# Aufruf:  .\stop.ps1
# Mit komplettem Loeschen der DB-Daten:  .\stop.ps1 -DeleteData

param(
    [switch]$DeleteData
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    $dockerBin = "$env:ProgramFiles\Docker\Docker\resources\bin"
    if (Test-Path $dockerBin) {
        $env:Path = "$dockerBin;$env:Path"
    }
}

if ($DeleteData) {
    Write-Host "Stoppe MySQL + Adminer und loesche Datenbank-Daten..." -ForegroundColor Yellow
    docker compose down -v
} else {
    Write-Host "Stoppe MySQL + Adminer (Daten bleiben erhalten)..." -ForegroundColor Cyan
    docker compose down
}

Write-Host "Fertig. Der Nuxt Dev-Server (falls noch offen) muss separat per Strg+C beendet werden." -ForegroundColor Cyan
