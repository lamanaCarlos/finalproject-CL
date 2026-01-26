# Verificación de Instalación de Node.js

**Fecha:** 26 de Enero, 2026

---

## ⚠️ Problema Detectado

La terminal actual sigue usando **Node.js 18.9.0** porque:
- La terminal no se ha reiniciado después de la instalación
- El PATH todavía prioriza NVM (`C:\nvm4w\nodejs`) sobre la instalación directa

---

## ✅ Solución: Reiniciar Terminal

**IMPORTANTE:** Después de instalar Node.js, debes:

1. **Cerrar TODAS las terminales** (incluyendo Cursor/VS Code)
2. **Cerrar Cursor/VS Code completamente**
3. **Abrir Cursor/VS Code de nuevo**
4. **Abrir una terminal NUEVA**

Luego verificar:

```powershell
node --version
# Debe mostrar: v20.x.x o v22.x.x (NO v18.9.0)
```

---

## 🔍 Verificar Instalación

Si después de reiniciar sigue mostrando v18.9.0:

### Opción 1: Verificar PATH

```powershell
# Ver el orden del PATH
$env:PATH -split ';' | Where-Object { $_ -like '*node*' }

# Debe mostrar primero "C:\Program Files\nodejs" antes de "C:\nvm4w\nodejs"
```

### Opción 2: Verificar Instalación

```powershell
# Verificar si Node.js 20.x está instalado
& "C:\Program Files\nodejs\node.exe" --version

# Si muestra v20.x.x, está instalado pero el PATH no está actualizado
```

### Opción 3: Reordenar PATH Manualmente

1. Presionar `Win + R`
2. Escribir: `sysdm.cpl`
3. Click en "Variables de entorno"
4. Buscar "Path" en "Variables del sistema"
5. Click en "Editar"
6. Mover `C:\Program Files\nodejs` al principio de la lista
7. Click en "Aceptar"
8. **Cerrar todas las terminales y abrir una nueva**

---

## 🎯 Pasos Rápidos

1. ✅ Cerrar TODAS las terminales
2. ✅ Cerrar Cursor/VS Code
3. ✅ Abrir Cursor/VS Code de nuevo
4. ✅ Abrir terminal nueva
5. ✅ Verificar: `node --version`
6. ✅ Si muestra v20.x.x: ¡Listo!
7. ✅ Si muestra v18.9.0: Reordenar PATH (ver Opción 3)

---

**Documento creado por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
