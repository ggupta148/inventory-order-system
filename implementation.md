# Inventory & Order Management System — Build Instructions

## Project overview

Build a full-stack Inventory & Order Management System. The repository already has a folder structure in place. Your job is to write all the code.

**Stack:**
- Backend: Python + FastAPI
- Frontend: React (Vite)
- Database: PostgreSQL
- Containerisation: Docker + Docker Compose

---

## Folder structure to produce

```
inventory-order-system/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── products.py
│   │       ├── customers.py
│   │       └── orders.py
│   ├── Dockerfile
│   ├── .dockerignore
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Customers.jsx
│   │   │   └── Orders.jsx
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── ProductForm.jsx
│   │       ├── CustomerForm.jsx
│   │       └── OrderForm.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Backend — FastAPI

### `requirements.txt`

```
fastapi
uvicorn[standard]
sqlalchemy
psycopg2-binary
python-dotenv
alembic
pydantic[email]
```

### `app/database.py`

- Use SQLAlchemy with async support or sync (sync is fine)
- Read `DATABASE_URL` from environment variable
- Create `engine`, `SessionLocal`, and `Base`
- Provide a `get_db` dependency function

### `app/models.py`

Create three SQLAlchemy models:

**Product**
- `id` (Integer, primary key, autoincrement)
- `name` (String, not null)
- `sku` (String, unique, not null, indexed)
- `price` (Numeric(10,2), not null)
- `quantity` (Integer, not null, default 0)
- `created_at` (DateTime, default now)

**Customer**
- `id` (Integer, primary key, autoincrement)
- `full_name` (String, not null)
- `email` (String, unique, not null, indexed)
- `phone` (String, nullable)
- `created_at` (DateTime, default now)

**Order**
- `id` (Integer, primary key, autoincrement)
- `customer_id` (Integer, ForeignKey → customers.id)
- `total_amount` (Numeric(10,2)) — calculated by backend, not provided by user
- `status` (String, default "pending")
- `created_at` (DateTime, default now)
- Relationship to `OrderItem`

**OrderItem**
- `id` (Integer, primary key, autoincrement)
- `order_id` (Integer, ForeignKey → orders.id)
- `product_id` (Integer, ForeignKey → products.id)
- `quantity` (Integer, not null)
- `unit_price` (Numeric(10,2)) — snapshot of price at time of order

### `app/schemas.py`

Create Pydantic schemas (request and response) for Product, Customer, Order, and OrderItem. Use `model_config = ConfigDict(from_attributes=True)` for ORM mode.

### `app/routers/products.py`

Implement these endpoints:

- `POST /products` — create product; SKU must be unique (409 if duplicate); quantity cannot be negative (422)
- `GET /products` — return all products
- `GET /products/{id}` — return single product (404 if not found)
- `PUT /products/{id}` — update product fields; quantity cannot be negative
- `DELETE /products/{id}` — delete product (404 if not found)

### `app/routers/customers.py`

- `POST /customers` — create customer; email must be unique (409 if duplicate)
- `GET /customers` — return all customers
- `GET /customers/{id}` — return single customer (404 if not found)
- `DELETE /customers/{id}` — delete customer

### `app/routers/orders.py`

- `POST /orders` — create order with business logic:
  - Accept `customer_id` and a list of `{ product_id, quantity }` items
  - Validate customer exists (404)
  - For each item, validate product exists (404) and has sufficient stock (409 with message "Insufficient stock for product X")
  - Deduct stock from each product atomically
  - Calculate `total_amount` = sum of (quantity × product.price) for all items
  - Store `unit_price` snapshot on each OrderItem
  - Return full order with items
- `GET /orders` — return all orders with items and customer info
- `GET /orders/{id}` — return single order with items (404 if not found)
- `DELETE /orders/{id}` — cancel/delete order; restore product stock for each item

### `app/main.py`

- Create FastAPI app
- Add CORS middleware — allow all origins (`*`) for development, or read `FRONTEND_URL` from env
- Include routers with prefix `/api/v1` (e.g. `/api/v1/products`)
- On startup, call `Base.metadata.create_all(bind=engine)` to auto-create tables
- Add a health check endpoint at `GET /health` returning `{ "status": "ok" }`

### `backend/Dockerfile`

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### `backend/.dockerignore`

```
__pycache__
*.pyc
*.pyo
.env
.venv
venv
.git
```

---

## Frontend — React + Vite

### Setup

Use Vite with React. Install dependencies:
- `axios` — for API calls
- `react-router-dom` — for routing
- `react-hot-toast` — for notifications

### `src/api/client.js`

Create an Axios instance with `baseURL` from `import.meta.env.VITE_API_URL` (fallback to `http://localhost:8000/api/v1`).

