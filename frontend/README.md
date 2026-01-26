# Frontend - ArtMarket

Frontend del marketplace de arte desarrollado con React, TypeScript, Vite y Tailwind CSS.

## 🚀 Inicio Rápido

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Requisitos

- **Node.js >= 20.x** (recomendado 20.x o 22.x)
- Backend corriendo en `http://localhost:4000`
- MongoDB configurado y corriendo

---

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Imágenes, iconos, estilos
│   └── images/      # Imágenes por defecto (artwork-placeholder.svg)
├── components/      # Componentes React
│   ├── common/      # Componentes reutilizables (Button, Input, Card, Badge, Image, Loader, Modal, Pagination, Select)
│   ├── layout/      # Componentes de layout (Header, Footer, Layout, Sidebar, DashboardLayout)
│   └── artwork/     # Componentes de obras (ArtworkCard)
├── context/         # Context API (AuthContext, LanguageContext)
├── hooks/           # Custom hooks
├── i18n/            # Internacionalización (ES/EN)
├── pages/           # Páginas de la aplicación
│   ├── Home/        # Página inicial con galería aleatoria
│   ├── Gallery/     # Galería de obras con filtros
│   ├── Login/       # Login
│   ├── Register/    # Registro
│   ├── ArtworkDetail/ # Detalle de obra
│   ├── ArtistProfile/ # Perfil de artista (público y edición)
│   ├── BuyerDashboard/ # Dashboard comprador
│   ├── BuyerOrders/    # Pedidos del comprador
│   ├── BuyerCommissions/ # Encargos del comprador
│   ├── ArtistDashboard/ # Dashboard artista
│   ├── ArtistArtworks/  # Gestión de obras del artista
│   ├── ArtistOrders/    # Pedidos recibidos por el artista
│   ├── ArtistCommissions/ # Encargos recibidos por el artista
│   ├── AdminDashboard/  # Dashboard administrador
│   ├── AdminUsers/      # Gestión de usuarios
│   ├── AdminArtists/    # Gestión de artistas
│   ├── AdminArtworks/   # Gestión de obras
│   ├── AdminMetrics/    # Métricas del sistema
│   └── AdminSettings/   # Configuración de la plataforma
├── routes/          # Configuración de rutas (AppRoutes, ProtectedRoute, PublicRoute)
├── services/        # Servicios API (auth, artwork, artist, order, commission, admin)
├── types/           # Tipos TypeScript
└── utils/           # Utilidades (constants, apiHelpers)
```

---

## 🛠️ Stack Tecnológico

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
- **react-icons** - Iconos (Feather Icons)

---

## 📚 Documentación

El proyecto incluye documentación esencial en:

### `ESTADO_PROYECTO.md`
Estado general del proyecto frontend. Incluye:
- ✅ Infraestructura base completada
- ✅ Componentes comunes implementados
- ✅ Componentes de layout implementados
- ✅ Páginas públicas implementadas
- ✅ Dashboards implementados (Buyer, Artist, Admin)
- ✅ Sub-páginas de navegación implementadas
- ✅ Autenticación y routing protegido
- ✅ Internacionalización (ES/EN)
- ⏳ Funcionalidades pendientes

### `GUIA_PRUEBAS.md`
Guía completa de pruebas con checklist:
- Páginas públicas (Home, Login, Register, Gallery, ArtworkDetail, ArtistProfile)
- Dashboards (Buyer, Artist, Admin)
- Sub-páginas (Orders, Commissions, Artworks, Profile, Users, Artists, Metrics, Settings)
- Componentes y funcionalidades
- Pruebas de integración
- Problemas comunes y soluciones
- Credenciales de prueba

---

## 🎨 Componentes Principales

### Componentes Comunes
- **Button**: Botón con variantes (primary, secondary, danger, outline), tamaños, iconos
- **Input**: Campo de entrada con validación, iconos, labels, mensajes de error
- **Card**: Contenedor flexible con padding, hover, clickable
- **Badge**: Etiquetas de estado con variantes de color
- **Image**: Imagen con lazy loading, fallback automático, aspect ratios
- **Loader**: Indicador de carga con tamaños
- **Modal**: Modal reutilizable con overlay
- **Pagination**: Paginación con navegación
- **Select**: Select con opciones y búsqueda
- **ErrorBoundary**: Manejo de errores de React

### Componentes de Layout
- **Layout**: Wrapper principal con Header y Footer
- **Header**: Navegación principal, selector de idioma, botones de auth
- **Footer**: Enlaces, redes sociales, información
- **Sidebar**: Navegación lateral para dashboards (responsive, por roles)
- **DashboardLayout**: Layout wrapper para dashboards con Sidebar

### Componentes Específicos
- **ArtworkCard**: Tarjeta de obra con imagen, título, precio, badges

---

## 📄 Páginas Implementadas

### Páginas Públicas
- **HomePage** (`/`): Hero section + galería aleatoria de 12 obras publicadas
- **LoginPage** (`/login`): Formulario de login con validación
- **RegisterPage** (`/register`): Registro con selección de rol (buyer/artist)
- **GalleryPage** (`/gallery`): Galería completa con filtros (tipo, búsqueda) y paginación
- **ArtworkDetailPage** (`/artwork/:id`): Detalle de obra con galería de imágenes, información completa
- **ArtistProfilePage** (`/artist/:id`): Perfil público del artista con estadísticas y galería de obras

### Dashboards
- **BuyerDashboard** (`/buyer/dashboard`): Estadísticas (pedidos, gastos, encargos), listas recientes
- **ArtistDashboard** (`/artist/dashboard`): Estadísticas (obras, ganancias, encargos), alerta de perfil pendiente, galería
- **AdminDashboard** (`/admin/dashboard`): Métricas del sistema, artistas pendientes, acciones rápidas

### Sub-páginas Buyer
- **BuyerOrdersPage** (`/buyer/orders`): Lista completa de pedidos
- **BuyerOrderDetailPage** (`/buyer/orders/:id`): Detalle del pedido
- **BuyerCommissionsPage** (`/buyer/commissions`): Lista completa de encargos
- **BuyerCommissionDetailPage** (`/buyer/commissions/:id`): Detalle del encargo

### Sub-páginas Artist
- **ArtistArtworksPage** (`/artist/artworks`): Lista de obras del artista
- **ArtistCreateArtworkPage** (`/artist/artworks/new`): Crear nueva obra
- **ArtistEditArtworkPage** (`/artist/artworks/:id/edit`): Editar obra existente
- **ArtistOrdersPage** (`/artist/orders`): Lista de pedidos recibidos
- **ArtistOrderDetailPage** (`/artist/orders/:id`): Detalle del pedido recibido
- **ArtistCommissionsPage** (`/artist/commissions`): Lista de encargos recibidos
- **ArtistCommissionDetailPage** (`/artist/commissions/:id`): Detalle del encargo recibido
- **ArtistProfileEditPage** (`/artist/profile`): Editar perfil artístico

### Sub-páginas Admin
- **AdminUsersPage** (`/admin/users`): Lista de usuarios con filtros
- **AdminUserDetailPage** (`/admin/users/:id`): Detalle y gestión de usuario
- **AdminArtistsPage** (`/admin/artists`): Lista de artistas con filtros por estado
- **AdminArtistDetailPage** (`/admin/artists/:id`): Detalle y gestión de artista (aprobar, bloquear)
- **AdminArtworksPage** (`/admin/artworks`): Lista de obras con filtros por estado
- **AdminMetricsPage** (`/admin/metrics`): Métricas detalladas del sistema
- **AdminSettingsPage** (`/admin/settings`): Configuración de la plataforma

---

## 🔐 Autenticación

La aplicación usa JWT almacenado en localStorage. El token se agrega automáticamente a todas las peticiones mediante interceptores de Axios.

### Roles
- **buyer**: Comprador (puede ver galería, hacer pedidos, crear encargos)
- **artist**: Artista (puede crear obras, gestionar pedidos y encargos)
- **admin**: Administrador (acceso completo al sistema)

### Rutas Protegidas
- Rutas protegidas por autenticación: `/buyer/*`, `/artist/*`, `/admin/*`
- Rutas protegidas por rol: `/admin/*` requiere rol `admin`
- Redirección automática según rol después del login

---

## 🌍 Internacionalización

Soporte para **Español** e **Inglés**. El idioma se guarda en localStorage y persiste entre sesiones.

### Archivos de Traducción
- `src/i18n/es.json` - Traducciones en español
- `src/i18n/en.json` - Traducciones en inglés

### Uso
```tsx
import { useLanguage } from '../../context/LanguageContext';

const { t, language } = useLanguage();
const text = t('common.save') || 'Guardar'; // Con fallback
```

---

## 📝 Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_NAME=ArtMarket
```

---

## 🧪 Desarrollo

El proyecto está configurado con:
- **ESLint** para linting
- **TypeScript** para type checking
- **Tailwind CSS** para estilos
- **Hot Module Replacement (HMR)** para desarrollo rápido

---

## 📦 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo (puerto 5173)
- `npm run build` - Build para producción
- `npm run preview` - Preview del build de producción
- `npm run lint` - Ejecuta ESLint

---

## 🎯 Funcionalidades Implementadas

### ✅ Completado

- [x] Autenticación (login, registro, logout)
- [x] Páginas públicas (Home, Gallery, Artwork Detail, Artist Profile)
- [x] Dashboards por rol (Buyer, Artist, Admin)
- [x] Gestión de obras (crear, editar, listar)
- [x] Gestión de pedidos (listar, ver detalles)
- [x] Gestión de encargos (listar, ver detalles)
- [x] Perfil de artista (ver, editar)
- [x] Administración (usuarios, artistas, obras, métricas, configuración)
- [x] Internacionalización (ES/EN)
- [x] Imágenes por defecto (artwork-placeholder.svg)
- [x] Galería aleatoria en HomePage
- [x] Filtros y búsqueda en GalleryPage
- [x] Paginación en listas
- [x] Formularios con validación (React Hook Form + Zod)
- [x] Notificaciones (react-hot-toast)
- [x] Manejo de errores (ErrorBoundary, validación de API)

### ⏳ Pendiente

- [ ] Funcionalidad de compra completa
- [ ] Sistema de mensajería en encargos (enviar mensajes)
- [ ] Actualizar estado de envío en pedidos
- [ ] Aceptar/rechazar encargos desde UI
- [ ] Publicar/despublicar obras (desde UI del artista)
- [ ] Subida de imágenes (actualmente solo URLs)

---

## 🏗️ Arquitectura

### Principios Aplicados

- **SOLID**: Separación de responsabilidades, componentes reutilizables
- **Programación Funcional**: Componentes funcionales, hooks personalizados
- **Type Safety**: TypeScript estricto, tipos bien definidos
- **Component-Based**: Arquitectura basada en componentes reutilizables

### Patrones Utilizados

- **Context API**: Para estado global (Auth, Language)
- **React Query**: Para estado del servidor y caché
- **Custom Hooks**: Para lógica reutilizable
- **Protected Routes**: Para control de acceso
- **Error Boundaries**: Para manejo de errores
- **Lazy Loading**: Para imágenes y componentes

---

## 🖼️ Imágenes por Defecto

El proyecto incluye una imagen por defecto (`artwork-placeholder.svg`) que se muestra automáticamente cuando:
- Una obra no tiene imágenes en el array `images`
- Una URL de imagen falla al cargar (error 404, CORS, etc.)
- Hay problemas de red al obtener la imagen

**Ubicación:** `src/assets/images/artwork-placeholder.svg`

---

## 🔗 Enlaces Útiles

- **Backend API**: http://localhost:4000/api
- **Frontend Dev**: http://localhost:5173
- **Documentación Backend**: Ver `../backend/README.md`

---

## 📝 Credenciales de Prueba

- **Comprador:** maria.garcia@email.com / Password123!
- **Artista:** sofia.artista@email.com / Password123!
- **Admin:** admin@marketplace.com / Admin123!

---

## 🐛 Solución de Problemas

### Node.js
- Requiere versión 20.x o superior
- Verificar con: `node --version`
- Si hay problemas, actualizar Node.js desde [nodejs.org](https://nodejs.org/)

### Backend no responde
- Verificar que el servidor esté corriendo en puerto 4000
- Verificar conexión a MongoDB
- Revisar logs del backend

### Frontend no carga
- Verificar que Node.js sea v20.x o superior
- Verificar que todas las dependencias estén instaladas (`npm install`)
- Revisar consola del navegador

### Errores de CORS
- Verificar configuración CORS en backend
- Verificar que el frontend use la URL correcta del backend (`VITE_API_BASE_URL`)

### Errores de autenticación
- Verificar que el token se guarde en localStorage
- Verificar que los interceptores funcionen
- Revisar expiración del token

---

## 📖 Guías de Uso

### Para Desarrolladores

1. **Leer primero**: `ESTADO_PROYECTO.md` para entender el estado actual
2. **Componentes**: Ver estructura en `src/components/`
3. **Páginas**: Ver estructura en `src/pages/`
4. **Pruebas**: Seguir `GUIA_PRUEBAS.md` para probar funcionalidades

### Para Testing

1. Seguir `GUIA_PRUEBAS.md` para checklist completo
2. Usar credenciales de prueba proporcionadas
3. Verificar todas las funcionalidades según el checklist

---

## 🎨 Diseño

- **Framework CSS**: Tailwind CSS 4
- **Colores**: Sistema de colores personalizado (primary, secondary, danger, etc.)
- **Responsive**: Diseño mobile-first, breakpoints de Tailwind
- **Iconos**: react-icons (Feather Icons principalmente)

---

## 📄 Licencia

Este proyecto es parte del marketplace de arte ArtMarket.

---

**Desarrollado siguiendo principios SOLID y mejores prácticas de React**

**Última actualización:** 26 de Enero, 2026
