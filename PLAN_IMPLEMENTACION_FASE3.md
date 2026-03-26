# Plan de Implementación Fase 3 (Valor + Factibilidad)

## 1) Alcance recomendado para ejecutar ya

Basado en `terceraFase.md`, se prioriza implementar primero lo que aporta valor directo al negocio y es viable con el stack actual:

- **P0.1** Pagos reales (Stripe) + estado de pago robusto.
- **P0.2** Certificados/licencias asociados a compras.
- **P1.1** Reseñas verificadas post-compra.
- **P1.2** Notificaciones (primera versión por API polling).
- **P1.3** Analítica accionable (eventos de embudo).

Se deja para fase posterior:
- WebSockets/SSE en tiempo real.
- Multi-moneda avanzada.
- Premium y app móvil.

---

## 2) Cosas a arreglar antes de nuevas features

## 2.1 Calidad técnica y fiabilidad
- Estandarizar estados de `Order` para evitar inconsistencias entre compra, pago y envío.
- Añadir idempotencia para operaciones críticas (crear pago, webhook, cambio de estado).
- Unificar formato de errores API (`success`, `message`, `errors`, `code`) para frontend.
- Definir estrategia de reintentos en frontend para requests de pago/notificaciones.

## 2.2 Seguridad y operación
- Validar firma de webhooks (obligatorio).
- Revisar límites de `rate limiting` en endpoints sensibles (`/auth`, `/payments/*`, `/webhooks/*`).
- Registrar auditoría mínima de eventos críticos: pago, reembolso, generación de certificado.
- Mover secretos a variables de entorno y revisar `.env.example`.

## 2.3 UX funcional
- Manejar estados intermedios claros: “procesando pago”, “pago confirmado”, “pago fallido”.
- Mostrar mensajes accionables al usuario (no errores genéricos).
- Evitar que una compra “se vea completada” si el webhook no confirma.

---

## 3) Buenas prácticas a aplicar en implementación

- **Arquitectura:** separar controladores, servicios de dominio y adaptadores externos (Stripe).
- **Contratos:** versionar payloads críticos de webhook y eventos de analítica.
- **Transacciones:** usar operaciones atómicas para sincronizar `Order` + `Payment`.
- **Idempotencia:** clave única por evento externo (webhook event id).
- **Observabilidad:** logs estructurados (JSON), trazas por `requestId`, métricas de errores.
- **Testing:** pirámide de pruebas (unit > integración > E2E) y datos seed dedicados.
- **Feature flags:** activar funcionalidades nuevas gradualmente (pagos/reseñas/notificaciones).
- **Documentación viva:** actualizar `README`, guías de pruebas y checklist QA por sprint.

---

## 4) Plan paso a paso (8 sprints sugeridos)

## Sprint 0 - Preparación técnica (1 semana)
**Objetivo:** dejar base sólida para cambios críticos.

1. Definir estados oficiales de dominio:
   - `Order`: `created`, `payment_pending`, `payment_succeeded`, `payment_failed`, `refunded`, `shipping_pending`, `shipping_sent`.
2. Crear ADR corto (decisiones): Stripe como proveedor, webhook como fuente de verdad.
3. Añadir tablas/colecciones o campos para `payment` y `audit`.
4. Establecer convenciones de errores y logging.
5. Crear fixtures de datos para pruebas automatizadas.

**DoD sprint 0**
- Documentación técnica aprobada.
- Contratos API internos definidos.
- Tests base ejecutando en CI local.

---

## Sprint 1 - Pagos (backend núcleo) (1 semana)
**Objetivo:** iniciar y confirmar pagos de forma fiable.

1. Crear módulo `payments`:
   - `POST /api/payments/checkout-session` o `payment-intent`.
   - `POST /api/webhooks/stripe`.
2. Persistir en DB:
   - `providerPaymentId`, `status`, `amount`, `currency`, `orderId`.
