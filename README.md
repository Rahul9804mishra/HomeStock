# HomeStock – Household Grocery Inventory Manager

A full-stack household grocery inventory SaaS-style application using React + Vite + Tailwind CSS on the client and Node.js + Express + MongoDB/Mongoose on the server.

## Stack

- React, Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide React
- Node.js, Express, MongoDB, Mongoose
- JWT authentication + bcrypt password hashing
- Helmet, CORS, express-mongo-sanitize, express-validator

## Folder structure

```text
HomeStock/
├── client/
│   ├── src/
│   │   ├── components/     # Modal, toast, confirmation UI
│   │   ├── context/        # Authentication context
│   │   ├── hooks/          # Reusable API hook
│   │   ├── layouts/        # Authenticated application shell
│   │   ├── pages/          # Dashboard, Inventory, Shopping, Purchases, Reports, etc.
│   │   ├── services/       # Axios API client
│   │   ├── utils/           # Categories, units, formatting, stock helpers
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── config/             # MongoDB connection
│   ├── controllers/        # Auth, products, purchases, shopping, reports
│   ├── middleware/         # JWT auth, validation, errors
│   ├── models/             # User, Product, StockHistory, Purchase, ShoppingItem
│   ├── routes/             # REST API routes
│   ├── seed/               # Realistic demo data
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## MongoDB setup

### Local MongoDB
Install MongoDB Community Server, make sure MongoDB is running, then use:

```env
MONGO_URI=mongodb://127.0.0.1:27017/homestock
```

### MongoDB Atlas
Create a database and use its connection string in `server/.env`.

## Environment variables

Copy `server/.env.example` to `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/homestock
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Optionally copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Install

Terminal 1:

```bash
cd server
npm install
```

Terminal 2:

```bash
cd client
npm install
```

## Seed demo data

```bash
cd server
npm run seed
```

Demo credentials:

```text
Email: demo@homestock.app
Password: Demo@12345
```

## Development

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Frontend defaults to `http://localhost:5173` and API to `http://localhost:5000`.

## Production build

```bash
cd client
npm run build
npm run preview
```

Start the API in production:

```bash
cd server
npm start
```

For deployment, host `client/dist` on a static host and configure `VITE_API_URL` to the deployed API URL. Set the API server's `CLIENT_URL` to the deployed frontend origin.

## REST API

All routes below except authentication routes require:

```text
Authorization: Bearer <JWT>
```

### Auth

- `POST /api/auth/register` – create account
- `POST /api/auth/login` – authenticate
- `GET /api/auth/me` – current user
- `PUT /api/auth/me` – update name/password

### Products

- `GET /api/products` – search, category/status/expiry filters, sorting, pagination
- `POST /api/products` – create product
- `GET /api/products/:id` – product details
- `PUT /api/products/:id` – edit product
- `DELETE /api/products/:id` – delete product
- `POST /api/products/:id/stock` – PURCHASE, CONSUMED, or ADJUSTMENT stock change

### Stock history

- `GET /api/stock-history?productId=&from=&to=` – user-scoped transaction history

### Purchases

- `GET /api/purchases` – search/filter/paginate purchases
- `POST /api/purchases` – add purchase and increase linked inventory
- `PUT /api/purchases/:id` – edit purchase
- `DELETE /api/purchases/:id` – delete purchase

### Shopping list

- `GET /api/shopping-list` – list items
- `POST /api/shopping-list` – add item
- `GET /api/shopping-list/suggestions` – low-stock suggestions
- `PUT /api/shopping-list/:id` – update/mark purchased
- `DELETE /api/shopping-list/:id` – delete item
- `POST /api/shopping-list/:id/purchase-to-inventory` – mark purchased and add to inventory

### Reports

- `GET /api/reports/dashboard` – live dashboard aggregates
- `GET /api/reports/spending?range=6m` – spending analytics
- `GET /api/reports/inventory` – inventory analytics

### Health

- `GET /api/health`

## Testing checklist

1. Register a new user and verify the API returns a JWT without a password.
2. Log in, refresh the browser, and verify the authenticated session remains.
3. Create, edit, consume, increase, and delete a product.
4. Verify quantity never becomes negative and stock history is recorded.
5. Add a purchase linked to a product and verify inventory increases.
6. Add a shopping item, mark it purchased, and use purchase-to-inventory.
7. Create products with expiry dates in the past, 7 days, and 30 days and verify expiry groups.
8. Verify dashboard/reports use live MongoDB data.
9. Test search, filters, pagination, loading, empty, error and confirmation states.
10. Test the responsive layout on mobile and desktop.
