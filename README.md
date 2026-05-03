# VOGUEVAULT
A premium, high-performance fashion e-commerce platform inspired by industry leaders.

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-purple.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ABOUT

VogueVault is a production-ready, full-stack web application designed to deliver a seamless shopping experience. Inspired by leading platforms like Myntra and Zara, it features a minimalist, responsive UI packed with advanced real-time capabilities. With over 200+ products, an integrated admin dashboard, and robust real-time notifications, this platform is built for modern e-commerce.

---

## LIVE DEMO

🌐 **Live:** [voguevault.vercel.app](https://voguevault.vercel.app)

**Admin Panel Access:**
Navigate to `/admin` to access the dashboard.
- **Email:** `admin@voguevault.com`
- **Password:** `Admin@123`

---

## FEATURES

| User Panel | Admin Panel |
|---|---|
| • Browse 200+ fashion products<br>• Advanced filters & smart search<br>• Product detail with image zoom<br>• Cart & wishlist<br>• Multi-step checkout<br>• Order tracking with live status<br>• Reviews & ratings<br>• Coupon system<br>• Google + Email auth<br>• Fully responsive | • Real-time dynamic dashboard<br>• Revenue & sales analytics<br>• Order pipeline management<br>• Live new-order notifications<br>• Product CRUD with Cloudinary<br>• User management<br>• Payment tracking (online + COD)<br>• Inventory alerts<br>• Coupon management<br>• CSV export |

---

## TECH STACK

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, Zustand |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Auth** | JWT, Firebase (Google OAuth) |
| **Real-time** | Ably |
| **Images** | Cloudinary |
| **Charts** | Recharts |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## SCREENSHOTS

| | |
|---|---|
| ![Home](screenshots/home.png)<br>**Homepage** | ![Shop](screenshots/shop.png)<br>**Shop Page** |
| ![Product](screenshots/product.png)<br>**Product Detail** | ![Cart](screenshots/cart.png)<br>**Cart & Checkout** |
| ![Dashboard](screenshots/dashboard.png)<br>**Admin Dashboard** | ![Orders](screenshots/orders.png)<br>**Order Management** |

---

## QUICK START

**Prerequisites:** Node.js 18+, MongoDB, Cloudinary account, Ably account

```bash
# Clone the repository
git clone https://github.com/yourusername/voguevault.git

# Server setup
cd server
npm install
# Configure .env variables
npm run seed
npm run dev

# Client setup (in a new terminal)
cd client
npm install
npm run dev
```
