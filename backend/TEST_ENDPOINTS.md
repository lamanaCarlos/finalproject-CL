# Guía de Prueba de Endpoints

## ⚠️ Requisito Previo

**MongoDB debe estar corriendo** antes de iniciar el servidor.

### Iniciar MongoDB (Windows)

```bash
# Si MongoDB está instalado como servicio
net start MongoDB

# O si está instalado localmente, ejecutar:
mongod --dbpath "C:\ruta\a\tu\data\db"
```

### Verificar que MongoDB está corriendo

```bash
# Probar conexión
mongosh mongodb://localhost:27017
```

## 🚀 Iniciar el Servidor

```bash
cd backend
npm run dev
```

El servidor debería iniciar en `http://localhost:4000`

## 📋 Endpoints para Probar

### 1. Health Check
```bash
GET http://localhost:4000/health
```

### 2. Autenticación

#### Registro de Usuario
```bash
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!",
  "role": "buyer"
}
```

#### Login
```bash
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
}
```

**Guardar el token** de la respuesta para usar en los siguientes endpoints.

### 3. Usuarios

#### Obtener Perfil Propio
```bash
GET http://localhost:4000/api/users/me
Authorization: Bearer <token>
```

### 4. Artistas

#### Crear Perfil de Artista
```bash
POST http://localhost:4000/api/artists/profile
Authorization: Bearer <token_artista>
Content-Type: application/json

{
  "displayName": "Artista de Prueba",
  "bio": "Biografía del artista",
  "socialLinks": {
    "instagram": "https://instagram.com/artista",
    "web": "https://artista.com"
  }
}
```

#### Obtener Perfil Público
```bash
GET http://localhost:4000/api/artists/<artist_profile_id>
```

### 5. Obras

#### Crear Obra
```bash
POST http://localhost:4000/api/artworks
Authorization: Bearer <token_artista>
Content-Type: application/json

{
  "title": "Obra de Prueba",
  "description": "Descripción de la obra",
  "type": "digital",
  "price": 100,
  "images": ["https://example.com/image.jpg"],
  "digitalFormat": "PNG",
  "resolution": "3000x2000px"
}
```

#### Galería Pública
```bash
GET http://localhost:4000/api/artworks?page=1&limit=20
```

#### Detalle de Obra
```bash
GET http://localhost:4000/api/artworks/<artwork_id>
```

### 6. Pedidos

#### Comprar Obra
```bash
POST http://localhost:4000/api/orders
Authorization: Bearer <token_buyer>
Content-Type: application/json

{
  "artworkId": "<artwork_id>"
}
```

#### Mis Pedidos
```bash
GET http://localhost:4000/api/orders/my
Authorization: Bearer <token>
```

### 7. Encargos

#### Solicitar Encargo
```bash
POST http://localhost:4000/api/commissions
Authorization: Bearer <token_buyer>
Content-Type: application/json

{
  "artistId": "<artist_user_id>",
  "description": "Descripción del encargo",
  "budget": 500,
  "deadline": "2026-02-26T00:00:00.000Z"
}
```

### 8. Administración

#### Obtener Métricas
```bash
GET http://localhost:4000/api/admin/metrics
Authorization: Bearer <token_admin>
```

#### Listar Usuarios
```bash
GET http://localhost:4000/api/admin/users
Authorization: Bearer <token_admin>
```

## 🧪 Usar Postman o Thunder Client

1. Importar la colección de endpoints
2. Configurar variables de entorno:
   - `base_url`: http://localhost:4000
   - `token`: (se actualiza automáticamente después del login)
3. Ejecutar los requests en orden

## 📝 Notas

- Todos los endpoints requieren autenticación excepto:
  - `/health`
  - `/api/auth/register`
  - `/api/auth/login`
  - `/api/artworks` (GET - galería pública)
  - `/api/artists/:id` (GET - perfil público)

- Los tokens JWT expiran en 7 días por defecto

- Usa los datos de ejemplo del seed para pruebas:
  - Admin: admin@marketplace.com / Admin123!
  - Comprador: maria.garcia@email.com / Password123!
  - Artista: sofia.artista@email.com / Password123!
