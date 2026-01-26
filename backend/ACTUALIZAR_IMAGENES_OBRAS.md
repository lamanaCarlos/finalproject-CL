# Actualizar Imágenes de Obras con FreeImages.com

**Fecha:** 26 de Enero, 2026

---

## 📋 Descripción

Este script actualiza las URLs de imágenes de todas las obras en la base de datos, reemplazando las URLs de Unsplash por URLs de imágenes gratuitas de freeimages.com.

---

## 🚀 Ejecutar el Script

### Opción 1: Ejecutar directamente con Node

```bash
cd backend
node src/scripts/updateArtworkImages.js
```

### Opción 2: Agregar script a package.json (recomendado)

Agregar al `package.json` del backend:

```json
{
  "scripts": {
    "update-images": "node src/scripts/updateArtworkImages.js"
  }
}
```

Luego ejecutar:

```bash
cd backend
npm run update-images
```

---

## 🎨 Imágenes Utilizadas

El script utiliza imágenes de freeimages.com organizadas por categorías:

### Abstract (Pinturas Abstractas)
- Dynamic Abstract Painting
- Abstract Painting of Tranquility
- Abstract painting with calming colors
- Abstract paint splatter patterns
- Abstract painting with textured brush strokes
- Bright Abstract Painting
- Vibrant Abstract Painting
- Y más...

### Landscape (Paisajes)
- Abstract Painting with Moon
- Abstract painting with textured wall
- Abstract Watercolor Painting
- Y más...

### Portrait (Retratos)
- Vibrant Abstract Painting with Bold Colors
- Textured Blue Abstract Painting
- Y más...

### Digital (Arte Digital)
- Abstract Paint Swirls
- Modern Minimalistic Interior with Abstract Painting
- Y más...

---

## 🔧 Funcionamiento

1. **Conecta a MongoDB** usando la URI de las variables de entorno
2. **Obtiene todas las obras** de la base de datos
3. **Determina la categoría** según el título o tipo de obra:
   - Abstract: obras con "abstract", "aurora", "digital" en el título
   - Landscape: obras con "paisaje", "landscape", "montaña", "ciudad"
   - Portrait: obras con "retrato", "portrait", "busto"
   - Digital: obras con type='digital'
4. **Selecciona imágenes aleatorias** de la categoría correspondiente
5. **Mantiene el número de imágenes** que tenía la obra originalmente
6. **Actualiza cada obra** en la base de datos

---

## ✅ Resultado

Después de ejecutar el script:
- ✅ Todas las obras tendrán nuevas URLs de imágenes
- ✅ Las imágenes serán de freeimages.com (gratuitas y legales)
- ✅ Se mantendrá el número de imágenes por obra
- ✅ Las imágenes serán apropiadas según el tipo de obra

---

## 📝 Notas

- Las imágenes de freeimages.com son gratuitas bajo la licencia FreeImages.com Content License
- El script es seguro y no elimina datos, solo actualiza las URLs
- Puedes ejecutarlo múltiples veces para cambiar las imágenes
- Las imágenes se seleccionan aleatoriamente de la categoría correspondiente

---

## 🔍 Verificar Cambios

Después de ejecutar el script, puedes verificar:

1. **En el frontend:**
   - Abrir la galería (`/gallery`)
   - Verificar que las imágenes se carguen correctamente
   - Verificar que la HomePage muestre las nuevas imágenes

2. **En la base de datos:**
   - Consultar las obras y verificar que las URLs hayan cambiado
   - Verificar que todas las obras tengan al menos una imagen

---

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verificar que `.env` tenga `MONGODB_URI` configurado
- Verificar que MongoDB esté corriendo o que la URI de Atlas sea correcta

### No se actualizan las obras
- Verificar que haya obras en la base de datos
- Verificar permisos de escritura en la base de datos

### URLs de imágenes no funcionan
- Verificar que las URLs de freeimages.com sean accesibles
- Algunas URLs pueden requerir acceso directo a la imagen

---

**Script creado por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
