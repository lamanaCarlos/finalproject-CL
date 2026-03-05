# Plan de Implementación de Base de Datos - Marketplace de Arte

## Objetivo
Crear una base de datos MongoDB completa y optimizada para el marketplace de arte, con todos los modelos preparados para las siguientes fases de desarrollo (Backend y Frontend).

---

## Fase 1: Análisis y Diseño

### 1.1 Revisión de Requerimientos
- ✅ Analizar modelo de datos existente en documentación
- ✅ Identificar entidades principales: User, ArtistProfile, Artwork, Order, CommissionRequest, PlatformSettings
- ✅ Identificar relaciones entre entidades
- ✅ Determinar campos requeridos vs opcionales

### 1.2 Diseño de Esquemas
- Definir estructura detallada de cada modelo
- Establecer tipos de datos apropiados
- Definir campos requeridos y opcionales
- Planificar campos de auditoría (createdAt, updatedAt)
- Considerar límites de tamaño de documentos MongoDB (16MB)

---

## Fase 2: Implementación de Modelos con Mongoose

### 2.1 Configuración Base
- Crear estructura de carpetas: `backend/src/models/`
- Configurar conexión a MongoDB
- Implementar manejo de errores de conexión
- Configurar variables de entorno

### 2.2 Modelo User
- Campos: email, password (hasheado), role, isActive, createdAt, updatedAt
- Validaciones: email único, formato válido, password mínimo 8 caracteres
- Índices: email (único), role, isActive
- Middleware: hash de password antes de guardar

### 2.3 Modelo ArtistProfile
- Campos: userId (ref), displayName, bio, profileImage, socialLinks, status, createdAt
- Validaciones: userId requerido y único, status enum
- Índices: userId (único), status
- Relación: referencia a User

### 2.4 Modelo Artwork
- Campos: artistId (ref), title, description, type, price, images[], technique, dimensions, weight, digitalFormat, language, status, createdAt
- Validaciones: type enum, price positivo, status enum, language enum
- Índices: artistId, type, status, language, price (para búsquedas por rango)
- Índice compuesto: {status: 1, type: 1, language: 1} para consultas de galería
- Relación: referencia a ArtistProfile

### 2.5 Modelo Order
- Campos: buyerId (ref), artworkId (ref), artistId (ref), price, commission, shippingRequired, shippingStatus, createdAt
- Validaciones: price positivo, commission positivo, shippingStatus enum
- Índices: buyerId, artistId, artworkId, createdAt
- Índice compuesto: {buyerId: 1, createdAt: -1} para historial de compras
- Relaciones: referencias a User (buyer y artist) y Artwork

### 2.6 Modelo CommissionRequest
- Campos: buyerId (ref), artistId (ref), description, budget, deadline, status, createdAt, updatedAt
- Validaciones: status enum, budget positivo, deadline fecha futura
- Índices: buyerId, artistId, status, createdAt
- Índice compuesto: {artistId: 1, status: 1} para consultas de encargos pendientes
- Relaciones: referencias a User (buyer y artist)

### 2.7 Modelo PlatformSettings
- Campos: minimumCommission, supportedLanguages[], updatedAt
- Validaciones: minimumCommission positivo, supportedLanguages array no vacío
- Índices: ninguno necesario (documento único)
- Singleton: solo un documento en la colección

---

## Fase 3: Optimizaciones y Buenas Prácticas

### 3.1 Indexación Estratégica
- Índices únicos para campos que deben ser únicos (email, userId en ArtistProfile)
- Índices simples para búsquedas frecuentes (role, status, type)
- Índices compuestos para consultas complejas (filtros múltiples)
- Índices de texto para búsquedas full-text (title, description en Artwork)
- Considerar índices TTL si hay datos temporales

### 3.2 Validaciones
- Validaciones a nivel de esquema (Mongoose)
- Validaciones a nivel de aplicación (middleware)
- Validaciones de negocio (pre-save hooks)
- Manejo de errores descriptivos

### 3.3 Middleware y Hooks
- Pre-save: hash de passwords, cálculo de comisiones
- Post-save: actualización de contadores, notificaciones
- Pre-remove: validaciones de integridad referencial
- Virtuals: campos calculados (ej: totalPrice en Order)

