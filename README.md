# Marketplace de Arte 🎨

Plataforma web para la **comercialización de arte físico y digital**, orientada a artistas y compradores, con soporte para encargos personalizados, multi-idioma y escalabilidad internacional.

Este repositorio contiene todo lo necesario para **desarrollar, desplegar y mantener** el proyecto, incluyendo documentación funcional, técnica, UX y legal.

---

## 📌 Visión del Proyecto

Crear un marketplace artístico moderno donde:

* Los **artistas** gestionen sus perfiles y obras.
* Los **compradores** descubran y adquieran arte original.
* La **plataforma** actúe como intermediaria segura y escalable.

Soporta:

* Arte físico y digital
* Encargos personalizados
* Comisiones por venta
* Expansión multi-idioma

---

## 🧩 Stack Tecnológico

### Frontend

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Estilos
- **React Router v7** - Routing
- **React Query (TanStack Query)** - Estado del servidor y caché
- **Axios** - Cliente HTTP
- **React Hook Form + Zod** - Formularios y validación
- **react-i18next** - Internacionalización (ES/EN)
- **react-hot-toast** - Notificaciones
- **date-fns** - Manejo de fechas
- **react-icons** - Iconos

### Backend

- **Node.js >= 18** (recomendado 20.x o 22.x)
- **Express** - Framework web
- **MongoDB + Mongoose** - Base de datos y ODM
- **JWT** - Autenticación
- **express-validator** - Validación de datos
- **multer** - Manejo de archivos
- **bcryptjs** - Hash de contraseñas
- **winston** - Sistema de logging
- **helmet** - Seguridad HTTP
- **cors** - Configuración CORS
- **express-rate-limit** - Rate limiting

### Base de Datos

- **MongoDB** (local o Atlas recomendado)

### Infraestructura

- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Almacenamiento de imágenes: Local (desarrollo) / Cloudinary / S3 (producción)

---

## 📁 Estructura del Repositorio

```
marketplace-arte/
├── frontend/
├── backend/
├── docs/
├── README.md
└── .gitignore
```

---

## 📚 Documentación

### Documentación Principal

- **`backend/README.md`** - Documentación completa del backend
  - Endpoints disponibles
  - Instalación y configuración
  - Scripts disponibles
  - Subida de archivos
  - Datos de ejemplo y credenciales
  - Proceso de pruebas

- **`frontend/README.md`** - Documentación completa del frontend
  - Estructura del proyecto
  - Componentes principales
  - Páginas implementadas
  - Funcionalidades implementadas
  - Subida de imágenes
  - Internacionalización

- **`frontend/ESTADO_PROYECTO.md`** - Estado detallado del proyecto frontend
  - Infraestructura base
  - Componentes implementados
  - Funcionalidades completadas
  - Archivos modificados/creados
  - Pruebas recomendadas

- **`GUIA_PRUEBAS_COMPLETA.md`** - Guía completa de pruebas (Backend + Frontend)
  - Pruebas detalladas de todos los endpoints del backend
  - Pruebas de todas las páginas y funcionalidades del frontend
  - Flujos completos por rol (Comprador, Artista, Administrador)
  - Credenciales de prueba organizadas
  - Checklist final completo
  - Problemas comunes y soluciones

- **`frontend/GUIA_PRUEBAS.md`** - Guía de pruebas del frontend (referencia rápida)

- **`backend/README_BBDD.md`** - Documentación detallada de la base de datos
  - Esquemas y modelos
  - Relaciones entre colecciones
  - Índices y optimizaciones

### Documentación Adicional

- `frontendprompts.md` - Resumen de prompts y conversaciones
- `backend/ACTUALIZAR_IMAGENES_OBRAS.md` - Script de actualización de imágenes
- `terceraFase.md` - Mejoras funcionales de Fase 3
- `PLAN_IMPLEMENTACION_INMEDIATA.md` - Plan paso a paso de implementación
- `BACKLOG_TECNICO_FASE3_INMEDIATO.md` - Backlog técnico por archivo
- `RUN_LOCAL_FASE3.md` - Comandos para ejecutar Fase 3 en local
- `CHECKLIST_REGRESION_FASE3.md` - Checklist formal de regresión
- `E2E_FASE3_CHECKLIST.md` - Checklist E2E de Fase 3
- `INFORME_VALIDACION_FASE3.md` - Estado de validación de la implementación

