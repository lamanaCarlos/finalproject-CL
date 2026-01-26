# Componentes de Layout - Frontend ArtMarket

**Fecha:** 26 de Enero, 2026

---

## ✅ Componentes Creados

### 1. Header Component
**Ubicación:** `src/components/layout/Header/`

**Características:**
- ✅ Navegación responsive (desktop y mobile)
- ✅ Menú hamburguesa para móviles
- ✅ Logo con enlace a home
- ✅ Enlaces de navegación (Home, Explore, Artists)
- ✅ Selector de idioma (ES/EN) integrado
- ✅ Botones de autenticación (Login/Register o Logout)
- ✅ Enlace al dashboard según el rol del usuario
- ✅ Sticky header (se mantiene fijo al hacer scroll)
- ✅ Transiciones suaves
- ✅ Accesibilidad (ARIA labels)

**Funcionalidades:**
- Menú móvil colapsable
- Cierre automático del menú móvil al hacer click en un enlace
- Estado visual del idioma activo
- Integración completa con AuthContext y LanguageContext

**Uso:**
```tsx
import { Header } from '../../components/layout';

<Header />
```

---

### 2. Footer Component
**Ubicación:** `src/components/layout/Footer/`

**Características:**
- ✅ Grid responsive (1 columna móvil, 4 columnas desktop)
- ✅ Sección de marca con descripción
- ✅ Enlaces a redes sociales (Facebook, Instagram, Twitter)
- ✅ Enlaces rápidos (Home, Explore, About, Contact)
- ✅ Sección de soporte (Terms, Privacy, Contact)
- ✅ Barra inferior con copyright
- ✅ Año dinámico
- ✅ Diseño oscuro (bg-gray-900)
- ✅ Hover effects en enlaces

**Estructura:**
- **Columna 1-2:** Brand + Social Media
- **Columna 3:** Quick Links
- **Columna 4:** Support

**Uso:**
```tsx
import { Footer } from '../../components/layout';

<Footer />
```

---

### 3. Layout Component
**Ubicación:** `src/components/layout/Layout/`

**Características:**
- ✅ Wrapper que incluye Header y Footer
- ✅ Opción de mostrar/ocultar Header
- ✅ Opción de mostrar/ocultar Footer
- ✅ Estructura flex para mantener footer al final
- ✅ Fondo gris claro consistente

**Props:**
```typescript
interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}
```

**Uso:**
```tsx
import { Layout } from '../../components/layout';

<Layout>
  <div>Contenido de la página</div>
</Layout>

// Sin footer
<Layout showFooter={false}>
  <div>Contenido</div>
</Layout>
```

---

## 📦 Exportaciones

Todos los componentes están exportados desde `src/components/layout/index.ts`:

```typescript
export { Header } from './Header';
export { Footer } from './Footer';
export { Layout } from './Layout';
export type { LayoutProps } from './Layout';
```

---

## 🎨 Características de Diseño

### Header
- **Fondo:** Blanco con sombra sutil
- **Posición:** Sticky top (se mantiene fijo)
- **Z-index:** 40 (por encima del contenido)
- **Transiciones:** Suaves en todos los elementos interactivos

### Footer
- **Fondo:** Gris oscuro (gray-900)
- **Texto:** Gris claro (gray-300, gray-400)
- **Hover:** Blanco en enlaces
- **Grid:** Responsive con breakpoints

### Layout
- **Estructura:** Flex column con min-h-screen
- **Fondo:** Gris claro (gray-50)
- **Main:** Flex-1 para empujar footer al final

---

## 🔧 Integración

### HomePage Actualizado
El `HomePage` ha sido actualizado para usar el nuevo componente `Layout`:

```tsx
import { Layout } from '../../components/layout';

export const HomePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section>...</section>
      
      {/* Main Content */}
      <div>...</div>
    </Layout>
  );
};
```

**Beneficios:**
- ✅ Código más limpio y mantenible
- ✅ Header y Footer consistentes en todas las páginas
- ✅ Fácil de personalizar por página

---

## 📝 Traducciones Agregadas

### Español (`es.json`)
```json
"footer": {
  "about": "Acerca de",
  "contact": "Contacto",
  "terms": "Términos y condiciones",
  "privacy": "Política de privacidad",
  "rights": "Todos los derechos reservados",
  "followUs": "Síguenos",
  "quickLinks": "Enlaces rápidos",
  "support": "Soporte"
}
```

### Inglés (`en.json`)
```json
"footer": {
  "about": "About",
  "contact": "Contact",
  "terms": "Terms and conditions",
  "privacy": "Privacy policy",
  "rights": "All rights reserved",
  "followUs": "Follow us",
  "quickLinks": "Quick links",
  "support": "Support"
}
```

---

## ✅ Verificaciones

- ✅ TypeScript compila sin errores
- ✅ Build de producción exitoso
- ✅ Componentes responsive
- ✅ Accesibilidad implementada (ARIA)
- ✅ Integración con Context API (Auth, Language)
- ✅ HomePage actualizado para usar Layout

---

## 🚀 Próximos Pasos

Los componentes de Layout están listos para ser usados en todas las páginas:

1. **Actualizar páginas existentes** para usar `Layout`
2. **Crear nuevas páginas** con `Layout` desde el inicio
3. **Personalizar Footer** con enlaces reales cuando estén disponibles
4. **Agregar más enlaces** al Header cuando se creen nuevas páginas

---

**Componentes creados por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
