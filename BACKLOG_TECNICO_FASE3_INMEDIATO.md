# Backlog Técnico Fase 3 (Implementación Inmediata)

Backlog orientado a ejecución directa en código, dividido por backend/frontend y por pruebas.

## Prioridad de ejecución
- **P0** Pagos + webhook + estado de orden.
- **P0** Certificados/licencias post-pago.
- **P1** Reseñas verificadas.
- **P1** Notificaciones in-app v1.

---

## 1) Backend - Tareas por archivo

## 1.1 Pagos (P0)

### `backend/src/models/Order.js`
- [ ] Añadir campos de pago:
  - `paymentStatus` (`pending|succeeded|failed|refunded`)
  - `paymentProvider`
  - `providerPaymentId`
  - `paymentAmount`
  - `paymentCurrency`
  - `paymentConfirmedAt`
  - `lastWebhookEventId`
- [ ] Añadir índices por `paymentStatus`, `providerPaymentId`.

### `backend/src/services/payment.service.js` (nuevo)
- [ ] Crear servicio Stripe:
  - `createPaymentIntent(order, user)`
  - `verifyWebhookSignature(rawBody, signature)`
  - `mapStripeEventToStatus(event)`
- [ ] Implementar capa adaptadora para evitar acoplar Stripe en controladores.

### `backend/src/controllers/payment.controller.js` (nuevo)
- [ ] `createPaymentIntent`:
  - valida autenticación buyer
  - valida que orden exista y pertenezca al buyer
  - valida que no esté pagada
  - crea intent y retorna `clientSecret`.
- [ ] `handleStripeWebhook`:
  - valida firma
  - procesa eventos relevantes
  - aplica idempotencia por `event.id`.

### `backend/src/routes/payment.routes.js` (nuevo)
- [ ] `POST /api/payments/create-intent`
- [ ] `POST /api/payments/webhook/stripe` (raw body)

### `backend/src/app.js`
- [ ] Registrar rutas de pagos.
- [ ] Configurar raw body solo para webhook Stripe.

### `backend/src/validators/payment.validators.js` (nuevo)
- [ ] Validar `orderId`.
- [ ] Validar payload mínimo en endpoints.

---

## 1.2 Certificados/Licencias (P0)

### `backend/src/models/Certificate.js` (nuevo)
- [ ] Crear esquema:
  - `orderId`, `artworkId`, `artistId`, `buyerId`
  - `type` (`authenticity|digital_license`)
  - `terms`
  - `issuedAt`
  - `version`
  - `downloadUrl` (si aplica)
- [ ] Índices por `orderId`, `buyerId`, `artistId`.

### `backend/src/services/certificate.service.js` (nuevo)
- [ ] `issueCertificateFromOrder(order)`
- [ ] `buildCertificatePayload(order, artwork, users)`
- [ ] Regla: solo si `paymentStatus === succeeded`.

### `backend/src/controllers/certificate.controller.js` (nuevo)
- [ ] `getMyCertificateByOrder`
- [ ] `downloadCertificate` (si se expone archivo/PDF)
- [ ] Control de acceso buyer/artist/admin.

### `backend/src/routes/certificate.routes.js` (nuevo)
- [ ] `GET /api/certificates/order/:orderId`
- [ ] `GET /api/certificates/:id/download` (opcional)

### `backend/src/app.js`
- [ ] Registrar rutas de certificados.

---

## 1.3 Reseñas verificadas (P1)

### `backend/src/models/Review.js` (nuevo)
- [ ] Campos:
  - `orderId`, `artworkId`, `artistId`, `buyerId`
  - `rating` (1-5)
  - `comment`
  - `createdAt`, `updatedAt`
- [ ] Índice único compuesto `orderId + buyerId`.

### `backend/src/services/review.service.js` (nuevo)
- [ ] `canUserReviewOrder(userId, orderId)`:
  - compra pagada + propiedad.
- [ ] `createReview(payload)`
- [ ] `getReviewsByArtwork(artworkId, pagination)`
- [ ] `getReviewsByArtist(artistId, pagination)`

### `backend/src/controllers/review.controller.js` (nuevo)
- [ ] `createReview`
- [ ] `getArtworkReviews`
- [ ] `getArtistReviews`

