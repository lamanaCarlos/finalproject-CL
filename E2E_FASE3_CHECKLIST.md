# Checklist E2E Fase 3 (sin pasarela de pago)

Este checklist cubre validación end-to-end de funcionalidades de Fase 3 que no dependen de seleccionar proveedor de pagos.

## Preparación

- Backend corriendo en `http://localhost:4000`.
- Frontend corriendo en `http://localhost:5173`.
- Base de datos sembrada (`npm run seed`).
- Usuario comprador y artista disponibles.

---

## Flujo E2E 1 - Notificaciones completas

1. Iniciar sesión como artista.
2. Abrir un pedido físico del artista.
3. Actualizar envío a `agreed` o `sent`.
4. Cerrar sesión e iniciar como comprador del pedido.
5. Verificar campana con contador > 0.
6. Abrir panel de notificaciones.
7. Verificar que aparece evento de envío actualizado.
8. Hacer clic en notificación no leída.
9. Verificar que cambia estilo visual a leída y contador disminuye.

**Resultado esperado:** notificación creada, visible y marcada como leída desde UI.

---

## Flujo E2E 2 - Reseña verificada

1. Preparar un pedido del comprador con `paymentStatus = payment_succeeded`.
2. Iniciar sesión como comprador.
3. Ir a detalle del pedido.
4. Enviar reseña con rating y comentario.
5. Intentar enviar segunda reseña para el mismo pedido.
6. Ir a detalle de la obra.
7. Verificar que la reseña aparece.

**Resultado esperado:** primera reseña OK, duplicado bloqueado con `409`, reseña visible en obra.

---

## Flujo E2E 3 - Certificado por pedido

1. Asegurar pedido en `payment_succeeded`.
2. Verificar que existe certificado asociado al pedido.
3. Iniciar sesión como comprador.
4. Ir a detalle del pedido.
5. Ver sección de certificado/licencia.
6. Validar tipo y fecha de emisión.

**Resultado esperado:** certificado accesible para buyer/artist/admin y no accesible para terceros.

---

## Regresión mínima obligatoria

- Login buyer/artist/admin.
- Navegación dashboard por rol.
- Crear encargo y cambiar estado.
- Actualizar envío en pedido físico.
- Visualización de galería y detalle de obra.

---

## Evidencias recomendadas

- Capturas del panel de notificaciones antes/después de marcar leída.
- Captura de reseña en detalle de pedido y en detalle de obra.
- Captura de bloque de certificado en detalle de pedido.
- Log de ejecución del script `backend/scripts/test-phase3-integration.js`.

