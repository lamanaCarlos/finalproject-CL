# Base de Datos - Marketplace de Arte

## 📋 Descripción

Este documento describe la estructura y configuración de la base de datos MongoDB para el marketplace de arte. La base de datos está diseñada con buenas prácticas, optimizaciones de rendimiento y preparada para escalabilidad.

---

## 🗄️ Modelos de Datos

### 1. User (Usuarios)
**Colección:** `users`

Representa todos los usuarios del sistema (compradores, artistas, administradores).

**Campos principales:**
- `email` (String, único, indexado)
- `password` (String, hasheado con bcrypt)
- `role` (Enum: 'buyer', 'artist', 'admin')
- `isActive` (Boolean, indexado)

**Índices:**
- `email` (único)
- `role`
- `isActive`
- Compuesto: `{role: 1, isActive: 1}`

**Características:**
- Hash automático de contraseñas antes de guardar
- Método `comparePassword()` para autenticación
- Método `toPublicJSON()` para excluir password en respuestas

---

### 2. ArtistProfile (Perfil de Artista)
**Colección:** `artistprofiles`

Perfil público de los artistas. Relación 1:1 con User.

**Campos principales:**
- `userId` (ObjectId, ref: User, único)
- `displayName` (String)
- `bio` (String, max 2000 caracteres)
- `profileImage` (String, URL)
- `socialLinks` (Object: instagram, web)
- `status` (Enum: 'pending', 'approved', 'blocked')

**Índices:**
- `userId` (único)
- `status`
- Compuesto: `{status: 1, createdAt: -1}`
- Texto: `{displayName: 'text', bio: 'text'}`

---

### 3. Artwork (Obras)
**Colección:** `artworks`

Obras de arte físicas y digitales publicadas por artistas.

**Campos principales:**
- `artistId` (ObjectId, ref: ArtistProfile)
- `title` (String)
- `description` (String, max 5000 caracteres)
- `type` (Enum: 'digital', 'physical')
- `price` (Number, min: 0)
- `images` (Array de Strings, max 10)
- `technique` (String)
- `dimensions` (String, para obras físicas)
- `weight` (Number, para obras físicas)
- `digitalFormat` (String, para obras digitales)
- `resolution` (String, para obras digitales)
- `language` (Enum: 'es', 'en')
- `status` (Enum: 'draft', 'published', 'sold')

**Índices:**
- `artistId`
- `type`
- `status`
- `language`
- `price`
- Compuestos:
  - `{status: 1, type: 1, language: 1}` (galería pública)
  - `{status: 1, price: 1}` (ordenamiento por precio)
  - `{artistId: 1, status: 1}` (obras de artista)
- Texto: `{title: 'text', description: 'text', technique: 'text'}`

---

### 4. Order (Pedidos/Ventas)
**Colección:** `orders`

Transacciones de compra de obras.

**Campos principales:**
- `buyerId` (ObjectId, ref: User)
- `artworkId` (ObjectId, ref: Artwork)
- `artistId` (ObjectId, ref: User)
- `price` (Number)
- `commission` (Number)
- `artistEarnings` (Number, calculado automáticamente)
- `shippingRequired` (Boolean)
- `shippingStatus` (Enum: 'pending', 'agreed', 'sent')
- `shippingInfo` (Object: address, trackingNumber, shippingMethod, shippingCost)

**Índices:**
- `buyerId`
- `artistId`
- `artworkId`
- `shippingStatus`
- Compuestos:
  - `{buyerId: 1, createdAt: -1}` (historial de compras)
  - `{artistId: 1, createdAt: -1}` (ventas del artista)

**Características:**
- Cálculo automático de `artistEarnings` (precio - comisión)
- Método estático `createOrder()` para crear órdenes con comisión

---

### 5. CommissionRequest (Encargos Personalizados)
**Colección:** `commissionrequests`

Solicitudes de encargos personalizados de compradores a artistas.

**Campos principales:**
- `buyerId` (ObjectId, ref: User)
- `artistId` (ObjectId, ref: User)
- `title` (String)
- `description` (String, max 5000 caracteres)
- `budget` (Number)
- `agreedPrice` (Number, opcional)
- `deadline` (Date)
- `status` (Enum: 'pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')
- `messages` (Array de objetos con senderId, message, createdAt)

