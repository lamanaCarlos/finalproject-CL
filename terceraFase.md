# Tercera Fase - Escalado, Monetización y Confianza

## Contexto (qué ya existe)
Según la documentación y el estado del MVP, la plataforma ya incluye:
- Autenticación y autorización JWT con roles (`buyer`, `artist`, `admin`).
- Publicación y gestión de obras (incluye subida de imágenes).
- Compra de obras y gestión de pedidos.
- Encargos personalizados con mensajería (flujo comprador/artista) y gestión de estados.
- Envíos (acuerdo y actualización del artista) para obras físicas.
- Panel de administración (moderación de artistas/obras, configuración de comisiones y métricas base).
- Internacionalización `ES/EN`.

## Objetivo de esta tercera fase
Convertir el MVP en una solución “lista para mercado” que:
- Aumente conversión (comprar con menos fricción y con método de pago real).
- Genere confianza (prueba social, certificados y claridad post-compra).
- Mejore la experiencia (notificaciones y comunicación más eficiente).
- Escale a nuevos mercados (idiomas, monedas, cumplimiento legal y operación).

## Principales mejoras a introducir

### 1) Pagos reales + estado de pago consistente (P0)
**Por qué:** actualmente el flujo de compra existe, pero la documentación de pruebas/roadmap no refleja una pasarela de pago (Stripe/PayPal, webhooks, etc.). Para un marketplace real, el pago debe ser verificable, registrable y reversible.

**Qué mejorar:**
- Integrar una pasarela de pago (recomendado Stripe; alternativa PayPal) con `paymentIntent`/`checkout` para compras digitales y físicas.
- Añadir estados de orden relacionados a pago: `payment_pending`, `payment_succeeded`, `payment_failed`, `refunded` (o equivalentes).
- “Liberación” de la descarga/licencia digital solo tras pago confirmado (webhook como fuente de verdad).
- Soportar reintentos y conciliación (idempotencia) en webhooks.
- Flujo de reembolso/cancelación con reglas claras para buyer/artist (al menos: cuándo es posible y cómo se notifica).

**Entregables:**
- Endpoints/servicios de pago y persistencia de IDs de proveedor (ej. `stripePaymentIntentId`, `chargeId`).
- Webhook(s) validados por firma.
- UI de comprador con resumen de pago y estado final.
- UI de artista con notificación/estado cuando el pago se confirme.

**Resultado esperado en mercado:**
- Mayor conversión por reducción de fricción y por credibilidad (“pagos reales”).
- Menos disputas y soporte al tener trazabilidad del pago.

**Métricas a definir:**
- Tasa de conversión `detalle de obra -> compra completada`.
- % de pagos fallidos por causa (y su reducción tras iteraciones).
- Tiempo medio desde “checkout” a “pago confirmado”.

---

### 2) Certificados de autenticidad / licencia (P0)
**Por qué:** el roadmap ya menciona certificados; son un diferenciador claro para el mercado del arte y elevan la percepción de valor.

**Qué mejorar:**
- Para cada compra (digital o física) generar un “documento de autenticidad/licencia” asociado a la orden.
- Para digitales: especificar licencia (personal/comercial, y alcance) y permitir descarga posterior al pago.
- Para físicas: incluir al menos metadatos verificables (ID de orden, artista, obra, fecha) y opcionalmente un PDF descargable.

**Entregables:**
- Modelo de datos para `certificate` ligado a `orderId` (y/o a `artworkId` con versionado).
- Endpoint para descargar certificados/licencias.
- UI en el `OrderDetailPage` del comprador y en vistas de artista (histórico).

**Resultado esperado en mercado:**
- Aumento de confianza y valor percibido (mejor conversión y ticket medio).
- Menos “dudas” post-compra y mejor reputación de plataforma.

---

### 3) Reseñas y valoraciones post-entrega (P1)
**Por qué:** el marketplace necesita “social proof” para competir. Sin reviews, el riesgo percibido frena a nuevos compradores.

