# Guía Completa de Pruebas - Marketplace de Arte

**Fecha:** 26 de Enero, 2026  
**Versión:** 1.0.0

---

## 📋 Índice

1. [Preparación](#preparación)
2. [Credenciales de Prueba](#credenciales-de-prueba)
3. [Pruebas Backend](#pruebas-backend)
4. [Pruebas Frontend](#pruebas-frontend)
5. [Flujos Completos por Rol](#flujos-completos-por-rol)
6. [Checklist Final](#checklist-final)

---

## 🚀 Preparación

### Requisitos Previos

1. **Node.js >= 20.x** instalado y verificado
2. **MongoDB** corriendo (local o Atlas)
3. **Git** para clonar el repositorio

### Configuración Inicial

```bash
# 1. Clonar repositorio (si aplica)
git clone <repository-url>
cd artistProyect

# 2. Configurar Backend
cd backend
npm install
cp .env.example .env
# Editar .env con MONGO_URI, JWT_SECRET, etc.

# 3. Poblar base de datos
npm run seed

# 4. Iniciar Backend
npm run dev
# Verificar: http://localhost:4000/health

# 5. Configurar Frontend (en otra terminal)
cd ../frontend
npm install
npm run dev
# Verificar: http://localhost:5173
```

### Verificar Servidores

- ✅ Backend: http://localhost:4000/health → `{"success":true}`
- ✅ Frontend: http://localhost:5173 → Página carga correctamente

---

## 🔑 Credenciales de Prueba

### Administrador
- **Email:** `admin@marketplace.com`
- **Password:** `Admin123!`
- **Rol:** `admin`
- **Estado:** Activo

### Compradores (4 usuarios disponibles)

#### Comprador 1 (Principal)
- **Email:** `maria.garcia@email.com`
- **Password:** `Password123!`
- **Rol:** `buyer`
- **Estado:** Activo

#### Comprador 2
- **Email:** `juan.rodriguez@email.com`
- **Password:** `Password123!`
- **Rol:** `buyer`
- **Estado:** Activo

#### Comprador 3
- **Email:** `ana.martinez@email.com`
- **Password:** `Password123!`
- **Rol:** `buyer`
- **Estado:** Activo

#### Comprador 4
- **Email:** `carlos.lopez@email.com`
- **Password:** `Password123!`
- **Rol:** `buyer`
- **Estado:** Activo

### Artistas (5 usuarios disponibles)

#### Artista 1 (Principal - Aprobado)
- **Email:** `sofia.artista@email.com`
- **Password:** `Password123!`
- **Rol:** `artist`
- **Estado Perfil:** Aprobado
- **Obras:** 3 obras (2 publicadas, 1 borrador)

#### Artista 2 (Aprobado)
- **Email:** `diego.pintor@email.com`
- **Password:** `Password123!`
- **Rol:** `artist`
- **Estado Perfil:** Aprobado
- **Obras:** 3 obras (2 publicadas, 1 vendida)

#### Artista 3 (Aprobado)
- **Email:** `laura.creativa@email.com`
- **Password:** `Password123!`
- **Rol:** `artist`
- **Estado Perfil:** Aprobado
- **Obras:** 2 obras digitales (ambas publicadas)

#### Artista 4 (Aprobado)
- **Email:** `miguel.art@email.com`
- **Password:** `Password123!`
- **Rol:** `artist`
- **Estado Perfil:** Aprobado
- **Obras:** 2 esculturas físicas (ambas publicadas)

#### Artista 5 (Pendiente - Para pruebas de moderación)
- **Email:** `elena.diseno@email.com`
- **Password:** `Password123!`
- **Rol:** `artist`
- **Estado Perfil:** Pendiente
- **Obras:** 2 obras (1 publicada, 1 borrador)

---

## 🧪 Pruebas Backend

### 1. Health Check

```bash
GET http://localhost:4000/health
```

**Resultado Esperado:**
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2026-01-26T...",
  "environment": "development"
}
```

✅ **Verificar:** Status 200, `success: true`

---

### 2. Autenticación

#### 2.1. Registro de Usuario

```bash
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "test.buyer@example.com",
  "password": "Test123!",
  "role": "buyer"
}
```

**Resultado Esperado:**
- Status: 201
- `success: true`
- `data.token` presente
- `data.user` con email y rol

✅ **Verificar:** Token generado, usuario creado

#### 2.2. Login de Comprador

```bash
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "maria.garcia@email.com",
  "password": "Password123!"
}
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.token` presente
- `data.user.role: "buyer"`

✅ **Verificar:** Token válido, rol correcto

#### 2.3. Login de Artista

```bash
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "sofia.artista@email.com",
  "password": "Password123!"
}
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.user.role: "artist"`

✅ **Verificar:** Token válido, rol correcto

#### 2.4. Login de Admin

```bash
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@marketplace.com",
  "password": "Admin123!"
}
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.user.role: "admin"`

✅ **Verificar:** Token válido, rol correcto

#### 2.5. Login con Credenciales Inválidas

```bash
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "maria.garcia@email.com",
  "password": "PasswordIncorrecta"
}
```

**Resultado Esperado:**
- Status: 401
- `success: false`
- Mensaje de error apropiado

✅ **Verificar:** Error de autenticación manejado correctamente

---

### 3. Usuarios

#### 3.1. Obtener Perfil Propio

```bash
GET http://localhost:4000/api/users/me
Authorization: Bearer <token_comprador>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.email` coincide con el usuario autenticado
- `data.role` correcto

✅ **Verificar:** Datos del usuario correctos

---

### 4. Artistas

#### 4.1. Crear/Actualizar Perfil de Artista

```bash
POST http://localhost:4000/api/artists/profile
Authorization: Bearer <token_artista>
Content-Type: application/json

{
  "displayName": "Mi Nombre Artístico",
  "bio": "Soy un artista especializado en...",
  "profileImage": "https://example.com/image.jpg",
  "socialLinks": {
    "instagram": "@minombre",
    "web": "https://minombre.art"
  }
}
```

**Resultado Esperado:**
- Status: 200 o 201
- `success: true`
- `data.displayName` actualizado
- Perfil creado o actualizado

✅ **Verificar:** Perfil guardado correctamente

#### 4.2. Obtener Mi Perfil de Artista

```bash
GET http://localhost:4000/api/artists/me/profile
Authorization: Bearer <token_artista>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.displayName` presente
- `data.status` presente

✅ **Verificar:** Perfil del artista autenticado

#### 4.3. Obtener Perfil Público de Artista

```bash
GET http://localhost:4000/api/artists/<artist_id>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.displayName` presente
- Solo perfiles aprobados (o admin puede ver todos)