Export named functions for all API calls:
- Products: `getProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct`
- Customers: `getCustomers`, `getCustomer`, `createCustomer`, `deleteCustomer`
- Orders: `getOrders`, `getOrder`, `createOrder`, `deleteOrder`

### Pages

**`Dashboard.jsx`**
Show four summary cards:
- Total products (count)
- Total customers (count)
- Total orders (count)
- Low stock products (products with quantity < 10) — shown as a list

Fetch data on mount using the API client.

**`Products.jsx`**
- List all products in a table: Name, SKU, Price, Stock, Actions
- "Add Product" button opens `ProductForm` (modal or inline)
- Each row has Edit and Delete buttons
- Confirm before delete
- After create/update/delete, refresh the list and show a toast notification

**`Customers.jsx`**
- List all customers: Name, Email, Phone, Actions
- "Add Customer" button opens `CustomerForm`
- Delete with confirmation

**`Orders.jsx`**
- List all orders: ID, Customer, Total, Status, Date, Actions
- "Create Order" button opens `OrderForm`
- Click on an order row to expand and show items
- Delete (cancel) with confirmation

### Forms

**`ProductForm.jsx`** — fields: Name, SKU, Price, Stock (quantity). Validate: all required, price > 0, quantity ≥ 0.

**`CustomerForm.jsx`** — fields: Full name, Email, Phone. Validate: name and email required, email format.

**`OrderForm.jsx`** — fields: Customer (dropdown from customers list), then dynamic list of line items each with Product (dropdown) + Quantity. Allow adding/removing line items. Validate: customer required, at least one item, quantity > 0.

### `Navbar.jsx`

Navigation links to: Dashboard, Products, Customers, Orders.

### `App.jsx`

Set up `BrowserRouter` with routes:
- `/` → Dashboard
- `/products` → Products
- `/customers` → Customers
- `/orders` → Orders

Wrap with `<Toaster />` from react-hot-toast.

### `frontend/Dockerfile`

```dockerfile
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

Also create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### `frontend/.dockerignore`

```
node_modules
dist
.env
.git
```

---

## `docker-compose.yml`

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    restart: always
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  pgdata:
```

---

## `.env.example`

```env
POSTGRES_USER=appuser
POSTGRES_PASSWORD=changeme
POSTGRES_DB=inventorydb
DATABASE_URL=postgresql://appuser:changeme@db:5432/inventorydb
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Business logic checklist

Make sure these rules are enforced in the backend:

- [ ] Product SKU is unique — return 409 Conflict if duplicate
- [ ] Customer email is unique — return 409 Conflict if duplicate
- [ ] Product quantity cannot go below 0
- [ ] Order creation checks stock availability for every item before deducting anything (all-or-nothing)
- [ ] `total_amount` is always calculated by the backend, never trusted from the client
- [ ] Cancelling an order restores stock
- [ ] All endpoints return proper HTTP status codes: 200, 201, 400, 404, 409, 422, 500

---

## Error handling

- Wrap all database operations in try/except
- Return JSON error responses in the format `{ "detail": "message" }`
- FastAPI handles 422 validation errors automatically via Pydantic
- Add a global exception handler for unexpected 500 errors

---

## API response format examples

**Product response:**
```json
{
  "id": 1,
  "name": "Laptop",
  "sku": "LAP-001",
  "price": "999.99",
  "quantity": 50,
  "created_at": "2024-01-01T00:00:00"
}
```

**Order response:**
```json
{
  "id": 1,
  "customer_id": 2,
  "total_amount": "1999.98",
  "status": "pending",
  "created_at": "2024-01-01T00:00:00",
  "items": [
    { "product_id": 1, "quantity": 2, "unit_price": "999.99" }
  ]
}
```

---

## Notes for Claude Code

- Do not use SQLite. PostgreSQL only.
- Do not hardcode any credentials anywhere. Read everything from environment variables.
- Use `python-dotenv` with a `.env` file for local development.
- The backend must start on port 8000, the frontend on port 80.
- The frontend talks to the backend via the `VITE_API_URL` env variable.
- Inside Docker Compose, services communicate by service name (e.g. `db`, `backend`).
- The API prefix is `/api/v1` — all routes go under this prefix.
- Keep components focused — one concern per file.
- Use `async/await` in frontend API calls.