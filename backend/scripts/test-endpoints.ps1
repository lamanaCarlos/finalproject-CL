# Script de PowerShell para probar todos los endpoints
# Ejecutar: .\scripts\test-endpoints.ps1

$baseUrl = "http://localhost:4000"
$results = @{
    Passed = 0
    Failed = 0
    Warnings = 0
}

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Path,
        [hashtable]$Body = $null,
        [string]$Token = $null,
        [int]$ExpectedStatus = 200,
        [bool]$IsWarning = $false
    )
    
    try {
        $headers = @{
            'Content-Type' = 'application/json'
        }
        
        if ($Token) {
            $headers['Authorization'] = "Bearer $Token"
        }
        
        $params = @{
            Uri = "$baseUrl$Path"
            Method = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params -ErrorAction Stop
        
        if ($response.success -ne $null -and $response.success -eq $true) {
            Write-Host "   ✅ $Name" -ForegroundColor Green
            $results.Passed++
            return $response
        } else {
            throw "Response success = false"
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $ExpectedStatus -or $IsWarning) {
            Write-Host "   ⚠️  $Name (Status: $statusCode)" -ForegroundColor Yellow
            $results.Warnings++
            return $null
        } else {
            Write-Host "   ❌ $Name : $($_.Exception.Message)" -ForegroundColor Red
            $results.Failed++
            return $null
        }
    }
}

Write-Host "`n🧪 PRUEBAS COMPLETAS DEL API REST`n" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

# ============================================
# 1. AUTENTICACIÓN
# ============================================
Write-Host "`n📋 1. AUTENTICACIÓN`n" -ForegroundColor Blue

$health = Test-Endpoint -Name "Health Check" -Method "GET" -Path "/health"
$register = Test-Endpoint -Name "Registro de comprador" -Method "POST" -Path "/api/auth/register" -Body @{
    email = "test.buyer2@example.com"
    password = "Test123!"
    role = "buyer"
} -ExpectedStatus 201

$loginBuyer = Test-Endpoint -Name "Login de comprador" -Method "POST" -Path "/api/auth/login" -Body @{
    email = "test.buyer2@example.com"
    password = "Test123!"
}
$buyerToken = $loginBuyer.data.token

$loginAdmin = Test-Endpoint -Name "Login de admin" -Method "POST" -Path "/api/auth/login" -Body @{
    email = "admin@marketplace.com"
    password = "Admin123!"
}
$adminToken = $loginAdmin.data.token

$loginArtist = Test-Endpoint -Name "Login de artista" -Method "POST" -Path "/api/auth/login" -Body @{
    email = "sofia.artista@email.com"
    password = "Password123!"
}
$artistToken = $loginArtist.data.token

# ============================================
# 2. USUARIOS
# ============================================
Write-Host "`n📋 2. USUARIOS`n" -ForegroundColor Blue

Test-Endpoint -Name "Obtener perfil propio" -Method "GET" -Path "/api/users/me" -Token $buyerToken

# ============================================
# 3. ARTISTAS
# ============================================
Write-Host "`n📋 3. ARTISTAS`n" -ForegroundColor Blue

$profile = Test-Endpoint -Name "Crear/actualizar perfil de artista" -Method "POST" -Path "/api/artists/profile" -Body @{
    displayName = "Artista de Prueba"
    bio = "Biografía del artista de prueba"
    socialLinks = @{
        instagram = "https://instagram.com/test"
        web = "https://test.com"
    }
} -Token $artistToken

$myProfile = Test-Endpoint -Name "Obtener mi perfil de artista" -Method "GET" -Path "/api/artists/me/profile" -Token $artistToken
$artistProfileId = $myProfile.data._id

if ($artistProfileId) {
    Test-Endpoint -Name "Obtener perfil público de artista" -Method "GET" -Path "/api/artists/$artistProfileId" -IsWarning $true
}

# ============================================
# 4. OBRAS
# ============================================
Write-Host "`n📋 4. OBRAS`n" -ForegroundColor Blue

$gallery = Test-Endpoint -Name "Galería pública de obras" -Method "GET" -Path "/api/artworks?page=1`&limit=10"
$artworkId = $null
if ($gallery.data -and $gallery.data.Count -gt 0) {
    $artworkId = $gallery.data[0]._id
}

$newArtwork = Test-Endpoint -Name "Crear obra (artista)" -Method "POST" -Path "/api/artworks" -Body @{
    title = "Obra de Prueba API"
    description = "Descripción de la obra de prueba"
    type = "digital"
    price = 150
    images = @("https://example.com/image.jpg")
    digitalFormat = "PNG"
    resolution = "3000x2000px"
} -Token $artistToken -ExpectedStatus 201

if ($newArtwork.data._id) {
    $artworkId = $newArtwork.data._id
}

