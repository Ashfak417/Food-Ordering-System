# 🍕 Food Ordering System — Backend API

Node.js + Express + MongoDB REST API with PayHere Sandbox payment integration.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Then edit .env with your values
```

### 3. Seed the database (creates admin + sample food items)
```bash
npm run seed
```

### 4. Start the server
```bash
npm run dev        # development (nodemon)
npm start          # production
```

Server runs at: `http://localhost:5000`

---

## 🔐 Default Admin Credentials (after seeding)
- **Email:** admin@foodorder.lk
- **Password:** admin123

---

## 📁 Project Structure

```
food-ordering-backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, login, profile
│   ├── foodController.js      # CRUD for food items
│   ├── orderController.js     # Place & manage orders
│   ├── paymentController.js   # PayHere integration
│   └── adminController.js     # Admin dashboard & customers
├── middleware/
│   ├── auth.js                # JWT protect + role authorize
│   └── errorHandler.js        # Global error handler
├── models/
│   ├── User.js                # Customer & Admin schema
│   ├── FoodItem.js            # Menu items schema
│   └── Order.js               # Order schema
├── routes/
│   ├── authRoutes.js
│   ├── foodRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   └── adminRoutes.js
├── utils/
│   ├── tokenUtils.js          # JWT helpers
│   └── seeder.js              # DB seed script
├── .env.example
├── server.js
└── package.json
```

---

## 📡 API Reference

### Base URL: `http://localhost:5000/api`

All protected routes require:
```
Authorization: Bearer <token>
```

---

### 🔑 Auth Routes `/api/auth`

| Method | Endpoint              | Access  | Description              |
|--------|-----------------------|---------|--------------------------|
| POST   | `/register`           | Public  | Register new customer    |
| POST   | `/login`              | Public  | Login (customer + admin) |
| GET    | `/me`                 | Private | Get current user         |
| PUT    | `/update-profile`     | Private | Update name/phone/address|
| PUT    | `/change-password`    | Private | Change password          |

**Register body:**
```json
{
  "name": "John Perera",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0771234567",
  "address": { "street": "45 Main St", "city": "Colombo", "postalCode": "10100" }
}
```

**Login body:**
```json
{ "email": "john@example.com", "password": "password123" }
```

---

### 🍔 Food Routes `/api/food`

| Method | Endpoint                       | Access       | Description              |
|--------|--------------------------------|--------------|--------------------------|
| GET    | `/`                            | Public       | Get all food items       |
| GET    | `/?category=Pizza`             | Public       | Filter by category       |
| GET    | `/?search=burger`              | Public       | Search by name           |
| GET    | `/?sort=price_asc`             | Public       | Sort (price_asc/desc/name)|
| GET    | `/:id`                         | Public       | Get single food item     |
| POST   | `/`                            | Admin        | Create food item         |
| PUT    | `/:id`                         | Admin        | Update food item         |
| DELETE | `/:id`                         | Admin        | Delete food item         |
| PATCH  | `/:id/toggle-availability`     | Admin        | Toggle available status  |

**Categories:** `Pizza`, `Burger`, `Cake`, `Drinks`, `Sides`, `Desserts`, `Other`

---

### 🛒 Order Routes `/api/orders`

| Method | Endpoint           | Access   | Description                    |
|--------|--------------------|----------|--------------------------------|
| POST   | `/`                | Customer | Place a new order              |
| GET    | `/my-orders`       | Customer | Get my order history           |
| GET    | `/:id`             | Private  | Get single order details       |
| PATCH  | `/:id/cancel`      | Customer | Cancel pending/confirmed order |

**Place order body:**
```json
{
  "items": [
    { "foodItem": "<food_item_id>", "quantity": 2 },
    { "foodItem": "<food_item_id>", "quantity": 1 }
  ],
  "deliveryAddress": {
    "street": "45 Main Street",
    "city": "Colombo",
    "postalCode": "10100"
  },
  "specialInstructions": "Extra sauce please"
}
```

---

### 💳 Payment Routes `/api/payment`

| Method | Endpoint            | Access         | Description                            |
|--------|---------------------|----------------|----------------------------------------|
| POST   | `/initiate`         | Customer       | Get PayHere form data for checkout     |
| POST   | `/notify`           | Public (PayHere) | PayHere server-to-server callback    |
| GET    | `/verify/:orderId`  | Customer       | Verify payment status after redirect   |

**Initiate payment body:**
```json
{ "orderId": "<mongo_order_id>" }
```

**Payment Flow:**
1. Customer places order → gets `orderId`
2. Frontend calls `POST /api/payment/initiate` → gets PayHere form data
3. Frontend submits form to PayHere sandbox checkout
4. User completes payment on PayHere
5. PayHere calls `POST /api/payment/notify` (server-to-server) → order updated
6. Customer is redirected to `return_url`
7. Frontend calls `GET /api/payment/verify/:orderId` to confirm status

---

### 👑 Admin Routes `/api/admin` (Admin only)

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | `/dashboard`                      | Summary stats                  |
| GET    | `/customers`                      | List all customers             |
| GET    | `/customers?search=john`          | Search customers               |
| GET    | `/customers/:id`                  | Customer details + orders      |
| PATCH  | `/customers/:id/toggle-status`    | Activate/deactivate customer   |
| GET    | `/orders`                         | All orders (paginated)         |
| GET    | `/orders?status=Pending`          | Filter by status               |
| GET    | `/orders?paymentStatus=Paid`      | Filter by payment status       |
| GET    | `/orders/stats`                   | Order statistics               |
| PATCH  | `/orders/:id/status`              | Update order status            |

**Update order status body:**
```json
{ "orderStatus": "Preparing" }
```
**Valid statuses:** `Pending` → `Confirmed` → `Preparing` → `Out for Delivery` → `Delivered` / `Cancelled`

---

## 💰 PayHere Sandbox Setup

1. Register at [sandbox.payhere.lk](https://sandbox.payhere.lk)
2. Get your **Merchant ID** and **Merchant Secret**
3. Add to `.env`:
   ```
   PAYHERE_MERCHANT_ID=your_merchant_id
   PAYHERE_MERCHANT_SECRET=your_merchant_secret
   ```
4. For local testing of the notify webhook, use [ngrok](https://ngrok.com):
   ```bash
   ngrok http 5000
   # Use the https URL as your backend notify_url
   ```

---

## 🛠 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** express-validator
- **Payment:** PayHere Sandbox
- **Dev:** nodemon, morgan