✅ **Verificar:** Perfil público accesible

---

### 5. Obras

#### 5.1. Galería Pública de Obras

```bash
GET http://localhost:4000/api/artworks?page=1&limit=12
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.data` array con obras
- Solo obras con `status: "published"`
- Paginación funcionando

✅ **Verificar:** Obras publicadas visibles, paginación correcta

#### 5.2. Crear Obra (Artista)

```bash
POST http://localhost:4000/api/artworks
Authorization: Bearer <token_artista>
Content-Type: application/json

{
  "title": "Nueva Obra de Prueba",
  "description": "Descripción detallada de la obra",
  "type": "physical",
  "price": 500,
  "images": ["http://localhost:4000/uploads/test-image.jpg"],
  "technique": "Óleo sobre lienzo",
  "dimensions": "50x70 cm",
  "weight": 2.5,
  "language": "es"
}
```

**Resultado Esperado:**
- Status: 201
- `success: true`
- `data.title` coincide
- `data.status: "draft"` por defecto
- `data.artistId` del artista autenticado

✅ **Verificar:** Obra creada correctamente

#### 5.3. Obtener Detalle de Obra

```bash
GET http://localhost:4000/api/artworks/<artwork_id>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.title` presente
- `data.images` array
- `data.artist` poblado

✅ **Verificar:** Información completa de la obra

#### 5.4. Publicar Obra

```bash
PATCH http://localhost:4000/api/artworks/<artwork_id>/publish
Authorization: Bearer <token_artista>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.status: "published"`

✅ **Verificar:** Obra publicada, visible en galería pública

#### 5.5. Despublicar Obra

```bash
PATCH http://localhost:4000/api/artworks/<artwork_id>/unpublish
Authorization: Bearer <token_artista>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.status: "draft"`

✅ **Verificar:** Obra despublicada, no visible en galería

#### 5.6. Obtener Mis Obras (Artista)

```bash
GET http://localhost:4000/api/artworks/my/list
Authorization: Bearer <token_artista>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data` array con todas las obras del artista
- Incluye borradores y publicadas

✅ **Verificar:** Todas las obras del artista listadas

---

### 6. Pedidos

#### 6.1. Comprar Obra

```bash
POST http://localhost:4000/api/orders
Authorization: Bearer <token_comprador>
Content-Type: application/json

{
  "artworkId": "<artwork_id_publicada>"
}
```

**Resultado Esperado:**
- Status: 201
- `success: true`
- `data.artwork` poblado
- `data.buyer` del comprador autenticado
- `data.total` calculado correctamente
- Obra marcada como `status: "sold"`

✅ **Verificar:** Pedido creado, obra vendida

#### 6.2. Obtener Mis Pedidos (Comprador)

```bash
GET http://localhost:4000/api/orders/my
Authorization: Bearer <token_comprador>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data` array con pedidos del comprador

✅ **Verificar:** Pedidos del comprador listados

#### 6.3. Obtener Mis Pedidos (Artista)

```bash
GET http://localhost:4000/api/orders/my
Authorization: Bearer <token_artista>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data` array con pedidos recibidos por el artista
- `earnings` calculado correctamente

✅ **Verificar:** Pedidos del artista listados con ganancias

#### 6.4. Actualizar Información de Envío

```bash
PATCH http://localhost:4000/api/orders/<order_id>/shipping
Authorization: Bearer <token_artista>
Content-Type: application/json

{
  "shippingStatus": "sent",
  "address": "Calle Ejemplo 123, Madrid, España",
  "trackingNumber": "TRACK123456",
  "shippingMethod": "Correos Express",
  "shippingCost": 15
}
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.shipping` actualizado

✅ **Verificar:** Información de envío guardada

---

### 7. Encargos

#### 7.1. Solicitar Encargo

```bash
POST http://localhost:4000/api/commissions
Authorization: Bearer <token_comprador>
Content-Type: application/json

{
  "artistId": "<artist_id>",
  "title": "Encargo Personalizado",
  "description": "Quiero un retrato de mi familia",
  "budget": 500,
  "deadline": "2026-03-01"
}
```

**Resultado Esperado:**
- Status: 201
- `success: true`
- `data.status: "pending"`
- `data.buyer` del comprador autenticado

✅ **Verificar:** Encargo creado correctamente

#### 7.2. Obtener Mis Encargos (Comprador)

```bash
GET http://localhost:4000/api/commissions/my
Authorization: Bearer <token_comprador>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data` array con encargos del comprador

✅ **Verificar:** Encargos del comprador listados

#### 7.3. Obtener Mis Encargos (Artista)

```bash
GET http://localhost:4000/api/commissions/my
Authorization: Bearer <token_artista>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data` array con encargos recibidos por el artista

✅ **Verificar:** Encargos del artista listados

#### 7.4. Aceptar Encargo

```bash
PATCH http://localhost:4000/api/commissions/<commission_id>
Authorization: Bearer <token_artista>
Content-Type: application/json

{
  "status": "accepted",
  "agreedPrice": 450
}
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.status: "accepted"`
- `data.agreedPrice` establecido

✅ **Verificar:** Encargo aceptado correctamente

#### 7.5. Rechazar Encargo

```bash
PATCH http://localhost:4000/api/commissions/<commission_id>
Authorization: Bearer <token_artista>
Content-Type: application/json

{
  "status": "rejected"
}
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.status: "rejected"`

✅ **Verificar:** Encargo rechazado correctamente

#### 7.6. Agregar Mensaje a Encargo

```bash
POST http://localhost:4000/api/commissions/<commission_id>/messages
Authorization: Bearer <token_artista>
Content-Type: application/json

{
  "message": "Hola, puedo empezar el encargo la próxima semana."
}
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- Mensaje agregado al array `messages`

✅ **Verificar:** Mensaje guardado correctamente

---

### 8. Subida de Archivos

#### 8.1. Subir Una Imagen

```bash
POST http://localhost:4000/api/upload/image
Authorization: Bearer <token_artista>
Content-Type: multipart/form-data

Form Data:
- image: [archivo imagen]
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.url` con URL completa
- `data.filename` único
- Archivo guardado en `backend/uploads/`

✅ **Verificar:** Imagen subida, URL accesible

#### 8.2. Subir Múltiples Imágenes

```bash
POST http://localhost:4000/api/upload/images
Authorization: Bearer <token_artista>
Content-Type: multipart/form-data

