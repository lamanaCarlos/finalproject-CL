# Guía de Pruebas - Frontend ArtMarket

**Fecha:** 26 de Enero, 2026

---

## 🚀 Iniciar Servidores

### Backend
```bash
cd backend
npm run dev
```
**URL:** http://localhost:4000

### Frontend
```bash
cd frontend
npm run dev
```
**URL:** http://localhost:5173

---

## ✅ Checklist de Pruebas

### 1. Páginas Públicas

#### HomePage (`/`)
- [ ] Página carga correctamente
- [ ] Hero section se muestra
- [ ] Galería aleatoria de obras se carga
- [ ] Obras se muestran en grid responsive
- [ ] Obras se mezclan aleatoriamente en cada carga
- [ ] Solo se muestran obras publicadas
- [ ] Botón "Ver Todas las Obras" funciona
- [ ] Navegación funciona
- [ ] Selector de idioma funciona
- [ ] Botones de login/register visibles

#### LoginPage (`/login`)
- [ ] Formulario carga correctamente
- [ ] Validación de campos funciona
- [ ] Login exitoso redirige correctamente
- [ ] Error de login muestra mensaje

#### RegisterPage (`/register`)
- [ ] Formulario carga correctamente
- [ ] Selección de rol funciona
- [ ] Validación de contraseña funciona
- [ ] Registro exitoso redirige correctamente

#### GalleryPage (`/gallery`)
- [ ] Obras se cargan correctamente
- [ ] Filtros funcionan (tipo, búsqueda)
- [ ] Paginación funciona
- [ ] Grid responsive
- [ ] Click en obra navega a detalle

#### ArtworkDetailPage (`/artwork/:id`)
- [ ] Información de obra se carga
- [ ] Galería de imágenes funciona
- [ ] Botón "Comprar ahora" visible
- [ ] Link a perfil de artista funciona

#### ArtistProfilePage (`/artist/:id`)
- [ ] Perfil del artista se carga
- [ ] Estadísticas se muestran
- [ ] Galería de obras funciona
- [ ] Enlaces sociales funcionan

---

### 2. Dashboards

#### BuyerDashboard (`/buyer/dashboard`)
- [ ] Requiere autenticación
- [ ] Estadísticas se muestran correctamente
- [ ] Lista de pedidos recientes funciona
- [ ] Lista de encargos recientes funciona
- [ ] Enlaces a sub-páginas funcionan

#### ArtistDashboard (`/artist/dashboard`)
- [ ] Requiere rol de artista
- [ ] Estadísticas se muestran correctamente
- [ ] Alerta de perfil pendiente (si aplica)
- [ ] Galería de obras funciona
- [ ] Enlaces a sub-páginas funcionan

#### AdminDashboard (`/admin/dashboard`)
- [ ] Requiere rol de admin
- [ ] Métricas se muestran correctamente
- [ ] Lista de artistas pendientes funciona
- [ ] Acciones rápidas funcionan

---

### 3. Sub-páginas Buyer

#### BuyerOrdersPage (`/buyer/orders`)
- [ ] Lista de pedidos se carga
- [ ] Cards muestran información correcta
- [ ] Enlaces a detalles funcionan
- [ ] Estado vacío se muestra si no hay pedidos

#### BuyerOrderDetailPage (`/buyer/orders/:id`)
- [ ] Detalle del pedido se carga
- [ ] Información de envío se muestra (si aplica)
- [ ] Resumen del pedido es correcto
- [ ] Botón de volver funciona

#### BuyerCommissionsPage (`/buyer/commissions`)
- [ ] Lista de encargos se carga
- [ ] Cards muestran información correcta
- [ ] Enlaces a detalles funcionan

#### BuyerCommissionDetailPage (`/buyer/commissions/:id`)
- [ ] Detalle del encargo se carga
- [ ] Mensajes se muestran (si hay)
- [ ] Resumen es correcto

---

### 4. Sub-páginas Artist

#### ArtistArtworksPage (`/artist/artworks`)
- [ ] Lista de obras se carga
- [ ] Grid responsive funciona
- [ ] Badges de estado correctos
- [ ] Botón "Crear Obra" funciona

#### ArtistCreateArtworkPage (`/artist/artworks/new`)
- [ ] Formulario carga correctamente
- [ ] Campos dinámicos según tipo funcionan
- [ ] Validación funciona
- [ ] Múltiples imágenes se pueden agregar
- [ ] Creación exitosa redirige

#### ArtistEditArtworkPage (`/artist/artworks/:id/edit`)
- [ ] Formulario carga con datos existentes
- [ ] Campos se prellenan correctamente
- [ ] Actualización funciona
- [ ] Redirección después de actualizar

#### ArtistOrdersPage (`/artist/orders`)
- [ ] Lista de pedidos se carga
- [ ] Ganancias se muestran correctamente
- [ ] Enlaces a detalles funcionan

