# Marketplace de Arte 🎨

Plataforma web para la **comercialización de arte físico y digital**, orientada a artistas y compradores, con soporte para encargos personalizados, multi-idioma y escalabilidad internacional.

Este repositorio contiene todo lo necesario para **desarrollar, desplegar y mantener** el proyecto, incluyendo documentación funcional, técnica, UX y legal.

---

## 📌 Visión del Proyecto

Crear un marketplace artístico moderno donde:

* Los **artistas** gestionen sus perfiles y obras.
* Los **compradores** descubran y adquieran arte original.
* La **plataforma** actúe como intermediaria segura y escalable.

Soporta:

* Arte físico y digital
* Encargos personalizados
* Comisiones por venta
* Expansión multi-idioma

---

## 🧩 Stack Tecnológico

### Frontend

* React.js
* Internacionalización (i18n)
* Arquitectura por componentes

### Backend

* Node.js + Express
* API REST
* Autenticación JWT

### Base de Datos

* MongoDB (Atlas recomendado)

### Infraestructura

* Frontend: Vercel / Netlify
* Backend: Render / Railway
* Almacenamiento de imágenes: Cloudinary / S3

---

## 📁 Estructura del Repositorio

```
marketplace-arte/
├── frontend/
├── backend/
├── docs/
├── README.md
└── .gitignore
```

---

## 📚 Documentación

Toda la documentación del proyecto se encuentra en la carpeta `docs/`:

* Plan del proyecto
* API REST
* Backlog del producto
* Flujos de usuario + diagramas
* Estructura del repositorio
* Casos de uso y criterios de test
* Guía UX/UI y componentes
* Aspectos legales y responsabilidad
* Plan de despliegue y entornos
* Resumen de la conversación y prompts

---

## 🚀 Instalación y Ejecución

### Requisitos

* Node.js >= 18
* npm o yarn
* MongoDB (local o Atlas)

### Backend

```bash
cd backend
npm install
npm run dev
```

Crear archivo `.env` basado en `.env.example`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Variables de Entorno (ejemplo)

```
NODE_ENV=development
PORT=4000
MONGO_URI=
JWT_SECRET=
CLOUDINARY_API_KEY=
STRIPE_SECRET_KEY=
```

---

## 👥 Roles del Sistema

* Visitante
* Comprador
* Artista
* Administrador

Cada rol tiene permisos y flujos diferenciados.

---

## 🧪 Testing

Tipos de test recomendados:

* Unitarios
* Integración (API)
* End-to-End (flujos críticos)

---

## 🌍 Internacionalización

* Idiomas iniciales: Español / Inglés
* Arquitectura preparada para añadir nuevos idiomas

---

## ⚖️ Consideraciones Legales

* La plataforma actúa como intermediaria
* El artista conserva los derechos de autor
* Los envíos físicos se acuerdan entre las partes

Consultar el documento legal en `docs/` antes de lanzar a producción.

---

## 🗺️ Roadmap

* MVP funcional
* Encargos personalizados
* Escalado internacional
* Funcionalidades premium

---

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature
3. Pull Request con descripción clara

---

## 📄 Licencia

Por definir.

---

**Este README es el punto de entrada principal al proyecto.**

Para una comprensión completa, consultar la documentación detallada en la carpeta `docs/`.
