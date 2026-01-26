# Imágenes por Defecto

Este directorio contiene imágenes por defecto utilizadas en la aplicación cuando las imágenes de las obras no se pueden cargar.

## Archivos

### `artwork-placeholder.svg`
Imagen SVG por defecto que se muestra cuando:
- Una obra no tiene imágenes asociadas
- La URL de la imagen falla al cargar
- Hay un error de red al obtener la imagen

**Características:**
- Formato: SVG (escalable, sin pérdida de calidad)
- Dimensiones: 800x800px
- Diseño: Abstracto con elementos artísticos (círculos, rectángulos, trazos de pincel)
- Colores: Paleta suave y neutra (grises, azules, púrpuras, verdes, naranjas, rojos)

## Uso

La imagen por defecto se importa y utiliza automáticamente en:

1. **Componente `Image`** (`src/components/common/Image/Image.tsx`)
   - Se usa como fallback cuando `onError` se dispara
   - Valor por defecto del prop `fallback`

2. **Componente `ArtworkCard`** (`src/components/artwork/ArtworkCard/ArtworkCard.tsx`)
   - Se usa cuando una obra no tiene imágenes en el array `images`

3. **Página `ArtworkDetailPage`** (`src/pages/ArtworkDetail/ArtworkDetailPage.tsx`)
   - Se usa como imagen principal cuando no hay imágenes disponibles

## Personalización

Para cambiar la imagen por defecto:

1. Reemplaza el archivo `artwork-placeholder.svg` con tu propia imagen
2. Asegúrate de que el archivo tenga el mismo nombre o actualiza las importaciones
3. Para usar un formato diferente (PNG, JPG), actualiza las importaciones en los componentes

## Notas

- El componente `Image` maneja automáticamente el fallback cuando una imagen falla
- La imagen SVG es ligera y se carga rápidamente
- El diseño es neutral y no interfiere con el contenido de las obras
