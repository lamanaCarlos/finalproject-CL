# Solución: Problema con Versión de Node.js

**Fecha:** 26 de Enero, 2026

---

## ⚠️ Problema Identificado

El servidor de desarrollo de Vite no puede iniciar porque:

- **Versión actual de Node.js:** 18.9.0
- **Versión requerida por Vite 7:** 20.19+ o 22.12+
- **Error:** `TypeError: crypto.hash is not a function`

---

## ✅ Soluciones

### Opción 1: Actualizar Node.js (Recomendado)

**Para Windows:**

1. **Descargar Node.js LTS:**
   - Visitar: https://nodejs.org/
   - Descargar la versión LTS (20.x o 22.x)
   - Instalar el instalador

2. **Verificar instalación:**
   ```bash
   node --version
   # Debe mostrar v20.x.x o v22.x.x
   ```

3. **Reiniciar terminal y probar:**
   ```bash
   cd frontend
   npm run dev
   ```

---

### Opción 2: Usar Build de Producción

Si no puedes actualizar Node.js ahora, puedes usar el build de producción:

1. **Crear build:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Servir con servidor estático:**
   ```bash
   # Opción A: Usar serve (instalar primero: npm install -g serve)
   serve -s dist -l 5173
   
   # Opción B: Usar http-server (instalar primero: npm install -g http-server)
   http-server dist -p 5173
   
   # Opción C: Usar Python (si está instalado)
   cd dist
   python -m http.server 5173
   ```

3. **Abrir en navegador:**
   - Ir a `http://localhost:5173`

**Nota:** Con el build de producción, los cambios no se reflejarán automáticamente (sin hot reload).

---

### Opción 3: Downgrade de Vite (No recomendado)

Si necesitas mantener Node.js 18, podrías downgrade Vite a versión 6, pero esto no es recomendado porque:
- Perderás las mejoras de Vite 7
- Puede causar incompatibilidades con otras dependencias
- No es una solución a largo plazo

---

## 📋 Verificación

Después de actualizar Node.js:

1. **Verificar versión:**
   ```bash
   node --version
   npm --version
   ```

2. **Limpiar e instalar dependencias:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Verificar que funcione:**
   - Debe mostrar: `Local: http://localhost:5173`
   - Abrir en navegador y verificar que la aplicación carga

---

## 🎯 Recomendación

**Actualizar Node.js a la versión LTS (20.x o 22.x)** es la mejor solución porque:
- ✅ Permite usar todas las características de Vite 7
- ✅ Mejora el rendimiento
- ✅ Compatible con todas las dependencias modernas
- ✅ Hot reload funcionará correctamente
- ✅ Mejor experiencia de desarrollo

---

**Documento creado por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
