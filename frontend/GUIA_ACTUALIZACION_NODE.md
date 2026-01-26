# Guía de Actualización de Node.js

**Fecha:** 26 de Enero, 2026

---

## 📋 Estado Actual

- **Versión actual:** Node.js 18.9.0
- **Versión requerida:** Node.js 20.19+ o 22.12+
- **Razón:** Vite 7 requiere Node.js 20.19+ para el servidor de desarrollo

---

## 🚀 Opción 1: Instalación Directa (Recomendado para Windows)

### Paso 1: Descargar Node.js LTS

1. **Visitar el sitio oficial:**
   - URL: https://nodejs.org/
   - Descargar la versión **LTS (Long Term Support)**
   - Recomendado: **Node.js 20.x LTS** o **22.x LTS**

2. **Descargar el instalador:**
   - Para Windows 64-bit: `node-v20.x.x-x64.msi` o `node-v22.x.x-x64.msi`
   - El instalador se descargará automáticamente

### Paso 2: Instalar Node.js

1. **Ejecutar el instalador descargado**
2. **Seguir el asistente de instalación:**
   - ✅ Aceptar los términos
   - ✅ Seleccionar la ruta de instalación (por defecto está bien)
   - ✅ **IMPORTANTE:** Asegurarse de que la opción "Add to PATH" esté marcada
   - ✅ Instalar herramientas de compilación nativas (opcional pero recomendado)
   - ✅ Click en "Install"

3. **Esperar a que termine la instalación**

### Paso 3: Verificar Instalación

**Abrir una NUEVA terminal** (PowerShell o CMD) y ejecutar:

```powershell
node --version
# Debe mostrar: v20.x.x o v22.x.x

npm --version
# Debe mostrar la versión de npm correspondiente
```

### Paso 4: Limpiar y Reinstalar Dependencias

```powershell
cd c:\Users\Oneiros\Documents\GitHub\artistProyect\frontend

# Limpiar node_modules y lock file
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

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

---

## 🔧 Opción 2: Usar NVM para Windows (Gestor de Versiones)

Si prefieres gestionar múltiples versiones de Node.js:

### Paso 1: Instalar NVM para Windows

1. **Descargar NVM para Windows:**
   - URL: https://github.com/coreybutler/nvm-windows/releases
   - Descargar: `nvm-setup.exe` (última versión)

2. **Ejecutar el instalador:**
   - Seguir el asistente de instalación
   - Aceptar todos los valores por defecto

3. **Reiniciar la terminal** después de la instalación

### Paso 2: Instalar Node.js 20.x usando NVM

```powershell
# Verificar que nvm está instalado
nvm version

# Instalar Node.js 20 LTS
nvm install 20.11.0

# O instalar la última versión 20.x
nvm install 20

# Usar la versión instalada
nvm use 20.11.0

# Verificar
node --version
```

### Paso 3: Configurar como Versión por Defecto (Opcional)

```powershell
# Establecer como versión por defecto
nvm alias default 20.11.0
```

### Paso 4: Limpiar y Reinstalar Dependencias

```powershell
cd c:\Users\Oneiros\Documents\GitHub\artistProyect\frontend

# Limpiar
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstalar
npm install
```

---

## ✅ Verificación Post-Instalación

### 1. Verificar Versiones

```powershell
node --version
# Debe mostrar: v20.x.x o v22.x.x

npm --version
# Debe mostrar la versión de npm correspondiente
```

### 2. Probar Build

```powershell
cd frontend
npm run build
# Debe compilar sin errores
```

### 3. Probar Dev Server

```powershell
npm run dev
# Debe iniciar en http://localhost:5173
```

### 4. Verificar que Funciona

- Abrir navegador en `http://localhost:5173`
- Debe cargar la aplicación sin errores
- Hot reload debe funcionar (cambios se reflejan automáticamente)

---

## 🔄 Si Ya Tienes Node.js Instalado

Si ya tienes Node.js instalado y quieres actualizarlo:

### Método 1: Reinstalar (Más Simple)

1. Descargar la nueva versión desde nodejs.org
2. Ejecutar el instalador
3. El instalador actualizará automáticamente la versión existente

### Método 2: Desinstalar y Reinstalar

1. **Desinstalar Node.js actual:**
   - Panel de Control → Programas → Desinstalar Node.js

2. **Eliminar carpetas residuales (opcional):**
   ```powershell
   # Eliminar node_modules globales (si existen)
   Remove-Item -Recurse -Force "$env:APPDATA\npm"
   Remove-Item -Recurse -Force "$env:APPDATA\npm-cache"
   ```

3. **Instalar nueva versión** siguiendo los pasos de la Opción 1

---

## ⚠️ Problemas Comunes

### Problema: "node no se reconoce como comando"

**Solución:**
1. Verificar que Node.js está en el PATH
2. Reiniciar la terminal completamente
3. Verificar con: `where.exe node`

### Problema: Versión antigua sigue apareciendo

**Solución:**
1. Cerrar TODAS las terminales
2. Abrir una nueva terminal
3. Verificar con: `node --version`

### Problema: npm no funciona después de actualizar

**Solución:**
```powershell
# Reinstalar npm globalmente
npm install -g npm@latest
```

---

## 📝 Notas Importantes

1. **Reiniciar Terminal:** Siempre abre una nueva terminal después de instalar Node.js
2. **Limpiar node_modules:** Es recomendable limpiar y reinstalar dependencias después de actualizar
3. **Backup:** Si tienes proyectos importantes, considera hacer backup antes de actualizar
4. **Versión LTS:** Se recomienda usar la versión LTS (Long Term Support) para mayor estabilidad

---

## 🎯 Recomendación Final

**Para este proyecto, recomiendo:**
- ✅ **Node.js 20.x LTS** (versión estable y ampliamente soportada)
- ✅ **Instalación directa** desde nodejs.org (más simple y confiable)
- ✅ **Verificar** que todo funciona después de la actualización

**⚠️ Nota:** Si NVM tiene problemas (como en este caso), la instalación directa es más confiable en Windows.

---

## 🔗 Enlaces Útiles

- **Node.js Official:** https://nodejs.org/
- **NVM para Windows:** https://github.com/coreybutler/nvm-windows
- **Documentación Node.js:** https://nodejs.org/docs/

---

**Guía creada por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
