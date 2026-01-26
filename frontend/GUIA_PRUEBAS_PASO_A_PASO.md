# Guía de Pruebas Paso a Paso - Frontend ArtMarket

**Fecha:** 26 de Enero, 2026

---

## 🎯 Preparación

### Servidores Requeridos

1. **Backend:** http://localhost:4000 ✅ (Verificado)
2. **Frontend Dev Server:** http://localhost:5173 ✅ (Activo)

### Herramientas

- Navegador web (Chrome, Firefox, Edge)
- DevTools abierto (F12)
  - Console tab (para ver errores)
  - Network tab (para ver requests API)
  - Application tab → Local Storage (para ver tokens)

---

## 📋 Pruebas Paso a Paso

### 1. Página de Inicio (`/`)

**URL:** http://localhost:5173/

**Pasos:**
1. Abrir http://localhost:5173/ en el navegador
2. Verificar que la página carga sin errores
3. Verificar que el Header se muestra:
   - Logo
   - Navegación (Home, Gallery, etc.)
   - Selector de idioma (ES/EN)
   - Botones "Login" y "Register"
4. Verificar que el Footer se muestra:
   - Enlaces
   - Redes sociales
   - Copyright
5. Probar selector de idioma:
   - Cambiar de ES a EN
   - Verificar que los textos cambien
6. Probar navegación:
   - Click en "Gallery" → Debe ir a `/gallery`
   - Click en "Login" → Debe ir a `/login`
   - Click en "Register" → Debe ir a `/register`
7. Verificar responsive:
   - Reducir tamaño de ventana
   - Verificar que aparezca menú hamburguesa
   - Probar menú móvil

**Resultado Esperado:**
- ✅ Página carga correctamente
- ✅ Header y Footer visibles
- ✅ Navegación funciona
- ✅ Selector de idioma funciona
- ✅ Responsive funciona

---

### 2. Página de Login (`/login`)

**URL:** http://localhost:5173/login

**Pasos:**
1. Ir a http://localhost:5173/login
2. Verificar que el formulario se muestra:
   - Campo Email
   - Campo Password
   - Botón "Login"
   - Enlace "¿No tienes cuenta? Regístrate"
3. **Prueba de Validación:**
   - Intentar enviar formulario vacío
   - Verificar que aparezcan mensajes de error
   - Ingresar email inválido (ej: "test")
   - Verificar mensaje de error de email
4. **Prueba de Login Fallido:**
   - Email: `test@test.com`
   - Password: `wrongpassword`
   - Click en "Login"
   - Verificar que aparezca mensaje de error
5. **Prueba de Login Exitoso:**
   - Email: `maria.garcia@email.com`
   - Password: `Password123!`
   - Click en "Login"
   - Verificar redirección a `/` (home)
   - Verificar que el Header muestre botón "Logout"
   - Abrir DevTools → Application → Local Storage
   - Verificar que exista `token` y `user` en localStorage
6. Verificar enlace a registro:
   - Click en "¿No tienes cuenta? Regístrate"
   - Debe ir a `/register`

**Resultado Esperado:**
- ✅ Formulario se muestra correctamente
- ✅ Validación funciona
- ✅ Login exitoso redirige
- ✅ Token se guarda en localStorage
- ✅ Header se actualiza

---

### 3. Página de Registro (`/register`)

**URL:** http://localhost:5173/register

**Pasos:**
1. Ir a http://localhost:5173/register
2. Verificar que el formulario se muestra:
   - Campo Name
   - Campo Email
   - Campo Password
   - Campo Confirm Password
   - Select Role (Buyer/Artist)
   - Botón "Register"
   - Enlace "¿Ya tienes cuenta? Inicia sesión"
3. **Prueba de Validación:**
   - Intentar enviar formulario vacío
   - Verificar mensajes de error
   - Ingresar email inválido
   - Ingresar contraseña corta (< 8 caracteres)
   - Ingresar contraseñas que no coinciden
   - Verificar mensajes de error apropiados
4. **Prueba de Registro Exitoso:**
   - Name: `Test User`
   - Email: `testuser${Date.now()}@test.com` (email único)
   - Password: `Test1234!`
   - Confirm Password: `Test1234!`
   - Role: `Buyer`
   - Click en "Register"
   - Verificar redirección a `/login`
   - Verificar mensaje de éxito (si existe)
5. **Prueba de Email Duplicado:**
   - Intentar registrar con `maria.garcia@email.com`
   - Verificar mensaje de error
6. Verificar enlace a login:
   - Click en "¿Ya tienes cuenta? Inicia sesión"
   - Debe ir a `/login`

**Resultado Esperado:**
- ✅ Formulario se muestra correctamente
- ✅ Validación funciona
- ✅ Registro exitoso redirige a login
- ✅ Error de email duplicado se maneja