### `backend/src/routes/review.routes.js` (nuevo)
- [ ] `POST /api/reviews`
- [ ] `GET /api/reviews/artworks/:artworkId`
- [ ] `GET /api/reviews/artists/:artistId`

### `backend/src/validators/review.validators.js` (nuevo)
- [ ] Validar `rating`, `comment`, `orderId`.

---

## 1.4 Notificaciones in-app v1 (P1)

### `backend/src/models/Notification.js` (nuevo)
- [ ] Campos:
  - `userId`
  - `type`
  - `title`
  - `message`
  - `entityType`, `entityId`
  - `isRead`
  - `createdAt`
- [ ] Índices por `userId`, `isRead`, `createdAt`.

### `backend/src/services/notification.service.js` (nuevo)
- [ ] `createNotification(payload)`
- [ ] `notifyPaymentStatusChange(order)`
- [ ] `notifyCommissionStatusChange(commission)`
- [ ] `notifyShippingStatusChange(order)`

### `backend/src/controllers/notification.controller.js` (nuevo)
- [ ] `getMyNotifications`
- [ ] `markAsRead`
- [ ] `getUnreadCount`

### `backend/src/routes/notification.routes.js` (nuevo)
- [ ] `GET /api/notifications`
- [ ] `PATCH /api/notifications/:id/read`
- [ ] `GET /api/notifications/unread-count`

### Integración de eventos (archivos existentes)
- [ ] `order.controller.js`: disparar notificación al cambiar envío/pago.
- [ ] `commission.controller.js`: disparar notificación al aceptar/rechazar/actualizar.

---

## 2) Frontend - Tareas por archivo

## 2.1 Pagos (P0)

### `frontend/src/types/order.types.ts`
- [ ] Añadir tipado de `paymentStatus`, `paymentProvider`, `paymentCurrency`, etc.

### `frontend/src/services/api/payment.api.ts` (nuevo)
- [ ] `createPaymentIntent(orderId)`
- [ ] `handlePaymentReturn(params)` (si aplica)

### `frontend/src/pages/ArtworkDetail/ArtworkDetailPage.tsx`
- [ ] Actualizar flujo de compra:
  - crear orden
  - crear intent
  - redirigir a checkout.

### `frontend/src/pages/BuyerOrders/BuyerOrderDetailPage.tsx`
- [ ] Mostrar bloque de estado de pago.
- [ ] Mostrar acciones según estado (`reintentar pago` si falla).

### `frontend/src/routes/AppRoutes.tsx`
- [ ] Añadir ruta resultado pago:
  - `PaymentSuccessPage`
  - `PaymentFailurePage`
  - `PaymentPendingPage` (opcional)

### `frontend/src/pages/Payments/*` (nuevo)
- [ ] Crear páginas de retorno de pago con UX clara.

---

## 2.2 Certificados (P0)

### `frontend/src/services/api/certificate.api.ts` (nuevo)
- [ ] `getCertificateByOrder(orderId)`
- [ ] `downloadCertificate(certificateId)` (si aplica)

### `frontend/src/pages/BuyerOrders/BuyerOrderDetailPage.tsx`
- [ ] Añadir sección `Certificado/Licencia`.
- [ ] Mostrar botón de descarga solo con pago confirmado.

### `frontend/src/pages/ArtistOrders/ArtistOrderDetailPage.tsx`
- [ ] Mostrar estado y acceso a certificado para artista (lectura).

---

## 2.3 Reseñas verificadas (P1)

### `frontend/src/types/review.types.ts` (nuevo)
- [ ] Definir tipo `Review`, payloads y respuestas.

### `frontend/src/services/api/review.api.ts` (nuevo)
- [ ] `createReview`
- [ ] `getArtworkReviews`
- [ ] `getArtistReviews`

### `frontend/src/components/review/ReviewForm.tsx` (nuevo)
- [ ] Formulario rating + comentario (React Hook Form + Zod).

### `frontend/src/components/review/ReviewList.tsx` (nuevo)
- [ ] Lista paginada de reseñas.

### `frontend/src/pages/BuyerOrders/BuyerOrderDetailPage.tsx`
- [ ] Permitir reseñar si la orden es elegible.

### `frontend/src/pages/ArtworkDetail/ArtworkDetailPage.tsx`
- [ ] Mostrar reseñas de la obra.

### `frontend/src/pages/ArtistProfile/ArtistProfilePage.tsx`
- [ ] Mostrar reseñas del artista.