---

## Fase 4: Agregaciones y Consultas Avanzadas

### 4.1 Pipelines de Agregación
- Galería pública con filtros (tipo, precio, artista, idioma)
- Estadísticas de artista (obras vendidas, ingresos, comisiones)
- Dashboard de administrador (métricas globales)
- Historial de compras con detalles de obras
- Encargos pendientes por artista

### 4.2 Optimización de Consultas
- Usar proyección para limitar campos devueltos
- Implementar paginación eficiente
- Usar agregaciones en lugar de múltiples consultas
- Cachear consultas frecuentes (si aplica)

---

## Fase 5: Transacciones y Atomicidad

### 5.1 Operaciones que Requieren Transacciones
- Creación de Order: debe ser atómica (crear orden + marcar obra como vendida)
- Aceptación de CommissionRequest: actualizar estado atómicamente
- Actualización de PlatformSettings: asegurar consistencia

### 5.2 Implementación
- Usar sesiones de MongoDB para transacciones
- Manejo de rollback en caso de error
- Retry logic para operaciones críticas

---

## Fase 6: Scripts de Inicialización

### 6.1 Seeders
- Crear usuario administrador inicial
- Crear PlatformSettings con valores por defecto
- Datos de prueba para desarrollo (opcional)

### 6.2 Migraciones
- Scripts para actualizar esquemas en producción
- Versionado de cambios en esquemas

---

## Fase 7: Documentación y Utilidades

### 7.1 Documentación
- Documentar cada modelo con ejemplos
- Documentar índices y su propósito
- Documentar agregaciones complejas
- Crear diagrama de relaciones

### 7.2 Utilidades
- Funciones helper para consultas comunes
- Manejo centralizado de errores de base de datos
- Validadores reutilizables

---

## Estructura de Archivos Propuesta

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de conexión MongoDB
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── ArtistProfile.js
│   │   ├── Artwork.js
│   │   ├── Order.js
│   │   ├── CommissionRequest.js
│   │   ├── PlatformSettings.js
│   │   └── index.js             # Exportación centralizada
│   │
│   ├── utils/
│   │   ├── validators.js        # Validadores reutilizables
│   │   └── dbErrors.js          # Manejo de errores
│   │
│   ├── aggregations/
│   │   ├── artwork.aggregations.js
│   │   ├── artist.aggregations.js
│   │   └── admin.aggregations.js
│   │
│   └── scripts/
│       ├── seed.js              # Script de inicialización
│       └── migrations/          # Scripts de migración
│
└── .env.example                 # Variables de entorno
```

---

## Consideraciones Especiales

### Límites de MongoDB
- Tamaño máximo de documento: 16MB
- Arrays grandes en Artwork.images: considerar GridFS si superan límites
- Embedded vs Referenced: usar referencias para relaciones uno-a-muchos

### Escalabilidad
- Preparar para sharding futuro si es necesario
- Índices optimizados para consultas de lectura
- Considerar separación de colecciones por tipo de consulta

### Seguridad
- Passwords nunca en texto plano
- Validación de entrada en todos los niveles
- Sanitización de datos de usuario

### Internacionalización
- Campos de texto multi-idioma: usar objetos {es: "...", en: "..."}
- Índices por idioma para búsquedas eficientes

---

## Checklist de Implementación

- [ ] Configuración de conexión MongoDB
- [ ] Modelo User con validaciones e índices
- [ ] Modelo ArtistProfile con relaciones
- [ ] Modelo Artwork con índices compuestos
- [ ] Modelo Order con transacciones
- [ ] Modelo CommissionRequest
- [ ] Modelo PlatformSettings (singleton)
- [ ] Scripts de seed/initialización
- [ ] Pipelines de agregación principales
- [ ] Manejo de errores centralizado
- [ ] Documentación completa
- [ ] Tests básicos de modelos

---

## Próximos Pasos Post-Implementación

1. Integración con Backend (controllers, routes)
2. Implementación de autenticación JWT
3. Endpoints de API REST
4. Middleware de autorización por roles
5. Integración con servicio de imágenes (Cloudinary/S3)

---

**Este plan asegura una base de datos robusta, escalable y lista para las siguientes fases del proyecto.**
