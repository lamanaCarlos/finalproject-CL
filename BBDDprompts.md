# Prompts de Conversación - Implementación de Base de Datos

Este documento registra todos los prompts utilizados durante la creación e implementación de la base de datos del proyecto Marketplace de Arte.

---

## Prompt Principal - Inicio de Implementación

**Fecha:** 26 de Enero, 2026

**Prompt:**

```
Adopta el rol de un experto desarrollador full stack, con gran experiencia en base de datos.
Analiza toda la documentación de este proyecto para comprenderlo.
El objetivo es crear la base de datos con todos sus modelos ya preparados para siguientes fases de desarrollo, que seran la creación del Back end y despues el Front end, pero ahora solo nos centraremos en la creación de la base de datos.
Aplica buenas practicas de desarrollo:
- Diseñar esquemas con una indexación adecuada para un mejor rendimiento
- Utilizar canales de agregación de MongoDB para transformaciones de datos complejas
- Implementar un manejo adecuado de errores en las operaciones de bases de datos
- Seguir patrones de validación de datos tanto a nivel de aplicación como de base de datos
- Considerar los límites de tamaño de los documentos al diseñar esquemas
- Utilizar transacciones de MongoDB para operaciones que requieren atomicidad

Crea un plan paso a paso para ejecutar el objetivo.
Registra los prompts usados en esta conversación en un archivo BBDDprompts.md
Consulta todas las dudas que necesites.
```

---

## Análisis Realizado

### Documentación Revisada:
1. ✅ Plan del proyecto (0.plan_proyecto_marketplace_de_arte.md)
2. ✅ Modelo de datos (1.Modelo de datos.md)
3. ✅ API REST (2.api_rest_marketplace_de_arte.md)
4. ✅ Backlog y épicas (3.backlog epicas e historias de usuario.md)
5. ✅ Flujos de usuario (4.flujos_de_usuario_marketplace_de_arte.md)
6. ✅ Estructura del repositorio (5.estructura_del_repositorio_marketplace_de_arte.md)
7. ✅ Casos de uso (6.casos_de_uso_y_criterios_de_test_marketplace_de_arte.md)
8. ✅ Guía UX/UI (7.guia_ux_ui_y_componentes_marketplace_de_arte.md)
9. ✅ Aspectos legales (8.aspectos_legales_y_responsabilidad_marketplace_de_arte.md)
10. ✅ Plan de despliegue (9.plan_de_despliegue_y_entornos_marketplace_de_arte.md)
11. ✅ README.md
12. ✅ Prompts anteriores (prompts.md)

---

## Plan de Implementación Creado

Se creó el documento **PLAN_BBDD.md** con el plan detallado paso a paso que incluye:

### Fase 1: Análisis y Diseño
- Revisión de requerimientos
- Diseño de esquemas detallado

### Fase 2: Implementación de Modelos con Mongoose
- Configuración base de conexión
- Modelo User con hash de passwords
- Modelo ArtistProfile con relaciones
- Modelo Artwork con índices compuestos
- Modelo Order con cálculo de comisiones
- Modelo CommissionRequest con estados
- Modelo PlatformSettings (singleton)

### Fase 3: Optimizaciones y Buenas Prácticas
- Indexación estratégica
- Validaciones múltiples
- Middleware y hooks

### Fase 4: Agregaciones y Consultas Avanzadas
- Pipelines de agregación para galería
- Estadísticas de artistas
- Dashboard de administrador

### Fase 5: Transacciones y Atomicidad
- Operaciones atómicas para órdenes
- Gestión de encargos

### Fase 6: Scripts de Inicialización
- Seeders para datos iniciales
- Usuario administrador por defecto

### Fase 7: Documentación y Utilidades
- Manejo de errores centralizado
- Validadores reutilizables

---

## Archivos Creados

### Configuración
- ✅ `backend/src/config/database.js` - Configuración de conexión MongoDB

### Modelos
- ✅ `backend/src/models/User.js` - Modelo de usuarios
- ✅ `backend/src/models/ArtistProfile.js` - Modelo de perfiles de artista
- ✅ `backend/src/models/Artwork.js` - Modelo de obras
- ✅ `backend/src/models/Order.js` - Modelo de pedidos/ventas
- ✅ `backend/src/models/CommissionRequest.js` - Modelo de encargos
- ✅ `backend/src/models/PlatformSettings.js` - Configuración global
- ✅ `backend/src/models/index.js` - Exportación centralizada

### Utilidades
- ✅ `backend/src/utils/dbErrors.js` - Manejo de errores de BD
- ✅ `backend/src/utils/validators.js` - Validadores reutilizables
- ✅ `backend/src/utils/transactions.js` - Utilidades de transacciones

### Agregaciones
- ✅ `backend/src/aggregations/artwork.aggregations.js` - Pipelines de obras
- ✅ `backend/src/aggregations/artist.aggregations.js` - Pipelines de artistas
- ✅ `backend/src/aggregations/admin.aggregations.js` - Pipelines de admin

### Scripts
- ✅ `backend/src/scripts/seed.js` - Script de inicialización

### Configuración
- ✅ `backend/package.json` - Dependencias del proyecto
- ✅ `backend/.env.example` - Variables de entorno de ejemplo

### Documentación
- ✅ `PLAN_BBDD.md` - Plan detallado de implementación
- ✅ `backend/README_BBDD.md` - Documentación completa de la BD
- ✅ `BBDDprompts.md` - Este archivo