---

### 4. Página de Galería (`/gallery`)

**URL:** http://localhost:5173/gallery

**Pasos:**
1. Ir a http://localhost:5173/gallery
2. Verificar que se muestre estado de carga inicial
3. Verificar que se carguen obras desde la API:
   - Deben aparecer cards de obras
   - Cada card debe mostrar:
     - Imagen
     - Título
     - Artista
     - Precio
     - Tipo (Digital/Físico)
     - Badge de estado
4. **Prueba de Filtros:**
   - **Búsqueda por texto:**
     - Escribir en el campo de búsqueda
     - Verificar que se filtren las obras
   - **Filtro por tipo:**
     - Seleccionar "Digital" → Verificar que solo muestre digitales
     - Seleccionar "Físico" → Verificar que solo muestre físicas
     - Seleccionar "Todos" → Verificar que muestre todas
   - **Ordenamiento:**
     - Probar diferentes opciones (Precio, Fecha, etc.)
     - Verificar que se ordenen correctamente
5. **Prueba de Paginación:**
   - Si hay más de 12 obras, verificar que aparezca paginación
   - Cambiar de página
   - Verificar que se carguen las obras correctas
6. **Prueba de Lazy Loading:**
   - Hacer scroll hacia abajo
   - Verificar que las imágenes se carguen al aparecer en pantalla
7. **Prueba de Estado Vacío:**
   - Usar búsqueda que no devuelva resultados
   - Verificar mensaje de "No se encontraron obras"
8. Verificar responsive:
   - Grid debe adaptarse a diferentes tamaños de pantalla

**Resultado Esperado:**
- ✅ Obras se cargan desde la API
- ✅ Filtros funcionan correctamente
- ✅ Paginación funciona
- ✅ Lazy loading funciona
- ✅ Responsive funciona

---

### 5. Navegación Después de Login

**Pasos:**
1. Estar autenticado (haber hecho login)
2. Verificar que el Header muestre:
   - Botón "Logout" en lugar de "Login/Register"
   - Nombre de usuario (si está implementado)
3. Probar navegación:
   - Ir a `/gallery` → Debe funcionar
   - Intentar ir a `/buyer/dashboard` → Debe funcionar (si es buyer)
   - Intentar ir a `/artist/dashboard` → Debe redirigir si no es artist
4. **Prueba de Logout:**
   - Click en "Logout"
   - Verificar redirección a `/` o `/login`
   - Verificar que `token` y `user` se eliminen de localStorage
   - Verificar que Header muestre "Login/Register" de nuevo

**Resultado Esperado:**
- ✅ Header se actualiza después de login
- ✅ Logout funciona correctamente
- ✅ Rutas protegidas funcionan

---

### 6. Verificación de Integración API

**Pasos:**
1. Abrir DevTools → Network tab
2. Ir a `/gallery`
3. Verificar requests:
   - Debe haber un request a `GET /api/artworks`
   - Verificar que el request sea exitoso (200)
   - Verificar que la respuesta contenga datos
4. Hacer login
5. Verificar que requests autenticados incluyan:
   - Header `Authorization: Bearer <token>`
6. Verificar manejo de errores:
   - Desconectar backend temporalmente
   - Intentar cargar galería
   - Verificar que se muestre mensaje de error apropiado

**Resultado Esperado:**
- ✅ Requests API funcionan
- ✅ Token se envía en requests autenticados
- ✅ Errores se manejan correctamente

---

## ⚠️ Problemas Conocidos

### Páginas Placeholder:
- `/artwork/:id` - Solo muestra texto placeholder
- `/artist/:id` - Solo muestra texto placeholder
- `/buyer/dashboard` - Solo muestra texto placeholder
- `/artist/dashboard` - Solo muestra texto placeholder
- `/admin/dashboard` - Solo muestra texto placeholder

**Nota:** Estas páginas están definidas pero no implementadas completamente.

---

## 📝 Checklist de Pruebas

### Funcionalidades Básicas
- [ ] Página de inicio carga correctamente
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Galería carga obras
- [ ] Navegación funciona
- [ ] Selector de idioma funciona

### Validación y Errores
- [ ] Validación de formularios funciona
- [ ] Mensajes de error se muestran
- [ ] Manejo de errores de API funciona

### Integración
- [ ] API se conecta correctamente
- [ ] Token se guarda y envía
- [ ] CORS funciona (sin errores en console)

### UI/UX
- [ ] Diseño responsive funciona
- [ ] Componentes se muestran correctamente
- [ ] Estados de carga se muestran
- [ ] Lazy loading funciona

---

## ✅ Resultados

**Fecha de Pruebas:** 26 de Enero, 2026

**Estado:** ⏳ **EN PRUEBA**

---

**Guía creada por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
