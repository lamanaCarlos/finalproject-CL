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

- Node.js >= 18
- Backend corriendo en `http://localhost:4000`

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Imágenes, iconos, estilos
├── components/      # Componentes React
│   ├── common/     # Componentes reutilizables
│   ├── layout/     # Componentes de layout
│   ├── artwork/     # Componentes de obras
│   ├── artist/     # Componentes de artistas
│   ├── order/      # Componentes de pedidos
│   ├── commission/ # Componentes de encargos
│   └── admin/      # Componentes de administración
├── context/         # Context API (Auth, Language)
├── hooks/           # Custom hooks
├── i18n/            # Internacionalización
├── pages/           # Páginas de la aplicación
├── routes/          # Configuración de rutas
├── services/        # Servicios API
├── types/           # Tipos TypeScript
└── utils/           # Utilidades
```

## 🛠️ Stack Tecnológico

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **React Router** - Routing
- **React Query** - Estado del servidor
- **Axios** - Cliente HTTP
- **React Hook Form + Zod** - Formularios y validación
- **react-i18next** - Internacionalización
- **react-hot-toast** - Notificaciones

## 🔐 Autenticación

La aplicación usa JWT almacenado en localStorage. El token se agrega automáticamente a todas las peticiones mediante interceptores de Axios.

## 🌍 Internacionalización

Soporte para Español e Inglés. El idioma se guarda en localStorage y persiste entre sesiones.

## 📝 Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_NAME=ArtMarket
```

## 🧪 Desarrollo

El proyecto está configurado con:
- ESLint para linting
- TypeScript para type checking
- Tailwind CSS para estilos
- Hot Module Replacement (HMR)

## 📦 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build
- `npm run lint` - Ejecuta ESLint

---

**Desarrollado siguiendo principios SOLID y mejores prácticas de React**
