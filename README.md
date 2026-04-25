# 🧾 BillMaster — Billing Application for Retail Store

A full-stack **Point of Sale (POS) and Billing Management System** for retail stores. BillMaster supports multiple user roles (Admin, Manager, Cashier), real-time product management, payment processing via Razorpay, analytics & reporting, and customer management — all built on a microservices backend and a modern React frontend.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Microservices Architecture](#microservices-architecture)
- [Frontend Architecture](#frontend-architecture)
- [User Roles & Features](#user-roles--features)
- [API Reference](#api-reference)
- [Database Configuration](#database-configuration)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)

---

## Overview

BillMaster is a comprehensive retail billing solution featuring:

- **Role-based access control** — Admin, Manager, and Cashier dashboards
- **Point of Sale (POS)** — product scanning, cart management, and invoice generation
- **Payment Integration** — Razorpay payment gateway with order creation and verification
- **Product Management** — CRUD operations, CSV bulk import, PDF export, and image uploads
- **Customer Management** — add, update, search, and delete customers by phone
- **Analytics & Reporting** — daily/range sales reports, tax collection, low-stock alerts, PDF exports
- **Authentication** — JWT-based login, registration, forgot/reset password flows

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| React Router DOM 7 | Client-side routing |
| Axios | HTTP client for API calls |
| Chart.js + react-chartjs-2 | Dashboard analytics charts |
| jsPDF + jspdf-autotable | PDF export on the frontend |
| XLSX | Excel report export |
| React Toastify | Toast notifications |
| Lucide React / Phosphor React | Icon libraries |
| Font Awesome | Additional icons |
| Vanilla CSS | Styling (no Tailwind in use) |

### Backend (Microservices)

| Service | Framework | Database | Port |
|---|---|---|---|
| Auth Service | Spring Boot 3.2.5 + Spring Security | MySQL | 8083 |
| Product Service | Spring Boot 3.2.5 | MongoDB | 8086 |
| Payment Service | Spring Boot 3.2.5 + Razorpay | MongoDB | 8087 |
| User/Customer Service | Spring Boot 4.0.2 | MongoDB | 8085 |
| Analytics/Report Service | Spring Boot 3.2.5 | MongoDB | 8090 |

---

## Project Structure

```
Billing Application for Retail Store/
├── BillMaster-Frontend-master/       # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx                   # Root component with page/role routing
│   │   ├── main.jsx                  # React entry point
│   │   ├── components/               # All page and UI components
│   │   │   ├── Welcome.jsx           # Landing page
│   │   │   ├── Home.jsx              # Login page
│   │   │   ├── SignUp.jsx            # Registration page
│   │   │   ├── ForgotPassword.jsx    # Forgot password flow
│   │   │   ├── ResetPassword.jsx     # Reset password flow
│   │   │   ├── Dashboard.jsx         # Admin dashboard
│   │   │   ├── POS.jsx               # Admin POS
│   │   │   ├── ProductManagement.jsx # Admin product management
│   │   │   ├── SalesHistory.jsx      # Admin sales history
│   │   │   ├── Reports.jsx           # Admin reports
│   │   │   ├── Customers.jsx         # Admin customer management
│   │   │   ├── Settings.jsx          # Admin settings
│   │   │   ├── AddEmployee.jsx       # Add employee/user
│   │   │   ├── CashierDashboard.jsx  # Cashier dashboard
│   │   │   ├── CashierPOS.jsx        # Cashier POS
│   │   │   ├── CashierSalesHistory.jsx
│   │   │   ├── CashierCustomer.jsx
│   │   │   ├── ManagerDashboard.jsx  # Manager dashboard
│   │   │   ├── ManagerPOS.jsx        # Manager POS
│   │   │   ├── ManagerProductManagement.jsx
│   │   │   ├── ManagerSalesHistory.jsx
│   │   │   ├── ManagerReports.jsx
│   │   │   ├── ManagerCustomers.jsx
│   │   │   ├── PaymentModal.jsx      # Razorpay payment modal
│   │   │   ├── InvoiceModal.jsx      # Invoice generation
│   │   │   ├── AddProductModal.jsx   # Add/edit product modal
│   │   │   ├── Sidebar.jsx           # Admin sidebar
│   │   │   ├── CashierSidebar.jsx    # Cashier sidebar
│   │   │   ├── ManagerSidebar.jsx    # Manager sidebar
│   │   │   ├── Layout.jsx            # Admin layout wrapper
│   │   │   ├── CashierLayout.jsx     # Cashier layout wrapper
│   │   │   └── ManagerLayout.jsx     # Manager layout wrapper
│   │   └── assets/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── BillMaster-Backend-master/        # Java Spring Boot microservices
    ├── billmaster-auth-main/         # Authentication Service
    ├── product_management-import--main/  # Product Service
    ├── billmaster-payment-main/      # Payment Service
    ├── userService_billmaster-main/  # Customer/User Service
    └── analytics_service-main/       # Analytics & Report Service
```

---

## Microservices Architecture

```
Frontend (React :5173)
        │
        ├──► Auth Service         (:8083)  →  MySQL DB (authentication)
        ├──► Product Service      (:8086)  →  MongoDB  (billmaster_products)
        ├──► Payment Service      (:8087)  →  MongoDB  (paymentdb) + Razorpay
        ├──► Customer Service     (:8085)  →  MongoDB  (billmaster_products)
        └──► Analytics Service    (:8090)  →  MongoDB  (billmaster_products)
```

### Service Descriptions

#### 1. 🔐 Auth Service (`billmaster-auth-main`) — Port 8083
Handles user registration and login using Spring Security + JWT.

- **Database**: MySQL (`authentication` schema)
- **JWT**: JJWT 0.11.5 with configurable secret and expiration
- **Endpoints**: `/api/auth/register`, `/api/auth/login`
- **Key classes**: `AuthController`, `AuthService`, `JwtUtil`, `JwtFilter`, `SecurityConfig`
- **API Docs**: SpringDoc OpenAPI (Swagger UI)

#### 2. 📦 Product Service (`product_management-import--main`) — Port 8086
Full product lifecycle management including image upload and bulk CSV import.

- **Database**: MongoDB (`billmaster_products`)
- **Key features**: Create with image upload (multipart), CSV bulk import, PDF export (iTextPDF), update, delete, low-stock query
- **Endpoints**: `/api/products`

#### 3. 💳 Payment Service (`billmaster-payment-main`) — Port 8087
Razorpay payment gateway integration with payment recording and history retrieval.

- **Database**: MongoDB (`paymentdb`)
- **Key features**: Create Razorpay order, verify payment signature, store payment records, filter history by invoice and date range
- **Endpoints**: `/api/payment`

#### 4. 👤 Customer/User Service (`userService_billmaster-main`) — Port 8085
Customer CRUD operations.

- **Database**: MongoDB (`billmaster_products`)
- **Key features**: Add, list, search by phone, update by phone, delete by phone
- **Endpoints**: `/api/customers`

#### 5. 📊 Analytics & Report Service (`analytics_service-main`) — Port 8090
Sales analytics, report generation, and PDF export for management.

- **Database**: MongoDB (`billmaster_products`)
- **Key features**: Daily sales report, date-range sales report, transaction count, low-stock alerts, manager summary PDF (iText7 + Apache POI)
- **Endpoints**: `/api/reports`

---

## Frontend Architecture

The frontend is a Single Page Application (SPA) using **state-based navigation** (no URL-based routing). `App.jsx` manages:

- A `currentPage` state that controls which component renders
- A `currentUser` state for logged-in user context
- Role-specific layout wrappers (`Layout`, `CashierLayout`, `ManagerLayout`)

### Routing Logic

```
Welcome  →  Home (Login)  →  Role-based Dashboard
                               ├── Admin    → Layout + Admin components
                               ├── Cashier  → CashierLayout + Cashier components
                               └── Manager  → ManagerLayout + Manager components
```

---

## User Roles & Features

### 👑 Admin
| Feature | Component |
|---|---|
| Dashboard with charts | `Dashboard.jsx` |
| Point of Sale | `POS.jsx` |
| Product Management (CRUD + CSV import + PDF export) | `ProductManagement.jsx` |
| Sales History | `SalesHistory.jsx` |
| Reports (Daily, Range, Tax, Low Stock) | `Reports.jsx` |
| Customer Management | `Customers.jsx` |
| Add Employee | `AddEmployee.jsx` |
| Settings | `Settings.jsx` |

### 🧑‍💼 Manager
| Feature | Component |
|---|---|
| Dashboard with charts | `ManagerDashboard.jsx` |
| Point of Sale | `ManagerPOS.jsx` |
| Product Management | `ManagerProductManagement.jsx` |
| Sales History | `ManagerSalesHistory.jsx` |
| Reports (with PDF export) | `ManagerReports.jsx` |
| Customer Management | `ManagerCustomers.jsx` |

### 🧑‍💻 Cashier
| Feature | Component |
|---|---|
| Dashboard | `CashierDashboard.jsx` |
| Point of Sale | `CashierPOS.jsx` |
| Sales History | `CashierSalesHistory.jsx` |
| Customer Lookup | `CashierCustomer.jsx` |

### 🔓 Public (No Login Required)
| Page | Component |
|---|---|
| Welcome / Landing | `Welcome.jsx` |
| Login | `Home.jsx` |
| Sign Up | `SignUp.jsx` |
| Forgot Password | `ForgotPassword.jsx` |
| Reset Password | `ResetPassword.jsx` |

---

## API Reference

### Auth Service — `http://localhost:8083`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

**Login Request Body:**
```json
{ "username": "string", "password": "string" }
```
**Register Request Body:**
```json
{ "username": "string", "password": "string", "role": "ADMIN|MANAGER|CASHIER" }
```

---

### Product Service — `http://localhost:8086`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products` (multipart) | Create product with image |
| GET | `/api/products` | Get all products |
| GET | `/api/products/sku/{sku}` | Get product by SKU |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |
| GET | `/api/products/lowstock` | Get low-stock products |
| POST | `/api/products/import/csv` | Bulk import from CSV |
| GET | `/api/products/export/pdf` | Export products to PDF |
| POST | `/api/products/{id}/upload` | Upload product image |

**Create Product (multipart/form-data):**
```
sku, name, category, price, stock, image (file)
```

---

### Payment Service — `http://localhost:8087`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment and save |
| GET | `/api/payment/history` | Get all payment records |
| GET | `/api/payment/history/invoice/{invoiceNumber}` | Filter by invoice |
| GET | `/api/payment/history/date?start=&end=` | Filter by date range |
| GET | `/api/payment/history/filter` | Filter by invoice + date range |

---

### Customer Service — `http://localhost:8085`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customers` | Add new customer |
| GET | `/api/customers` | Get all customers |
| GET | `/api/customers/phone/{phone}` | Find customer by phone |
| PUT | `/api/customers/phone/{phone}` | Update customer by phone |
| DELETE | `/api/customers/phone/{phone}` | Delete customer by phone |

---

### Analytics Service — `http://localhost:8090`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/daily?date=YYYY-MM-DD` | Daily sales report |
| GET | `/api/reports/range?start=&end=` | Date range sales report |
| GET | `/api/reports/dashboard/transactions?date=` | Transaction count for date |
| GET | `/api/reports/dashboard/low-stock?threshold=10` | Low-stock product list |
| GET | `/api/reports/manager-summary/pdf` | Manager summary PDF export |

---

## Database Configuration

### MySQL (Auth Service)
```
Host:     localhost:3306
Database: authentication
```

### MongoDB (All other services)
```
Host:          localhost:27017
Databases:
  - billmaster_products   (Products, Analytics, Customers)
  - paymentdb             (Payments)
```

---

## Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Java JDK | 17 (Auth, Product, Payment, Analytics) / 21 (User Service) |
| Maven | 3.8+ |
| MySQL | 8.0+ |
| MongoDB | 6.0+ |

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd "Billing Application for Retail Store"
```

#### 2. Setup MySQL database
```sql
CREATE DATABASE authentication;
```
> The Auth Service auto-creates tables via `spring.jpa.hibernate.ddl-auto=update`.

#### 3. Start MongoDB
```bash
mongod --port 27017
```

---

## Environment Variables

### Auth Service (`billmaster-auth-main/src/main/resources/application.properties`)

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/authentication?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
app.jwt.secret=YOUR_JWT_SECRET_KEY
app.jwt.expiration=900000
server.port=8083
```

### Product Service (`product_management-import--main/src/main/resources/application.properties`)

```properties
spring.application.name=product
server.port=8086
spring.data.mongodb.uri=mongodb://localhost:27017/billmaster_products
```

### Payment Service (`billmaster-payment-main/src/main/resources/application.properties`)

```properties
spring.application.name=paymentservice
server.port=8087
spring.data.mongodb.uri=mongodb://localhost:27017/paymentdb
razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET
```

### Customer Service (`userService_billmaster-main/src/main/resources/application.properties`)

```properties
spring.application.name=user
server.port=8085
spring.data.mongodb.uri=mongodb://localhost:27017/billmaster_products
```

### Analytics Service (`analytics_service-main/src/main/resources/application.properties`)

```properties
spring.application.name=analytics-report-service
server.port=8090
spring.data.mongodb.uri=mongodb://localhost:27017/billmaster_products
```

---

## Running the Application

### Start Backend Services

Open a separate terminal for each service and run:

```bash
# Auth Service
cd BillMaster-Backend-master/billmaster-auth-main
./mvnw spring-boot:run

# Product Service
cd BillMaster-Backend-master/product_management-import--main
./mvnw spring-boot:run

# Payment Service
cd BillMaster-Backend-master/billmaster-payment-main
./mvnw spring-boot:run

# Customer Service
cd BillMaster-Backend-master/userService_billmaster-main
./mvnw spring-boot:run

# Analytics Service
cd BillMaster-Backend-master/analytics_service-main
./mvnw spring-boot:run
```

### Start Frontend

```bash
cd BillMaster-Frontend-master
npm install
npm run dev
```

The frontend will be available at: **http://localhost:5173**

### Service Health Check URLs

| Service | URL |
|---|---|
| Auth | http://localhost:8083/api/auth |
| Product | http://localhost:8086/api/products |
| Payment | http://localhost:8087/api/payment |
| Customer | http://localhost:8085/api/customers |
| Analytics | http://localhost:8090/api/reports |
| Auth Swagger UI | http://localhost:8083/swagger-ui.html |

---

## Key Frontend Dependencies

```json
{
  "react": "^19.2.0",
  "react-router-dom": "^7.12.0",
  "axios": "^1.13.5",
  "chart.js": "^4.5.1",
  "react-chartjs-2": "^5.3.1",
  "jspdf": "^4.0.0",
  "jspdf-autotable": "^5.0.7",
  "xlsx": "^0.18.5",
  "react-toastify": "^11.0.5",
  "lucide-react": "^0.562.0"
}
```

---

## Key Backend Dependencies (per service)

| Dependency | Services Using It |
|---|---|
| Spring Boot Web | All |
| Spring Data JPA + MySQL | Auth Service |
| Spring Data MongoDB | Product, Payment, Customer, Analytics |
| Spring Security + JJWT | Auth Service |
| Razorpay Java SDK | Payment Service |
| Apache POI (xlsx) | Product, Analytics |
| iTextPDF 7 | Product, Analytics |
| SpringDoc OpenAPI (Swagger) | Auth Service |
| Lombok | All |

---

> **Note:** This project contains hardcoded credentials in `application.properties` files (database usernames, passwords, JWT secrets, Razorpay API keys). Before deploying to production or sharing publicly, move all secrets to environment variables or a secrets manager and add `application.properties` to `.gitignore`.
