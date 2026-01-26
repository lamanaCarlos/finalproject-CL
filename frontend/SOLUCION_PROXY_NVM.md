# Solución: Problema de Proxy con NVM

**Fecha:** 26 de Enero, 2026

---

## ⚠️ Problema Detectado

NVM está intentando descargar Node.js pero hay un problema de proxy:
```
proxyconnect tcp: dial tcp 127.0.0.1:9: connectex: No connection could be made
```

---

## ✅ Soluciones

### Opción 1: Deshabilitar Proxy Temporalmente

Si tienes un proxy configurado pero no lo necesitas:

```powershell
# Verificar variables de proxy
$env:HTTP_PROXY
$env:HTTPS_PROXY

# Deshabilitar proxy temporalmente
$env:HTTP_PROXY = ""
$env:HTTPS_PROXY = ""
$env:http_proxy = ""
$env:https_proxy = ""

# Intentar instalar nuevamente
nvm install 20
```

### Opción 2: Configurar Proxy Correctamente

Si necesitas usar un proxy:

```powershell
# Configurar proxy (reemplazar con tu proxy real)
$env:HTTP_PROXY = "http://proxy.example.com:8080"
$env:HTTPS_PROXY = "http://proxy.example.com:8080"

# Intentar instalar
nvm install 20
```

### Opción 3: Descargar Manualmente e Instalar con NVM

1. **Descargar Node.js manualmente:**
   - Visitar: https://nodejs.org/dist/v20.11.0/
   - Descargar: `node-v20.11.0-x64.msi` (para Windows 64-bit)

2. **Instalar manualmente:**
   - Ejecutar el instalador descargado
   - Seguir el asistente de instalación

3. **Verificar:**
   ```powershell
   node --version
   # Debe mostrar: v20.11.0
   ```

### Opción 4: Usar Instalador Directo (Más Simple)

Si NVM sigue dando problemas, puedes instalar Node.js directamente:

1. **Descargar desde nodejs.org:**
   - URL: https://nodejs.org/
   - Descargar Node.js 20.x LTS (Windows Installer .msi)

2. **Ejecutar el instalador:**
   - Aceptar términos
   - Asegurarse de que "Add to PATH" esté marcado
   - Instalar

3. **Verificar en nueva terminal:**
   ```powershell
   node --version
   npm --version
   ```

4. **Limpiar y reinstalar dependencias:**
   ```powershell
   cd frontend
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   npm install
   ```

---

## 🔍 Verificar Configuración de Proxy

```powershell
# Ver todas las variables de entorno relacionadas con proxy
Get-ChildItem Env: | Where-Object { $_.Name -like "*PROXY*" }

# Ver configuración de npm
npm config get proxy
npm config get https-proxy
```

---

## 📝 Recomendación

**Para este caso, recomiendo la Opción 4 (Instalador Directo)** porque:
- ✅ Más simple y directo
- ✅ No depende de NVM
- ✅ Funciona sin problemas de proxy
- ✅ Actualiza automáticamente la versión en PATH

Después de instalar, simplemente:
1. Cerrar todas las terminales
2. Abrir nueva terminal
3. Verificar: `node --version`
4. Ir a `frontend` y ejecutar: `npm run dev`

---

**Documento creado por:** AI Assistant  
**Fecha:** 26 de Enero, 2026
