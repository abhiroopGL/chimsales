# React + Vite


This are the test changes3.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


This can be used for invoice pdf
@apandresipm/pdf-invoice

to run it on ngrok
ngrok http --url=crucial-escargot-concrete.ngrok-free.app 5173

Use spree for rails, it has drag drop functionality



# 🧾 Invoice Management System

A simple and powerful invoice management system built with **Node.js**, **Express.js**, and **Sequelize ORM**.

---

## 🚀 Features
- Create, read, update, and delete invoices.
- Store and manage customer details:
  - Name, Phone, Email
  - Address, Governorate, Area, Street
- Associate invoices with **Users** (created by).
- Add multiple **Invoice Items** per invoice.
- Auto-calculations for:
  - Subtotal
  - Tax (rate & amount)
  - Discount (rate & amount)
  - Final total
- Invoice status tracking:
  - `draft`, `sent`, `paid`, `overdue`
- Manage due dates, paid dates, and sent timestamps.
- Notes and terms fields for customization.
- API responses include **invoice details, items, and creator info**.

---

## 🛠️ Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (via Sequelize ORM)
- **Authentication**: Sequelize `User` association
- **Migrations**: Sequelize CLI

---

## 📦 Installation

```bash
# Clone the repository
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run database migrations
npx sequelize-cli db:migrate

# Start server
npm run dev
