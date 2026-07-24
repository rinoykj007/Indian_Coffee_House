# Indian Coffee House (Payasam.ie) - Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Frontend](#frontend)
6. [Backend](#backend)
7. [Database Models](#database-models)
8. [API Reference](#api-reference)
9. [Authentication & Authorization](#authentication--authorization)
10. [Security](#security)
11. [Deployment](#deployment)

---

## Project Overview

**Indian Coffee House** is a full-stack restaurant management web application for [payasam.ie](https://www.payasam.ie). It provides:

- A **public-facing website** with a menu, about section, reservation, and recipes pages.
- A **staff management portal** for handling table orders and billing.
- An **admin dashboard** for managing menu items, staff, and viewing revenue reports.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router v6   |
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB Atlas (via Mongoose)                    |
| Auth       | JWT (JSON Web Tokens), bcryptjs                 |
| Security   | Helmet, express-rate-limit, express-mongo-sanitize, CORS |
| Icons      | Lucide React, FontAwesome                       |
| Hosting    | Vercel (frontend), Vercel/Netlify (backend)     |

---

## Project Structure

```
ICH - Copy/
├── Client/                        # React frontend (Vite)
│   └── src/
│       ├── App.jsx                # Root component with routes
│       ├── main.jsx               # Entry point
│       ├── assets/                # Static assets & data
│       ├── contexts/
│       │   └── AuthContext.jsx    # Auth state & API helpers
│       ├── components/
│       │   ├── Home.jsx           # Public homepage
│       │   ├── ProtectedRoute.jsx # Auth guard component
│       │   └── management/
│       │       ├── Login.jsx          # Login page
│       │       ├── ManagementApp.jsx  # Role selection portal
│       │       ├── AdminDashboard.jsx # Admin panel
│       │       ├── StaffDashboard.jsx # Staff panel
│       │       ├── Table.jsx          # Table management (staff)
│       │       └── MenuPage.jsx       # Menu management (admin)
│       └── sections/              # Public-facing page sections
│           ├── Header/            # Hero header with navigation
│           ├── Menu/              # Public menu with cart & ordering
│           │   └── components/    # CartItem, FilterButtons, OrderPopup, etc.
│           ├── About/             # About the restaurant
│           ├── Footer/            # Footer
│           ├── FixedImage/        # Parallax image section
│           ├── Recipes/           # Recipes section
│           └── Reservation/       # Table reservation form
│
└── Server/                        # Node.js/Express backend
    ├── Server.js                  # App entry point & middleware setup
    ├── routes/
    │   ├── auth.js                # Authentication routes
    │   ├── menu.js                # Menu CRUD routes
    │   ├── orders.js              # Order management routes
    │   ├── tables.js              # Table status routes
    │   └── payments.js            # Payment & billing routes
    ├── models/
    │   ├── User.js                # User schema (admin/staff)
    │   ├── Menu.js                # Menu item schema
    │   ├── Order.js               # Order schema
    │   ├── Table.js               # Table schema
    │   └── Payment.js             # Payment schema
    └── middleware/
        ├── auth.js                # JWT authentication & role authorization
        ├── cors.js                # CORS configuration
        └── validators.js          # Input validation middleware
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account
- npm or yarn

### Environment Variables

Copy `Server/.env.example` to `Server/.env` and fill in:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

### Install & Run

**Backend:**
```bash
cd Server
npm install
npm start        # or: node Server.js
```

**Frontend:**
```bash
cd Client
npm install
npm run dev      # Vite dev server on http://localhost:5173
```

---

## Frontend

### Routing

| Path                    | Component          | Access          |
|-------------------------|--------------------|-----------------|
| `/`                     | Home               | Public          |
| `/MenuList`             | MenuList           | Public          |
| `/management`           | ManagementApp      | Public          |
| `/management/login`     | Login              | Public          |
| `/management/staff`     | Table (Staff view) | Authenticated   |
| `/management/admin`     | AdminDashboard     | Admin only      |
| `/management/menu`      | MenuPage           | Admin only      |

### Auth Context (`AuthContext.jsx`)

Provides global auth state via `useAuth()` hook:

- `user` — current logged-in user object `{ id, username, role, name }`
- `token` — JWT token (stored in `localStorage`)
- `login(username, password)` — authenticates and stores token
- `logout()` — clears auth state
- `makeAuthenticatedRequest(url, options)` — wrapper for fetch with `Authorization` header

### Key Public Components

| Component              | Description                                              |
|------------------------|----------------------------------------------------------|
| `Header`               | Hero section with navigation and background image        |
| `Menu/Menu.jsx`        | Public menu with category filters, search, and cart      |
| `MenuItemCard`         | Individual menu item with add-to-cart button             |
| `OrderPopup`           | Cart popup with order summary and submission             |
| `OrderCompletePopup`   | Confirmation screen after order placement                |
| `FilterButtons`        | Category filter buttons for menu                         |
| `SearchBar`            | Real-time menu search                                    |
| `FloatingCartButton`   | Sticky cart icon showing item count                      |

### Management Components

| Component              | Role Required | Description                                          |
|------------------------|---------------|------------------------------------------------------|
| `Login`                | —             | Username/password login form                         |
| `ManagementApp`        | —             | Redirects to login or respective dashboard           |
| `Table` (Staff)        | staff/admin   | Table grid, order placement, item management         |
| `AdminDashboard`       | admin         | Stats overview, staff, tables, menu, orders view     |
| `MenuPage`             | admin         | Add, edit, delete menu items                         |

---

## Backend

### Middleware

| Middleware              | Purpose                                                   |
|-------------------------|-----------------------------------------------------------|
| `helmet`                | Sets HTTP security headers (CSP, CORS, etc.)              |
| `express-rate-limit`    | 100 req/15min globally; 5 login attempts/15min on auth    |
| `express-mongo-sanitize`| Prevents NoSQL injection by stripping `$` operators       |
| `cors`                  | Whitelist of allowed origins                              |
| `express.json`          | Body parsing with 1MB limit                               |
| `auth.authenticate`     | Verifies JWT token on protected routes                    |
| `auth.authorize(role)`  | Role-based access control (admin/staff)                   |

### Health Check

```
GET /health
```
Returns server status, timestamp, and service name.

---

## Database Models

### User
| Field      | Type   | Notes                         |
|------------|--------|-------------------------------|
| username   | String | Unique, required              |
| password   | String | Bcrypt hashed (auto on save)  |
| role       | String | `"admin"` or `"staff"`        |
| name       | String | Display name (optional)       |

### Menu
| Field        | Type    | Notes                    |
|--------------|---------|--------------------------|
| id           | Number  | Unique numeric item ID   |
| name         | String  | Item name                |
| type         | String  | e.g., vegetarian/non-veg |
| image        | String  | Image URL                |
| price        | Number  | Price in EUR             |
| rating       | Number  | Star rating              |
| reviewCount  | Number  | Number of reviews        |
| description  | String  | Item description         |
| category     | String  | e.g., Starters, Mains    |
| available    | Boolean | Default: `true`          |

### Table
| Field       | Type   | Notes                              |
|-------------|--------|------------------------------------|
| tableNumber | Number | Unique                             |
| status      | String | `"available"` or `"occupied"`      |

### Order
| Field          | Type     | Notes                                           |
|----------------|----------|-------------------------------------------------|
| orderNumber    | String   | Auto-generated: `YYYYMMDD-NNN`                  |
| tableId        | ObjectId | Ref: Table                                      |
| items          | Array    | Array of `{ menuItemId, name, quantity, price, specialNotes }` |
| customerCount  | Number   | Default: 1                                      |
| specialRequests| String   | Optional notes                                  |
| status         | String   | `pending`, `preparing`, `ready`, `served`, `paid` |
| total          | Virtual  | Computed from items (price × quantity)          |
| createdAt      | Date     | Auto                                            |
| updatedAt      | Date     | Auto-updated on save                            |

### Payment
| Field         | Type     | Notes                                          |
|---------------|----------|------------------------------------------------|
| paymentId     | String   | Auto-generated: `PAY-YYYYMMDD-XXXX`            |
| orderId       | ObjectId | Ref: Order                                     |
| tableId       | ObjectId | Ref: Table                                     |
| orderNumber   | String   | Copied from Order                              |
| tableNumber   | Number   | Copied from Table                              |
| itemsCount    | Number   | Total items quantity                           |
| subtotal      | Number   | Order total before discount                    |
| discount      | Number   | Applied discount (default: 0)                  |
| totalAmount   | Number   | `subtotal - discount`                          |
| paymentMethod | String   | `cash`, `card`, `upi`, `online`                |
| paymentStatus | String   | `pending`, `completed`, `failed`, `refunded`   |
| staffId       | ObjectId | Ref: User (the staff who processed payment)    |
| paidAt        | Date     | Set when `paymentStatus` → `"completed"`       |

---

## API Reference

All API routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Endpoint         | Auth Required | Description                    |
|--------|------------------|---------------|--------------------------------|
| POST   | `/login`         | No            | Login and receive JWT token    |
| POST   | `/logout`        | Yes           | Logout (client clears token)   |
| GET    | `/me`            | Yes           | Get current user info          |
| GET    | `/users`         | Admin only    | List all staff users           |
| POST   | `/register`      | Admin only    | Create a new staff/admin user  |

**Login Request:**
```json
{ "username": "staff1", "password": "password123" }
```

**Login Response:**
```json
{
  "success": true,
  "token": "<JWT>",
  "user": { "id": "...", "username": "staff1", "role": "staff", "name": "Staff One" }
}
```

---

### Menu — `/api/menu`

| Method | Endpoint           | Auth Required | Description               |
|--------|--------------------|---------------|---------------------------|
| GET    | `/`                | No            | Get all menu items        |
| GET    | `/stats/summary`   | Admin only    | Menu statistics           |
| POST   | `/`                | Admin only    | Add a new menu item       |
| PUT    | `/:id`             | Admin only    | Update a menu item        |
| DELETE | `/:id`             | Admin only    | Delete a menu item        |

---

### Tables — `/api/tables`

| Method | Endpoint                  | Auth Required | Description               |
|--------|---------------------------|---------------|---------------------------|
| GET    | `/`                       | Yes           | Get all tables            |
| GET    | `/summary/availability`   | Yes           | Table availability stats  |
| PUT    | `/:id/status`             | Yes           | Update table status       |

**Update Table Status:**
```json
{ "status": "occupied" }
```

---

### Orders — `/api/orders`

| Method | Endpoint                         | Auth Required | Description                      |
|--------|----------------------------------|---------------|----------------------------------|
| GET    | `/`                              | Yes           | Get all orders (latest 20)       |
| GET    | `/stats/summary`                 | Yes           | Order count statistics           |
| GET    | `/table/:tableId`                | Yes           | Get pending order for a table    |
| POST   | `/`                              | Yes           | Create or update an order        |
| POST   | `/:orderId/reduce-item`          | Yes           | Reduce item quantity by 1        |
| POST   | `/:orderId/cancel-item`          | Yes           | Remove an item from order        |

**Create Order:**
```json
{
  "tableId": "<tableId>",
  "items": [
    { "menuItemId": "<id>", "name": "Masala Dosa", "quantity": 2, "price": 8.50 }
  ],
  "customerCount": 2,
  "specialRequests": "No spice"
}
```

**Update Order** (add `isUpdate: true` and `orderId`):
```json
{
  "tableId": "<tableId>",
  "orderId": "<orderId>",
  "isUpdate": true,
  "items": [...]
}
```

---

### Payments — `/api/payments`

| Method | Endpoint                    | Auth Required | Description                          |
|--------|-----------------------------|---------------|--------------------------------------|
| GET    | `/reports/daily`            | Yes           | Today's revenue summary              |
| GET    | `/daily`                    | Yes           | Detailed daily payment breakdown     |
| GET    | `/pending-bills`            | Yes           | All pending bills across all tables  |
| GET    | `/table/:tableId/bill`      | Yes           | Generate bill for a specific table   |
| GET    | `/table/:tableId`           | Yes           | Payment history for a table          |
| POST   | `/process`                  | Yes           | Process payment and close order      |

**Process Payment:**
```json
{
  "orderId": "<orderId>",
  "tableId": "<tableId>",
  "paymentMethod": "cash",
  "discount": 0,
  "notes": ""
}
```

On success, the order status is set to `"paid"` and the table status reverts to `"available"`.

---

## Authentication & Authorization

- **JWT tokens** are issued at login and expire after **24 hours**.
- Tokens must be sent in the `Authorization: Bearer <token>` header.
- Two roles are supported:
  - `staff` — can view tables, create/update orders, process payments.
  - `admin` — all staff permissions + manage menu items, manage staff users, view full dashboard stats.
- The `ProtectedRoute` component on the frontend redirects unauthenticated users to `/management/login`.

---

## Security

| Measure                  | Implementation                                      |
|--------------------------|-----------------------------------------------------|
| Password hashing         | bcrypt with salt rounds = 10                        |
| JWT signing              | HS256 with `JWT_SECRET` from environment            |
| Rate limiting (global)   | 100 requests / 15 minutes per IP                    |
| Rate limiting (login)    | 5 attempts / 15 minutes per IP                      |
| NoSQL injection          | `express-mongo-sanitize` strips `$` from inputs     |
| HTTP security headers    | `helmet` with custom CSP                            |
| CORS whitelist           | Only allowed origins can access the API             |
| Body size limit          | 1 MB max payload                                    |
| Input validation         | `validators.js` middleware on all write routes      |

---

## Deployment

| Environment | Frontend URL                                          | Backend         |
|-------------|-------------------------------------------------------|-----------------|
| Production  | https://www.payasam.ie                                | Vercel          |
| Staging     | https://indian-coffee-house-hxyp.vercel.app           | Vercel          |
| Development | http://localhost:5173 (client) / :5000 (server)       | Local           |

- Frontend is deployed on **Vercel** (auto-deploys from main branch).
- Backend is also deployable to **Vercel** or **Netlify** (see `Server/netlify.toml`).
- Set all environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`, `NODE_ENV`) in the hosting platform's settings.
