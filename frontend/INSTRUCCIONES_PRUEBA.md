# Instrucciones para Probar el Frontend

**Fecha:** 26 de Enero, 2026

---

## ✅ Estado Actual

- ✅ **Backend:** Funcionando en `http://localhost:4000`
- ✅ **Frontend:** Funcionando en `http://localhost:4173` (Preview mode)
- ✅ **Build:** Compilado exitosamente

---

## 🚀 Cómo Probar

### Opción 1: Usar Preview Server (Actual)

El servidor de preview ya está corriendo:

1. **Abrir navegador:**
   ```
   http://localhost:4173
   ```

2. **Probar las siguientes funcionalidades:**
   - ✅ Navegación entre páginas
   - ✅ Login con credenciales
   - ✅ Registro de nuevos usuarios
   - ✅ Galería de obras
   - ✅ Filtros y búsqueda
   - ✅ Paginación

**Nota:** Con preview mode, los cambios en código no se reflejan automáticamente. Necesitas hacer `npm run build` y recargar.

---

### Opción 2: Actualizar Node.js (Recomendado para desarrollo)

Para tener hot reload y mejor experiencia de desarrollo:

1. **Actualizar Node.js:**
   - Descargar Node.js LTS (20.x o 22.x) desde https://nodejs.org/
   - Instalar
   - Reiniciar terminal

2. **Iniciar servidor de desarrollo:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Abrir navegador:**
   ```
   http://localhost:5173
   ```

---

## 🧪 Pruebas a Realizar

### 1. Página de Login (`/login`)

**Credenciales de Prueba:**
- Email: `maria.garcia@email.com`
- Password: `Password123!`

**Verificar:**
- [ ] Formulario carga correctamente
- [ ] Validación funciona (email inválido, password corta)
- [ ] Login exitoso redirige a home
- [ ] Error muestra mensaje apropiado
- [ ] Enlace a registro funciona

---

### 2. Página de Registro (`/register`)

**Verificar:**
- [ ] Formulario carga correctamente
- [ ] Validación de campos funciona
- [ ] Validación de contraseñas coincidentes
- [ ] Selección de rol funciona
- [ ] Registro exitoso redirige a login
- [ ] Error de email duplicado se maneja

---

### 3. Página de Galería (`/gallery`)

**Verificar:**
- [ ] Obras se cargan desde la API
- [ ] Grid responsive funciona
- [ ] ArtworkCard muestra información correcta
- [ ] Imágenes cargan (pueden ser placeholders)
- [ ] Búsqueda por texto funciona
- [ ] Filtro por tipo funciona
- [ ] Ordenamiento funciona
- [ ] Paginación funciona
- [ ] Click en obra navega (si detalle está implementado)

**Datos Esperados:**
- 18 obras disponibles
- 12 obras por página
- 2 páginas totales

---

### 4. Navegación y Layout

**Verificar:**
- [ ] Header se muestra en todas las páginas
- [ ] Footer se muestra en todas las páginas
- [ ] Navegación entre páginas funciona
- [ ] Selector de idioma funciona (ES/EN)
- [ ] Menú móvil funciona (responsive)
- [ ] Botones de auth se actualizan según estado
- [ ] Sticky header funciona

---

## 🔍 Verificación de Integración API

### Endpoints a Probar:

1. **GET `/api/artworks`**
   - Debe devolver lista de obras
   - Verificar paginación
   - Verificar filtros

2. **POST `/api/auth/login`**
   - Debe devolver token JWT
   - Token debe guardarse en localStorage
   - Usuario debe actualizarse en AuthContext

3. **POST `/api/auth/register`**
   - Debe crear nuevo usuario
   - Debe mostrar mensaje de éxito

---

## ⚠️ Problemas Conocidos

1. **Node.js Version:**
   - Dev server requiere Node.js 20.19+
   - Preview funciona con Node.js 18.9.0
   - Ver `SOLUCION_NODE_VERSION.md` para más detalles

2. **Páginas Pendientes:**
   - ArtworkDetailPage (detalle de obra)
   - ArtistProfilePage (perfil de artista)
   - Dashboards (Buyer, Artist, Admin)

---

## 📝 Notas

- El backend debe estar corriendo en `http://localhost:4000`
- CORS debe estar configurado en el backend
- Las imágenes pueden ser placeholders si no hay URLs reales
- Algunas rutas pueden mostrar 404 si no están implementadas

---

## ✅ Checklist de Verificación Rápida

- [ ] Backend corriendo en puerto 4000
- [ ] Frontend accesible en puerto 4173
- [ ] Login funciona
- [ ] Register funciona
- [ ] Gallery muestra obras
- [ ] Filtros funcionan
- [ ] Navegación funciona
- [ ] Layout se muestra correctamente

---

**Instrucciones creadas por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