#### ArtistOrderDetailPage (`/artist/orders/:id`)
- [ ] Detalle del pedido se carga
- [ ] Información del comprador se muestra
- [ ] Resumen con ganancias es correcto

#### ArtistCommissionsPage (`/artist/commissions`)
- [ ] Lista de encargos se carga
- [ ] Enlaces a detalles funcionan

#### ArtistCommissionDetailPage (`/artist/commissions/:id`)
- [ ] Detalle del encargo se carga
- [ ] Mensajes se muestran

#### ArtistProfileEditPage (`/artist/profile`)
- [ ] Formulario carga con datos existentes
- [ ] Campos se prellenan correctamente
- [ ] Actualización funciona
- [ ] Redirección después de actualizar

---

### 5. Sub-páginas Admin

#### AdminUsersPage (`/admin/users`)
- [ ] Lista de usuarios se carga
- [ ] Filtro por rol funciona
- [ ] Paginación funciona
- [ ] Enlaces a detalles funcionan

#### AdminUserDetailPage (`/admin/users/:id`)
- [ ] Detalle del usuario se carga
- [ ] Botón activar/desactivar funciona
- [ ] Notificación de éxito se muestra

#### AdminArtistsPage (`/admin/artists`)
- [ ] Lista de artistas se carga
- [ ] Filtro por estado funciona
- [ ] Indicador de pendientes funciona
- [ ] Paginación funciona

#### AdminArtistDetailPage (`/admin/artists/:id`)
- [ ] Detalle del artista se carga
- [ ] Estadísticas se muestran
- [ ] Botones de acción funcionan (Aprobar/Bloquear)
- [ ] Notificaciones funcionan

#### AdminArtworksPage (`/admin/artworks`)
- [ ] Lista de obras se carga
- [ ] Filtro por estado funciona
- [ ] Paginación funciona

#### AdminMetricsPage (`/admin/metrics`)
- [ ] Métricas se cargan correctamente
- [ ] Cards muestran valores correctos
- [ ] Enlaces rápidos funcionan

#### AdminSettingsPage (`/admin/settings`)
- [ ] Configuración se carga
- [ ] Formulario se prellena
- [ ] Actualización funciona
- [ ] Notificación de éxito se muestra

---

### 6. Componentes y Funcionalidades

#### Sidebar
- [ ] Se muestra en dashboards
- [ ] Navegación por rol funciona
- [ ] Menú móvil funciona
- [ ] Indicador de ruta activa funciona
- [ ] Overlay en móvil funciona

#### Header
- [ ] Navegación funciona
- [ ] Selector de idioma funciona
- [ ] Botones de auth funcionan
- [ ] Menú móvil funciona

#### Footer
- [ ] Enlaces funcionan
- [ ] Redes sociales funcionan

#### Internacionalización
- [ ] Cambio de idioma funciona
- [ ] Todas las páginas están traducidas
- [ ] Fechas se formatean correctamente

#### Autenticación
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Logout funciona
- [ ] Protección de rutas funciona
- [ ] Redirección según rol funciona

---

## 🧪 Pruebas de Integración

### Flujo Completo de Comprador
1. [ ] Registrarse como comprador
2. [ ] Explorar galería
3. [ ] Ver detalle de obra
4. [ ] (Simular compra - si está implementado)
5. [ ] Ver pedidos en dashboard
6. [ ] Ver detalle de pedido

### Flujo Completo de Artista
1. [ ] Registrarse como artista
2. [ ] Crear perfil artístico
3. [ ] Crear obra
4. [ ] Editar obra
5. [ ] Ver pedidos recibidos
6. [ ] Ver encargos recibidos

### Flujo Completo de Admin
1. [ ] Login como admin
2. [ ] Ver métricas
3. [ ] Revisar artistas pendientes
4. [ ] Aprobar artista
5. [ ] Ver lista de usuarios
6. [ ] Activar/Desactivar usuario
7. [ ] Actualizar configuración

---

## 🐛 Problemas Comunes

### Backend no responde
- Verificar que el servidor esté corriendo en puerto 4000
- Verificar conexión a MongoDB
- Revisar logs del backend

### Frontend no carga
- Verificar que Node.js sea v20.x o superior
- Verificar que todas las dependencias estén instaladas
- Revisar consola del navegador

### Errores de CORS
- Verificar configuración CORS en backend
- Verificar que el frontend use la URL correcta del backend

### Errores de autenticación
- Verificar que el token se guarde en localStorage
- Verificar que los interceptores funcionen
- Revisar expiración del token

---

## 📝 Notas

- **Credenciales de Prueba:**
  - Comprador: maria.garcia@email.com / Password123!
  - Artista: sofia.artista@email.com / Password123!
  - Admin: admin@marketplace.com / Admin123!

- **URLs:**
  - Frontend: http://localhost:5173
  - Backend: http://localhost:4000
  - API Base: http://localhost:4000/api

---

**Última actualización:** 26 de Enero, 2026