---

## 🚀 Instalación y Ejecución

## ⚡ Puesta en Marcha Rápida (primera vez)

Sigue estos pasos en orden para dejar el proyecto funcionando en local:

### 1) Requisitos

- Node.js `>= 20`
- MongoDB local o MongoDB Atlas

Verifica versiones:

```bash
node --version
npm --version
```

### 2) Backend (terminal 1)

```bash
cd backend
npm install
cp .env.example .env
```

Editar `backend/.env` (mínimo obligatorio):

```env
MONGO_URI=mongodb://localhost:27017/marketplace-arte
JWT_SECRET=tu-secreto-jwt
PORT=4000
```

Opcionales (si quieres dejar preparado pagos):

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CURRENCY=eur
```

Inicializar datos y arrancar backend:

```bash
npm run seed
npm run dev
```

Comprobar backend:

```bash
curl http://localhost:4000/health
```

### 3) Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Abrir en navegador:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`

### 4) Login de prueba

- Admin: `admin@marketplace.com / Admin123!`
- Buyer: `maria.garcia@email.com / Password123!`
- Artist: `sofia.artista@email.com / Password123!`

### 5) Verificación rápida recomendada

Backend:

```bash
cd backend
npm run test:unit
npm run test:endpoints
```

Frontend:

```bash
cd frontend
npm run build
```

Si quieres validar Fase 3 (sin pasarela real), consulta:
- `RUN_LOCAL_FASE3.md`
- `CHECKLIST_REGRESION_FASE3.md`
- `E2E_FASE3_CHECKLIST.md`

### Requisitos

- **Node.js >= 20.x** (recomendado 20.x o 22.x)
- **npm** o **yarn**
- **MongoDB** (local o Atlas)

### Backend

```bash
# 1. Instalar dependencias
cd backend
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones (MONGO_URI, JWT_SECRET, etc.)

# 3. Inicializar base de datos con datos de ejemplo
npm run seed

# 4. Iniciar servidor en modo desarrollo
npm run dev
```

**URL:** http://localhost:4000

### Frontend

```bash
# 1. Instalar dependencias
cd frontend
npm install

# 2. Configurar variables de entorno (opcional)
# Crear .env basado en .env.example si necesitas cambiar la URL del backend

# 3. Iniciar servidor de desarrollo
npm run dev
```

**URL:** http://localhost:5173

### Verificar Instalación

```bash
# Backend - Health check
curl http://localhost:4000/health

# Debe responder: {"success":true,"message":"API funcionando correctamente"}
```

---

## 🔐 Variables de Entorno

### Backend (`.env`)

```env
# Base de Datos
MONGO_URI=mongodb://localhost:27017/marketplace-arte
# O para MongoDB Atlas:
# MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/marketplace-arte

# Servidor
NODE_ENV=development
PORT=4000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Administrador Inicial
ADMIN_EMAIL=admin@marketplace.com
ADMIN_PASSWORD=Admin123!

# Pagos (integración preparada)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CURRENCY=eur
```

### Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_NAME=ArtMarket
```

---

## 👥 Roles del Sistema

### Visitante
- Explorar galería pública
- Ver detalles de obras
- Ver perfiles de artistas
- Registrarse como comprador o artista

### Comprador (Buyer)
- Todas las funciones de visitante
- Comprar obras publicadas
- Solicitar encargos personalizados
- Gestionar pedidos y encargos
- Ver historial de compras

### Artista (Artist)
- Todas las funciones de comprador
- Crear y gestionar perfil artístico
- Crear, editar y publicar obras
- Gestionar pedidos recibidos
- Aceptar/rechazar encargos
- Enviar mensajes en encargos
- Actualizar información de envío

### Administrador (Admin)
- Acceso completo al sistema
- Gestionar usuarios (activar/desactivar)
- Moderar artistas (aprobar/bloquear)
- Gestionar obras
- Ver métricas del sistema
- Configurar plataforma

---

## 🔑 Credenciales de Prueba

Después de ejecutar `npm run seed` en el backend, puedes usar:

**Administrador:**
- Email: `admin@marketplace.com`
- Password: `Admin123!`

**Comprador:**
- Email: `maria.garcia@email.com`
- Password: `Password123!`

**Artista:**
- Email: `sofia.artista@email.com`
- Password: `Password123!`

---

## ✅ Funcionalidades Implementadas

### Core
- ✅ Autenticación JWT completa (login, registro, logout)
- ✅ Sistema de roles y permisos
- ✅ Internacionalización (ES/EN)
- ✅ Páginas públicas (Home, Gallery, Artwork Detail, Artist Profile)
- ✅ Dashboards por rol (Buyer, Artist, Admin)

### Gestión de Obras
- ✅ Crear, editar y listar obras
- ✅ Publicar/despublicar obras desde UI
- ✅ Filtros y búsqueda en galería
- ✅ Paginación en listas
- ✅ **Subida de imágenes** (reemplazo de URLs por upload de archivos)

### Compras y Pedidos
- ✅ **Funcionalidad de compra completa** (botón "Comprar ahora")
- ✅ Gestión de pedidos (comprador y artista)
- ✅ **Actualizar estado de envío** (desde UI del artista)
- ✅ Cálculo automático de comisiones
- ✅ Estados de pago en pedidos (`payment_pending`, `payment_succeeded`, `payment_failed`, `refunded`)
- ✅ Flujo de confirmación de venta por webhook (la obra pasa a `sold` tras confirmación de pago)

### Confianza y Post-compra
- ✅ Certificados/licencias automáticos para pedidos confirmados
- ✅ Consulta de certificado por pedido
- ✅ Reseñas verificadas por compra
- ✅ Bloqueo de reseñas duplicadas por pedido

### Encargos
- ✅ Solicitar encargos personalizados
- ✅ **Aceptar/rechazar encargos** desde UI
- ✅ **Sistema de mensajería** en encargos
- ✅ Negociación de precios

### Administración
- ✅ Gestión de usuarios (listar, activar/desactivar)
- ✅ Moderación de artistas (aprobar/bloquear)
- ✅ Gestión de obras
- ✅ Métricas del sistema
- ✅ Configuración de plataforma

### Componentes y UX
- ✅ Componentes reutilizables (Button, Input, Card, Badge, Image, Loader, Modal, Pagination, Select, ImageUpload)
- ✅ Layout responsive (Header, Footer, Sidebar, DashboardLayout)
- ✅ Formularios con validación (React Hook Form + Zod)
- ✅ Notificaciones (react-hot-toast)
- ✅ Manejo de errores (ErrorBoundary)
- ✅ Imágenes por defecto (artwork-placeholder.svg)
- ✅ Notificaciones in-app (campana, panel, contador y marcado como leído)

---

## 🧪 Testing

### Backend

```bash
# Probar conexión a MongoDB
cd backend
npm run test:connection