**Índices:**
- `buyerId`
- `artistId`
- `status`
- Compuestos:
  - `{artistId: 1, status: 1}` (encargos pendientes)
  - `{buyerId: 1, status: 1}` (encargos del comprador)

**Métodos:**
- `accept(agreedPrice)` - Aceptar encargo
- `reject()` - Rechazar encargo
- `startWork()` - Iniciar trabajo
- `complete()` - Completar encargo
- `addMessage(senderId, message)` - Agregar mensaje

---

### 6. PlatformSettings (Configuración Global)
**Colección:** `platformsettings`

Configuración global del sistema (singleton - solo un documento).

**Campos principales:**
- `minimumCommission` (Number, 0-100, default: 10)
- `supportedLanguages` (Array de Strings, default: ['es', 'en'])
- `features` (Object con flags de funcionalidades)

**Métodos estáticos:**
- `getSettings()` - Obtener o crear configuración
- `updateSettings(updates, updatedBy)` - Actualizar configuración

---

## 🔍 Agregaciones

### Artwork Aggregations
- `getPublicGalleryPipeline()` - Galería pública con filtros
- `getArtistArtworkStatsPipeline()` - Estadísticas de obras de artista
- `getTopSellingArtworksPipeline()` - Obras más vendidas

### Artist Aggregations
- `getArtistProfileWithStatsPipeline()` - Perfil completo con estadísticas
- `getArtistsListPipeline()` - Lista de artistas con filtros

### Admin Aggregations
- `getPlatformMetricsPipeline()` - Métricas globales
- `getArtworkMetricsPipeline()` - Estadísticas de obras
- `getSalesMetricsPipeline()` - Estadísticas de ventas
- `getCommissionMetricsPipeline()` - Estadísticas de encargos
- `getTopArtistsPipeline()` - Artistas más exitosos

---

## 🔄 Transacciones

Operaciones que requieren atomicidad:

1. **Crear Orden y Marcar Obra como Vendida**
   - `createOrderWithArtworkUpdate()`
   - Asegura que la obra se marque como vendida solo si la orden se crea exitosamente

2. **Aceptar Encargo**
   - `acceptCommissionRequest()`
   - Actualiza estado de forma atómica

3. **Completar Encargo con Orden**
   - `completeCommissionWithOrder()`
   - Crea orden y actualiza estado del encargo de forma atómica

---

## 🛠️ Utilidades

### dbErrors.js
Manejo centralizado de errores de base de datos:
- `handleValidationError()` - Errores de validación
- `handleDuplicateKeyError()` - Errores de duplicado
- `handleCastError()` - Errores de cast
- `formatDatabaseError()` - Formateo para respuestas HTTP

### validators.js
Validadores reutilizables:
- `isValidEmail()`
- `isValidUrl()`
- `isValidPrice()`
- `isValidObjectId()`
- `isValidLanguage()`

---

## 📦 Instalación y Configuración

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar variables de entorno
Copiar `.env.example` a `.env` y configurar:
```env
MONGO_URI=mongodb://localhost:27017/marketplace-arte
NODE_ENV=development
ADMIN_EMAIL=admin@marketplace.com
ADMIN_PASSWORD=Admin123!
```

### 3. Inicializar base de datos
```bash
npm run seed
```

Esto creará:
- Usuario administrador inicial
- Configuración de plataforma por defecto
- **Datos de ejemplo para pruebas:**
  - 4 usuarios compradores
  - 5 usuarios artistas
  - 5 perfiles de artistas (4 aprobados, 1 pendiente)
  - 12 obras de arte (físicas y digitales) en diferentes estados
  - Órdenes de ejemplo
  - Encargos personalizados de ejemplo

**Para limpiar y recrear todos los datos:**
```bash
npm run seed:clear
```

⚠️ **Nota:** El comando `seed:clear` solo funciona en desarrollo (NODE_ENV !== 'production')

**Credenciales de prueba:**
- **Admin:** admin@marketplace.com / Admin123!
- **Comprador:** maria.garcia@email.com / Password123!
- **Artista:** sofia.artista@email.com / Password123!
- Todos los usuarios de prueba usan la contraseña: `Password123!`

---

## 📊 Índices y Optimización

### Estrategia de Indexación

1. **Índices Únicos:** Para campos que deben ser únicos (email, userId en ArtistProfile)
2. **Índices Simples:** Para búsquedas frecuentes (role, status, type)
3. **Índices Compuestos:** Para consultas con múltiples filtros
4. **Índices de Texto:** Para búsquedas full-text (títulos, descripciones)

