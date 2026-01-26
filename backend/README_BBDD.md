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

## 🚀 Próximos Pasos

1. Integración con Backend (controllers, routes)
2. Implementación de autenticación JWT
3. Endpoints de API REST
4. Middleware de autorización por roles
5. Integración con servicio de imágenes (Cloudinary/S3)

---

**Base de datos lista para las siguientes fases de desarrollo.**