Form Data:
- images: [archivo1, archivo2, archivo3]
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data` array con todas las imágenes subidas

✅ **Verificar:** Múltiples imágenes subidas correctamente

#### 8.3. Acceder a Imagen Subida

```bash
GET http://localhost:4000/uploads/<filename>
```

**Resultado Esperado:**
- Status: 200
- Content-Type: image/jpeg o image/png
- Imagen se muestra correctamente

✅ **Verificar:** Archivo estático accesible públicamente

#### 8.4. Eliminar Imagen

```bash
DELETE http://localhost:4000/api/upload/<filename>
Authorization: Bearer <token_artista>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- Archivo eliminado del servidor

✅ **Verificar:** Archivo eliminado físicamente

---

### 9. Administración

#### 9.1. Listar Usuarios (Admin)

```bash
GET http://localhost:4000/api/admin/users?page=1&limit=10
Authorization: Bearer <token_admin>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.data` array con usuarios
- Paginación funcionando

✅ **Verificar:** Lista de usuarios accesible solo para admin

#### 9.2. Activar/Desactivar Usuario

```bash
PATCH http://localhost:4000/api/admin/users/<user_id>/status
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "status": "inactive"
}
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.status` actualizado

✅ **Verificar:** Estado de usuario actualizado

#### 9.3. Listar Artistas (Admin)

```bash
GET http://localhost:4000/api/admin/artists?status=pending
Authorization: Bearer <token_admin>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.data` array con artistas
- Filtro por estado funcionando

✅ **Verificar:** Lista de artistas con filtros

#### 9.4. Aprobar Artista

```bash
PATCH http://localhost:4000/api/admin/artists/<artist_id>/status
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "status": "approved"
}
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.status: "approved"`

✅ **Verificar:** Artista aprobado, visible públicamente

#### 9.5. Bloquear Artista

```bash
PATCH http://localhost:4000/api/admin/artists/<artist_id>/status
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "status": "blocked"
}
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.status: "blocked"`

✅ **Verificar:** Artista bloqueado

#### 9.6. Obtener Métricas (Admin)

```bash
GET http://localhost:4000/api/admin/metrics
Authorization: Bearer <token_admin>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.totalUsers`, `data.totalArtists`, `data.totalRevenue`, etc.

✅ **Verificar:** Métricas calculadas correctamente

#### 9.7. Obtener Configuración (Admin)

```bash
GET http://localhost:4000/api/admin/settings
Authorization: Bearer <token_admin>
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data.commissionRate`, `data.minCommission` presentes

✅ **Verificar:** Configuración accesible

#### 9.8. Actualizar Configuración (Admin)

```bash
PATCH http://localhost:4000/api/admin/settings
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "commissionRate": 12,
  "minCommission": 5
}
```

**Resultado Esperado:**
- Status: 200
- `success: true`
- `data` actualizado

✅ **Verificar:** Configuración guardada

---

## 🎨 Pruebas Frontend

### 1. Páginas Públicas (Sin Autenticación)

#### 1.1. HomePage (`/`)

**Acciones a Verificar:**
- [ ] Página carga sin errores
- [ ] Hero section se muestra correctamente
- [ ] Galería aleatoria de obras se carga
- [ ] Se muestran 12 obras en grid responsive
- [ ] Las obras se mezclan aleatoriamente (recargar página para verificar)
- [ ] Solo se muestran obras publicadas
- [ ] Botón "Ver Todas las Obras" navega a `/gallery`
- [ ] Header y Footer visibles
- [ ] Selector de idioma funciona (ES/EN)
- [ ] Botones "Iniciar Sesión" y "Registrarse" visibles
- [ ] Navegación funciona correctamente

**Credenciales:** No requiere autenticación

---

#### 1.2. LoginPage (`/login`)

**Acciones a Verificar:**
- [ ] Formulario carga correctamente
- [ ] Campos email y password presentes
- [ ] Validación de email funciona
- [ ] Validación de password funciona
- [ ] Login exitoso con `maria.garcia@email.com / Password123!` redirige a `/buyer/dashboard`
- [ ] Login exitoso con `sofia.artista@email.com / Password123!` redirige a `/artist/dashboard`
- [ ] Login exitoso con `admin@marketplace.com / Admin123!` redirige a `/admin/dashboard`
- [ ] Error de login muestra mensaje apropiado
- [ ] Link "¿No tienes cuenta? Regístrate" funciona
- [ ] Selector de idioma funciona

**Credenciales de Prueba:**
- Comprador: `maria.garcia@email.com / Password123!`
- Artista: `sofia.artista@email.com / Password123!`
- Admin: `admin@marketplace.com / Admin123!`
- Inválido: `test@test.com / WrongPassword`

---

#### 1.3. RegisterPage (`/register`)

**Acciones a Verificar:**
- [ ] Formulario carga correctamente
- [ ] Campos: email, password, confirmPassword, role
- [ ] Selección de rol funciona (buyer/artist)
- [ ] Validación de contraseña (mínimo 8 caracteres, mayúscula, número)
- [ ] Validación de confirmación de contraseña
- [ ] Registro exitoso redirige según rol
- [ ] Error de email duplicado muestra mensaje
- [ ] Link "¿Ya tienes cuenta? Inicia sesión" funciona

**Pruebas:**
1. Registrar nuevo comprador → Debe redirigir a `/buyer/dashboard`
2. Registrar nuevo artista → Debe redirigir a `/artist/dashboard`
3. Intentar registrar email existente → Debe mostrar error

---

#### 1.4. GalleryPage (`/gallery`)

**Acciones a Verificar:**
- [ ] Obras se cargan correctamente
- [ ] Grid responsive funciona (1 col móvil, 2 tablet, 3-4 desktop)
- [ ] Filtro por tipo funciona (todos, físico, digital)
- [ ] Búsqueda por texto funciona
- [ ] Paginación funciona (si hay más de 12 obras)
- [ ] Click en obra navega a `/artwork/:id`
- [ ] Estado vacío se muestra si no hay resultados
- [ ] Selector de idioma funciona

**Pruebas:**
1. Filtrar por "Físico" → Solo obras físicas
2. Filtrar por "Digital" → Solo obras digitales
3. Buscar "abstract" → Obras con "abstract" en título/descripción
4. Navegar a página 2 → Obras de página 2 se muestran

---

#### 1.5. ArtworkDetailPage (`/artwork/:id`)

**Acciones a Verificar:**
- [ ] Información de obra se carga correctamente
- [ ] Galería de imágenes funciona (si hay múltiples)
- [ ] Título, descripción, precio, técnica se muestran
- [ ] Información del artista se muestra
- [ ] Link a perfil del artista funciona
- [ ] Botón "Comprar ahora" visible (si está publicada)
- [ ] Botón "Comprar ahora" deshabilitado si está vendida
- [ ] Si no está autenticado, botón muestra "Inicia sesión para comprar"
- [ ] Selector de idioma funciona

