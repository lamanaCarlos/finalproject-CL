# Datos de Ejemplo - Marketplace de Arte

Este documento describe los datos de ejemplo que se crean al ejecutar el script de seed. Estos datos están diseñados para facilitar el desarrollo y las pruebas del sistema.

---

## 👥 Usuarios de Ejemplo

### Administrador
- **Email:** admin@marketplace.com
- **Password:** Admin123!
- **Rol:** admin
- **Estado:** Activo

### Compradores (4 usuarios)
Todos con password: `Password123!`

1. **maria.garcia@email.com** - Comprador
2. **juan.rodriguez@email.com** - Comprador
3. **ana.martinez@email.com** - Comprador
4. **carlos.lopez@email.com** - Comprador

### Artistas (5 usuarios)
Todos con password: `Password123!`

1. **sofia.artista@email.com** - Artista
2. **diego.pintor@email.com** - Artista
3. **laura.creativa@email.com** - Artista
4. **miguel.art@email.com** - Artista
5. **elena.diseno@email.com** - Artista

---

## 🎨 Perfiles de Artistas

### 1. Sofía Martínez
- **Estado:** Aprobado
- **Nombre artístico:** Sofía Martínez
- **Bio:** Artista contemporánea especializada en pintura abstracta y arte digital
- **Instagram:** @sofiamartinez
- **Web:** https://sofiamartinez.art
- **Obras:** 3 obras (2 publicadas, 1 borrador)

### 2. Diego Rivera Art
- **Estado:** Aprobado
- **Nombre artístico:** Diego Rivera Art
- **Bio:** Pintor realista con más de 15 años de experiencia
- **Instagram:** @diegoriveraart
- **Web:** https://diegorivera.art
- **Obras:** 3 obras (2 publicadas, 1 vendida)

### 3. Laura Creativa
- **Estado:** Aprobado
- **Nombre artístico:** Laura Creativa
- **Bio:** Artista digital y diseñadora gráfica
- **Instagram:** @lauracreativa
- **Web:** https://lauracreativa.com
- **Obras:** 2 obras digitales (ambas publicadas)

### 4. Miguel Escultor
- **Estado:** Aprobado
- **Nombre artístico:** Miguel Escultor
- **Bio:** Escultor especializado en bronce y mármol
- **Instagram:** @miguelescultor
- **Web:** https://miguelescultor.es
- **Obras:** 2 esculturas físicas (ambas publicadas)

### 5. Elena Diseño
- **Estado:** Pendiente (para pruebas de moderación)
- **Nombre artístico:** Elena Diseño
- **Bio:** Ilustradora y artista gráfica
- **Instagram:** @elenadiseno
- **Web:** https://elenadiseno.com
- **Obras:** 2 obras (1 publicada, 1 borrador)

---

## 🖼️ Obras de Arte (12 obras)

### Obras Físicas (8 obras)

#### Sofía Martínez
1. **Aurora Abstracta** - €450
   - Estado: Publicada
   - Tipo: Física
   - Técnica: Acrílico y óleo sobre lienzo
   - Dimensiones: 60x80 cm
   - Peso: 2.5 kg

2. **Noche Estrellada Moderna** - €680
   - Estado: Borrador
   - Tipo: Física
   - Técnica: Óleo sobre lienzo
   - Dimensiones: 80x100 cm
   - Peso: 3.2 kg

#### Diego Rivera Art
3. **Retrato Urbano** - €320
   - Estado: Publicada
   - Tipo: Física
   - Técnica: Carboncillo y grafito
   - Dimensiones: 50x70 cm
   - Peso: 0.8 kg

4. **Paisaje de Montaña** - €550
   - Estado: Publicada
   - Tipo: Física
   - Técnica: Óleo sobre lienzo
   - Dimensiones: 70x90 cm
   - Peso: 2.8 kg

5. **Ciudad al Atardecer** - €280
   - Estado: **Vendida** ✅
   - Tipo: Física
   - Técnica: Acuarela
   - Dimensiones: 40x60 cm
   - Peso: 0.5 kg

#### Miguel Escultor
6. **Busto de Mujer** - €1,200
   - Estado: Publicada
   - Tipo: Física
   - Técnica: Bronce patinado
   - Dimensiones: 35x25x20 cm
   - Peso: 8.5 kg

7. **Forma Orgánica** - €1,800
   - Estado: Publicada
   - Tipo: Física
   - Técnica: Mármol de Carrara
   - Dimensiones: 40x30x25 cm
   - Peso: 12 kg

### Obras Digitales (4 obras)

#### Sofía Martínez
8. **Digital Dreams** - €120
   - Estado: Publicada
   - Tipo: Digital
   - Formato: PNG
   - Resolución: 3000x4000px

#### Laura Creativa
9. **NFT Collection: Cosmic Dreams** - €250
   - Estado: Publicada
   - Tipo: Digital
   - Formato: PNG
   - Resolución: 4K (3840x2160px)
   - Idioma: Inglés

10. **Surreal Landscape** - €95
    - Estado: Publicada
    - Tipo: Digital
    - Formato: JPG
    - Resolución: 5000x3000px
    - Idioma: Inglés

#### Elena Diseño
11. **Ilustración Editorial: Naturaleza** - €150
    - Estado: Publicada
    - Tipo: Digital
    - Formato: SVG, PNG
    - Resolución: Vectorial + 3000x3000px