---

## Buenas Prácticas Implementadas

### 1. Indexación Estratégica
- ✅ Índices únicos para campos críticos (email, userId)
- ✅ Índices simples para búsquedas frecuentes (role, status, type)
- ✅ Índices compuestos para consultas complejas
- ✅ Índices de texto para búsquedas full-text

### 2. Validaciones Multi-nivel
- ✅ Validaciones a nivel de esquema (Mongoose)
- ✅ Validaciones a nivel de aplicación (middleware)
- ✅ Validaciones de negocio (pre-save hooks)

### 3. Seguridad
- ✅ Passwords hasheados con bcrypt (12 salt rounds)
- ✅ Campos sensibles excluidos por defecto
- ✅ Sanitización de datos de usuario

### 4. Transacciones
- ✅ Operaciones atómicas para creación de órdenes
- ✅ Gestión de estados con rollback automático
- ✅ Sesiones de MongoDB para consistencia

### 5. Agregaciones Optimizadas
- ✅ Pipelines eficientes para consultas complejas
- ✅ Proyección de campos para reducir transferencia
- ✅ Paginación en todas las consultas de listado

### 6. Manejo de Errores
- ✅ Manejo centralizado de errores de BD
- ✅ Formateo consistente para respuestas HTTP
- ✅ Mensajes de error descriptivos

### 7. Escalabilidad
- ✅ Estructura preparada para sharding
- ✅ Referencias en lugar de documentos embebidos
- ✅ Consideración de límites de MongoDB (16MB)

---

## Características Destacadas

### Modelo User
- Hash automático de passwords
- Método `comparePassword()` para autenticación
- Virtuals para verificar roles
- Índices optimizados para búsquedas por rol

### Modelo Artwork
- Validaciones condicionales según tipo (físico/digital)
- Índices compuestos para galería pública
- Búsqueda full-text en títulos y descripciones
- Método `markAsSold()` para actualización de estado

### Modelo Order
- Cálculo automático de comisiones y ganancias del artista
- Método estático `createOrder()` con cálculo de comisión
- Gestión de información de envío
- Índices para historial de compras y ventas

### Modelo CommissionRequest
- Sistema de estados completo
- Mensajes de negociación embebidos
- Métodos para gestión de estados (accept, reject, complete)
- Validación de fechas límite

### Modelo PlatformSettings
- Patrón singleton (un solo documento)
- Métodos estáticos para obtener/actualizar configuración
- Soporte para múltiples idiomas
- Flags de funcionalidades

---

## Dependencias Principales

```json
{
  "mongoose": "^8.0.0",
  "bcryptjs": "^2.4.3",
  "dotenv": "^16.3.1"
}
```

---

## Próximos Pasos Sugeridos

1. **Instalación de dependencias:**
   ```bash
   cd backend
   npm install
   ```

2. **Configuración de variables de entorno:**
   - Copiar `.env.example` a `.env`
   - Configurar `MONGO_URI`
   - Configurar credenciales de administrador

3. **Inicialización de base de datos:**
   ```bash
   npm run seed
   ```

4. **Integración con Backend:**
   - Crear controllers para cada modelo
   - Implementar routes de API REST
   - Agregar middleware de autenticación JWT
   - Implementar middleware de autorización por roles

5. **Testing:**
   - Tests unitarios de modelos
   - Tests de integración de transacciones
   - Tests de agregaciones

---

## Notas Finales

- ✅ Todos los modelos están completamente implementados
- ✅ Índices optimizados para rendimiento
- ✅ Validaciones robustas en múltiples niveles
- ✅ Transacciones para operaciones críticas
- ✅ Agregaciones preparadas para consultas complejas
- ✅ Manejo de errores centralizado
- ✅ Documentación completa

**La base de datos está lista para las siguientes fases de desarrollo (Backend y Frontend).**

---

## Actualización: Datos de Ejemplo

**Fecha:** 26 de Enero, 2026

Se actualizó el script de seed (`backend/src/scripts/seed.js`) para incluir datos de ejemplo completos para pruebas y desarrollo:

### Datos Incluidos:
- ✅ 1 usuario administrador
- ✅ 4 usuarios compradores
- ✅ 5 usuarios artistas
- ✅ 5 perfiles de artistas (4 aprobados, 1 pendiente)
- ✅ 12 obras de arte (8 físicas, 4 digitales) en diferentes estados
- ✅ 3 órdenes de ejemplo (incluyendo una obra vendida)
- ✅ 4 encargos personalizados en diferentes estados

### Características:
- Datos realistas pero inventados
- Cobertura de diferentes casos de uso
- Obras en diferentes estados (publicadas, borradores, vendidas)
- Encargos en diferentes estados (pendiente, aceptado, en progreso, completado)
- Perfil pendiente para pruebas de moderación
- Obra vendida para pruebas de historial

### Comandos:
- `npm run seed` - Crea/verifica datos (idempotente)
- `npm run seed:clear` - Limpia y recrea todos los datos (solo desarrollo)

### Documentación:
- ✅ `backend/DATOS_EJEMPLO.md` - Documentación detallada de todos los datos de ejemplo
- ✅ `backend/README_BBDD.md` - Actualizado con información de datos de ejemplo

**Todos los usuarios de prueba usan la contraseña:** `Password123!`

---

**Fecha de creación:** 26 de Enero, 2026  
**Última actualización:** 26 de Enero, 2026  
**Estado:** ✅ Completado (con datos de ejemplo)
