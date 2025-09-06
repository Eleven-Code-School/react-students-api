# React Students API

API pública con **Node 20 + Express + MongoDB (Mongoose)** lista para desplegar en **Vercel** (serverless).
Incluye modelos y endpoints para **productos**, **usuarios**, **carritos** y **preferencias** y autenticación JWT.

## 🎯 Características

-   Conexión a Mongo con **pooling/caching** para serverless (`api/_lib/mongo.js`).
-   Modelos Mongoose: `Product`, `User`, `UserPreferences`, `Cart`.
-   Validación de entrada con **Zod** en los controladores.
-   Endpoints REST con CRUD y operaciones de carrito.

## 🔧 Variables de entorno

Crea `.env` (para local) y define en Vercel → Project Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://USER:PASS@HOST/dbname?retryWrites=true&w=majority
MONGODB_DB=appdb   # opcional, usado como fallback para algunos drivers
```

> La URI la aportarás tú. Usa MongoDB Atlas o tu propia instancia.

## 🚀 Quick start (local)

```bash
pnpm i
# crea .env con MONGODB_URI
pnpm dev
# -> http://localhost:3000/api
```

## ☁️ Deploy a Vercel

1. Sube el repo a GitHub/GitLab.
2. Vercel → New Project → Importa repo.
3. Añade `MONGODB_URI` (y opcional `MONGODB_DB`) en Environment Variables.
4. Deploy. La API queda en `/api/...`.

## 📚 Rutas (igual que antes)

-   `GET    /api` -> healthcheck
-   `GET    /api/products` -> listar (?search, ?page, ?limit, ?categoryId, ?sort=price|rating)
-   `POST   /api/products` -> crear
-   `GET    /api/products/:id` -> detalle
-   `PATCH  /api/products/:id` -> actualizar parcial
-   `DELETE /api/products/:id` -> eliminar

-   `POST   /api/auth/register` -> registro
-   `PATCH  /api/users/:id` -> actualizar parcial

-   `GET    /api/users` -> listar
-   `GET    /api/users/:id` -> detalle
-   `DELETE /api/users/:id` -> eliminar
-   `PATCH  /api/auth/:id/preferences` -> actualizar preferencias del usuario
-   `GET    /api/users/:id/preferences` -> leer preferencias del usuario

-   `GET    /api/preferences` -> listar todas
-   `POST   /api/preferences` -> crear
-   `GET    /api/preferences/:id` -> detalle
-   `PATCH  /api/preferences/:id` -> actualizar
-   `DELETE /api/preferences/:id` -> eliminar

-   `POST   /api/carts` -> crear carrito (opcional `userId`)
-   `GET    /api/carts` -> listar (?status=active|ordered)
-   `GET    /api/carts/:id` -> detalle
-   `POST   /api/carts/:id/items` -> añadir item `{ productId, qty }`
-   `PATCH  /api/carts/:id/items/:productId` -> cambiar qty `{ qty }`
-   `DELETE /api/carts/:id/items/:productId` -> quitar item
-   `GET    /api/carts/:id/summary` -> totales `{ subtotal, tax, total }`
-   `POST   /api/carts/:id/checkout` -> marca carrito como `ordered`

## 🧪 Seed opcional

Si defines `SEED=true` en env del despliegue, el primer arranque insertará datos de ejemplo (idempotente).
