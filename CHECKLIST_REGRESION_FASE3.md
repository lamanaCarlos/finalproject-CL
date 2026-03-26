# Checklist de Regresión Formal - Fase 3

Documento formal de hardening/regresión para cierre de sprint.

## Estado general

- [ ] Backend compilando y levantando sin errores.
- [ ] Frontend build de producción sin errores.
- [ ] Variables de entorno actualizadas y documentadas.
- [ ] Script de integración Fase 3 ejecutado con éxito.

---

## Backend - validaciones críticas

- [ ] `POST /api/payments/create-intent` responde correctamente (si key Stripe presente).
- [ ] `POST /api/payments/webhook/stripe` maneja firma inválida con `400`.
- [ ] `Order.paymentStatus` se actualiza por webhook idempotente.
- [ ] Certificado se consulta por `GET /api/certificates/order/:orderId`.
- [ ] `POST /api/reviews` bloquea usuario sin compra válida.
- [ ] `POST /api/reviews` bloquea duplicado por pedido.
- [ ] `GET /api/notifications` retorna solo notificaciones del usuario autenticado.
- [ ] `PATCH /api/notifications/:id/read` marca correctamente `isRead`.

---

## Frontend - validaciones críticas

- [ ] Campana de notificaciones visible en sesión autenticada.
- [ ] Contador de no leídas se actualiza.
- [ ] Click en notificación la marca como leída y reduce contador.
- [ ] Detalle de pedido muestra estado de pago.
- [ ] Detalle de pedido muestra certificado cuando aplica.
- [ ] Formulario de reseña funciona para pedidos elegibles.
- [ ] Reseñas aparecen en detalle de obra.

---

## Seguridad y calidad

- [ ] No hay endpoints nuevos sin `authenticate` donde aplica.
- [ ] Validaciones de entrada activas en endpoints nuevos.
- [ ] Logs de eventos críticos (pago/envío/encargo) presentes.
- [ ] No hay secretos en repositorio.

---

## Aprobación de release interno

- [ ] QA funcional backend aprobado.
- [ ] QA funcional frontend aprobado.
- [ ] Evidencias E2E adjuntas.
- [ ] Riesgos conocidos documentados.
- [ ] Go/No-Go decidido.