**Pruebas:**
1. Ver obra publicada → Botón "Comprar ahora" habilitado
2. Ver obra vendida → Botón muestra "Vendido"
3. Ver obra borrador (sin autenticación) → Error 404 o no accesible
4. Click en artista → Navega a `/artist/:id`

---

#### 1.6. ArtistProfilePage (`/artist/:id`)

**Acciones a Verificar:**
- [ ] Perfil del artista se carga
- [ ] Nombre artístico, bio, imagen de perfil se muestran
- [ ] Estadísticas se muestran (total obras, publicadas, vendidas)
- [ ] Galería de obras publicadas funciona
- [ ] Enlaces sociales funcionan (si existen)
- [ ] Solo perfiles aprobados visibles (o admin puede ver todos)
- [ ] Selector de idioma funciona

**Pruebas:**
1. Ver perfil aprobado → Visible y completo
2. Ver perfil pendiente (sin autenticación) → Error 404
3. Ver perfil pendiente (como admin) → Visible

---

### 2. Dashboard Comprador

#### 2.1. BuyerDashboard (`/buyer/dashboard`)

**Credenciales:** `maria.garcia@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Requiere autenticación (redirige a login si no está autenticado)
- [ ] Dashboard carga correctamente
- [ ] Estadísticas se muestran:
  - Total de pedidos
  - Pedidos pendientes
  - Total gastado
  - Encargos activos
- [ ] Lista de pedidos recientes funciona (máximo 5)
- [ ] Lista de encargos recientes funciona (máximo 5)
- [ ] Enlaces a sub-páginas funcionan:
  - "Mis Pedidos" → `/buyer/orders`
  - "Mis Encargos" → `/buyer/commissions`
- [ ] Sidebar visible y funcional
- [ ] Navegación funciona

**Pruebas:**
1. Acceder sin autenticación → Redirige a `/login`
2. Verificar estadísticas → Valores correctos según datos
3. Click en "Ver todos" → Navega a página completa

---

#### 2.2. BuyerOrdersPage (`/buyer/orders`)

**Credenciales:** `maria.garcia@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Lista completa de pedidos se carga
- [ ] Cards muestran información correcta:
  - Imagen de la obra
  - Título de la obra
  - Precio
  - Fecha del pedido
  - Estado
- [ ] Enlaces a detalles funcionan
- [ ] Estado vacío se muestra si no hay pedidos
- [ ] Paginación funciona (si hay muchos pedidos)

**Pruebas:**
1. Verificar que se muestran todos los pedidos del comprador
2. Click en un pedido → Navega a `/buyer/orders/:id`
3. Verificar estados (completado, pendiente, etc.)

---

#### 2.3. BuyerOrderDetailPage (`/buyer/orders/:id`)

**Credenciales:** `maria.garcia@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Detalle del pedido se carga
- [ ] Información de la obra se muestra
- [ ] Resumen del pedido es correcto:
  - Precio de la obra
  - Costo de envío (si aplica)
  - Total
- [ ] Información de envío se muestra (si es obra física)
- [ ] Estado del envío se muestra
- [ ] Botón "Volver" funciona
- [ ] Información del artista se muestra

**Pruebas:**
1. Ver pedido de obra física → Información de envío visible
2. Ver pedido de obra digital → Sin información de envío
3. Verificar cálculos → Total = precio + envío

---

#### 2.4. BuyerCommissionsPage (`/buyer/commissions`)

**Credenciales:** `maria.garcia@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Lista completa de encargos se carga
- [ ] Cards muestran información correcta:
  - Título del encargo
  - Artista
  - Presupuesto
  - Estado
  - Fecha
- [ ] Enlaces a detalles funcionan
- [ ] Estado vacío se muestra si no hay encargos

**Pruebas:**
1. Verificar que se muestran todos los encargos del comprador
2. Click en un encargo → Navega a `/buyer/commissions/:id`

---

#### 2.5. BuyerCommissionDetailPage (`/buyer/commissions/:id`)

**Credenciales:** `maria.garcia@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Detalle del encargo se carga
- [ ] Información completa se muestra:
  - Título, descripción
  - Artista
  - Presupuesto
  - Precio acordado (si aplica)
  - Estado
  - Fecha límite
- [ ] Mensajes se muestran (si hay)
- [ ] Resumen es correcto

**Pruebas:**
1. Ver encargo pendiente → Estado "Pendiente"
2. Ver encargo aceptado → Precio acordado visible
3. Ver mensajes → Lista de mensajes con fechas

---

### 3. Dashboard Artista

#### 3.1. ArtistDashboard (`/artist/dashboard`)

**Credenciales:** `sofia.artista@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Requiere autenticación y rol de artista
- [ ] Dashboard carga correctamente
- [ ] Alerta de perfil pendiente (si aplica) se muestra
- [ ] Estadísticas se muestran:
  - Total de obras
  - Obras publicadas
  - Obras vendidas
  - Ganancias totales
  - Encargos pendientes
- [ ] Galería de obras recientes funciona
- [ ] Enlaces a sub-páginas funcionan
- [ ] Sidebar visible y funcional

**Pruebas:**
1. Acceder sin autenticación → Redirige a `/login`
2. Acceder como comprador → Error 403 o redirige
3. Verificar estadísticas → Valores correctos

---

#### 3.2. ArtistArtworksPage (`/artist/artworks`)

**Credenciales:** `sofia.artista@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Lista de obras se carga
- [ ] Grid responsive funciona
- [ ] Badges de estado correctos:
  - "Publicada" (verde) para `published`
  - "Borrador" (amarillo) para `draft`
  - "Vendida" (azul) para `sold`
- [ ] Botón "Crear Obra" funciona → Navega a `/artist/artworks/new`
- [ ] Botón "Editar" en cada obra funciona
- [ ] **Botón "Publicar" visible para obras en borrador**
- [ ] **Botón "Despublicar" visible para obras publicadas**
- [ ] **Botones no disponibles para obras vendidas**
- [ ] Estado vacío se muestra si no hay obras

**Pruebas:**
1. Publicar obra en borrador:
   - Click en "Publicar"
   - Confirmar
   - Verificar que badge cambia a "Publicada"
   - Verificar que aparece en galería pública
2. Despublicar obra publicada:
   - Click en "Despublicar"
   - Confirmar
   - Verificar que badge cambia a "Borrador"
   - Verificar que desaparece de galería pública

---

#### 3.3. ArtistCreateArtworkPage (`/artist/artworks/new`)

**Credenciales:** `sofia.artista@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Formulario carga correctamente
- [ ] Campos requeridos: título, descripción, tipo, precio, imágenes
- [ ] Campos dinámicos según tipo:
  - Físico: dimensiones, peso
  - Digital: formato, resolución
