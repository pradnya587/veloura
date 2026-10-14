# Veloura — Microservices Backend

Your website, features, and frontend are **100% unchanged**. Only the `backend/`
folder was restructured, from one monolithic Express server into 4 small
services that all share the **same MongoDB database** (exactly as you asked).

## What changed

**Before:** one `backend/` Express app handling products, cart, and orders,
listening on port 5000.

**Now:** `backend/` contains 4 independent Node/Express apps:

| Service            | Folder                    | Port | Responsible for                          |
|---------------------|---------------------------|------|-------------------------------------------|
| API Gateway         | `backend/api-gateway`     | 5000 | Single entry point; routes requests to the right service |
| Product Service     | `backend/product-service` | 5001 | View products, search, filters (`/api/products`) |
| Cart Service        | `backend/cart-service`    | 5002 | Cart add/update/remove/clear (`/api/cart`) |
| Order Service       | `backend/order-service`   | 5003 | Checkout / place order (`/api/orders`) |

Each service is its own folder with its own `package.json`, `server.js`,
models, and routes — you can develop, run, deploy, or scale any one of them
independently.

**The frontend never talks to product/cart/order services directly.** It
still calls `http://localhost:5000/api/...` (the gateway), exactly like
before — so `frontend/` needed **zero code changes**. The gateway forwards
`/api/products/*` to the product service, `/api/cart/*` to the cart service,
and `/api/orders/*` to the order service.

## Why the database stays "the same"

All 4 services read the same `MONGODB_URI` (your existing Atlas cluster and
`veloura` database). Nothing is split or duplicated — it's the same
collections (`products`, `carts`, `orders`) as before. The cart-service and
order-service each keep a small, read-only copy of the `Product`/`Cart`
mongoose model (schema-only, no route) purely so they can look up data they
need from the shared database — e.g. the cart service reading a product's
price when you click "Add to Cart". This is a common, pragmatic pattern for
converting a monolith to microservices without introducing extra inter-service
network calls or changing any behavior.

## Running it locally

1. Copy each service's `.env.example` to `.env` and fill in your MongoDB URI:
   ```
   backend/api-gateway/.env
   backend/product-service/.env
   backend/cart-service/.env
   backend/order-service/.env
   ```
   (`MONGODB_URI` should be the same value in product-service, cart-service,
   and order-service — it's the same database.)

2. Install everything and seed products (from `backend/`):
   ```bash
   cd backend
   npm run install:all
   npm run seed
   ```

3. Start all 4 services together:
   ```bash
   npm run dev
   ```
   You'll see logs from `gateway`, `product`, `cart`, and `order` in one
   terminal, running on ports 5000–5003.

4. In another terminal, start the frontend exactly as before:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Your app behaves exactly the same at `http://localhost:5173` — same
features (view products, search, cart, checkout), same API paths, same
database. Nothing about the website itself changed.

## Running with Docker (optional)

```bash
cd backend
MONGODB_URI="your-atlas-uri" docker compose up --build
```

## Deploying each service separately

Since these are now independent services, you can deploy each to its own
host/container (Render, Railway, EC2, etc.). Just point the gateway's
`.env` at wherever each one lives:

```
PRODUCT_SERVICE_URL=https://your-product-service-url
CART_SERVICE_URL=https://your-cart-service-url
ORDER_SERVICE_URL=https://your-order-service-url
```

The frontend only ever needs to know the gateway's URL
(`VITE_API_URL=https://your-gateway-url/api`), same as it only knew the
single backend's URL before.
