# Backend - Marketplace de Arte API REST

API REST completa para el marketplace de arte desarrollada con Node.js y Express.

## 🚀 Inicio Rápido

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Inicializar base de datos con datos de ejemplo
npm run seed

# Iniciar servidor en modo desarrollo
npm run dev

# Iniciar servidor en modo producción
npm start
```

### Variables de Entorno

Configura las siguientes variables en tu archivo `.env`:

```env
# Base de Datos
MONGO_URI=mongodb://localhost:27017/marketplace-arte

# Servidor
NODE_ENV=development
PORT=4000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Administrador Inicial
ADMIN_EMAIL=admin@marketplace.com
ADMIN_PASSWORD=Admin123!
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuración (DB, JWT, env)
│   ├── controllers/     # Controladores de endpoints
│   ├── middlewares/     # Middlewares (auth, roles, validación, errores)
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Definición de rutas
│   ├── services/         # Servicios de negocio
│   ├── utils/           # Utilidades (validadores, logger, transacciones)
│   ├── validators/      # Validadores de express-validator
│   ├── aggregations/    # Pipelines de agregación MongoDB
│   ├── app.js           # Configuración de Express
│   └── server.js        # Punto de entrada
├── tests/               # Tests (estructura básica)
├── package.json
└── .env.example
```

## 🔌 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario

### Usuarios
- `GET /api/users/me` - Obtener perfil propio

### Artistas
- `POST /api/artists/profile` - Crear/actualizar perfil
- `GET /api/artists/:id` - Perfil público
- `GET /api/artists/me/profile` - Mi perfil

### Obras
- `POST /api/artworks` - Crear obra
- `GET /api/artworks` - Galería pública (con filtros)
- `GET /api/artworks/:id` - Detalle de obra
- `PUT /api/artworks/:id` - Actualizar obra
- `PATCH /api/artworks/:id/publish` - Publicar obra
- `PATCH /api/artworks/:id/unpublish` - Despublicar obra
- `GET /api/artworks/my/list` - Mis obras

### Pedidos
- `POST /api/orders` - Comprar obra
- `GET /api/orders/my` - Mis pedidos
- `GET /api/orders/:id` - Detalle de pedido
- `PATCH /api/orders/:id/shipping` - Actualizar envío

### Encargos
- `POST /api/commissions` - Solicitar encargo
- `GET /api/commissions/my` - Mis encargos
- `GET /api/commissions/:id` - Detalle de encargo
- `PATCH /api/commissions/:id` - Gestionar encargo
- `POST /api/commissions/:id/messages` - Agregar mensaje

### Subida de Archivos
- `POST /api/upload/image` - Subir una imagen (requiere autenticación)
- `POST /api/upload/images` - Subir múltiples imágenes (requiere autenticación)
- `DELETE /api/upload/:filename` - Eliminar imagen (requiere autenticación)
- `GET /uploads/:filename` - Servir archivo estático (público)

### Administración
- `GET /api/admin/users` - Listar usuarios
- `PATCH /api/admin/users/:id/status` - Activar/desactivar usuario
- `GET /api/admin/artists` - Listar artistas
- `PATCH /api/admin/artists/:id/status` - Aprobar/bloquear artista
- `GET /api/admin/artworks` - Listar obras
- `PATCH /api/admin/artworks/:id/status` - Cambiar estado de obra
- `GET /api/admin/settings` - Obtener configuración
- `PATCH /api/admin/settings` - Actualizar configuración
- `GET /api/admin/metrics` - Métricas globales

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens) para autenticación. Incluye el token en el header:

```
Authorization: Bearer <token>
```

## 📝 Validación

Todos los endpoints validan los datos de entrada usando `express-validator`. Los errores de validación se retornan con formato:

```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "email",
      "message": "El email es requerido",
      "value": ""
    }
  ]
}
```

## 🛡️ Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de origen cruzado
- **Rate Limiting**: Límites de requests por IP
- **JWT**: Tokens con expiración
- **Validación**: Validación en múltiples capas
- **Sanitización**: Sanitización de inputs

## 📊 Características

- ✅ Autenticación JWT completa
- ✅ Control de acceso por roles (buyer, artist, admin)
- ✅ Validación de datos robusta
- ✅ Manejo centralizado de errores
- ✅ Transacciones para operaciones críticas
- ✅ Agregaciones optimizadas para consultas complejas
- ✅ Paginación en todos los listados
- ✅ Filtros y búsqueda avanzada
- ✅ Logging con Winston
- ✅ Rate limiting configurado


## 📚 Documentación

- Ver `README_BBDD.md` para información detallada sobre la base de datos y esquemas

---

## 👥 Datos de Ejemplo y Credenciales

Al ejecutar `npm run seed`, se crean los siguientes datos de prueba:

### Usuarios de Prueba

**Administrador:**
- Email: `admin@marketplace.com`
- Password: `Admin123!`
- Rol: `admin`

**Compradores (4 usuarios):**
- `maria.garcia@email.com` / `Password123!`
- `juan.rodriguez@email.com` / `Password123!`
- `ana.martinez@email.com` / `Password123!`
- `carlos.lopez@email.com` / `Password123!`

**Artistas (5 usuarios):**
- `sofia.artista@email.com` / `Password123!` (Aprobado)
- `diego.pintor@email.com` / `Password123!` (Aprobado)
- `laura.creativa@email.com` / `Password123!` (Aprobado)
- `miguel.art@email.com` / `Password123!` (Aprobado)
- `elena.diseno@email.com` / `Password123!` (Pendiente - para pruebas de moderación)

### Datos Creados

- **5 Perfiles de Artistas** (4 aprobados, 1 pendiente)
- **12 Obras de Arte** (físicas y digitales, varios estados)
- **Órdenes de Ejemplo** (pedidos completados y pendientes)
- **Encargos de Ejemplo** (varios estados)

---

## 🗄️ Instalación de MongoDB

### Opción 1: Docker (Recomendado)

```bash
docker run -d --name mongodb-marketplace -p 27017:27017 -v mongodb-data:/data/db mongo:latest
```

### Opción 2: MongoDB Community Server

1. Descargar desde: https://www.mongodb.com/try/download/community
2. Instalar con configuración por defecto
3. El servicio se inicia automáticamente

### Opción 3: MongoDB Atlas (Cloud)

1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear cluster gratuito (512MB)
3. Obtener connection string
4. Configurar en `.env` como `MONGO_URI`

### Verificar Conexión

```bash
# Probar conexión
npm run test:connection