3. Webhook:
   - validar firma,
   - mapear eventos (`succeeded`, `failed`, `refunded`),
   - actualizar estado en forma idempotente.
4. Reglas de negocio:
   - no liberar activos digitales hasta `payment_succeeded`.
   - bloquear duplicados de compra.

**DoD sprint 1**
- Pago sandbox funcionando end-to-end en backend.
- Webhook validado e idempotente.
- Cobertura de tests de integración crítica.

---

## Sprint 2 - Pagos (frontend + UX) (1 semana)
**Objetivo:** flujo de compra visible y claro para el comprador.

1. Integrar checkout en `ArtworkDetailPage`.
2. Página de resultado de pago (`success`, `failure`, `pending`).
3. Actualizar `OrderDetailPage` con timeline de estado.
4. Mejorar mensajes de error y reintentos.
5. Añadir tracking de eventos de checkout.

**DoD sprint 2**
- Comprador puede pagar en entorno sandbox.
- Estados de pago visibles y coherentes con backend.
- Eventos de embudo registrados.

---

## Sprint 3 - Certificados y licencias (1 semana)
**Objetivo:** elevar confianza y trazabilidad post-compra.

1. Crear entidad `Certificate`:
   - `orderId`, `artworkId`, `artistId`, `buyerId`, `type`, `licenseTerms`, `issuedAt`, `version`.
2. Generar certificado tras `payment_succeeded`.
3. Exponer endpoint de consulta/descarga para buyer y artista.
4. Integrar UI en detalle de pedido.

**DoD sprint 3**
- Cada compra pagada tiene certificado/licencia.
- Descarga/control de acceso funcionando.

---

## Sprint 4 - Reseñas verificadas (1 semana)
**Objetivo:** aumentar confianza y conversión.

1. Crear entidad `Review` con constraint de compra verificada.
2. Endpoints:
   - crear reseña,
   - listar reseñas por obra/artista,
   - reportar reseña (mínimo).
3. UI de reseñas en `ArtworkDetailPage` y `ArtistProfilePage`.
4. Reglas:
   - una reseña por orden,
   - sin compra válida no hay reseña.

**DoD sprint 4**
- Reseñas visibles en obra/artista.
- Validaciones de autenticidad activas.

---

## Sprint 5 - Notificaciones v1 (polling) (1 semana)
**Objetivo:** reducir fricción en comunicación.

1. Crear entidad/servicio `Notification`.
2. Endpoints:
   - listar notificaciones,
   - marcar como leída,
   - contador de no leídas.
3. Disparadores de eventos:
   - pago confirmado/fallido,
   - cambio de estado de encargo,
   - cambio de estado de envío.
4. UI:
   - campana + panel simple en dashboards.

**DoD sprint 5**
- Notificaciones operativas para buyer/artist/admin.
- Estado leído/no leído consistente.

---

## Sprint 6 - Analítica de producto (1 semana)
**Objetivo:** medir para optimizar conversiones.

1. Definir taxonomía de eventos:
   - `artwork_viewed`, `checkout_started`, `payment_succeeded`, `payment_failed`, `certificate_downloaded`, etc.
2. Instrumentar frontend + endpoint de captura backend (o proveedor).
3. Crear dashboard básico de embudo y métricas de caída.
4. Alertas mínimas:
   - aumento de fallos de pago,
   - caída de conversión.

**DoD sprint 6**
- Eventos críticos trazables de punta a punta.
- Embudo operativo para decisiones de producto.

---

## Sprint 7 - Hardening + release (1 semana)
**Objetivo:** estabilizar y preparar salida.

1. Pruebas no funcionales:
   - carga básica en pagos/webhooks,
   - seguridad de webhook y auth,
   - regresión de compras/encargos.
2. Corrección de defectos priorizados por severidad.
3. Checklist legal/operativo previo a release.
4. Documentación final de uso y soporte.

**DoD sprint 7**
- Sin bugs críticos abiertos.
- Checklist de release al 100%.

---

