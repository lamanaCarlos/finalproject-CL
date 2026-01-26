# Problema: Node.js 20.x No Detectado

**Fecha:** 26 de Enero, 2026

---

## ⚠️ Situación

- La terminal muestra: **Node.js 18.9.0** (desde NVM)
- El registro solo muestra: **Node.js 12.18.3**
- **Node.js 20.x no aparece instalado**

---

## 🔍 Posibles Causas

1. **La instalación no se completó correctamente**
2. **Se instaló en una ubicación diferente**
3. **El instalador falló silenciosamente**

---

## ✅ Solución: Reinstalar Node.js 20.x

### Paso 1: Verificar Instalación Actual

Abre una **terminal nueva** (después de cerrar todas) y ejecuta:

```powershell
# Verificar todas las ubicaciones posibles
Get-ChildItem "C:\Program Files" -Directory -Filter "*node*" -ErrorAction SilentlyContinue
Get-ChildItem "$env:LOCALAPPDATA\Programs" -Directory -Filter "*node*" -ErrorAction SilentlyContinue

# Verificar PATH
$env:PATH -split ';' | Where-Object { $_ -like '*node*' }
```

### Paso 2: Desinstalar Versiones Antiguas (Opcional)

Si quieres limpiar antes de instalar:

1. **Panel de Control → Programas → Desinstalar programas**
2. Buscar "Node.js"
3. Desinstalar versiones antiguas (12.18.3, etc.)
4. **NO desinstalar si no estás seguro**

### Paso 3: Instalar Node.js 20.x LTS

1. **Descargar desde:**
   - https://nodejs.org/
   - Click en el botón verde **"LTS"**
   - Descargar: `node-v20.x.x-x64.msi`

2. **Ejecutar el instalador:**
   - ✅ Aceptar términos
   - ✅ **IMPORTANTE:** Marcar "Add to PATH"
   - ✅ Instalar

3. **Durante la instalación:**
   - Si aparece un mensaje sobre "versión existente", elegir **"Reemplazar"** o **"Actualizar"**

### Paso 4: Verificar Instalación

**CERRAR TODAS LAS TERMINALES** y abrir una nueva:

```powershell
node --version
# Debe mostrar: v20.x.x

npm --version
# Debe mostrar la versión de npm correspondiente
```

### Paso 5: Verificar PATH

```powershell
where.exe node
# Debe mostrar: C:\Program Files\nodejs\node.exe (o similar)
# NO debe mostrar: C:\nvm4w\nodejs\node.exe primero
```

---

## 🔧 Si el PATH Sigue Apuntando a NVM

Si después de instalar, `where.exe node` muestra NVM primero:

1. **Abrir Variables de Entorno:**
   - `Win + R` → `sysdm.cpl`
   - Click en "Variables de entorno"
   - Buscar "Path" en "Variables del sistema"
   - Click en "Editar"

2. **Reordenar:**
   - Mover `C:\Program Files\nodejs` al **principio** de la lista
   - Mover `C:\nvm4w\nodejs` más abajo (o eliminarlo si no lo necesitas)

3. **Aplicar:**
   - Click en "Aceptar" en todas las ventanas
   - **Cerrar TODAS las terminales**
   - Abrir una terminal nueva

---

## 🎯 Verificación Final

Después de reinstalar y reiniciar terminal:

```powershell
# Versión de Node.js
node --version
# Debe ser: v20.x.x o v22.x.x

# Ubicación
where.exe node
# Debe mostrar: C:\Program Files\nodejs\node.exe

# Probar dev server
cd frontend
npm run dev
# Debe funcionar en http://localhost:5173
```

---

## 📝 Notas

- Si la instalación falla, intenta ejecutar el instalador como **Administrador**
- Si hay problemas con permisos, desactiva temporalmente el antivirus
- Asegúrate de que "Add to PATH" esté marcado durante la instalación

---

**Documento creado por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