---

## 2.4 Notificaciones v1 (P1)

### `frontend/src/types/notification.types.ts` (nuevo)
- [ ] Definir tipo de notificación y paginación.

### `frontend/src/services/api/notification.api.ts` (nuevo)
- [ ] `getNotifications`
- [ ] `markAsRead`
- [ ] `getUnreadCount`

### `frontend/src/components/layout/Header/Header.tsx`
- [ ] Añadir campana con contador de no leídas.

### `frontend/src/components/notifications/NotificationPanel.tsx` (nuevo)
- [ ] Panel listado + marcar como leído.

### `frontend/src/hooks/useNotifications.ts` (nuevo)
- [ ] Encapsular queries/mutations de notificaciones.

---

## 3) Testing - tareas concretas por capa

## 3.1 Backend (Jest + Supertest)

### `backend/tests/integration/payments.integration.test.js` (nuevo)
- [ ] Crear intent válido.
- [ ] Webhook válido actualiza orden.
- [ ] Webhook repetido no duplica transición.
- [ ] Firma inválida devuelve `400`.

### `backend/tests/integration/certificates.integration.test.js` (nuevo)
- [ ] Pago confirmado crea certificado.
- [ ] Acceso no autorizado a certificado bloqueado.

### `backend/tests/integration/reviews.integration.test.js` (nuevo)
- [ ] Crear reseña con compra válida.
- [ ] Bloquear reseña duplicada.
- [ ] Bloquear reseña sin compra verificada.

### `backend/tests/integration/notifications.integration.test.js` (nuevo)
- [ ] Listar notificaciones del usuario autenticado.
- [ ] Marcar notificación como leída.

### `backend/tests/unit/payment.service.test.js` (nuevo)
- [ ] Mapeo de eventos Stripe.
- [ ] Idempotencia de procesamiento.

---

## 3.2 Frontend (Vitest + RTL)

### `frontend/src/pages/ArtworkDetail/ArtworkDetailPage.test.tsx`
- [ ] Click comprar inicia flujo de pago.

### `frontend/src/pages/BuyerOrders/BuyerOrderDetailPage.test.tsx`
- [ ] Renderiza estado de pago correctamente.
- [ ] Muestra certificado solo cuando aplica.
- [ ] Permite reseñar cuando orden elegible.

### `frontend/src/components/notifications/NotificationPanel.test.tsx`
- [ ] Lista notificaciones.
- [ ] Marca como leída y actualiza contador.

### `frontend/src/components/review/ReviewForm.test.tsx`
- [ ] Validaciones de formulario.
- [ ] Submit exitoso.

---

## 3.3 E2E (Playwright)

### `e2e/payment-flow.spec.ts` (nuevo)
- [ ] Buyer compra obra y llega a estado pagado.

### `e2e/certificate-flow.spec.ts` (nuevo)
- [ ] Tras pago, buyer visualiza/descarga certificado.

### `e2e/review-flow.spec.ts` (nuevo)
- [ ] Buyer deja reseña y se muestra en obra.

### `e2e/notification-flow.spec.ts` (nuevo)
- [ ] Cambio de estado genera notificación visible.

---

## 4) Criterios de aceptación técnicos (Definition of Done)

Para cerrar cada bloque:
- [ ] Endpoints documentados y tipados.
- [ ] Validación de entrada y errores consistentes.
- [ ] Logs de eventos críticos implementados.
- [ ] Tests unitarios + integración pasando.
- [ ] E2E crítico pasando.
- [ ] Sin errores de lint/TS en frontend.
- [ ] Guías de prueba actualizadas.

---

## 5) Plan de ejecución semanal sugerido

- **Semana 1:** Pagos backend + webhook + tests integración.
- **Semana 2:** Pagos frontend + certificados backend/frontend + tests.
- **Semana 3:** Reseñas backend/frontend + tests.
- **Semana 4:** Notificaciones backend/frontend + hardening + E2E completos.

---

## 6) Qué atacar hoy (primer día)

1. Crear rama `feature/fase3-pagos`.
2. Añadir campos de pago en `Order`.
3. Crear `payment.service`, `payment.controller`, `payment.routes`.
4. Registrar webhook con validación de firma.
5. Escribir primer test de integración de webhook (happy path).