## 5) Plan de tests para nuevas funcionalidades

## 5.1 Stack recomendado de testing
- **Backend:** Jest + Supertest (integración API), tests unitarios de servicios.
- **Frontend:** Vitest + React Testing Library.
- **E2E:** Playwright (flujos completos de compra y post-compra).

## 5.2 Matriz mínima de pruebas por feature

### A) Pagos + Webhooks
**Unitarios (backend)**
- Servicio de pagos crea intención con payload correcto.
- Mapeo de eventos webhook a estados internos.
- Idempotencia: mismo evento no cambia estado dos veces.

**Integración (backend)**
- `POST /payments/*` crea registro `payment_pending`.
- `POST /webhooks/stripe` con firma válida actualiza a `payment_succeeded`.
- Firma inválida devuelve `400`.

**E2E**
- Buyer inicia checkout y completa pago sandbox -> orden en `payment_succeeded`.
- Pago fallido -> orden en `payment_failed` y mensaje visible.

### B) Certificados/Licencias
**Unitarios**
- Generador de certificado construye metadatos correctos.
- Regla “solo con pago confirmado”.

**Integración**
- Tras webhook `succeeded`, se crea certificado.
- Endpoint de descarga restringe acceso por rol/propiedad.

**E2E**
- Buyer compra y descarga certificado desde pedido.
- Artista ve certificado asociado a la venta.

### C) Reseñas verificadas
**Unitarios**
- Validador bloquea reseña sin compra.
- Regla “una reseña por orden”.

**Integración**
- Crear reseña con orden válida -> `201`.
- Crear reseña duplicada -> `409`.

**E2E**
- Buyer con compra reseña obra y aparece en detalle.
- Usuario sin compra no puede reseñar.

### D) Notificaciones v1
**Unitarios**
- Servicio de notificaciones crea evento por transición relevante.
- Marcado como leído actualiza contador.

**Integración**
- Cambiar estado de encargo genera notificación en destinatario.
- Endpoint de listado devuelve paginación y no leídas.

**E2E**
- Artista acepta encargo -> buyer recibe notificación visible.
- Buyer marca notificación como leída -> contador disminuye.

### E) Analítica de embudo
**Unitarios**
- Normalizador de eventos valida schema.

**Integración**
- Endpoint de eventos rechaza payload inválido.
- Evento válido queda persistido/trazado.

**E2E**
- Flujo `view -> checkout -> payment` emite eventos esperados.

---

## 6) Criterios de aceptación globales (release de fase 3)

- Conversión de compra medible y con estado real de pago.
- 0 inconsistencias entre estado de webhook y estado de orden.
- Certificado/licencia generado en 100% de compras confirmadas.
- Reseñas solo por compras verificadas.
- Notificaciones funcionales para eventos críticos.
- Dashboard mínimo de embudo disponible para PO/negocio.
- Cobertura de pruebas de regresión en flujos críticos:
  - login,
  - compra,
  - encargo,
  - envío.

---

## 7) Riesgos y mitigación

- **Riesgo:** duplicidad de eventos webhook.  
  **Mitigación:** idempotencia por `eventId` + lock transaccional.

- **Riesgo:** UX confusa en estados intermedios de pago.  
  **Mitigación:** diseño de estados explícitos y mensajes de recuperación.

- **Riesgo:** deuda técnica por lanzar rápido.  
  **Mitigación:** sprint de hardening obligatorio antes de release.

---

## 8) Entregables de documentación por sprint

- API contract actualizado (endpoints y payloads).
- Checklist QA por feature.
- Registro de decisiones técnicas (ADR breve).
- Métricas esperadas vs reales por sprint.

---

## 9) Orden de ejecución recomendado (resumen)

1. Preparación y estados de dominio.
2. Pagos backend + webhook.
3. Pagos frontend + UX.
4. Certificados/licencias.
5. Reseñas verificadas.
6. Notificaciones v1.
7. Analítica de embudo.
8. Hardening y release.

