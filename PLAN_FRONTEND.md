# Plan de Desarrollo Frontend - Marketplace de Arte

## 📋 Resumen Ejecutivo

Este documento detalla el plan paso a paso para desarrollar el frontend del marketplace de arte, siguiendo las mejores prácticas de React, principios SOLID, programación funcional y desarrollo basado en componentes.

---

## 🎯 Objetivos

1. Crear una aplicación React moderna y escalable
2. Implementar todas las páginas según el mockup de diseño
3. Integrar con la API REST existente
4. Implementar autenticación JWT
5. Soporte multi-idioma (ES/EN)
6. Diseño responsive y accesible
7. Código limpio, mantenible y testeable

---

## 🛠️ Stack Tecnológico Recomendado

### Core
- **React 18+** - Framework principal
- **Vite** - Build tool (más rápido que CRA)
- **React Router v6** - Routing
- **TypeScript** - Type safety (recomendado) o JavaScript con PropTypes

### Estado y Datos
- **Context API + useReducer** - Estado global (o Zustand para proyectos más complejos)
- **React Query / TanStack Query** - Gestión de estado del servidor y caché
- **Axios** - Cliente HTTP

### UI y Estilos
- **Tailwind CSS** - Utility-first CSS (recomendado para rapidez)
- O **Material-UI (MUI)** - Componentes pre-construidos
- O **styled-components** - CSS-in-JS
- **React Hook Form** - Formularios
- **Zod** o **Yup** - Validación de formularios

### Internacionalización
- **react-i18next** - i18n

### Utilidades
- **date-fns** - Manejo de fechas
- **react-hot-toast** o **react-toastify** - Notificaciones
- **react-loading-skeleton** - Loading states
- **react-icons** - Iconos

---

