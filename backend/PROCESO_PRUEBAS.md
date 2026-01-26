# Proceso de Pruebas - API REST

## Pasos a Seguir

### 1. Configurar Contraseña de MongoDB Atlas
Edita `backend/.env` y reemplaza `<db_password>` con tu contraseña real.

### 2. Probar Conexión
```bash
npm run test:connection
```

### 3. Poblar Base de Datos
```bash
npm run seed
```

Esto creará:
- Usuario administrador
- Usuarios de prueba (compradores y artistas)
- Perfiles de artistas
- Obras de ejemplo
- Órdenes de ejemplo
- Encargos de ejemplo

### 4. Iniciar Servidor
```bash
npm run dev
```

El servidor debería iniciar en `http://localhost:4000`

### 5. Probar Endpoints
```bash
# En otra terminal
npm run test:endpoints
```

O usar Postman/Thunder Client con los ejemplos de `TEST_ENDPOINTS.md`

---

## Credenciales de Prueba (después del seed)

**Administrador:**
- Email: admin@marketplace.com
- Password: Admin123!

**Comprador:**
- Email: maria.garcia@email.com
- Password: Password123!

**Artista:**
- Email: sofia.artista@email.com
- Password: Password123!

---

## Endpoints a Probar

### Públicos (sin autenticación)
- ✅ GET /health
- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ GET /api/artworks (galería pública)
- ✅ GET /api/artists/:id (perfil público)

### Autenticados
- ✅ GET /api/users/me
- ✅ POST /api/artists/profile
- ✅ GET /api/artists/me/profile
- ✅ POST /api/artworks
- ✅ GET /api/artworks/my/list
- ✅ POST /api/orders
- ✅ GET /api/orders/my
- ✅ POST /api/commissions
- ✅ GET /api/commissions/my

### Administración
- ✅ GET /api/admin/users
- ✅ GET /api/admin/artists
- ✅ GET /api/admin/artworks
- ✅ GET /api/admin/settings
- ✅ GET /api/admin/metrics

---

## Verificación de Funcionamiento

Cada endpoint debe:
1. Retornar código de estado HTTP correcto
2. Incluir campo `success: true/false`
3. Retornar datos en formato JSON válido
4. Validar datos de entrada
5. Manejar errores apropiadamente
