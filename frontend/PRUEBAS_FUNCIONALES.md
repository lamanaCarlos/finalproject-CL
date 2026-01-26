# Pruebas Funcionales - Frontend ArtMarket

**Fecha:** 26 de Enero, 2026

---

## 🧪 Pruebas con Backend

### Estado de Servidores

#### Backend
- ✅ **Estado:** Funcionando
- ✅ **URL:** `http://localhost:4000`
- ✅ **Health Check:** 200 OK
- ✅ **MongoDB:** Conectado (Atlas)

#### Frontend
- ✅ **Estado:** Funcionando (Preview mode)
- ✅ **URL:** `http://localhost:4173` (Vite preview server)
- ⚠️ **Nota:** Dev server requiere Node.js 20.19+, pero preview funciona
- ✅ **Build:** Funciona correctamente

---

## 📋 Checklist de Pruebas

### 1. Página de Login (`/login`)
- [ ] Cargar página correctamente
- [ ] Mostrar formulario de login
- [ ] Validar campos (email, password)
- [ ] Mostrar errores de validación
- [ ] Login exitoso con credenciales válidas
- [ ] Redirección después del login
- [ ] Manejo de errores (credenciales inválidas)
- [ ] Enlace a página de registro funciona

**Credenciales de Prueba:**
- Email: `maria.garcia@email.com`
- Password: `Password123!`

---

### 2. Página de Registro (`/register`)
- [ ] Cargar página correctamente
- [ ] Mostrar formulario de registro
- [ ] Validar todos los campos
- [ ] Validar que las contraseñas coincidan
- [ ] Selección de rol funciona
- [ ] Registro exitoso
- [ ] Redirección a login después del registro
- [ ] Manejo de errores (email duplicado, etc.)
- [ ] Enlace a página de login funciona

---

### 3. Página de Galería (`/gallery`)
- [ ] Cargar página correctamente
- [ ] Mostrar obras desde la API
- [ ] Grid responsive funciona
- [ ] ArtworkCard muestra información correcta
- [ ] Imágenes cargan con lazy loading
- [ ] Filtros funcionan:
  - [ ] Búsqueda por texto
  - [ ] Filtro por tipo (digital/físico)
  - [ ] Ordenamiento
- [ ] Paginación funciona
- [ ] Estados de carga se muestran
- [ ] Manejo de errores funciona
- [ ] Estado vacío cuando no hay resultados
- [ ] Links a detalle de obra funcionan

**Datos Esperados:**
- 18 obras disponibles en la base de datos
- Paginación: 12 obras por página

---

### 4. Navegación y Layout
- [ ] Header se muestra correctamente
- [ ] Footer se muestra correctamente
- [ ] Navegación entre páginas funciona
- [ ] Selector de idioma funciona (ES/EN)
- [ ] Menú móvil funciona (responsive)
- [ ] Botones de autenticación se actualizan según estado
- [ ] Sticky header funciona

---

### 5. Integración API
- [ ] CORS configurado correctamente
- [ ] Token JWT se envía en headers
- [ ] Respuestas de API se procesan correctamente
- [ ] Errores de API se manejan correctamente
- [ ] React Query cache funciona
- [ ] Invalidación de cache funciona

---

### 6. Autenticación
- [ ] Login guarda token en localStorage
- [ ] Token se envía en requests autenticados
- [ ] Logout limpia localStorage
- [ ] Rutas protegidas redirigen si no autenticado
- [ ] Rutas públicas redirigen si autenticado
- [ ] Refresh de usuario funciona

---

## 🔍 Pruebas Específicas

### Login Flow
1. Ir a `/login`
2. Ingresar credenciales inválidas → Debe mostrar error
3. Ingresar credenciales válidas → Debe redirigir a `/`
4. Verificar que header muestre botón de logout
5. Verificar que token esté en localStorage

### Register Flow
1. Ir a `/register`
2. Completar formulario con datos válidos
3. Seleccionar rol (buyer o artist)
4. Enviar formulario → Debe redirigir a `/login`
5. Intentar registrar con email existente → Debe mostrar error

### Gallery Flow
1. Ir a `/gallery`
2. Verificar que se carguen obras
3. Probar búsqueda por texto
4. Probar filtro por tipo
5. Probar ordenamiento
6. Cambiar de página
7. Click en una obra → Debe ir a `/artwork/:id` (si está implementado)

---

## ⚠️ Problemas Conocidos

### Pendientes de Verificación
- [ ] CORS puede necesitar configuración adicional
- [ ] Imágenes placeholder si no hay imágenes reales
- [ ] Página de detalle de obra aún no implementada

---

## 📝 Notas de Prueba

### Para Probar Manualmente:

1. **Abrir navegador en:** `http://localhost:4173` (Preview server)
   - **Nota:** Si necesitas hot reload, actualiza Node.js a 20.19+ y usa `npm run dev` (puerto 5173)

2. **Probar Login:**
   - Ir a `/login`
   - Usar: `maria.garcia@email.com` / `Password123!`
   - Verificar redirección

3. **Probar Register:**
   - Ir a `/register`
   - Crear nueva cuenta
   - Verificar redirección a login

4. **Probar Gallery:**
   - Ir a `/gallery`
   - Verificar que se muestren obras
   - Probar filtros y paginación

---

## ✅ Resultados

**Estado:** ⏳ **EN PRUEBA**

---

**Pruebas realizadas por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