- [ ] Validación funciona:
  - Título mínimo 1 carácter
  - Descripción mínimo 10 caracteres
  - Precio >= 0
  - Al menos una imagen requerida
- [ ] **Componente ImageUpload funciona:**
  - Botón "Subir Imágenes" visible
  - Seleccionar imágenes → Preview se muestra
  - Múltiples imágenes se pueden subir
  - Eliminar imagen del preview funciona
  - Estados de carga se muestran
- [ ] Creación exitosa redirige a `/artist/artworks`
- [ ] Notificación de éxito se muestra

**Pruebas:**
1. Crear obra física:
   - Llenar todos los campos
   - Subir 2-3 imágenes
   - Guardar
   - Verificar que se crea como borrador
2. Crear obra digital:
   - Llenar campos digitales
   - Subir imagen
   - Guardar
   - Verificar creación

---

#### 3.4. ArtistEditArtworkPage (`/artist/artworks/:id/edit`)

**Credenciales:** `sofia.artista@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Formulario carga con datos existentes
- [ ] Campos se prellenan correctamente
- [ ] **Imágenes existentes se muestran en preview**
- [ ] **Se pueden agregar más imágenes**
- [ ] **Se pueden eliminar imágenes del preview**
- [ ] Actualización funciona
- [ ] Redirección después de actualizar
- [ ] Notificación de éxito se muestra

**Pruebas:**
1. Editar obra existente:
   - Cambiar título
   - Agregar más imágenes
   - Eliminar una imagen
   - Guardar
   - Verificar cambios
2. Cambiar tipo de obra:
   - De físico a digital (o viceversa)
   - Verificar que campos cambian
   - Guardar

---

#### 3.5. ArtistOrdersPage (`/artist/orders`)

**Credenciales:** `sofia.artista@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Lista de pedidos recibidos se carga
- [ ] Ganancias se muestran correctamente (precio - comisión)
- [ ] Enlaces a detalles funcionan
- [ ] Estado vacío se muestra si no hay pedidos

**Pruebas:**
1. Verificar cálculo de ganancias:
   - Precio obra: €100
   - Comisión 10%: €10
   - Ganancias: €90
2. Verificar que solo se muestran pedidos del artista autenticado

---

#### 3.6. ArtistOrderDetailPage (`/artist/orders/:id`)

**Credenciales:** `sofia.artista@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Detalle del pedido se carga
- [ ] Información del comprador se muestra
- [ ] Resumen con ganancias es correcto
- [ ] **Formulario de actualización de envío visible (si es obra física)**
- [ ] **Botón "Actualizar Envío" funciona**
- [ ] **Formulario se muestra/oculta correctamente**
- [ ] **Campos de envío:**
  - Estado de envío (select)
  - Dirección
  - Número de seguimiento
  - Método de envío
  - Costo de envío
- [ ] **Guardar actualización funciona**
- [ ] **Notificación de éxito se muestra**

**Pruebas:**
1. Actualizar envío:
   - Click en "Actualizar Envío"
   - Llenar formulario
   - Guardar
   - Verificar que se actualiza
   - Verificar que formulario se oculta
2. Verificar que solo aparece para obras físicas

---

#### 3.7. ArtistCommissionsPage (`/artist/commissions`)

**Credenciales:** `sofia.artista@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Lista de encargos recibidos se carga
- [ ] Enlaces a detalles funcionan
- [ ] Estado vacío se muestra si no hay encargos

**Pruebas:**
1. Verificar que solo se muestran encargos del artista autenticado
2. Verificar estados (pendiente, aceptado, rechazado, etc.)

---

#### 3.8. ArtistCommissionDetailPage (`/artist/commissions/:id`)