## 📁 Estructura del Proyecto

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       └── globals.css
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Loader/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   ├── Dropdown/
│   │   │   ├── Pagination/
│   │   │   └── Toast/
│   │   │
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Navigation/
│   │   │   ├── Sidebar/
│   │   │   └── Layout/
│   │   │
│   │   ├── artwork/
│   │   │   ├── ArtworkCard/
│   │   │   ├── ArtworkGallery/
│   │   │   ├── ArtworkDetail/
│   │   │   ├── ArtworkForm/
│   │   │   ├── ArtworkFilters/
│   │   │   └── ArtworkImageGallery/
│   │   │
│   │   ├── artist/
│   │   │   ├── ArtistProfileCard/
│   │   │   ├── ArtistDashboard/
│   │   │   ├── ArtistArtworkList/
│   │   │   └── ArtistStats/
│   │   │
│   │   ├── order/
│   │   │   ├── OrderSummary/
│   │   │   ├── OrderStatusBadge/
│   │   │   ├── OrderList/
│   │   │   └── ShippingInfo/
│   │   │
│   │   ├── commission/
│   │   │   ├── CommissionForm/
│   │   │   ├── CommissionCard/
│   │   │   ├── CommissionMessages/
│   │   │   └── CommissionStatus/
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard/
│   │       ├── UserTable/
│   │       ├── ArtworkModerationTable/
│   │       └── MetricsCards/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Gallery/
│   │   ├── ArtworkDetail/
│   │   ├── ArtistProfile/
│   │   ├── ArtistDashboard/
│   │   ├── BuyerDashboard/
│   │   ├── CommissionDetail/
│   │   ├── OrderDetail/
│   │   └── AdminDashboard/
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts (o .js)
│   │   │   ├── auth.api.ts
│   │   │   ├── artwork.api.ts
│   │   │   ├── artist.api.ts
│   │   │   ├── order.api.ts
│   │   │   ├── commission.api.ts
│   │   │   └── admin.api.ts
│   │   └── auth.service.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useArtwork.ts
│   │   ├── useArtist.ts
│   │   ├── useOrder.ts
│   │   ├── useCommission.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── LanguageContext.tsx
│   │   └── CartContext.tsx (opcional)
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   │
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── artwork.types.ts
│   │   ├── artist.types.ts
│   │   ├── order.types.ts
│   │   ├── commission.types.ts
│   │   └── api.types.ts
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   │
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── es.json
│   │   └── en.json
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts (si TypeScript)
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json (si TypeScript)
├── tailwind.config.js (si Tailwind)
├── vite.config.ts
└── README.md
```

---

## 📝 Plan de Implementación Paso a Paso

### Fase 1: Configuración Inicial (Setup)

#### 1.1 Crear proyecto base
- [ ] Inicializar proyecto con Vite + React
- [ ] Configurar TypeScript (si se elige)
- [ ] Instalar dependencias base
- [ ] Configurar estructura de carpetas
- [ ] Configurar ESLint y Prettier
- [ ] Configurar Git y .gitignore

#### 1.2 Configuración de herramientas
- [ ] Configurar Tailwind CSS o librería de UI elegida
- [ ] Configurar React Router
- [ ] Configurar react-i18next
- [ ] Configurar Axios y cliente API base
- [ ] Configurar React Query (si se usa)
- [ ] Configurar variables de entorno

#### 1.3 Configuración de estilos
- [ ] Configurar tema y paleta de colores
- [ ] Crear variables CSS/Tailwind
- [ ] Configurar tipografía
- [ ] Crear estilos globales

---

### Fase 2: Infraestructura Base

#### 2.1 Servicios y API
- [ ] Crear cliente Axios con interceptores
- [ ] Implementar servicio de autenticación
- [ ] Crear servicios API para cada módulo:
  - [ ] auth.api
  - [ ] artwork.api
  - [ ] artist.api
  - [ ] order.api
  - [ ] commission.api
  - [ ] admin.api
- [ ] Implementar manejo de errores centralizado
- [ ] Implementar refresh token (si aplica)

#### 2.2 Context y Estado Global
- [ ] Crear AuthContext
- [ ] Crear LanguageContext
- [ ] Crear CartContext (opcional)
- [ ] Implementar hooks personalizados:
  - [ ] useAuth
  - [ ] useLocalStorage
  - [ ] Otros hooks necesarios

#### 2.3 Routing y Protección
- [ ] Configurar rutas principales
- [ ] Implementar ProtectedRoute
- [ ] Implementar PublicRoute (redirigir si ya está autenticado)
- [ ] Implementar rutas por roles

#### 2.4 Internacionalización
- [ ] Configurar react-i18next
- [ ] Crear archivos de traducción (es.json, en.json)
- [ ] Implementar LanguageSwitcher component
- [ ] Traducir textos base

---

### Fase 3: Componentes Comunes

#### 3.1 Componentes Base
- [ ] Button (variantes: primary, secondary, danger, etc.)
- [ ] Input (text, email, password, textarea)
- [ ] Modal
- [ ] Loader/Spinner
- [ ] Card
- [ ] Badge
- [ ] Dropdown/Select
- [ ] Pagination
- [ ] Toast/Notification
- [ ] Image (con lazy loading y error handling)

#### 3.2 Layout Components
- [ ] Header (con navegación y carrito)
- [ ] Footer
- [ ] Navigation
- [ ] Sidebar (para dashboards)
- [ ] Layout wrapper

---

### Fase 4: Páginas Públicas

#### 4.1 Home Page
- [ ] Hero section con imagen destacada
- [ ] Sección de obras destacadas
- [ ] Filtros básicos (Category, Style, Price Range, Sort By)
- [ ] Grid de obras con ArtworkCard
- [ ] Integración con API de galería

#### 4.2 Gallery Page
- [ ] Filtros avanzados
- [ ] Grid/List view toggle (opcional)
- [ ] Paginación
- [ ] Búsqueda por texto
- [ ] Ordenamiento

#### 4.3 Artwork Detail Page
- [ ] Galería de imágenes
- [ ] Información de la obra
- [ ] Información del artista
- [ ] Botones: Add to Cart, Buy Now
- [ ] Sección de reviews (si aplica)
- [ ] Obras relacionadas

#### 4.4 Artist Profile Page
- [ ] Información del artista
- [ ] Estadísticas (ventas, obras)
- [ ] Grid de obras del artista
- [ ] Botón "Follow" (si aplica)
- [ ] Botón "Commission Me"
- [ ] Filtros de obras del artista

#### 4.5 Login/Register Pages
- [ ] Formulario de login
- [ ] Formulario de registro
- [ ] Validación de formularios
- [ ] Manejo de errores
- [ ] Redirección post-login según rol

---

### Fase 5: Funcionalidades de Usuario Autenticado

#### 5.1 Buyer Dashboard
- [ ] Mis pedidos
- [ ] Mis encargos
- [ ] Perfil de usuario
- [ ] Carrito de compras (si se implementa)

#### 5.2 Artist Dashboard
- [ ] Estadísticas del artista
- [ ] Mis obras (listado)
- [ ] Crear/Editar obra
- [ ] Publicar/Despublicar obra
- [ ] Mis ventas
- [ ] Encargos recibidos
- [ ] Editar perfil de artista

#### 5.3 Commission Flow
- [ ] Formulario de solicitud de encargo
- [ ] Listado de encargos (buyer y artist)
- [ ] Detalle de encargo
- [ ] Sistema de mensajes
- [ ] Gestión de estados (aceptar, rechazar, completar)

#### 5.4 Order Management
- [ ] Detalle de pedido
- [ ] Seguimiento de envío (para obras físicas)
- [ ] Actualización de información de envío (artista)

---

### Fase 6: Administración

#### 6.1 Admin Dashboard
- [ ] Métricas globales
- [ ] Gestión de usuarios
- [ ] Gestión de artistas (aprobar/bloquear)
- [ ] Moderación de obras
- [ ] Configuración de plataforma

---

### Fase 7: Mejoras y Optimizaciones

#### 7.1 Performance
- [ ] Lazy loading de imágenes
- [ ] Code splitting de rutas
- [ ] Memoización de componentes pesados
- [ ] Optimización de re-renders
- [ ] Implementar React.memo donde sea necesario

#### 7.2 UX/UI
- [ ] Loading states en todas las operaciones
- [ ] Error boundaries
- [ ] Mensajes de error amigables
- [ ] Confirmaciones para acciones críticas
- [ ] Animaciones sutiles
- [ ] Responsive design completo

#### 7.3 Accesibilidad
- [ ] Navegación por teclado
- [ ] Etiquetas ARIA
- [ ] Contraste de colores (WCAG AA)
- [ ] Focus visible
- [ ] Alt text en imágenes

#### 7.4 Testing (Opcional pero recomendado)
- [ ] Tests unitarios de componentes críticos
- [ ] Tests de integración de flujos principales
- [ ] Tests E2E de flujos críticos

---

## 🎨 Diseño Basado en Mockup

### Páginas a Implementar según Mockup:

1. **Home & Gallery Page**
   - Header con logo "ArtMarket"
   - Navegación: Home, Explore, Artists, My Account
   - Carrito con contador
   - Hero section con imagen y CTA
   - Filtros: Category, Style, Price Range, Sort By
   - Grid de obras destacadas con ratings

2. **Artist Profile Page**
   - Información del artista (foto, nombre, título)
   - Estadísticas: Sales, Artworks
   - About section
   - Grid de obras del artista
   - Botón "Commission Me"

3. **Product & Purchase Page**
   - Imagen grande de la obra
   - Título y precio
   - Especificaciones (Type, Size, Medium)
   - Descripción
   - Botones: Add to Cart, Buy Now
   - Sección de reviews

4. **Custom Commission Form**
   - Formulario con campos:
     - Artwork Type (dropdown)
     - Size (input)
     - Description (textarea)
     - Reference Images (upload)
     - Budget (input)
     - Deadline (date picker)
   - Botón Submit Request

---

## 🔐 Autenticación y Seguridad

- [ ] Almacenar token JWT en localStorage o httpOnly cookie
- [ ] Implementar refresh token si está disponible
- [ ] Interceptor de Axios para agregar token automáticamente
- [ ] Manejo de expiración de token
- [ ] Logout automático en caso de 401
- [ ] Protección de rutas según roles

---

## 📱 Responsive Design

- [ ] Mobile-first approach
- [ ] Breakpoints: mobile, tablet, desktop
- [ ] Navegación adaptativa (hamburger menu en mobile)
- [ ] Grids adaptativos
- [ ] Formularios optimizados para mobile

---

## 🌍 Internacionalización

- [ ] Traducciones completas (ES/EN)
- [ ] Formateo de fechas según idioma
- [ ] Formateo de moneda según idioma
- [ ] RTL support (futuro)

---

## 🧪 Testing Strategy

### Unit Tests
- Componentes críticos
- Hooks personalizados
- Utilidades y formatters

### Integration Tests
- Flujos de autenticación
- Flujos de compra
- Flujos de creación de obra

### E2E Tests (Opcional)
- Flujo completo de compra
- Flujo de creación de encargo

---

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "react-i18next": "^13.5.0",
    "react-query": "^3.39.3",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "date-fns": "^2.30.0",
    "react-hot-toast": "^2.4.1",
    "react-icons": "^4.12.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  }
}
```

