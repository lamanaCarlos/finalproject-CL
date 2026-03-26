# Plan Paso a Paso - Implementación Inmediata (Máximo Valor)

Este plan está pensado para **empezar ya** con lo más pertinente del proyecto, priorizando impacto real en negocio y viabilidad técnica con el stack actual.

## Objetivo inmediato (4 bloques)
1. **Pagos reales + estados de pago fiables**.
2. **Certificados/licencias automáticos post-pago**.
3. **Reseñas verificadas por compra**.
4. **Notificaciones básicas in-app**.

---

## Orden de implementación (secuencial)

## Paso 1 - Congelar reglas de negocio (1-2 días)
Antes de tocar código:

- Definir estados finales de `Order`:
  - `payment_pending`, `payment_succeeded`, `payment_failed`, `refunded`.
- Definir regla de oro:
  - **solo webhook confirmado cambia a `payment_succeeded`**.
- Definir quién puede hacer qué:
  - Buyer: pagar, descargar certificado, reseñar compra.
  - Artist: ver estado de pago y certificados de sus ventas.

**Entregable**
- Documento corto de reglas (`README` técnico o sección en plan).

---

## Paso 2 - Implementar pagos reales (backend primero) (3-5 días)

### 2.1 Crear módulo de pagos
- Añadir servicio `payment.service` (adaptador Stripe).
- Añadir endpoints:
  - `POST /api/payments/create-intent` (buyer autenticado).
  - `POST /api/webhooks/stripe` (sin auth, con firma validada).

### 2.2 Persistencia
- En `Order` (o entidad `Payment`) guardar:
  - `provider`, `providerPaymentId`, `amount`, `currency`, `status`, `lastWebhookEventId`.

### 2.3 Idempotencia + seguridad
- Ignorar webhook repetido usando `lastWebhookEventId`.
- Validar firma Stripe obligatoriamente.
- Logging estructurado para cada transición.

**Entregable**
- Pago sandbox funcional de extremo a extremo (API).

---

## Paso 3 - Integrar pagos en frontend (2-3 días)

### 3.1 Flujo comprador
- En `ArtworkDetailPage`:
  - botón comprar -> crear `payment intent` -> redirigir a checkout.
- Crear vista de resultado:
  - `Pago exitoso`, `Pago fallido`, `Pago en proceso`.

### 3.2 Estado de pedido claro
- En `OrderDetailPage` mostrar:
  - estado de pago,
  - fecha de confirmación,
  - mensajes accionables.

**Entregable**
- Usuario puede completar compra real en sandbox y ver estado final.

---

## Paso 4 - Certificados/licencias post-pago (2-3 días)

### 4.1 Modelo de certificado
- Crear entidad `Certificate` con:
  - `orderId`, `artworkId`, `artistId`, `buyerId`,
  - `certificateType` (`digital_license` | `authenticity`),
  - `issuedAt`, `terms`, `version`.

### 4.2 Generación automática
- Al recibir `payment_succeeded` por webhook:
  - generar certificado/licencia.

### 4.3 Exposición en UI
- En detalle de pedido:
  - botón `Ver/Descargar certificado`.

**Entregable**
- Toda compra confirmada tiene certificado disponible.

---

## Paso 5 - Reseñas verificadas (2-3 días)

### 5.1 Reglas
- Solo buyer con compra pagada puede reseñar.
- Una reseña por `orderId`.

### 5.2 Backend
- Crear entidad `Review`.
- Endpoints:
  - `POST /api/reviews`,
  - `GET /api/reviews/artworks/:artworkId`,
  - `GET /api/reviews/artists/:artistId`.

### 5.3 Frontend
- Formulario de reseña en pedido completado.
- Mostrar reseñas en obra y perfil de artista.

**Entregable**
- Sistema de social proof funcional y confiable.

---

## Paso 6 - Notificaciones in-app v1 (2-3 días)

### 6.1 Backend
- Crear entidad `Notification`:
  - `userId`, `type`, `title`, `message`, `isRead`, `createdAt`.
- Endpoints:
  - `GET /api/notifications`,
  - `PATCH /api/notifications/:id/read`,
  - `GET /api/notifications/unread-count`.

### 6.2 Disparadores mínimos
- Pago confirmado/fallido.
- Encargo aceptado/rechazado.
- Envío actualizado.

### 6.3 Frontend
- Campana en header/dashboard.
- Panel de notificaciones y marcado como leído.

**Entregable**
- Buyer y artist reciben avisos clave sin fricción.

---

## Paso 7 - QA y hardening (2-3 días)

- Revisar regresión de flujos existentes:
  - login, compra, pedidos, encargos, envío.
- Verificar errores de red y UX de fallback.
- Revisar rate limiting y logs de endpoints críticos.
- Ajustar copy/mensajes de error.

**Entregable**
- Release candidate estable.

---

## Tests obligatorios para esta implementación

## A) Pagos
### Unitarios (backend)
- Crea payment intent con datos correctos.
- Webhook `succeeded` cambia estado correcto.
- Webhook duplicado no duplica transición.

### Integración (backend)
- `POST /payments/create-intent` retorna `clientSecret`.
- `POST /webhooks/stripe` con firma inválida -> `400`.
- `POST /webhooks/stripe` válido -> `payment_succeeded`.

### E2E
- Buyer completa pago sandbox y orden queda pagada.
- Fallo de pago muestra estado y mensaje correcto.

## B) Certificados
### Unitarios
- Generador de certificado produce campos requeridos.

### Integración
- Pago confirmado crea `Certificate`.
- Usuario no propietario no puede descargar certificado.

### E2E
- Buyer ve/descarga certificado tras compra exitosa.

## C) Reseñas
### Unitarios
- Bloquea reseña sin compra verificada.
- Bloquea segunda reseña para mismo `orderId`.

### Integración
- `POST /reviews` con orden válida -> `201`.
- `POST /reviews` duplicada -> `409`.

### E2E
- Buyer publica reseña y se visualiza en detalle de obra.

## D) Notificaciones
### Unitarios
- Evento de negocio crea notificación esperada.

### Integración
- `GET /notifications` lista por usuario autenticado.
- `PATCH /notifications/:id/read` marca como leído.

### E2E
- Cambio de estado en encargo/envío dispara notificación visible.

---

## Buenas prácticas mínimas (obligatorias)

- No acoplar lógica Stripe en controladores (usar servicio).
- Webhook como fuente de verdad para estado de pago.
- Idempotencia por evento externo.
- Validación de entrada en todos los endpoints nuevos.
- Errores API consistentes.
- Logs estructurados de eventos críticos.
- Tests en CI antes de merge.

---

## Checklist de salida (go-live interno)

- [ ] Pago real sandbox funcionando.
- [ ] Estado de orden consistente con webhook.
- [ ] Certificado/licencia generado y accesible.
- [ ] Reseñas verificadas operativas.
- [ ] Notificaciones in-app operativas.
- [ ] Sin errores críticos en regresión.
- [ ] Documentación y guía de pruebas actualizadas.

---

## Resumen ejecutivo (qué hacer mañana)
1. Implementar backend de pagos + webhook.
2. Conectar checkout frontend y estados de pedido.
3. Generar certificados al confirmar pago.
4. Activar reseñas verificadas.
5. Activar notificaciones in-app.
6. Ejecutar tests y cerrar release interno.