### Consideraciones de Rendimiento

- Los índices están optimizados para las consultas más frecuentes
- Se usa proyección en agregaciones para limitar campos devueltos
- Paginación implementada en todas las consultas de listado
- Agregaciones optimizadas para evitar múltiples consultas

---

## 🔒 Seguridad

- Passwords hasheados con bcrypt (12 salt rounds)
- Validación de entrada en múltiples niveles
- Sanitización de datos de usuario
- Campos sensibles excluidos por defecto (password)

---

## 📝 Notas Importantes

1. **Límites de MongoDB:**
   - Tamaño máximo de documento: 16MB
   - Arrays grandes (imágenes) pueden requerir GridFS si superan límites

2. **Relaciones:**
   - Se usan referencias (ObjectId) en lugar de documentos embebidos
   - Facilita escalabilidad y evita duplicación

3. **Multi-idioma:**
   - Preparado para expansión con campos de idioma
   - Búsquedas por idioma optimizadas con índices

4. **Escalabilidad:**
   - Estructura preparada para sharding futuro
   - Índices optimizados para consultas de lectura

---

---

## 🌐 API REST - Endpoints Documentados

### Base URL
```
http://localhost:4000/api
```

### Autenticación
La mayoría de los endpoints requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

---

### 1. Autenticación (`/api/auth`)

#### POST `/api/auth/register`
Registro de nuevo usuario.

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123!",
  "role": "buyer"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "role": "buyer"
  }
}
```

**Response (409 - Usuario duplicado):**
```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

---

#### POST `/api/auth/login`
Login de usuario.

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "usuario@example.com",
      "role": "buyer",
      "isActive": true
    }
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

### 2. Usuarios (`/api/users`)

#### GET `/api/users/me`
Obtener perfil propio.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "role": "buyer",
    "isActive": true,
    "createdAt": "2026-01-26T10:00:00.000Z"
  }
}
```

---

### 3. Artistas (`/api/artists`)

#### POST `/api/artists/profile`
Crear o actualizar perfil de artista.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "displayName": "Artista Ejemplo",
  "bio": "Biografía del artista",
  "profileImage": "https://example.com/image.jpg",
  "socialLinks": {
    "instagram": "https://instagram.com/artista",
    "web": "https://artista.com"
  }
}
```

**Response (200/201):**
```json
{
  "success": true,
  "message": "Perfil de artista creado/actualizado exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "displayName": "Artista Ejemplo",
    "bio": "Biografía del artista",
    "profileImage": "https://example.com/image.jpg",
    "socialLinks": {
      "instagram": "https://instagram.com/artista",
      "web": "https://artista.com"
    },
    "status": "pending",
    "createdAt": "2026-01-26T10:00:00.000Z"
  }
}
```

---

#### GET `/api/artists/me/profile`
Obtener mi perfil de artista.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "artista@example.com"
    },
    "displayName": "Artista Ejemplo",
    "bio": "Biografía del artista",
    "status": "approved",
    "createdAt": "2026-01-26T10:00:00.000Z"
  }
}
```

---

#### GET `/api/artists/:id`
Obtener perfil público de artista.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "displayName": "Artista Ejemplo",
    "bio": "Biografía del artista",
    "profileImage": "https://example.com/image.jpg",
    "socialLinks": {
      "instagram": "https://instagram.com/artista",
      "web": "https://artista.com"
    },
    "status": "approved",
    "stats": {
      "totalArtworks": 15,
      "publishedArtworks": 12,
      "soldArtworks": 5
    }
  }
}
```

---

### 4. Obras (`/api/artworks`)

#### POST `/api/artworks`
Crear nueva obra.

**Headers:**
```
Authorization: Bearer <token>
```

**Request (Obra Digital):**
```json
{
  "title": "Obra Digital Ejemplo",
  "description": "Descripción de la obra",
  "type": "digital",
  "price": 150,
  "images": ["https://example.com/image1.jpg"],
  "digitalFormat": "PNG",
  "resolution": "3000x2000px",
  "technique": "Digital Art",
  "language": "es"
}
```

