# Script de PowerShell para probar endpoints del API
# Ejecutar: .\scripts\test-endpoints-simple.ps1

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
        [bool]$IsWarning = $false,
        [bool]$Allow409 = $false
    )
    
    # Delay para evitar rate limiting
    Start-Sleep -Milliseconds 300
    
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
            Write-Host "   [OK] $Name" -ForegroundColor Green
            $results.Passed++
            return $response
        } else {
            throw "Response success = false"
        }
    } catch {
        $statusCode = $null
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
        }
        
        # Si el status code coincide con el esperado, es éxito
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "   [OK] $Name (Status esperado: $statusCode)" -ForegroundColor Green
            $results.Passed++
            return $null
        }
        
        # Si Allow409 está activado y recibimos 409, es éxito (usuario duplicado es comportamiento correcto)
        if ($Allow409 -and $statusCode -eq 409) {
            Write-Host "   [OK] $Name (Usuario duplicado rechazado correctamente - 409)" -ForegroundColor Green
            $results.Passed++
            return $null
        }
        
        if ($IsWarning) {
            Write-Host "   [WARN] $Name (Status: $statusCode)" -ForegroundColor Yellow
            $results.Warnings++
            return $null
        } else {
            Write-Host "   [FAIL] $Name : $($_.Exception.Message)" -ForegroundColor Red
            $results.Failed++
            return $null
        }
    }
}

Write-Host "`nPRUEBAS COMPLETAS DEL API REST`n" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

# 1. AUTENTICACION
Write-Host "`n1. AUTENTICACION`n" -ForegroundColor Blue

$health = Test-Endpoint -Name "Health Check" -Method "GET" -Path "/health"

# Intentar registrar un usuario (409 es éxito si el usuario ya existe - comportamiento correcto)
$testEmail = "test.buyer@example.com"
$register = Test-Endpoint -Name "Registro de comprador (o rechazo de duplicado)" -Method "POST" -Path "/api/auth/register" -Body @{
    email = $testEmail
    password = "Test123!"
    role = "buyer"
} -ExpectedStatus 201 -Allow409 $true

$loginBuyer = Test-Endpoint -Name "Login de comprador" -Method "POST" -Path "/api/auth/login" -Body @{
    email = $testEmail
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

# 2. USUARIOS
Write-Host "`n2. USUARIOS`n" -ForegroundColor Blue
Test-Endpoint -Name "Obtener perfil propio" -Method "GET" -Path "/api/users/me" -Token $buyerToken

# 3. ARTISTAS
Write-Host "`n3. ARTISTAS`n" -ForegroundColor Blue
$profile = Test-Endpoint -Name "Crear/actualizar perfil de artista" -Method "POST" -Path "/api/artists/profile" -Body @{
    displayName = "Artista de Prueba"
    bio = "Biografia del artista de prueba"
    socialLinks = @{
        instagram = "https://instagram.com/test"
        web = "https://test.com"
    }
} -Token $artistToken

$myProfile = Test-Endpoint -Name "Obtener mi perfil de artista" -Method "GET" -Path "/api/artists/me/profile" -Token $artistToken
$artistProfileId = $myProfile.data._id

if ($artistProfileId) {
    Test-Endpoint -Name "Obtener perfil publico de artista" -Method "GET" -Path "/api/artists/$artistProfileId" -IsWarning $true
}

# 4. OBRAS
Write-Host "`n4. OBRAS`n" -ForegroundColor Blue
$galleryPath = "/api/artworks?page=1"
$gallery = Test-Endpoint -Name "Galeria publica de obras" -Method "GET" -Path $galleryPath
$artworkId = $null
if ($gallery.data -and $gallery.data.Count -gt 0) {
    $artworkId = $gallery.data[0]._id
}

$newArtwork = Test-Endpoint -Name "Crear obra (artista)" -Method "POST" -Path "/api/artworks" -Body @{
    title = "Obra de Prueba API"
    description = "Descripcion de la obra de prueba"
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
    # Obtener detalle como artista (puede ver borradores propios)
    Test-Endpoint -Name "Obtener detalle de obra (artista)" -Method "GET" -Path "/api/artworks/$artworkId" -Token $artistToken
    Test-Endpoint -Name "Publicar obra" -Method "PATCH" -Path "/api/artworks/$artworkId/publish" -Token $artistToken
    # Después de publicar, cualquiera puede verla
    Test-Endpoint -Name "Obtener detalle de obra publicada" -Method "GET" -Path "/api/artworks/$artworkId"
}

Test-Endpoint -Name "Obtener mis obras (artista)" -Method "GET" -Path "/api/artworks/my/list" -Token $artistToken

# 5. PEDIDOS
Write-Host "`n5. PEDIDOS`n" -ForegroundColor Blue
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

# 6. ENCARGOS
Write-Host "`n6. ENCARGOS`n" -ForegroundColor Blue
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
    $deadline = (Get-Date).AddDays(30).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    $commission = Test-Endpoint -Name "Solicitar encargo" -Method "POST" -Path "/api/commissions" -Body @{
        artistId = $artistForCommission
        description = "Encargo de prueba para testing del API"
        budget = 500
        deadline = $deadline
    } -Token $buyerToken -ExpectedStatus 201 -IsWarning $true
}

Test-Endpoint -Name "Obtener mis encargos (comprador)" -Method "GET" -Path "/api/commissions/my" -Token $buyerToken
Test-Endpoint -Name "Obtener mis encargos (artista)" -Method "GET" -Path "/api/commissions/my" -Token $artistToken

# 7. ADMINISTRACION
Write-Host "`n7. ADMINISTRACION`n" -ForegroundColor Blue
Test-Endpoint -Name "Listar usuarios (admin)" -Method "GET" -Path "/api/admin/users" -Token $adminToken
Test-Endpoint -Name "Listar artistas (admin)" -Method "GET" -Path "/api/admin/artists" -Token $adminToken
Test-Endpoint -Name "Listar obras (admin)" -Method "GET" -Path "/api/admin/artworks" -Token $adminToken
Test-Endpoint -Name "Obtener configuracion (admin)" -Method "GET" -Path "/api/admin/settings" -Token $adminToken
Test-Endpoint -Name "Obtener metricas (admin)" -Method "GET" -Path "/api/admin/metrics" -Token $adminToken

# RESUMEN
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "`nRESUMEN DE PRUEBAS`n" -ForegroundColor Cyan
Write-Host "   Exitosas: $($results.Passed)" -ForegroundColor Green
Write-Host "   Fallidas: $($results.Failed)" -ForegroundColor Red
Write-Host "   Advertencias: $($results.Warnings)" -ForegroundColor Yellow
$total = $results.Passed + $results.Failed + $results.Warnings
Write-Host "   Total: $total" -ForegroundColor Blue

if ($results.Passed + $results.Failed -gt 0) {
    $successRate = [math]::Round(($results.Passed / ($results.Passed + $results.Failed)) * 100, 1)
    $color = if ($successRate -ge 80) { "Green" } else { "Yellow" }
    Write-Host "   Tasa de exito: $successRate%`n" -ForegroundColor $color
}

if ($results.Failed -eq 0) {
    Write-Host "Todas las pruebas criticas pasaron exitosamente!`n" -ForegroundColor Green
} else {
    Write-Host "Algunas pruebas fallaron. Revisa los errores arriba.`n" -ForegroundColor Yellow
}