# Probar todos los endpoints (requiere servidor corriendo)
npm run test:endpoints
```

**Resultados:** ✅ Endpoints base + extensiones Fase 3 probados

### Frontend

Ver `frontend/GUIA_PRUEBAS.md` para checklist completo de pruebas.

### Tipos de Test Recomendados

- **Unitarios** - Componentes y funciones individuales
- **Integración (API)** - Endpoints y flujos backend
- **End-to-End** - Flujos críticos completos (compra, encargo, etc.)

---

## 🌍 Internacionalización

- **Idiomas soportados:** Español (ES) / Inglés (EN)
- **Arquitectura:** Preparada para añadir nuevos idiomas fácilmente
- **Persistencia:** El idioma se guarda en localStorage
- **Cobertura:** Todas las páginas y componentes están traducidos

---

## ⚖️ Consideraciones Legales

* La plataforma actúa como intermediaria
* El artista conserva los derechos de autor
* Los envíos físicos se acuerdan entre las partes

Consultar el documento legal en `docs/` antes de lanzar a producción.

---

## 🗺️ Estado del Proyecto

### ✅ Completado (MVP Funcional)

- ✅ Autenticación y autorización completa
- ✅ Gestión de obras (crear, editar, publicar)
- ✅ Sistema de compras
- ✅ Encargos personalizados
- ✅ Mensajería en encargos
- ✅ Gestión de envíos
- ✅ Subida de imágenes
- ✅ Administración completa
- ✅ Internacionalización (ES/EN)
- ✅ Dashboards por rol

### 🚀 Próximos Pasos

- [ ] Seleccionar pasarela definitiva y completar checkout real en frontend
- [ ] Notificaciones en tiempo real (WebSocket/SSE)
- [ ] Chat en tiempo real
- [ ] Escalado internacional (más idiomas)
- [ ] Funcionalidades premium
- [ ] App móvil (React Native)

---

## 📤 Subida de Archivos

El proyecto incluye sistema completo de subida de imágenes:

### Backend
- Endpoints: `POST /api/upload/image`, `POST /api/upload/images`, `DELETE /api/upload/:filename`
- Almacenamiento local en desarrollo (`backend/uploads/`)
- Validaciones: tipo (JPEG, PNG, GIF, WEBP), tamaño (5MB), cantidad (10 máximo)

### Frontend
- Componente `ImageUpload` reutilizable
- Preview de imágenes
- Validación en cliente
- Integrado en formularios de creación/edición de obras

**Nota:** En producción, se recomienda usar almacenamiento en la nube (AWS S3, Cloudinary, etc.)

---

## 🔧 Scripts Disponibles

### Backend

```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar servidor en desarrollo (nodemon)
npm run seed       # Poblar base de datos con datos de ejemplo
npm run seed:clear # Limpiar y recrear datos de ejemplo
npm run update-images # Actualizar URLs de imágenes de obras
npm run test:connection # Probar conexión a MongoDB
npm run test:endpoints # Probar todos los endpoints
npm run test:unit  # Tests unitarios backend
npm run test:phase3 # Integración Fase 3 (sin pasarela real)
```

### Frontend

```bash
npm run dev        # Iniciar servidor de desarrollo (puerto 5173)
npm run build      # Build para producción
npm run preview    # Preview del build de producción
npm run lint       # Ejecutar ESLint
```

---

## 🐛 Solución de Problemas

### Backend no responde
- Verificar que el servidor esté corriendo en puerto 4000
- Verificar conexión a MongoDB (local o Atlas)
- Revisar logs del backend
- Verificar variables de entorno en `.env`

### Frontend no carga
- Verificar que Node.js sea v20.x o superior
- Verificar que todas las dependencias estén instaladas (`npm install`)
- Revisar consola del navegador
- Verificar que el backend esté corriendo

### Errores de CORS
- Verificar configuración CORS en backend
- Verificar que el frontend use la URL correcta del backend (`VITE_API_BASE_URL`)

### Errores de autenticación
- Verificar que el token se guarde en localStorage
- Verificar que los interceptores funcionen
- Revisar expiración del token

### Imágenes no se muestran
- Verificar que el servidor esté sirviendo archivos estáticos en `/uploads`
- Verificar que la URL de la imagen sea correcta
- Verificar la consola del navegador para errores CORS o 404

---

## 📊 Estadísticas del Proyecto

- **Endpoints Backend:** 30+ endpoints (incluye payments/certificates/reviews/notifications)
- **Páginas Frontend:** 20+ páginas implementadas
- **Componentes:** 15+ componentes reutilizables
- **Idiomas:** 2 (Español, Inglés)
- **Roles:** 4 (Visitante, Comprador, Artista, Administrador)

---

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request con descripción clara

---

## 📄 Licencia

Por definir.

---

## 🔗 Enlaces Útiles

- **Backend API:** http://localhost:4000/api
- **Frontend Dev:** http://localhost:5173
- **Health Check:** http://localhost:4000/health
- **Documentación Backend:** `backend/README.md`
- **Documentación Frontend:** `frontend/README.md`
- **Guía de Pruebas:** `frontend/GUIA_PRUEBAS.md`

---

**Este README es el punto de entrada principal al proyecto.**

Para información detallada, consultar:
- `backend/README.md` - Documentación completa del backend
- `frontend/README.md` - Documentación completa del frontend
- `frontend/ESTADO_PROYECTO.md` - Estado detallado del proyecto
- `GUIA_PRUEBAS_COMPLETA.md` - Guía completa de pruebas (Backend + Frontend)
- `frontend/GUIA_PRUEBAS.md` - Guía de pruebas del frontend (referencia rápida)
- `RUN_LOCAL_FASE3.md` - Ejecución local de Fase 3
- `INFORME_VALIDACION_FASE3.md` - Estado de validación actual

---

**Última actualización:** 19 de Marzo, 2026
