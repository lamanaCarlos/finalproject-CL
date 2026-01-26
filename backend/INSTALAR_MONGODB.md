# Guía de Instalación de MongoDB

## Opción 1: MongoDB con Docker (Recomendado - Más Fácil) 🐳

### Paso 1: Iniciar Docker Desktop
1. Abre **Docker Desktop** desde el menú de inicio
2. Espera a que Docker esté completamente iniciado (ícono en la bandeja del sistema)

### Paso 2: Ejecutar MongoDB en Docker
Una vez que Docker Desktop esté corriendo, ejecuta:

```powershell
docker run -d --name mongodb-marketplace -p 27017:27017 -v mongodb-data:/data/db mongo:latest
```

### Paso 3: Verificar que MongoDB está corriendo
```powershell
docker ps
```

Deberías ver el contenedor `mongodb-marketplace` en la lista.

### Comandos útiles de Docker:
```powershell
# Detener MongoDB
docker stop mongodb-marketplace

# Iniciar MongoDB (si ya existe)
docker start mongodb-marketplace

# Ver logs
docker logs mongodb-marketplace

# Eliminar contenedor (si necesitas empezar de nuevo)
docker rm -f mongodb-marketplace
```

---

## Opción 2: Instalar MongoDB Community Server (Instalación Completa)

### Paso 1: Descargar MongoDB
1. Ve a: https://www.mongodb.com/try/download/community
2. Selecciona:
   - Version: Latest (7.0 o superior)
   - Platform: Windows
   - Package: MSI
3. Descarga el instalador

### Paso 2: Instalar MongoDB
1. Ejecuta el instalador MSI descargado
2. Selecciona "Complete" installation
3. Marca "Install MongoDB as a Service"
4. Deja la configuración por defecto:
   - Service Name: MongoDB
   - Data Directory: C:\Program Files\MongoDB\Server\7.0\data
   - Log Directory: C:\Program Files\MongoDB\Server\7.0\log
5. **NO** marques "Install MongoDB Compass" (opcional)
6. Completa la instalación

### Paso 3: Verificar Instalación
```powershell
# Verificar que el servicio está corriendo
Get-Service MongoDB

# O iniciar el servicio si no está corriendo
net start MongoDB

# Probar conexión
mongosh mongodb://localhost:27017
```

---

## Opción 3: MongoDB Atlas (Cloud - Gratis) ☁️

### Ventajas:
- ✅ No requiere instalación local
- ✅ Gratis hasta 512MB
- ✅ Siempre disponible
- ✅ Fácil de configurar

### Paso 1: Crear cuenta
1. Ve a: https://www.mongodb.com/cloud/atlas/register
2. Crea una cuenta gratuita

### Paso 2: Crear cluster
1. Selecciona "Build a Database" (gratis)
2. Elige el plan **M0 Free**
3. Selecciona una región cercana
4. Crea el cluster (puede tardar 1-3 minutos)

### Paso 3: Configurar acceso
1. Ve a "Database Access" → "Add New Database User"
2. Crea un usuario y contraseña (guárdalos)
3. Ve a "Network Access" → "Add IP Address"
4. Agrega `0.0.0.0/0` para permitir desde cualquier IP (o tu IP específica)

### Paso 4: Obtener cadena de conexión
1. Ve a "Database" → "Connect"
2. Selecciona "Connect your application"
3. Copia la cadena de conexión (URI)
4. Reemplaza `<password>` con tu contraseña de usuario

### Paso 5: Configurar en el proyecto
Edita el archivo `.env` en `backend/`:

```env
MONGO_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/marketplace-arte?retryWrites=true&w=majority
```

---

## Verificar que MongoDB está funcionando

Una vez que MongoDB esté corriendo (cualquiera de las opciones), prueba:

```powershell
# Con MongoDB local
mongosh mongodb://localhost:27017

# O desde Node.js (ya incluido en el proyecto)
cd backend
npm run dev
```

Si ves el mensaje `✅ MongoDB conectado exitosamente`, ¡todo está funcionando!

---

## Recomendación

**Para desarrollo local:** Usa **Docker** (Opción 1) - Es la más rápida y fácil.

**Para producción:** Usa **MongoDB Atlas** (Opción 3) - Más confiable y escalable.

---

## Solución de Problemas

### Error: "connect ECONNREFUSED"
- Verifica que MongoDB está corriendo
- Para Docker: `docker ps` debe mostrar el contenedor
- Para instalación local: `Get-Service MongoDB` debe mostrar "Running"

### Error: "Port 27017 already in use"
- Algo más está usando el puerto 27017
- Cambia el puerto en `.env`: `MONGO_URI=mongodb://localhost:27018/marketplace-arte`
- O detén el proceso que está usando el puerto

### Docker Desktop no inicia
- Reinicia Docker Desktop
- Verifica que WSL2 está instalado y actualizado
- Revisa los logs de Docker Desktop
