# 🍕 Foodie — React Frontend

React.js frontend for the Food Ordering System with customer and admin interfaces.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment (optional for dev)
```bash
cp .env.example .env
# Leave REACT_APP_API_URL empty — the proxy in package.json points to localhost:5000
```

### 3. Make sure backend is running on port 5000, then:
```bash
npm start
```

App opens at: `http://localhost:3000`

---

## 📁 Project Structure

```
src/
├── App.js                        # All routes
├── index.js                      # Entry point
├── index.css                     # Global design system
│
├── context/
│   ├── AuthContext.js            # JWT auth state
│   └── CartContext.js            # Shopping cart state
│
├── services/
│   └── api.js                    # Axios + all API calls
│
├── components/
│   ├── common/
│   │   ├── index.js              # Navbar, Footer, Spinner, ProtectedRoute
│   │   └── OrderStatus.js        # Badges + StatusTracker
│   ├── customer/
│   │   ├── CartDrawer.js         # Slide-in cart
│   │   └── FoodCard.js           # Menu item card
│   └── admin/
│       └── AdminLayout.js        # Sidebar + topbar
│
└── pages/
    ├── customer/
    │   ├── HomePage.js           # Landing page
    │   ├── LoginPage.js          # Login
    │   ├── RegisterPage.js       # Sign up
    │   ├── MenuPage.js           # Browse food items
    │   ├── CheckoutPage.js       # Place order + PayHere
    │   ├── OrderConfirmationPage.js  # After payment
    │   ├── PaymentCancelledPage.js   # Payment cancelled
    │   ├── MyOrdersPage.js       # Order history
    │   └── ProfilePage.js        # Edit profile / password
    └── admin/
        ├── AdminDashboard.js     # Stats overview
        ├── AdminOrders.js        # View + update orders
        ├── AdminCustomers.js     # Customer list + detail
        └── AdminFood.js          # CRUD food items
```

---

## 🎨 Design System

Custom CSS design system in `src/index.css` using CSS variables:

| Token | Value | Usage |
|-------|-------|-------|
| `--brand-orange` | `#FF5C00` | Primary CTA, accents |
| `--brand-dark` | `#111111` | Text, hero bg |
| `--font-display` | Syne | Headings |
| `--font-body` | Inter | Body text |

---

## 📱 Pages Overview

### Customer Flow
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing with hero + categories |
| Login | `/login` | Sign in |
| Register | `/register` | Create account |
| Menu | `/menu` | Browse + filter + search food |
| Checkout | `/checkout` | Address + PayHere payment |
| Confirmation | `/order-confirmation/:id` | Post-payment status |
| My Orders | `/my-orders` | Order history + cancel |
| Profile | `/profile` | Edit info + change password |

### Admin Flow
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/admin` | Stats cards |
| Orders | `/admin/orders` | All orders + status update |
| Customers | `/admin/customers` | Customer list + detail panel |
| Food Items | `/admin/food` | Add / Edit / Delete / Toggle |

---

## 💳 PayHere Payment Flow

1. Customer adds items → goes to Checkout
2. Clicks **Pay** → backend creates order + returns PayHere form data
3. Frontend auto-submits hidden form to PayHere Sandbox
4. Customer pays on PayHere
5. PayHere calls backend `/api/payment/notify` (server-to-server)
6. Customer lands on `/order-confirmation/:id` showing paid status

---

## 🔐 Auth

- JWT token stored in `localStorage`
- Auto-attached to all API requests via Axios interceptor
- 401 responses auto-logout + redirect to `/login`
- Role-based routes: `customer` and `admin`

---

## 🛠 Tech Stack
- React 18
- React Router v6
- Axios
- react-hot-toast
- lucide-react (icons)
- Google Fonts (Syne + Inter)