**Request (Obra Física):**
```json
{
  "title": "Obra Física Ejemplo",
  "description": "Descripción de la obra",
  "type": "physical",
  "price": 500,
  "images": ["https://example.com/image1.jpg"],
  "dimensions": "50x70cm",
  "weight": 2.5,
  "technique": "Óleo sobre lienzo",
  "language": "es"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Obra creada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "artistId": "507f1f77bcf86cd799439012",
    "title": "Obra Digital Ejemplo",
    "description": "Descripción de la obra",
    "type": "digital",
    "price": 150,
    "images": ["https://example.com/image1.jpg"],
    "digitalFormat": "PNG",
    "resolution": "3000x2000px",
    "status": "draft",
    "createdAt": "2026-01-26T10:00:00.000Z"
  }
}
```

---

#### GET `/api/artworks`
Obtener galería pública de obras.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `artistId` (opcional)
- `type` (opcional: "digital" | "physical")
- `minPrice` (opcional)
- `maxPrice` (opcional)
- `language` (opcional: "es" | "en")
- `search` (opcional: búsqueda de texto)
- `sortBy` (default: "createdAt")
- `sortOrder` (default: "-1" | "1" o "asc" | "desc")

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Obra Ejemplo",
      "description": "Descripción",
      "type": "digital",
      "price": 150,
      "images": ["https://example.com/image1.jpg"],
      "artist": {
        "_id": "507f1f77bcf86cd799439012",
        "displayName": "Artista Ejemplo"
      },
      "status": "published",
      "createdAt": "2026-01-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

#### GET `/api/artworks/:id`
Obtener detalle de obra.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "artistId": {
      "_id": "507f1f77bcf86cd799439012",
      "displayName": "Artista Ejemplo",
      "profileImage": "https://example.com/profile.jpg"
    },
    "title": "Obra Ejemplo",
    "description": "Descripción completa",
    "type": "digital",
    "price": 150,
    "images": ["https://example.com/image1.jpg"],
    "digitalFormat": "PNG",
    "resolution": "3000x2000px",
    "technique": "Digital Art",
    "language": "es",
    "status": "published",
    "createdAt": "2026-01-26T10:00:00.000Z"
  }
}
```

---

#### GET `/api/artworks/my/list`
Obtener mis obras (artista).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Mi Obra",
      "type": "digital",
      "price": 150,
      "status": "published",
      "createdAt": "2026-01-26T10:00:00.000Z"
    }
  ]
}
```

---

#### PUT `/api/artworks/:id`
Actualizar obra.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Título Actualizado",
  "description": "Nueva descripción",
  "price": 200
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Obra actualizada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Título Actualizado",
    "price": 200,
    "updatedAt": "2026-01-26T11:00:00.000Z"
  }
}
```

---

#### PATCH `/api/artworks/:id/publish`
Publicar obra.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Obra publicada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "published",
    "publishedAt": "2026-01-26T11:00:00.000Z"
  }
}
```

---

#### PATCH `/api/artworks/:id/unpublish`
Despublicar obra.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Obra despublicada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "draft"
  }
}
```

---

### 5. Pedidos (`/api/orders`)

#### POST `/api/orders`
Crear pedido (comprar obra).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "artworkId": "507f1f77bcf86cd799439013"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "buyerId": "507f1f77bcf86cd799439011",
    "artworkId": "507f1f77bcf86cd799439013",
    "artistId": "507f1f77bcf86cd799439015",
    "price": 150,
    "commission": 15,
    "artistEarnings": 135,
    "shippingRequired": false,
    "status": "completed",
    "createdAt": "2026-01-26T10:00:00.000Z"
  }
}
```

---

#### GET `/api/orders/my`
Obtener mis pedidos.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "artwork": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Obra Comprada",
        "images": ["https://example.com/image.jpg"]
      },
      "artist": {
        "displayName": "Artista Ejemplo"
      },
      "price": 150,
      "status": "completed",
      "createdAt": "2026-01-26T10:00:00.000Z"
    }
  ]
}
```

---

#### GET `/api/orders/:id`
Obtener detalle de pedido.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "buyerId": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "comprador@example.com"
    },
    "artworkId": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Obra Comprada",
      "images": ["https://example.com/image.jpg"]
    },
    "artistId": {
      "_id": "507f1f77bcf86cd799439015",
      "displayName": "Artista Ejemplo"
    },
    "price": 150,
    "commission": 15,
    "artistEarnings": 135,
    "shippingStatus": "sent",
    "shippingInfo": {
      "address": "Calle Ejemplo 123",
      "trackingNumber": "TRACK123456",
      "shippingMethod": "standard",
      "shippingCost": 10
    },
    "createdAt": "2026-01-26T10:00:00.000Z"
  }
}
```