if ($artworkId) {
    Test-Endpoint -Name "Obtener detalle de obra" -Method "GET" -Path "/api/artworks/$artworkId"
    Test-Endpoint -Name "Publicar obra" -Method "PATCH" -Path "/api/artworks/$artworkId/publish" -Token $artistToken
}

Test-Endpoint -Name "Obtener mis obras (artista)" -Method "GET" -Path "/api/artworks/my/list" -Token $artistToken

# ============================================
# 5. PEDIDOS
# ============================================
Write-Host "`n📋 5. PEDIDOS`n" -ForegroundColor Blue

# Buscar una obra publicada para comprar
$availableArtwork = $null
if ($gallery.data) {
    $availableArtwork = $gallery.data | Where-Object { $_.status -eq "published" } | Select-Object -First 1
}

if ($availableArtwork) {
    $order = Test-Endpoint -Name "Comprar obra (comprador)" -Method "POST" -Path "/api/orders" -Body @{
        artworkId = $availableArtwork._id
    } -Token $buyerToken -ExpectedStatus 201 -IsWarning $true
}

Test-Endpoint -Name "Obtener mis pedidos (comprador)" -Method "GET" -Path "/api/orders/my" -Token $buyerToken
Test-Endpoint -Name "Obtener mis pedidos (artista)" -Method "GET" -Path "/api/orders/my" -Token $artistToken

# ============================================
# 6. ENCARGOS
# ============================================
Write-Host "`n📋 6. ENCARGOS`n" -ForegroundColor Blue

# Obtener un artista diferente para el encargo
$artistForCommission = $null
$loginArtist2 = Test-Endpoint -Name "Login artista 2 para encargo" -Method "POST" -Path "/api/auth/login" -Body @{
    email = "diego.pintor@email.com"
    password = "Password123!"
} -IsWarning $true

if ($loginArtist2) {
    $profile2 = Test-Endpoint -Name "Obtener perfil artista 2" -Method "GET" -Path "/api/artists/me/profile" -Token $loginArtist2.data.token -IsWarning $true
    if ($profile2 -and $profile2.data.userId) {
        $artistForCommission = $profile2.data.userId._id
    }
}

if ($artistForCommission) {
    $commission = Test-Endpoint -Name "Solicitar encargo" -Method "POST" -Path "/api/commissions" -Body @{
        artistId = $artistForCommission
        description = "Encargo de prueba para testing del API"
        budget = 500
        deadline = (Get-Date).AddDays(30).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    } -Token $buyerToken -ExpectedStatus 201 -IsWarning $true
}

Test-Endpoint -Name "Obtener mis encargos (comprador)" -Method "GET" -Path "/api/commissions/my" -Token $buyerToken
Test-Endpoint -Name "Obtener mis encargos (artista)" -Method "GET" -Path "/api/commissions/my" -Token $artistToken

# ============================================
# 7. ADMINISTRACIÓN
# ============================================
Write-Host "`n📋 7. ADMINISTRACIÓN`n" -ForegroundColor Blue

Test-Endpoint -Name "Listar usuarios (admin)" -Method "GET" -Path "/api/admin/users" -Token $adminToken
Test-Endpoint -Name "Listar artistas (admin)" -Method "GET" -Path "/api/admin/artists" -Token $adminToken
Test-Endpoint -Name "Listar obras (admin)" -Method "GET" -Path "/api/admin/artworks" -Token $adminToken
Test-Endpoint -Name "Obtener configuración (admin)" -Method "GET" -Path "/api/admin/settings" -Token $adminToken
Test-Endpoint -Name "Obtener métricas (admin)" -Method "GET" -Path "/api/admin/metrics" -Token $adminToken

# ============================================
# RESUMEN
# ============================================
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "`n📊 RESUMEN DE PRUEBAS`n" -ForegroundColor Cyan
Write-Host "   ✅ Exitosas: $($results.Passed)" -ForegroundColor Green
Write-Host "   ❌ Fallidas: $($results.Failed)" -ForegroundColor Red
Write-Host "   ⚠️  Advertencias: $($results.Warnings)" -ForegroundColor Yellow
$total = $results.Passed + $results.Failed + $results.Warnings
Write-Host "   📈 Total: $total" -ForegroundColor Blue

if ($results.Passed + $results.Failed -gt 0) {
    $successRate = [math]::Round(($results.Passed / ($results.Passed + $results.Failed)) * 100, 1)
    $color = if ($successRate -ge 80) { "Green" } else { "Yellow" }
    Write-Host "   📊 Tasa de éxito: $successRate%`n" -ForegroundColor $color
}

if ($results.Failed -eq 0) {
    Write-Host "🎉 ¡Todas las pruebas críticas pasaron exitosamente!`n" -ForegroundColor Green
} else {
    Write-Host "Algunas pruebas fallaron. Revisa los errores arriba." -ForegroundColor Yellow
}
