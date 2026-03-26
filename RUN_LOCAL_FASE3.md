# Ejecutar Fase 3 en Local (comandos exactos)

Guía rápida para levantar backend/frontend y ejecutar pruebas de Fase 3.

## 1) Backend

```bash
cd backend
npm install
cp .env.example .env
```

Editar `backend/.env` con:

```env
MONGO_URI=...
JWT_SECRET=...

# Opcional si no usarás pasarela ahora:
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CURRENCY=eur
```

Inicializar datos:

```bash
npm run seed
```

Levantar API:

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:4000/health
```

---

## 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`

---

## 3) Pruebas backend

### Unitarias

```bash
cd backend
npm run test:unit
```

### Integración Fase 3 (sin pasarela)

```bash
cd backend
npm run test:phase3
```

> Si usas MongoDB Atlas, asegúrate de tener tu IP en whitelist.  
> Si falla por red, usa Mongo local temporalmente.

---

## 4) Build frontend

```bash
cd frontend
npm run build
```

---

## 5) Validación manual E2E

Usar estos checklists:

- `E2E_FASE3_CHECKLIST.md`
- `CHECKLIST_REGRESION_FASE3.md`

Credenciales de prueba (seed):

- Buyer: `maria.garcia@email.com / Password123!`
- Artist: `sofia.artista@email.com / Password123!`
- Admin: `admin@marketplace.com / Admin123!`