**Qué mejorar:**
- Permitir que el buyer deje una reseña tras `payment_succeeded` y (para físicas) tras `shipping_sent` (o tras confirmación de entrega, si se implementa).
- Validación de que solo buyers con compra válida puedan reseñar.
- Moderación mínima (reporting o reglas básicas) para evitar abuso.

**Entregables:**
- Modelo `Review` (score, texto, fecha, orderId).
- Endpoints: crear/revisar, y listar reseñas por artista/obra (con paginación).
- UI: sección de reseñas en `ArtworkDetailPage` y en `ArtistProfilePage`.

**Resultado esperado en mercado:**
- Mejora de conversión en obras de artistas nuevos/menos conocidos.
- Retención mayor por “comunidad” y señal de calidad.

---

### 4) Notificaciones y mensajería más fiable (P1)
**Por qué:** la guía de pruebas y el estado del proyecto mencionan “notificaciones” como pendiente/no cubierto en checklist final. Además, el chat actual se apoya en actualizaciones por petición; para el mercado, la inmediatez es clave.

**Qué mejorar:**
- Notificaciones (mínimo): UI con “eventos” y contador (por ejemplo `pending`, `accepted/rejected`, `shipping updated`, `payment confirmed`).
- Mejorar el sistema de mensajería en encargos:
  - A corto plazo: refuerzo del flujo HTTP con “mark as read” y refresco robusto.
  - A medio plazo: WebSockets o SSE para envío y lectura en tiempo real.

**Entregables:**
- Modelo/endpoint de notificaciones (o integración con eventos ya existentes de orders/commissions).
- UI de centro de notificaciones y avisos contextuales en dashboards.

**Resultado esperado en mercado:**
- Menos tiempo de espera entre partes (buyer/artist).
- Menor tasa de cancelación de encargos por desinformación.

---

### 5) Internacionalización para mercado real: idiomas + monedas + formatos (P1)
**Por qué:** la documentación actual cubre `ES/EN`, pero para expansión internacional se requiere:
- moneda (precio por país),
- formato de fecha/cantidad,
- (y potencialmente) adaptación de impuestos/envíos.

**Qué mejorar:**
- Añadir soporte multi-moneda (aunque sea con una estrategia inicial: precios en una moneda con conversión o conversión por país).
- Normalizar formatos en UI (moneda, fecha, unidades).
- Preparar pipeline para ampliar idiomas sin retrabajo grande:
  - estrategia de llaves i18n,
  - validación de cobertura,
  - fallback por idioma.

**Entregables:**
- Configuración de locale por usuario.
- Adaptación de UI para precios/formatos.
- (Opcional) administración para habilitar monedas/idiomas.

**Resultado esperado en mercado:**
- Expansión a nuevos países con menor fricción.
- Menos tickets de soporte por “precio raro” o formatos inconsistentes.

---

### 6) Premium features (P2, opcional por foco de lanzamiento)
**Por qué:** el roadmap contempla premium; es la forma de monetizar la plataforma más allá de la comisión mínima.

**Qué premium tiene sentido para artistas (ejemplos):**
- “Boost” de obras (visibilidad por periodo).
- Estadísticas avanzadas de conversiones/visitas.
- Validación/verificación de perfil (no necesariamente KYC completo; al menos “verified by admin”).
- Plantillas de portfolio y kit de promoción.

**Entregables:**
- Modelo de suscripción/estado premium (simple al inicio).
- UI en dashboard artista para activar/gestionar premium.
- Ajustes de backend para aplicar reglas (visibilidad, acceso a métricas avanzadas).

**Resultado esperado en mercado:**
- Aumento de ARPU (ingreso medio por usuario artista).
- Atraer “power users” que impulsan el catálogo.

---

### 7) Mobile-first / app móvil (P2, por estrategia de recursos)
**Por qué:** el roadmap menciona app móvil; pero suele depender del éxito de monetización y del feedback inicial.

**Estrategia recomendada:**
- Empezar con PWA (si no hay recursos para React Native todavía).
- Desarrollar primero lo más crítico: browse, detalle, compra y estado de pedidos.

**Resultado esperado en mercado:**
- Incremento de tráfico desde móviles.
- Mejor retención y engagement.

---

