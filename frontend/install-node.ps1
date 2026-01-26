# Script para instalar Node.js 20.x LTS automáticamente
# Ejecutar como administrador: PowerShell -ExecutionPolicy Bypass -File install-node.ps1

Write-Host "Descargando Node.js 20.11.0 LTS..." -ForegroundColor Cyan

# URL de descarga de Node.js 20.11.0 LTS para Windows 64-bit
$nodeVersion = "20.11.0"
$downloadUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-x64.msi"
$installerPath = "$env:TEMP\node-v$nodeVersion-x64.msi"

try {
    # Descargar el instalador
    Write-Host "Descargando desde: $downloadUrl" -ForegroundColor Yellow
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -UseBasicParsing
    
    Write-Host "Instalador descargado en: $installerPath" -ForegroundColor Green
    Write-Host "Ejecutando instalador..." -ForegroundColor Cyan
    
    # Ejecutar el instalador silenciosamente
    # /quiet = instalación silenciosa
    # /norestart = no reiniciar
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$installerPath`" /quiet /norestart ADDLOCAL=ALL" -Wait -NoNewWindow
    
    Write-Host "Instalación completada!" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANTE: Cierra TODAS las terminales y abre una nueva." -ForegroundColor Yellow
    Write-Host "Luego verifica con: node --version" -ForegroundColor Yellow
    
    # Limpiar el instalador descargado
    Remove-Item $installerPath -ErrorAction SilentlyContinue
    
} catch {
    Write-Host "Error durante la instalación: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternativa: Descarga manualmente desde https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