# O con mongosh
mongosh mongodb://localhost:27017
```

---

## 🧪 Proceso de Pruebas

### 1. Configurar Variables de Entorno

Editar `backend/.env` con tu configuración de MongoDB.

### 2. Poblar Base de Datos

```bash
npm run seed
```

### 3. Iniciar Servidor

```bash
npm run dev
```

### 4. Probar Endpoints

```bash
# Probar todos los endpoints automáticamente
npm run test:endpoints

# O usar Postman/Thunder Client con los ejemplos de abajo
```

### Endpoints para Probar Manualmente

**Públicos:**
- `GET /health` - Health check
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/artworks` - Galería pública
- `GET /api/artists/:id` - Perfil público

**Autenticados:**
- `GET /api/users/me` - Mi perfil
- `POST /api/artists/profile` - Crear perfil artista
- `POST /api/artworks` - Crear obra
- `GET /api/orders/my` - Mis pedidos
- `POST /api/commissions` - Solicitar encargo

**Administración:**
- `GET /api/admin/users` - Listar usuarios
- `GET /api/admin/artists` - Listar artistas
- `GET /api/admin/artworks` - Listar obras
- `GET /api/admin/metrics` - Métricas

### Resultados de Pruebas

✅ **27 endpoints probados con 100% de éxito**
- Autenticación: 5/5 ✅
- Usuarios: 1/1 ✅
- Artistas: 3/3 ✅
- Obras: 6/6 ✅
- Pedidos: 2/2 ✅
- Encargos: 5/5 ✅
- Administración: 5/5 ✅

---

## 🔧 Scripts Adicionales

### Actualizar Imágenes de Obras

El script `updateArtworkImages.js` actualiza las URLs de imágenes de todas las obras usando imágenes gratuitas de freeimages.com.

```bash
npm run update-images
```