**Credenciales:** `sofia.artista@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Detalle del encargo se carga
- [ ] Información completa se muestra
- [ ] **Mensajes se muestran:**
  - Lista de mensajes con fechas
  - Orden cronológico
- [ ] **Formulario para enviar mensaje funciona:**
  - Campo de texto
  - Botón "Enviar Mensaje"
  - Validación de mensaje vacío
  - Estado de carga durante envío
- [ ] **Botones "Aceptar" y "Rechazar" visibles (solo para encargos pendientes)**
- [ ] **Aceptar encargo:**
  - Click en "Aceptar"
  - Confirmar
  - Verificar que estado cambia a "Aceptado"
  - Verificar que botones desaparecen
- [ ] **Rechazar encargo:**
  - Click en "Rechazar"
  - Confirmar
  - Verificar que estado cambia a "Rechazado"
  - Verificar que botones desaparecen
- [ ] Notificaciones de éxito/error se muestran

**Pruebas:**
1. Enviar mensaje:
   - Escribir mensaje
   - Enviar
   - Verificar que aparece en la lista
   - Verificar fecha/hora
2. Aceptar encargo pendiente:
   - Verificar que precio acordado se establece
   - Verificar cambio de estado
3. Rechazar encargo pendiente:
   - Verificar cambio de estado
   - Verificar que botones desaparecen

---

#### 3.9. ArtistProfileEditPage (`/artist/profile`)

**Credenciales:** `sofia.artista@email.com / Password123!`

**Acciones a Verificar:**
- [ ] Formulario carga con datos existentes
- [ ] Campos se prellenan:
  - Nombre artístico
  - Bio
  - Imagen de perfil (URL)
  - Instagram
  - Web
- [ ] Actualización funciona
- [ ] Redirección después de actualizar
- [ ] Notificación de éxito se muestra

**Pruebas:**
1. Actualizar perfil:
   - Cambiar nombre artístico
   - Actualizar bio
   - Guardar
   - Verificar cambios en perfil público

---

### 4. Dashboard Administrador

#### 4.1. AdminDashboard (`/admin/dashboard`)

**Credenciales:** `admin@marketplace.com / Admin123!`

**Acciones a Verificar:**
- [ ] Requiere autenticación y rol de admin
- [ ] Dashboard carga correctamente
- [ ] Métricas se muestran:
  - Total de usuarios
  - Total de artistas
  - Ingresos totales
  - Artistas pendientes
- [ ] Lista de artistas pendientes funciona
- [ ] Acciones rápidas funcionan:
  - "Gestionar Usuarios" → `/admin/users`
  - "Gestionar Artistas" → `/admin/artists`
  - "Gestionar Obras" → `/admin/artworks`
  - "Ver Métricas" → `/admin/metrics`
- [ ] Sidebar visible y funcional

**Pruebas:**
1. Acceder sin autenticación → Redirige a `/login`
2. Acceder como comprador/artista → Error 403 o redirige
3. Verificar métricas → Valores correctos

---

#### 4.2. AdminUsersPage (`/admin/users`)

**Credenciales:** `admin@marketplace.com / Admin123!`

**Acciones a Verificar:**
- [ ] Lista de usuarios se carga
- [ ] Filtro por rol funciona (todos, buyer, artist, admin)
- [ ] Paginación funciona
- [ ] Enlaces a detalles funcionan
- [ ] Estado vacío se muestra si no hay usuarios

**Pruebas:**
1. Filtrar por "buyer" → Solo compradores
2. Filtrar por "artist" → Solo artistas
3. Click en usuario → Navega a `/admin/users/:id`

---

#### 4.3. AdminUserDetailPage (`/admin/users/:id`)

**Credenciales:** `admin@marketplace.com / Admin123!`

**Acciones a Verificar:**
- [ ] Detalle del usuario se carga
- [ ] Información completa se muestra
- [ ] Botón "Activar/Desactivar" funciona
- [ ] Notificación de éxito se muestra
- [ ] Estado se actualiza correctamente

**Pruebas:**
1. Desactivar usuario activo:
   - Click en "Desactivar"
   - Confirmar
   - Verificar que estado cambia
2. Activar usuario inactivo:
   - Click en "Activar"
   - Confirmar
   - Verificar que estado cambia

---

#### 4.4. AdminArtistsPage (`/admin/artists`)

**Credenciales:** `admin@marketplace.com / Admin123!`

**Acciones a Verificar:**
- [ ] Lista de artistas se carga
- [ ] Filtro por estado funciona (todos, aprobado, pendiente, bloqueado)
- [ ] Indicador de pendientes funciona
- [ ] Paginación funciona
- [ ] Enlaces a detalles funcionan

**Pruebas:**
1. Filtrar por "pendiente" → Solo artistas pendientes
2. Verificar indicador de pendientes → Número correcto

---

#### 4.5. AdminArtistDetailPage (`/admin/artists/:id`)

**Credenciales:** `admin@marketplace.com / Admin123!`

**Acciones a Verificar:**
- [ ] Detalle del artista se carga
- [ ] Estadísticas se muestran
- [ ] Botones de acción funcionan:
  - "Aprobar Artista" (si está pendiente)
  - "Bloquear Artista" (si está aprobado)
  - "Desbloquear Artista" (si está bloqueado)
- [ ] Notificaciones funcionan
- [ ] Estado se actualiza correctamente

**Pruebas:**
1. Aprobar artista pendiente:
   - Click en "Aprobar"
   - Confirmar
   - Verificar que estado cambia a "Aprobado"
   - Verificar que aparece en perfiles públicos
2. Bloquear artista aprobado:
   - Click en "Bloquear"
   - Confirmar
   - Verificar que estado cambia a "Bloqueado"
   - Verificar que desaparece de perfiles públicos

---

#### 4.6. AdminArtworksPage (`/admin/artworks`)

**Credenciales:** `admin@marketplace.com / Admin123!`

**Acciones a Verificar:**
- [ ] Lista de obras se carga
- [ ] Filtro por estado funciona
- [ ] Paginación funciona
- [ ] Enlaces a detalles funcionan

**Pruebas:**
1. Filtrar por "publicadas" → Solo obras publicadas
2. Filtrar por "borradores" → Solo borradores

---

#### 4.7. AdminMetricsPage (`/admin/metrics`)

**Credenciales:** `admin@marketplace.com / Admin123!`

**Acciones a Verificar:**
- [ ] Métricas se cargan correctamente
- [ ] Cards muestran valores correctos:
  - Total de usuarios
  - Total de artistas
  - Ingresos totales
  - Artistas pendientes
  - Ratio artista/usuario
  - Tasa de comisión
- [ ] Enlaces rápidos funcionan

**Pruebas:**
1. Verificar cálculos → Valores coinciden con datos reales
2. Verificar que métricas se actualizan en tiempo real

---

#### 4.8. AdminSettingsPage (`/admin/settings`)

**Credenciales:** `admin@marketplace.com / Admin123!`

**Acciones a Verificar:**
- [ ] Configuración se carga
- [ ] Formulario se prellena con valores actuales
- [ ] Campos:
  - Tasa de comisión (%)
  - Comisión mínima ($)
- [ ] Actualización funciona
- [ ] Notificación de éxito se muestra
- [ ] Valores se guardan correctamente

**Pruebas:**
1. Cambiar tasa de comisión:
   - Cambiar a 12%
   - Guardar
   - Verificar que se guarda
   - Verificar que se aplica en nuevos pedidos

---

### 5. Componentes y Funcionalidades Generales

#### 5.1. Sidebar

**Acciones a Verificar:**
- [ ] Se muestra en todos los dashboards
- [ ] Navegación por rol funciona:
  - Comprador: Pedidos, Encargos
  - Artista: Obras, Pedidos, Encargos, Perfil
  - Admin: Usuarios, Artistas, Obras, Métricas, Configuración
- [ ] Menú móvil funciona (hamburger)
- [ ] Indicador de ruta activa funciona
- [ ] Overlay en móvil funciona
- [ ] Cerrar menú móvil funciona

**Pruebas:**
1. Navegar entre páginas → Indicador se actualiza
2. En móvil → Menú se abre/cierra correctamente

---

#### 5.2. Header

**Acciones a Verificar:**
- [ ] Navegación funciona (Home, Explorar, Artistas)
- [ ] Selector de idioma funciona (ES/EN)
- [ ] Botones de auth funcionan:
  - Sin autenticación: "Iniciar Sesión", "Registrarse"
  - Autenticado: "Mi Cuenta", "Cerrar Sesión"
- [ ] Menú móvil funciona
- [ ] Logo/Home funciona

**Pruebas:**
1. Cambiar idioma → Página se traduce
2. Click en "Cerrar Sesión" → Redirige a home, token eliminado

---

#### 5.3. Footer

**Acciones a Verificar:**
- [ ] Enlaces funcionan (About, Contact, Terms, Privacy)
- [ ] Redes sociales funcionan (si están configuradas)
- [ ] Información de copyright se muestra

---

#### 5.4. Internacionalización

**Acciones a Verificar:**
- [ ] Cambio de idioma funciona en todas las páginas
- [ ] Todas las páginas están traducidas
- [ ] Fechas se formatean correctamente según idioma
- [ ] Idioma se guarda en localStorage
- [ ] Idioma persiste entre sesiones

**Pruebas:**
1. Cambiar a Inglés → Toda la UI en inglés
2. Cambiar a Español → Toda la UI en español
3. Recargar página → Idioma se mantiene

---

#### 5.5. Autenticación

**Acciones a Verificar:**
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Logout funciona
- [ ] Protección de rutas funciona:
  - Rutas protegidas redirigen a login si no está autenticado
  - Rutas de admin redirigen si no es admin
- [ ] Redirección según rol después del login funciona
- [ ] Token se guarda en localStorage
- [ ] Token se envía en todas las peticiones

**Pruebas:**
1. Intentar acceder a `/buyer/dashboard` sin autenticación → Redirige a `/login`
2. Login como comprador → Redirige a `/buyer/dashboard`
3. Login como artista → Redirige a `/artist/dashboard`
4. Login como admin → Redirige a `/admin/dashboard`
5. Logout → Redirige a home, token eliminado

---

#### 5.6. Componente ImageUpload

**Acciones a Verificar:**
- [ ] Botón "Subir Imágenes" funciona
- [ ] Seleccionar imágenes → Preview se muestra
- [ ] Múltiples imágenes se pueden subir (hasta 10)
- [ ] Eliminar imagen del preview funciona (hover → X)
- [ ] Estados de carga se muestran durante subida
- [ ] Validación de tipo funciona (solo imágenes)
- [ ] Validación de tamaño funciona (máximo 5MB)
- [ ] Mensajes de error se muestran apropiadamente
- [ ] Grid responsive para preview
- [ ] Límite de imágenes funciona (máximo 10)

**Pruebas:**
1. Subir imagen válida → Se muestra en preview
2. Subir imagen > 5MB → Error de tamaño
3. Subir archivo no imagen → Error de tipo
4. Subir 11 imágenes → Error de límite
5. Eliminar imagen → Desaparece del preview

---

## 👥 Flujos Completos por Rol

### Flujo Completo: Comprador

**Credenciales:** `maria.garcia@email.com / Password123!`

#### Paso 1: Explorar y Descubrir
1. [ ] Navegar a HomePage (`/`)
2. [ ] Ver galería aleatoria de obras
3. [ ] Click en "Ver Todas las Obras" → Navega a GalleryPage
4. [ ] Filtrar por tipo "Físico"
5. [ ] Buscar "abstract"
6. [ ] Click en una obra → Navega a ArtworkDetailPage
7. [ ] Ver información completa de la obra
8. [ ] Click en artista → Navega a ArtistProfilePage
9. [ ] Ver perfil del artista y sus obras

#### Paso 2: Comprar Obra
1. [ ] Volver a ArtworkDetailPage de una obra publicada
2. [ ] Click en "Comprar ahora"
3. [ ] Confirmar compra
4. [ ] Verificar redirección a `/buyer/orders/:id`
5. [ ] Verificar que pedido se creó correctamente
6. [ ] Verificar que obra está marcada como vendida

#### Paso 3: Gestionar Pedidos
1. [ ] Ir a BuyerDashboard
2. [ ] Ver estadísticas actualizadas
3. [ ] Click en "Mis Pedidos" → Navega a BuyerOrdersPage
4. [ ] Ver lista de pedidos
5. [ ] Click en un pedido → Navega a BuyerOrderDetailPage
6. [ ] Ver información completa del pedido
7. [ ] Verificar información de envío (si es obra física)

#### Paso 4: Solicitar Encargo
1. [ ] Ir a perfil de un artista
2. [ ] (Si hay botón de solicitar encargo, usarlo)
3. [ ] O ir directamente a BuyerCommissionsPage
4. [ ] Crear nuevo encargo (si hay formulario)
5. [ ] O usar endpoint directo del backend
6. [ ] Ver encargo en BuyerCommissionsPage
7. [ ] Click en encargo → Navega a BuyerCommissionDetailPage
8. [ ] Ver mensajes del artista (si hay)

---

### Flujo Completo: Artista

**Credenciales:** `sofia.artista@email.com / Password123!`

#### Paso 1: Configurar Perfil
1. [ ] Login como artista
2. [ ] Ir a ArtistDashboard
3. [ ] Verificar alerta de perfil (si está pendiente)
4. [ ] Ir a "Mi Perfil" → Navega a ArtistProfileEditPage
5. [ ] Actualizar información:
   - Nombre artístico
   - Bio
   - Redes sociales
6. [ ] Guardar cambios
7. [ ] Verificar que perfil se actualiza

#### Paso 2: Crear y Publicar Obra
1. [ ] Ir a "Mis Obras" → Navega a ArtistArtworksPage
2. [ ] Click en "Crear Obra"
3. [ ] Llenar formulario:
   - Título: "Obra de Prueba"
   - Descripción: "Descripción detallada..."
   - Tipo: Físico
   - Precio: 300
   - Técnica: "Óleo"
   - Dimensiones: "50x70 cm"
   - Peso: 2.5
4. [ ] **Subir 2-3 imágenes usando ImageUpload:**
   - Click en "Subir Imágenes"
   - Seleccionar imágenes
   - Verificar preview
   - Eliminar una imagen
5. [ ] Guardar obra
6. [ ] Verificar que se crea como borrador
7. [ ] Volver a ArtistArtworksPage
8. [ ] **Click en "Publicar" en la obra creada**
9. [ ] Confirmar
10. [ ] Verificar que badge cambia a "Publicada"
11. [ ] Verificar que aparece en galería pública

#### Paso 3: Gestionar Pedidos Recibidos
1. [ ] Ir a "Mis Pedidos" → Navega a ArtistOrdersPage
2. [ ] Ver lista de pedidos recibidos
3. [ ] Verificar ganancias calculadas
4. [ ] Click en un pedido de obra física → Navega a ArtistOrderDetailPage
5. [ ] **Actualizar información de envío:**
   - Click en "Actualizar Envío"
   - Llenar formulario:
     - Estado: "Enviado"
     - Dirección: "Calle Ejemplo 123"
     - Tracking: "TRACK123"
     - Método: "Correos Express"
     - Costo: 15
   - Guardar
6. [ ] Verificar que información se actualiza
7. [ ] Verificar que formulario se oculta

#### Paso 4: Gestionar Encargos
1. [ ] Ir a "Mis Encargos" → Navega a ArtistCommissionsPage
2. [ ] Ver lista de encargos recibidos
3. [ ] Click en un encargo pendiente → Navega a ArtistCommissionDetailPage
4. [ ] **Enviar mensaje:**
   - Escribir mensaje en el formulario
   - Click en "Enviar Mensaje"
   - Verificar que aparece en la lista
5. [ ] **Aceptar encargo:**
   - Click en "Aceptar Encargo"
   - Confirmar
   - Verificar que estado cambia a "Aceptado"
   - Verificar que botones desaparecen
6. [ ] O **Rechazar encargo:**
   - (Si hay otro encargo pendiente)
   - Click en "Rechazar Encargo"
   - Confirmar
   - Verificar que estado cambia a "Rechazado"

#### Paso 5: Editar Obra
1. [ ] Ir a "Mis Obras"
2. [ ] Click en "Editar" en una obra
3. [ ] Modificar título
4. [ ] **Agregar más imágenes:**
   - Subir nueva imagen
   - Verificar que se agrega al preview
5. [ ] **Eliminar una imagen:**
   - Hover sobre imagen
   - Click en X
   - Verificar que desaparece
6. [ ] Guardar cambios
7. [ ] Verificar que cambios se reflejan

---

### Flujo Completo: Administrador

**Credenciales:** `admin@marketplace.com / Admin123!`

#### Paso 1: Revisar Métricas
1. [ ] Login como admin
2. [ ] Ir a AdminDashboard
3. [ ] Ver métricas generales
4. [ ] Click en "Ver Métricas" → Navega a AdminMetricsPage
5. [ ] Verificar todas las métricas:
   - Total usuarios
   - Total artistas
   - Ingresos totales
   - Artistas pendientes
   - Ratio artista/usuario

#### Paso 2: Moderar Artistas
1. [ ] Ir a "Artistas" → Navega a AdminArtistsPage
2. [ ] Filtrar por "Pendiente"
3. [ ] Ver lista de artistas pendientes
4. [ ] Click en un artista pendiente → Navega a AdminArtistDetailPage
5. [ ] Revisar información del artista
6. [ ] **Aprobar artista:**
   - Click en "Aprobar Artista"
   - Confirmar
   - Verificar que estado cambia a "Aprobado"
   - Verificar que aparece en perfiles públicos
7. [ ] Volver a AdminArtistsPage
8. [ ] Filtrar por "Aprobado"
9. [ ] Click en otro artista
10. [ ] **Bloquear artista:**
    - Click en "Bloquear Artista"
    - Confirmar
    - Verificar que estado cambia a "Bloqueado"

#### Paso 3: Gestionar Usuarios
1. [ ] Ir a "Usuarios" → Navega a AdminUsersPage
2. [ ] Filtrar por rol "buyer"
3. [ ] Ver lista de compradores
4. [ ] Click en un usuario → Navega a AdminUserDetailPage
5. [ ] **Desactivar usuario:**
   - Click en "Desactivar Usuario"
   - Confirmar
   - Verificar que estado cambia
6. [ ] **Activar usuario:**
   - (Si hay usuario inactivo)
   - Click en "Activar Usuario"
   - Confirmar
   - Verificar que estado cambia

#### Paso 4: Configurar Plataforma
1. [ ] Ir a "Configuración" → Navega a AdminSettingsPage
2. [ ] Ver configuración actual
3. [ ] **Actualizar configuración:**
   - Cambiar tasa de comisión a 12%
   - Cambiar comisión mínima a 5
   - Guardar
4. [ ] Verificar que se guarda
5. [ ] Verificar que se aplica en nuevos pedidos

#### Paso 5: Gestionar Obras
1. [ ] Ir a "Obras" → Navega a AdminArtworksPage
2. [ ] Filtrar por estado
3. [ ] Ver lista de obras
4. [ ] Verificar que puede ver todas las obras (incluso borradores)

---

## ✅ Checklist Final

### Backend

- [ ] Health check responde correctamente
- [ ] Autenticación funciona (login, registro)
- [ ] Todos los endpoints responden correctamente
- [ ] Validaciones funcionan
- [ ] Errores se manejan apropiadamente
- [ ] Subida de archivos funciona
- [ ] Archivos estáticos se sirven correctamente
- [ ] CORS configurado correctamente
- [ ] Rate limiting funciona

### Frontend

- [ ] Todas las páginas públicas cargan
- [ ] Autenticación funciona (login, registro, logout)
- [ ] Protección de rutas funciona
- [ ] Dashboards cargan según rol
- [ ] Todas las sub-páginas funcionan
- [ ] Formularios validan correctamente
- [ ] Subida de imágenes funciona
- [ ] Internacionalización funciona
- [ ] Responsive design funciona
- [ ] Notificaciones se muestran
- [ ] Manejo de errores funciona

### Funcionalidades Específicas

- [ ] Compra de obras funciona
- [ ] Mensajería en encargos funciona
- [ ] Actualización de envío funciona
- [ ] Aceptar/rechazar encargos funciona
- [ ] Publicar/despublicar obras funciona
- [ ] Subida de imágenes funciona
- [ ] Administración completa funciona

---

## 🐛 Problemas Comunes y Soluciones

### Backend no responde
- **Solución:** Verificar que servidor esté corriendo en puerto 4000
- **Solución:** Verificar conexión a MongoDB
- **Solución:** Revisar logs del backend
- **Solución:** Verificar variables de entorno

### Frontend no carga
- **Solución:** Verificar Node.js >= 20.x
- **Solución:** Ejecutar `npm install` en frontend
- **Solución:** Revisar consola del navegador
- **Solución:** Verificar que backend esté corriendo

### Errores de CORS
- **Solución:** Verificar configuración CORS en backend
- **Solución:** Verificar `VITE_API_BASE_URL` en frontend

### Errores de autenticación
- **Solución:** Limpiar localStorage y volver a hacer login
- **Solución:** Verificar expiración del token
- **Solución:** Verificar que token se envía en headers

### Imágenes no se muestran
- **Solución:** Verificar que servidor sirve archivos en `/uploads`
- **Solución:** Verificar URL de la imagen
- **Solución:** Revisar consola para errores 404 o CORS

### Subida de imágenes falla
- **Solución:** Verificar tamaño de archivo (máximo 5MB)
- **Solución:** Verificar tipo de archivo (JPEG, PNG, GIF, WEBP)
- **Solución:** Verificar que carpeta `uploads/` existe
- **Solución:** Verificar permisos de escritura

---

## 📊 Resumen de Pruebas

### Backend
- **Total Endpoints:** 27+
- **Tasa de Éxito:** 100%
- **Categorías:** Autenticación, Usuarios, Artistas, Obras, Pedidos, Encargos, Upload, Administración

### Frontend
- **Total Páginas:** 20+
- **Total Componentes:** 15+
- **Roles Probados:** Visitante, Comprador, Artista, Administrador
- **Funcionalidades:** Todas implementadas y probadas

---

## 📝 Notas Finales

- Todas las pruebas deben ejecutarse en orden
- Usar las credenciales proporcionadas
- Verificar que los datos de prueba estén cargados (`npm run seed`)
- Documentar cualquier problema encontrado
- Las pruebas de frontend requieren interacción manual en el navegador

---

**Última actualización:** 26 de Enero, 2026