12. **Serie de Retratos** - €200
    - Estado: Borrador
    - Tipo: Digital
    - Formato: PNG
    - Resolución: 3000x3000px cada uno

---

## 📦 Órdenes de Ejemplo (3 órdenes)

### Orden 1: Ciudad al Atardecer (Vendida)
- **Comprador:** maria.garcia@email.com
- **Obra:** Ciudad al Atardecer (Diego Rivera Art)
- **Precio:** €280
- **Comisión (10%):** €28
- **Ganancias del artista:** €252
- **Tipo:** Física
- **Estado de envío:** Acordado
- **Dirección:** Calle Ejemplo 123, Madrid, España
- **Método de envío:** Correos Express
- **Costo de envío:** €15

### Orden 2: Retrato Urbano
- **Comprador:** juan.rodriguez@email.com
- **Obra:** Retrato Urbano (Diego Rivera Art)
- **Precio:** €320
- **Comisión (10%):** €32
- **Ganancias del artista:** €288
- **Tipo:** Física
- **Estado de envío:** Pendiente

### Orden 3: Digital Dreams
- **Comprador:** ana.martinez@email.com
- **Obra:** Digital Dreams (Sofía Martínez)
- **Precio:** €120
- **Comisión (10%):** €12
- **Ganancias del artista:** €108
- **Tipo:** Digital
- **Estado de envío:** N/A

---

## 🎯 Encargos Personalizados (4 encargos)

### Encargo 1: Retrato Familiar
- **Comprador:** maria.garcia@email.com
- **Artista:** sofia.artista@email.com
- **Título:** Retrato Familiar
- **Presupuesto:** €500
- **Estado:** Pendiente
- **Plazo:** 30 días

### Encargo 2: Ilustración para Libro
- **Comprador:** juan.rodriguez@email.com
- **Artista:** diego.pintor@email.com
- **Título:** Ilustración para Libro
- **Presupuesto:** €1,500
- **Precio acordado:** €1,400
- **Estado:** Aceptado
- **Plazo:** 60 días

### Encargo 3: Logo Personalizado
- **Comprador:** ana.martinez@email.com
- **Artista:** laura.creativa@email.com
- **Título:** Logo Personalizado
- **Presupuesto:** €300
- **Precio acordado:** €280
- **Estado:** En progreso
- **Plazo:** 14 días

### Encargo 4: Mural Interior
- **Comprador:** carlos.lopez@email.com
- **Artista:** miguel.art@email.com
- **Título:** Mural Interior
- **Presupuesto:** €2,000
- **Precio acordado:** €1,900
- **Estado:** Completado
- **Plazo:** 45 días

---

## 📊 Estadísticas de los Datos

### Por Estado de Obras
- **Publicadas:** 9 obras
- **Borradores:** 2 obras
- **Vendidas:** 1 obra

### Por Tipo de Obra
- **Físicas:** 8 obras
- **Digitales:** 4 obras

### Por Idioma
- **Español:** 10 obras
- **Inglés:** 2 obras

### Por Estado de Perfiles de Artistas
- **Aprobados:** 4 perfiles
- **Pendientes:** 1 perfil

### Por Estado de Encargos
- **Pendientes:** 1 encargo
- **Aceptados:** 1 encargo
- **En progreso:** 1 encargo
- **Completados:** 1 encargo

---

## 🧪 Casos de Uso para Pruebas

### Autenticación
- ✅ Login con diferentes roles (admin, buyer, artist)
- ✅ Registro de nuevos usuarios
- ✅ Validación de credenciales

### Perfiles de Artistas
- ✅ Ver perfil público de artista aprobado
- ✅ Ver perfil pendiente (solo admin)
- ✅ Editar perfil propio (artista)
- ✅ Moderación de perfiles (admin)

### Obras de Arte
- ✅ Listar galería pública (solo publicadas)
- ✅ Ver detalle de obra
- ✅ Filtrar por tipo (físico/digital)
- ✅ Filtrar por precio
- ✅ Filtrar por artista
- ✅ Búsqueda de texto
- ✅ Crear nueva obra (artista)
- ✅ Editar obra propia
- ✅ Publicar/despublicar obra
- ✅ Marcar como vendida

### Compras
- ✅ Comprar obra disponible
- ✅ Ver historial de compras (comprador)
- ✅ Ver ventas realizadas (artista)
- ✅ Gestionar envío de obra física

### Encargos
- ✅ Solicitar encargo (comprador)
- ✅ Ver encargos recibidos (artista)
- ✅ Aceptar/rechazar encargo
- ✅ Negociar precio
- ✅ Agregar mensajes
- ✅ Marcar como en progreso
- ✅ Completar encargo

### Administración
- ✅ Ver métricas globales
- ✅ Moderar artistas
- ✅ Configurar comisiones
- ✅ Ver estadísticas de ventas

---

## 🔄 Regenerar Datos

Para limpiar y recrear todos los datos de ejemplo:

```bash
npm run seed:clear
```

⚠️ **Importante:** Este comando solo funciona en modo desarrollo.

---

## 📝 Notas

- Todos los usuarios de prueba usan la contraseña: `Password123!`
- Las imágenes son URLs de ejemplo (Unsplash)
- Los precios están en euros (€)
- La comisión por defecto es del 10%
- Los datos se crean de forma idempotente (no se duplican si ya existen)

---

**Última actualización:** 26 de Enero, 2026