**Funcionamiento:**
- Conecta a MongoDB
- Obtiene todas las obras
- Determina categoría según título/tipo (abstract, landscape, portrait, digital)
- Asigna imágenes aleatorias de la categoría correspondiente
- Mantiene el número original de imágenes por obra

**Notas:**
- Las imágenes son gratuitas y legales (FreeImages.com Content License)
- El script es seguro y solo actualiza URLs
- Puede ejecutarse múltiples veces

---

## 🧪 Testing y Verificación

### Scripts de Prueba

```bash
# Probar conexión a MongoDB
npm run test:connection

# Probar todos los endpoints (requiere servidor corriendo)
npm run test:endpoints
```

### Estructura de Tests

La estructura de tests está preparada en `tests/`. Para implementar tests completos:

```bash
# Instalar dependencias de testing
npm install --save-dev jest supertest

# Ejecutar tests
npm test
```

## 🔧 Scripts Disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar servidor en desarrollo (nodemon)
npm run seed       # Poblar base de datos con datos de ejemplo
npm run seed:clear # Limpiar y recrear datos de ejemplo
npm run update-images # Actualizar URLs de imágenes de obras (ver sección Scripts Adicionales)
npm run test:connection # Probar conexión a MongoDB
npm run test:endpoints # Probar todos los endpoints (requiere servidor corriendo)
```

## 📦 Dependencias Principales

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **jsonwebtoken**: Autenticación JWT
- **express-validator**: Validación de datos
- **bcryptjs**: Hash de contraseñas
- **winston**: Sistema de logging
- **helmet**: Seguridad HTTP
- **cors**: Configuración CORS
- **express-rate-limit**: Rate limiting
- **multer**: Manejo de archivos multipart/form-data
- **form-data**: Para pruebas de upload
- **node-fetch**: Para scripts de prueba

## 📤 Subida de Archivos

### Endpoints de Upload

El backend incluye endpoints para subir imágenes de obras:

1. **POST /api/upload/image**
   - Requiere autenticación (Bearer token)
   - Body: `multipart/form-data` con campo `image`
   - Respuesta: `{ success: true, data: { url, filename, size, mimetype } }`

2. **POST /api/upload/images**
   - Requiere autenticación
   - Body: `multipart/form-data` con campo `images` (array)
   - Respuesta: `{ success: true, data: [{ url, filename, ... }] }`

3. **DELETE /api/upload/:filename**
   - Requiere autenticación
   - Elimina el archivo del servidor

4. **GET /uploads/:filename**
   - Público (sin autenticación)
   - Sirve el archivo estático desde `backend/uploads/`

### Configuración

- **Almacenamiento**: Local en `backend/uploads/` (en producción usar AWS S3, Cloudinary, etc.)
- **Validaciones**:
  - Tipo de archivo: Solo JPEG, PNG, GIF, WEBP
  - Tamaño máximo: 5MB por imagen
  - Cantidad máxima: 10 imágenes por request
- **Nombres únicos**: Se generan automáticamente para evitar conflictos
- **Servicio estático**: Los archivos se sirven en `/uploads/:filename`

### Archivos Relacionados

- `src/middlewares/upload.middleware.js` - Middleware de multer
- `src/controllers/upload.controller.js` - Controlador de upload
- `src/routes/upload.routes.js` - Rutas de upload
- `src/app.js` - Configuración de servicio estático

### Notas

- La carpeta `uploads/` está en `.gitignore` para no subir archivos al repositorio
- En producción, se recomienda usar un servicio de almacenamiento en la nube
- Los archivos se almacenan con nombres únicos: `nombre-timestamp-random.ext`

---

## 🚨 Notas Importantes

1. **Variables de Entorno**: Nunca subas el archivo `.env` al repositorio
2. **JWT Secret**: Cambia el JWT_SECRET en producción
3. **Base de Datos**: Asegúrate de tener MongoDB corriendo o configurar MongoDB Atlas
4. **Datos de Prueba**: Usa `npm run seed` para crear datos de ejemplo
5. **Archivos Subidos**: La carpeta `uploads/` se crea automáticamente y está en `.gitignore`

## 📞 Soporte

Para más información, consulta la documentación del proyecto en la raíz del repositorio.

---

**Desarrollado siguiendo principios SOLID y mejores prácticas de Node.js**
