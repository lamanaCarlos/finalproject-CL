# Componentes Comunes - Frontend ArtMarket

**Fecha:** 26 de Enero, 2026

---

## ✅ Componentes Creados

### 1. Input Component
**Ubicación:** `src/components/common/Input/`

**Características:**
- ✅ Soporte para `forwardRef` (compatible con React Hook Form)
- ✅ Label opcional con indicador de campo requerido
- ✅ Mensajes de error y texto de ayuda
- ✅ Iconos izquierdo y derecho
- ✅ Estados de error visual
- ✅ Accesibilidad (ARIA labels)
- ✅ Ancho completo opcional

**Props:**
```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}
```

**Uso:**
```tsx
<Input
  label="Email"
  type="email"
  error={errors.email}
  helperText="Ingresa tu correo electrónico"
  required
/>
```

---

### 2. Modal Component
**Ubicación:** `src/components/common/Modal/`

**Características:**
- ✅ Portal a document.body
- ✅ Overlay con click para cerrar (opcional)
- ✅ Cierre con tecla Escape (opcional)
- ✅ Tamaños configurables (sm, md, lg, xl, full)
- ✅ Header con título y botón de cierre
- ✅ Footer personalizable
- ✅ Bloqueo de scroll del body cuando está abierto
- ✅ Accesibilidad (ARIA)

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}
```

**Uso:**
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmar acción"
  footer={<Button onClick={handleConfirm}>Confirmar</Button>}
>
  <p>¿Estás seguro de realizar esta acción?</p>
</Modal>
```

---

### 3. Card Component
**Ubicación:** `src/components/common/Card/`

**Características:**
- ✅ Variantes: default, outlined, elevated
- ✅ Padding configurable (none, sm, md, lg)
- ✅ Efecto hover opcional
- ✅ Modo clickable con focus ring
- ✅ Extensible con className

**Props:**
```typescript
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
}
```

**Uso:**
```tsx
<Card variant="elevated" padding="lg" hover clickable>
  <h3>Título</h3>
  <p>Contenido de la tarjeta</p>
</Card>
```

---

### 4. Badge Component
**Ubicación:** `src/components/common/Badge/`

**Características:**
- ✅ Variantes de color (primary, secondary, success, danger, warning, info, gray)
- ✅ Tamaños (sm, md, lg)
- ✅ Indicador de punto opcional
- ✅ Diseño redondeado

**Props:**
```typescript
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}
```

**Uso:**
```tsx
<Badge variant="success" size="md" dot>
  Publicado
</Badge>
```

---

### 5. Select Component
**Ubicación:** `src/components/common/Select/`

**Características:**
- ✅ Soporte para `forwardRef` (compatible con React Hook Form)
- ✅ Label opcional con indicador de campo requerido
- ✅ Mensajes de error y texto de ayuda
- ✅ Placeholder opcional
- ✅ Icono izquierdo opcional
- ✅ Icono de flecha personalizado
- ✅ Opciones deshabilitadas
- ✅ Accesibilidad (ARIA)

**Props:**
```typescript
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
}

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
```

**Uso:**
```tsx
<Select
  label="Tipo de obra"
  options={[
    { value: 'digital', label: 'Digital' },
    { value: 'physical', label: 'Físico' }
  ]}
  placeholder="Selecciona un tipo"
  error={errors.type}
/>
```

---

### 6. Pagination Component
**Ubicación:** `src/components/common/Pagination/`

**Características:**
- ✅ Navegación entre páginas
- ✅ Botones primera/última página (opcional)
- ✅ Botones anterior/siguiente (opcional)
- ✅ Páginas visibles con elipsis inteligente
- ✅ Máximo de páginas visibles configurable
- ✅ Estado activo visual
- ✅ Accesibilidad (ARIA labels)

**Props:**
```typescript
interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}
```

**Uso:**
```tsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  maxVisiblePages={5}
/>
```

---

### 7. Image Component
**Ubicación:** `src/components/common/Image/`

**Características:**
- ✅ Lazy loading con Intersection Observer
- ✅ Placeholder mientras carga
- ✅ Fallback automático en caso de error
- ✅ Aspect ratios predefinidos (square, video, portrait, landscape, auto)
- ✅ Object-fit configurable (contain, cover, fill, none, scale-down)
- ✅ Transición suave al cargar
- ✅ Loading nativo del navegador

**Props:**
```typescript
interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lazy?: boolean;
  fallback?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'auto';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}
```

**Uso:**
```tsx
<Image
  src="/artwork.jpg"
  alt="Obra de arte"
  lazy
  aspectRatio="square"
  objectFit="cover"
  fallback="/placeholder.png"
/>
```

---

## 📦 Exportaciones

Todos los componentes están exportados desde `src/components/common/index.ts`:

```typescript
export { Button, Input, Modal, Card, Badge, Select, Pagination, Image, Loader, ErrorBoundary };
export type { ButtonProps, InputProps, ModalProps, CardProps, BadgeProps, SelectProps, SelectOption, PaginationProps, ImageProps, LoaderProps };
```

---

## ✅ Verificaciones

- ✅ TypeScript compila sin errores
- ✅ Build de producción exitoso
- ✅ Todos los componentes siguen el patrón establecido
- ✅ Accesibilidad implementada (ARIA)
- ✅ Compatible con React Hook Form (forwardRef)
- ✅ Tipos exportados correctamente

---

## 🎨 Estilos

Todos los componentes usan:
- **Tailwind CSS v4** para estilos
- **Colores del tema** (primary, secondary)
- **Transiciones suaves**
- **Estados de focus** accesibles
- **Responsive** por defecto

---

## 📝 Notas de Implementación

1. **Input y Select** usan `forwardRef` para compatibilidad con React Hook Form
2. **Modal** usa `createPortal` para renderizar fuera del DOM tree
3. **Image** usa `Intersection Observer` para lazy loading eficiente
4. **Pagination** calcula páginas visibles inteligentemente con elipsis
5. Todos los componentes son **completamente tipados** con TypeScript

---

**Componentes creados por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
