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

## 🧪 Testing

La estructura de tests está preparada. Para implementar tests:

```bash
# Instalar dependencias de testing
npm install --save-dev jest supertest

# Ejecutar tests
npm test
```

## 📚 Documentación

- Ver `README_BBDD.md` para información sobre la base de datos
- Ver `DATOS_EJEMPLO.md` para información sobre datos de prueba
- Ver `PLAN_API_REST.md` para el plan de desarrollo completo

## 🔧 Scripts Disponibles

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar servidor en desarrollo (nodemon)
npm run seed       # Poblar base de datos con datos de ejemplo
npm run seed:clear # Limpiar y recrear datos de ejemplo
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

## 🚨 Notas Importantes

1. **Variables de Entorno**: Nunca subas el archivo `.env` al repositorio
2. **JWT Secret**: Cambia el JWT_SECRET en producción
3. **Base de Datos**: Asegúrate de tener MongoDB corriendo o configurar MongoDB Atlas
4. **Datos de Prueba**: Usa `npm run seed` para crear datos de ejemplo

## 📞 Soporte

Para más información, consulta la documentación del proyecto en la raíz del repositorio.

---

**Desarrollado siguiendo principios SOLID y mejores prácticas de Node.js**