### 8) Cumplimiento legal “accionable” (P1)
**Por qué:** ya hay un documento legal base, pero para operar en producción hace falta convertirlo en mecanismos (no solo texto).

**Qué mejorar:**
- Términos de uso, privacidad y cookies como documentos publicables (y revisados por legal).
- GDPR: implementar funciones reales:
  - exportación de datos (al menos a nivel de perfil/órdenes),
  - eliminación/borrado cuando aplique,
  - retención y base legal registrada.
- Consentimiento de cookies (si aplica analítica) y transparencia de tracking.

**Entregables:**
- Endpoints o flujos para solicitudes GDPR.
- Sección legal en UI y políticas accesibles.

**Resultado esperado en mercado:**
- Reduce riesgo de bloqueo en mercados y facilita expansión internacional.
- Confianza: compradores y artistas más dispuestos a registrarse.

---

### 9) “Growth” para el marketplace: favoritos/seguimiento y descubrimiento (P2)
**Por qué:** aumentar retención y recurrencia depende de que buyer y artista tengan “señales” de continuidad (volver, guardar, seguir).

**Qué mejorar:**
- Favoritos de obras (guardar para más tarde).
- Seguimiento de artistas (notificaciones cuando publiquen o tengan actividad).
- Recomendaciones básicas (por historial de navegación/compra y categoría/estilo).

**Entregables:**
- Modelo/relación simple `Favorite` y `Follow`.
- Endpoints para crear/listar y UI en `ArtworkCard`, `ArtworkDetailPage` y `ArtistProfilePage`.

**Resultado esperado en mercado:**
- Incremento de visitas recurrentes.
- Mayor probabilidad de compra repetida.
- Mejor descubrimiento de artistas menos conocidos.

---

## Priorización sugerida (para guiar sprints)
- P0: Pagos + certificados/licencias.
- P1: Reseñas + notificaciones/tiempo de respuesta + internacionalización real (formatos/moneda) + GDPR accionable.
- P2: Premium + app/PWA.

## Riesgos y dependencias (para no “patinar” en tercera fase)
- Pasarela de pagos requiere coordinación técnica con webhooks y estados de orden.
- Certificados/licencias necesitan definición legal de alcance de licencia (colaboración legal).
- Reseñas implican moderación y prevención de abuso.
- WebSockets/SSE requiere asegurar escalabilidad y fallbacks (si se implementa).
- Multi-moneda/taxes puede requerir decisiones de negocio (estrategia inicial vs expansión).

## Posibles resultados a futuro (aplicado al mercado)
- Aumento de conversión por pagos reales, transparencia y reducción de fricción.
- Mejora del “trust score” del marketplace (certificados + reviews).
- Mayor tasa de finalización de encargos (notificaciones y comunicación más rápida).
- Expansión geográfica más eficiente al soportar formatos y monetización coherente por país.
- Diferenciación frente a marketplaces genéricos por enfoque en autoría, licencias y autenticidad.
- Crecimiento sostenible vía premium (cuando se valide el producto y la demanda).

---

## 10) Analítica accionable (P1)
**Por qué:** para que la tercera fase no sea “solo features”, hay que medir y aprender (A/B tests, embudos, drop-offs).

**Qué mejorar:**
- Eventos estandarizados: visita, apertura de detalle, clic en compra, checkout iniciado, pago confirmado/fallido, descarga de licencia/certificado, inicio y final de comisión.
- Panel de embudos (buyer) y actividad (artist).
- Correlación con idioma/moneda para identificar fricción por mercado.

**Entregables:**
- Sistema de tracking en frontend.
- Recolección en backend (o proveedor) con identificación de usuario y orden.
- Métricas operativas para QA de pagos/webhooks.

**Resultado esperado en mercado:**
- Iteraciones más rápidas y reducción del “tiempo hasta mejorar”.
- Optimización del gasto en adquisición (cuando el canal de marketing exista).

---

## Próximo paso recomendado
Convertir estas mejoras en un plan de sprints con:
- definición de historias por P0/P1,
- criterios de aceptación medibles,
- plan de QA específico (incluyendo pruebas de pago y estados de webhook),
- y dependencias legales.

