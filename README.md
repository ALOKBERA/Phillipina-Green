# 🧴 Phillipina Green — Daily Sales Tracker

A professional full-stack MERN dashboard for recording and tracking daily sales at a cleaning products shop. Optimized for bilingual Gujarati and English language reporting, featuring automated session tracking, database persistence, and end-of-day PDF generation.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Project Directory Structure](#-project-directory-structure)
5. [Database Schema](#-database-schema)
6. [Local Installation & Setup](#-local-installation--setup)
7. [Environment Variables](#-environment-variables)
8. [Seeding the Database](#-seeding-the-database)
9. [Verification Script](#-verification-script)
10. [Production Deployment Guide](#-production-deployment-guide)

---

## 🔍 Project Overview

The **Daily Sales Tracker** allows a shopkeeper to log in once a day and record product sales across two distinct shifts:
* **Morning Session:** 9:00 AM – 1:00 PM
* **Evening Session:** 4:00 PM – 8:30 PM

Both sessions contribute to a single consolidated daily sales record document in the database. After the evening session closes at 8:30 PM, the shopkeeper can download a professional, client-ready PDF report compiling all items sold, quantities, rates, sub-totals, and the grand total for the day.

---

## ✨ Key Features

* 🔐 **JWT Authentication:** Secure shopkeeper login with password hashing via `bcryptjs`.
* 🛒 **Bilingual Product Cards:** Product labels and details are displayed in both Gujarati (ગુજરાતી) and English.
* 🕒 **Timezone-Agnostic Session-Aware UI:** Automatically detects active sessions using UTC to IST conversions so that it displays the correct shift regardless of hosting location timezone.
* 💾 **Auto-Save & Debounce:** Automatically saves sales entries to the MongoDB database in real-time as quantities change, using a 300ms debounce to prevent server spamming.
* 🧾 **Live Bill Calculation:** Real-time billing overview summing morning and evening shifts separately, along with the grand total.
* 📄 **Professional PDF Invoice Generation:** Clean, server-side generated PDF containing tabular data, brand colors, and Noto Sans Gujarati font support.
* 📅 **Monthly History Page:** Allows the shopkeeper to review and download reports for any day of the current calendar month.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite SPA), Vanilla CSS Variables, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Security** | JWT (JSON Web Tokens), bcryptjs |
| **PDF Generation** | PDFKit (server-side, custom TTF font embedded) |

---

## 📂 Project Directory Structure

```text
Alok_Liquid_Shop/
│
├── client/                     # React Frontend (Vite)
│   ├── public/                 # Static assets (Favicons, logos)
│   ├── src/
│   │   ├── api/                # Axios instance & JWT configuration
│   │   ├── components/         # Reusable UI, layout & billing components
│   │   ├── context/            # AuthContext state provider
│   │   ├── data/               # Product catalog configuration
│   │   ├── hooks/              # Custom React hooks (useSales, useAuth, useSession)
│   │   ├── pages/              # Views (SalesPage, HistoryPage, LoginPage, RegisterPage)
│   │   ├── utils/              # Timezone & date utilities
│   │   ├── App.jsx             # React router and login controller
│   │   └── index.css           # Global custom CSS styles (Inter & Noto Fonts)
│   ├── .env.example            # Client env template
│   └── package.json            # Client packages & scripts
│
├── server/                     # Express Backend
│   ├── assets/fonts/           # Custom NotoSansGujarati TrueType font
│   ├── config/                 # DB connection configuration
│   ├── controllers/            # Controller logic (auth, sales management)
│   ├── middleware/             # Route guards (auth, session check)
│   ├── models/                 # Mongoose schemas (User, SalesRecord)
│   ├── routes/                 # Express API endpoints
│   ├── utils/                  # PDFKit generator module
│   ├── .env.example            # Server env template
│   ├── seed.js                 # Initial admin setup & font downloader
│   ├── server.js               # Entrypoint file
│   └── verify.js               # Local API testing script
│
├── .gitignore                  # Root gitignore rules
└── README.md                   # This documentation file
```

---

## 🗄 Database Schema

### `User` Collection
Stores shopkeeper credentials:
```js
{
  username: String,       // Unique index, e.g. "yogesh"
  passwordHash: String,   // bcrypt hashed password
  createdAt: Date
}
```

### `SalesRecord` Collection
A single document is updated in-place per user, per day:
```js
{
  userId: ObjectId,       // References User
  date: String,           // Key index format: "YYYY-MM-DD"
  items: [
    {
      productId: String,  // e.g. "dw1"
      nameGu: String,     // "ડીશ વોશ - ૧"
      nameEn: String,     // "Dish Wash - 1"
      variant: String,    // "pouch" | "bottle"
      unitPrice: Number,  // Rate at time of entry
      morningQty: Number, // Quantity sold during morning shift
      eveningQty: Number, // Quantity sold during evening shift
      quantity: Number,   // Total quantity (morning + evening)
      session: String     // Last updating session ("morning" | "evening")
    }
  ],
  morningTotal: Number,   // Sum of morning sales
  eveningTotal: Number,   // Sum of evening sales
  grandTotal: Number      // Consolidated sales total
}
```

---

## ⚡ Local Installation & Setup

### Prerequisites
* **Node.js** >= 18.x
* **MongoDB** locally running or a **MongoDB Atlas** Cluster connection.

### 1. Clone & Initialize Environment
Clone your repository locally, then create the configuration files:

```bash
# Enter project root
cd Alok_Liquid_Shop

# Setup server environments
cd server
copy .env.example .env

# Setup client environments
cd ../client
copy .env.example .env
```

### 2. Configure Environment Variables

#### Server Environment (`server/.env`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_key_here
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

#### Client Environment (`client/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Install Dependencies and Run Development Servers

#### Backend:
```bash
cd server
npm install
npm run dev # Starts on http://localhost:5000
```

#### Frontend:
```bash
cd client
npm install
npm run dev # Starts Vite on http://localhost:5173
```

---

## 🌾 Seeding the Database

Run the database seeder from the `server` directory to download the Gujarati font file and bootstrap your admin shopkeeper credentials:

```bash
cd server
node seed.js
```
*Creates the default credentials specified in `seed.js` (default: username `yogesh`, password `yogesh@6283`).*

---

## 🧪 Verification Script

To verify that the database connections, token authentication, sales updates, and PDF creation are working correctly, run the local verification test suite:

```bash
cd server
node verify.js
```
*Outputs a successful validation sequence and creates a sample `test-report.pdf` in your `server` directory.*

---

## 🚀 Production Hosting Guide

### 1. Database (MongoDB Atlas)
1. Set up a free **M0 Cluster** on MongoDB Atlas.
2. Under Network Access, whitelist the IP addresses of your hosting provider (or set to `0.0.0.0/0` temporarily).
3. Copy the database connection string and use it as `MONGO_URI`.

### 2. Backend (Render / Railway)
1. Add `server/` files to Git.
2. In your host control panel, set the following configurations:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - Configure the environment variables (`MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`).

### 3. Frontend (Vercel / Netlify)
1. Import your `client/` subdirectory.
2. Configure your environment variable:
   - Set `VITE_API_URL` to your live hosted backend URL.
3. Deploy. The platform will automatically compile the React app and deploy it on a secure CDN.