---

#### PATCH `/api/orders/:id/shipping`
Actualizar información de envío.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "shippingStatus": "sent",
  "shippingInfo": {
    "address": "Calle Ejemplo 123",
    "trackingNumber": "TRACK123456",
    "shippingMethod": "standard",
    "shippingCost": 10
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Información de envío actualizada",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "shippingStatus": "sent",
    "shippingInfo": {
      "address": "Calle Ejemplo 123",
      "trackingNumber": "TRACK123456",
      "shippingMethod": "standard",
      "shippingCost": 10
    }
  }
}
```

---

### 6. Encargos (`/api/commissions`)

#### POST `/api/commissions`
Solicitar encargo.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "artistId": "507f1f77bcf86cd799439015",
  "title": "Retrato Personalizado",
  "description": "Necesito un retrato en estilo realista",
  "budget": 500,
  "deadline": "2026-02-26T10:00:00.000Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Encargo solicitado exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "buyerId": "507f1f77bcf86cd799439011",
    "artistId": "507f1f77bcf86cd799439015",
    "title": "Retrato Personalizado",
    "description": "Necesito un retrato en estilo realista",
    "budget": 500,
    "status": "pending",
    "deadline": "2026-02-26T10:00:00.000Z",
    "createdAt": "2026-01-26T10:00:00.000Z"
  }
}
```

---

#### GET `/api/commissions/my`
Obtener mis encargos.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "title": "Retrato Personalizado",
      "description": "Necesito un retrato en estilo realista",
      "artist": {
        "displayName": "Artista Ejemplo"
      },
      "buyer": {
        "email": "comprador@example.com"
      },
      "budget": 500,
      "status": "accepted",
      "deadline": "2026-02-26T10:00:00.000Z",
      "createdAt": "2026-01-26T10:00:00.000Z"
    }
  ]
}
```

---

#### GET `/api/commissions/:id`
Obtener detalle de encargo.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "buyerId": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "comprador@example.com"
    },
    "artistId": {
      "_id": "507f1f77bcf86cd799439015",
      "displayName": "Artista Ejemplo"
    },
    "title": "Retrato Personalizado",
    "description": "Necesito un retrato en estilo realista",
    "budget": 500,
    "agreedPrice": 450,
    "status": "in_progress",
    "deadline": "2026-02-26T10:00:00.000Z",
    "messages": [
      {
        "senderId": "507f1f77bcf86cd799439011",
        "message": "¿Cuándo podría estar listo?",
        "createdAt": "2026-01-26T10:00:00.000Z"
      }
    ],
    "createdAt": "2026-01-26T10:00:00.000Z"
  }
}
```

---

#### PATCH `/api/commissions/:id`
Gestionar encargo (cambiar estado).

**Headers:**
```
Authorization: Bearer <token>
```

**Request (Aceptar):**
```json
{
  "status": "accepted",
  "agreedPrice": 450
}
```

**Request (Rechazar):**
```json
{
  "status": "rejected"
}
```

**Request (Iniciar trabajo):**
```json
{
  "status": "in_progress"
}
```

**Request (Completar):**
```json
{
  "status": "completed"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Estado del encargo actualizado",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "status": "accepted",
    "agreedPrice": 450,
    "updatedAt": "2026-01-26T11:00:00.000Z"
  }
}
```

---

#### POST `/api/commissions/:id/messages`
Agregar mensaje a encargo.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "message": "¿Podrías incluir más detalles sobre el estilo?"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Mensaje agregado exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "messages": [
      {
        "senderId": "507f1f77bcf86cd799439011",
        "message": "¿Podrías incluir más detalles sobre el estilo?",
        "createdAt": "2026-01-26T11:00:00.000Z"
      }
    ]
  }
}
```

---

### 7. Administración (`/api/admin`)

**Nota:** Todos los endpoints de administración requieren autenticación y rol de administrador.

#### GET `/api/admin/users`
Listar usuarios.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `role` (opcional: "buyer" | "artist" | "admin")
- `isActive` (opcional: true | false)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "usuario@example.com",
      "role": "buyer",
      "isActive": true,
      "createdAt": "2026-01-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

#### PATCH `/api/admin/users/:id/status`
Actualizar estado de usuario.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "isActive": false
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Estado de usuario actualizado",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "isActive": false,
    "updatedAt": "2026-01-26T11:00:00.000Z"
  }
}
```