---

## 🚀 Scripts de Desarrollo

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\""
  }
}
```

---

## 📋 Checklist de Validación

Antes de considerar el frontend completo:

### Funcionalidad
- [ ] Todas las páginas del mockup implementadas
- [ ] Autenticación funcionando
- [ ] CRUD de obras (artista)
- [ ] Compra de obras (buyer)
- [ ] Sistema de encargos completo
- [ ] Dashboard de administración
- [ ] Filtros y búsqueda funcionando

### Calidad
- [ ] Código sin errores de linting
- [ ] TypeScript sin errores (si aplica)
- [ ] Sin warnings de consola
- [ ] Performance aceptable (Lighthouse score > 80)

### UX
- [ ] Responsive en todos los dispositivos
- [ ] Loading states en todas las operaciones
- [ ] Mensajes de error claros
- [ ] Navegación intuitiva

### Integración
- [ ] Conectado correctamente con API
- [ ] Manejo de errores de API
- [ ] Validación de formularios

---

## 📝 Notas Importantes

1. **Backend debe estar corriendo** en `http://localhost:4000` durante desarrollo
2. **Variables de entorno** para URL del API
3. **Datos de prueba** disponibles en el seed del backend
4. **Mockup** es referencia, se puede mejorar UX/UI
5. **Priorizar funcionalidad** sobre diseño perfecto inicialmente

---

## 🎯 Próximos Pasos

1. **Confirmar stack tecnológico** con el usuario
2. **Crear proyecto base** con Vite
3. **Configurar herramientas** base
4. **Implementar infraestructura** (API client, context, routing)
5. **Desarrollar componentes** comunes
6. **Implementar páginas** según prioridad
7. **Integrar con backend** y probar
8. **Optimizar y pulir** UX/UI

---

**Última actualización:** 26 de Enero, 2026
