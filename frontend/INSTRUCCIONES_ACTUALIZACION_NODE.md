# Instrucciones para Actualizar Node.js a 20.x

**Fecha:** 26 de Enero, 2026

---

## ⚠️ Situación Actual

- **Versión actual:** Node.js 18.9.0
- **Versión requerida:** Node.js 20.19+ o 22.12+
- **Problema:** NVM tuvo problemas con la instalación (posible problema de proxy/configuración)

---

## ✅ Solución Recomendada: Instalación Directa

La forma más confiable en Windows es instalar Node.js directamente desde el sitio oficial.

### Paso 1: Descargar Node.js 20.x LTS

1. **Abrir navegador y visitar:**
   ```
   https://nodejs.org/
   ```

2. **Descargar la versión LTS (Long Term Support):**
   - Buscar el botón verde "LTS" (actualmente Node.js 20.x)
   - Click en "Download Node.js (LTS)"
   - Se descargará: `node-v20.x.x-x64.msi` (Windows Installer)

### Paso 2: Instalar Node.js

1. **Ejecutar el archivo descargado** (`node-v20.x.x-x64.msi`)

2. **Seguir el asistente de instalación:**
   - ✅ Click en "Next"
   - ✅ Aceptar los términos de licencia
   - ✅ Seleccionar la ruta de instalación (por defecto está bien)
   - ✅ **IMPORTANTE:** Asegurarse de que "Add to PATH" esté marcado
   - ✅ Seleccionar "Install native modules" (recomendado)
   - ✅ Click en "Install"
   - ✅ Esperar a que termine la instalación
   - ✅ Click en "Finish"

### Paso 3: Verificar Instalación

**⚠️ IMPORTANTE: Cerrar TODAS las terminales y abrir una NUEVA terminal**

En la nueva terminal, ejecutar:

```powershell
node --version
# Debe mostrar: v20.x.x (no v18.9.0)

npm --version
# Debe mostrar la versión de npm correspondiente
```

Si aún muestra v18.9.0:
- Cerrar TODAS las terminales (incluyendo VS Code/Cursor si está abierto)
- Abrir una terminal completamente nueva
- Verificar nuevamente

### Paso 4: Limpiar y Reinstalar Dependencias del Proyecto

```powershell
cd c:\Users\Oneiros\Documents\GitHub\artistProyect\frontend

# Limpiar node_modules y lock file
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Reinstalar dependencias
npm install
```

### Paso 5: Probar Servidor de Desarrollo

```powershell
npm run dev
```

**Debería mostrar:**
```
  VITE v7.3.1  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Si funciona, abrir el navegador en `http://localhost:5173`

---

## 🔄 Si Node.js 20.x Ya Está Instalado pero No Se Activa

Si instalaste Node.js 20.x pero la terminal sigue mostrando 18.9.0:

### Solución 1: Verificar PATH

```powershell
# Verificar dónde está Node.js
where.exe node

# Debe mostrar la ruta de Node.js 20.x, no 18.9.0
# Si muestra múltiples rutas, la primera es la que se usa
```

### Solución 2: Reordenar PATH

Si hay múltiples instalaciones de Node.js:

1. **Abrir Variables de Entorno:**
   - Presionar `Win + R`
   - Escribir: `sysdm.cpl`
   - Click en "Variables de entorno"
   - Buscar "Path" en "Variables del sistema"
   - Click en "Editar"

2. **Mover la ruta de Node.js 20.x al principio:**
   - Buscar rutas relacionadas con Node.js
   - Mover la ruta de Node.js 20.x al principio de la lista
   - Click en "Aceptar"

3. **Cerrar todas las terminales y abrir una nueva**

### Solución 3: Desinstalar Versión Antigua

Si quieres mantener solo Node.js 20.x:

1. **Panel de Control → Programas → Desinstalar programas**
2. **Buscar "Node.js"**
3. **Desinstalar la versión 18.9.0** (mantener 20.x si está instalada)
4. **Reiniciar terminal**

---

## ✅ Verificación Final

Después de la instalación, verificar:

```powershell
# Versión de Node.js
node --version
# Debe ser: v20.x.x o v22.x.x

# Versión de npm
npm --version

# Probar build
cd frontend
npm run build
# Debe compilar sin errores

# Probar dev server
npm run dev
# Debe iniciar en http://localhost:5173
```

---

## 📝 Notas Importantes

1. **Cerrar todas las terminales** después de instalar Node.js
2. **Abrir una terminal nueva** para que los cambios en PATH se apliquen
3. **Limpiar node_modules** después de actualizar Node.js
4. **Reinstalar dependencias** para asegurar compatibilidad

---

## 🔗 Enlaces Útiles

- **Node.js Official:** https://nodejs.org/
- **Node.js 20.x LTS:** https://nodejs.org/dist/v20.11.0/
- **Node.js 22.x LTS:** https://nodejs.org/dist/v22.12.0/

---

## 🎯 Pasos Rápidos (Resumen)

1. ✅ Descargar Node.js 20.x LTS desde nodejs.org
2. ✅ Instalar (asegurarse de "Add to PATH")
3. ✅ **Cerrar todas las terminales**
4. ✅ Abrir nueva terminal
5. ✅ Verificar: `node --version` (debe ser v20.x.x)
6. ✅ Ir a `frontend` y ejecutar: `npm install`
7. ✅ Ejecutar: `npm run dev`
8. ✅ Abrir navegador en `http://localhost:5173`

---

**Instrucciones creadas por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