---

#### GET `/api/admin/artists`
Listar artistas.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (opcional: "pending" | "approved" | "blocked")

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": {
        "_id": "507f1f77bcf86cd799439015",
        "email": "artista@example.com"
      },
      "displayName": "Artista Ejemplo",
      "status": "approved",
      "createdAt": "2026-01-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2
  }
}
```

---

#### PATCH `/api/admin/artists/:id/status`
Actualizar estado de artista.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "approved"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Estado de artista actualizado",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "approved",
    "updatedAt": "2026-01-26T11:00:00.000Z"
  }
}
```

---

#### GET `/api/admin/artworks`
Listar todas las obras.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` (opcional: "draft" | "published" | "sold")
- `type` (opcional: "digital" | "physical")

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Obra Ejemplo",
      "artist": {
        "displayName": "Artista Ejemplo"
      },
      "type": "digital",
      "price": 150,
      "status": "published",
      "createdAt": "2026-01-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

#### PATCH `/api/admin/artworks/:id/status`
Actualizar estado de obra.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "published"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Estado de obra actualizado",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "published",
    "updatedAt": "2026-01-26T11:00:00.000Z"
  }
}
```

---

#### GET `/api/admin/settings`
Obtener configuración de plataforma.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "minimumCommission": 10,
    "supportedLanguages": ["es", "en"],
    "features": {
      "commissionsEnabled": true,
      "digitalArtEnabled": true,
      "physicalArtEnabled": true
    },
    "updatedAt": "2026-01-26T10:00:00.000Z"
  }
}
```

---

#### PATCH `/api/admin/settings`
Actualizar configuración de plataforma.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "minimumCommission": 15,
  "supportedLanguages": ["es", "en", "fr"],
  "features": {
    "commissionsEnabled": true,
    "digitalArtEnabled": true,
    "physicalArtEnabled": true
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Configuración actualizada exitosamente",
  "data": {
    "_id": "507f1f77bcf86cd799439017",
    "minimumCommission": 15,
    "supportedLanguages": ["es", "en", "fr"],
    "updatedAt": "2026-01-26T11:00:00.000Z"
  }
}
```

---

#### GET `/api/admin/metrics`
Obtener métricas globales.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "buyers": 100,
      "artists": 45,
      "admins": 5,
      "active": 140
    },
    "artworks": {
      "total": 250,
      "published": 200,
      "draft": 40,
      "sold": 10,
      "digital": 150,
      "physical": 100
    },
    "sales": {
      "totalOrders": 50,
      "totalRevenue": 7500,
      "totalCommission": 750,
      "averageOrderValue": 150
    },
    "commissions": {
      "total": 30,
      "pending": 5,
      "accepted": 10,
      "inProgress": 8,
      "completed": 7
    },
    "topArtists": [
      {
        "artistId": "507f1f77bcf86cd799439012",
        "displayName": "Artista Top",
        "totalSales": 10,
        "totalRevenue": 1500
      }
    ]
  }
}
```

---

### 8. Health Check

#### GET `/health`
Verificar estado del API.

**Response (200):**
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2026-01-26T10:00:00.000Z",
  "environment": "development"
}
```

---

## 📝 Notas sobre Respuestas

### Estructura Estándar de Respuesta

**Éxito:**
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Mensaje de error",
  "errors": [ ... ] // Solo en errores de validación
}
```

### Códigos de Estado HTTP

- `200` - Éxito
- `201` - Creado exitosamente
- `400` - Solicitud inválida
- `401` - No autenticado
- `403` - No autorizado
- `404` - No encontrado
- `409` - Conflicto (ej: usuario duplicado)
- `429` - Demasiadas solicitudes (rate limiting)
- `500` - Error del servidor

---

## 🚀 Próximos Pasos

1. ✅ Integración con Backend (controllers, routes) - **COMPLETADO**
2. ✅ Implementación de autenticación JWT - **COMPLETADO**
3. ✅ Endpoints de API REST - **COMPLETADO**
4. ✅ Middleware de autorización por roles - **COMPLETADO**
5. Integración con servicio de imágenes (Cloudinary/S3)

---

**Base de datos y API REST completamente funcionales y documentadas.**
