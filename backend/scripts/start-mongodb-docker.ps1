# Script para iniciar MongoDB con Docker
# Ejecutar: .\scripts\start-mongodb-docker.ps1

Write-Host "Iniciando MongoDB con Docker..." -ForegroundColor Cyan

# Verificar si Docker esta corriendo
try {
    docker ps | Out-Null
    Write-Host "Docker esta corriendo" -ForegroundColor Green
} catch {
    Write-Host "Docker no esta corriendo. Por favor, inicia Docker Desktop primero." -ForegroundColor Red
    Write-Host "Abre Docker Desktop y espera a que este completamente iniciado." -ForegroundColor Yellow
    exit 1
}

# Verificar si el contenedor ya existe
$containerExists = docker ps -a --filter "name=mongodb-marketplace" --format "{{.Names}}"

if ($containerExists -eq "mongodb-marketplace") {
    Write-Host "Contenedor MongoDB ya existe. Iniciando..." -ForegroundColor Yellow
    docker start mongodb-marketplace
    if ($LASTEXITCODE -eq 0) {
        Write-Host "MongoDB iniciado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "Error al iniciar MongoDB" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Creando nuevo contenedor MongoDB..." -ForegroundColor Yellow
    docker run -d --name mongodb-marketplace -p 27017:27017 -v mongodb-data:/data/db mongo:latest
    if ($LASTEXITCODE -eq 0) {
        Write-Host "MongoDB creado e iniciado exitosamente" -ForegroundColor Green
        Write-Host "MongoDB esta disponible en: mongodb://localhost:27017" -ForegroundColor Cyan
    } else {
        Write-Host "Error al crear contenedor MongoDB" -ForegroundColor Red
        exit 1
    }
}

# Esperar un momento para que MongoDB este listo
Write-Host "Esperando a que MongoDB este listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Verificar que esta corriendo
$running = docker ps --filter "name=mongodb-marketplace" --format "{{.Names}}"
if ($running -eq "mongodb-marketplace") {
    Write-Host "MongoDB esta corriendo correctamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Cyan
    Write-Host "   1. Ejecuta: npm run seed (para poblar la base de datos)" -ForegroundColor White
    Write-Host "   2. Ejecuta: npm run dev (para iniciar el servidor)" -ForegroundColor White
} else {
    Write-Host "MongoDB no esta corriendo. Revisa los logs:" -ForegroundColor Red
    Write-Host "   docker logs mongodb-marketplace" -ForegroundColor Yellow
    exit 1
}
