# Solución Final: Actualizar Node.js

**Fecha:** 26 de Enero, 2026

---

## ⚠️ Situación

- **Problema:** NVM no está registrando correctamente las instalaciones
- **Problema:** Descarga automática falla por conexión/proxy
- **Solución:** Instalación manual directa (más confiable)

---

## ✅ Solución: Instalación Manual (5 minutos)

### Paso 1: Descargar Node.js

1. **Abrir navegador:**
   - Ir a: **https://nodejs.org/**
   - Buscar el botón verde **"LTS"** (Long Term Support)
   - Click en **"Download Node.js (LTS)"**
   - Se descargará: `node-v20.x.x-x64.msi`

### Paso 2: Instalar

1. **Ejecutar el archivo descargado** (`node-v20.x.x-x64.msi`)

2. **Seguir el asistente:**
   - ✅ Next → Accept → Next
   - ✅ **IMPORTANTE:** Asegurarse de que **"Add to PATH"** esté marcado
   - ✅ Next → Install
   - ✅ Finish

### Paso 3: Verificar (MUY IMPORTANTE)

**⚠️ CERRAR TODAS LAS TERMINALES** (incluyendo Cursor/VS Code)

**Abrir una terminal NUEVA** y ejecutar:

```powershell
node --version
# Debe mostrar: v20.x.x (NO v18.9.0)
```

Si aún muestra v18.9.0:
- Cerrar TODAS las terminales
- Cerrar Cursor/VS Code completamente
- Abrir una terminal completamente nueva
- Verificar nuevamente

### Paso 4: Limpiar y Reinstalar

```powershell
cd c:\Users\Oneiros\Documents\GitHub\artistProyect\frontend

# Limpiar
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Reinstalar
npm install
```

### Paso 5: Probar

```powershell
npm run dev
```

**Debería funcionar en:** `http://localhost:5173`

---

## 🔗 Enlace Directo

**Node.js 20.11.0 LTS (Windows 64-bit):**
https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi

---

## ⏱️ Tiempo Estimado

- **Descarga:** 1-2 minutos
- **Instalación:** 1 minuto
- **Verificación:** 1 minuto
- **Total:** ~5 minutos

---

**Documento creado por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
