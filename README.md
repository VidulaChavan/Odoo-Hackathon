# TransitOps — Smart Transport Operations Platform

A role-based fleet management web application built for real-time tracking of vehicles, drivers, trips, maintenance, and fuel/expense operations.

## Problem

Fleet operators today manage vehicles, drivers, and trips across spreadsheets, phone calls, and messaging apps, with no single connected view. This leads to missed maintenance windows, expired driver licenses going unnoticed, and dispatch decisions made without full visibility into vehicle and driver availability.

## Solution

TransitOps centralizes fleet operations into one dashboard, with role-based access so each user (Fleet Manager, Dispatcher, Safety Officer, or Financial Analyst) sees exactly the tools and data relevant to their role, backed by enforced business rules such as preventing dispatch of a vehicle that is in maintenance or assigning a driver whose license has expired.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, React Router, Axios
- Backend: Node.js, Express (CommonJS)
- Database: PostgreSQL, hosted on Railway
- ORM: Prisma v6
- Auth: JWT and bcrypt, role-based access control (RBAC)
- Validation: Zod
- Icons: lucide-react

## Features

- Authentication and RBAC: signup and login with role selection, JWT-based sessions, protected routes, role-filtered sidebar navigation
- Dashboard: real-time KPI cards for active vehicles, available vehicles, vehicles in maintenance, active and pending trips, drivers on duty, and fleet utilization percentage, filterable by vehicle type, status, and region, with a dark/light mode toggle
- Trip Dispatcher: full trip lifecycle including dispatch, complete, and cancel actions with automatic vehicle and driver status cascading and business-rule validation
- Vehicle Registry and Maintenance: vehicle CRUD operations, maintenance logs, and automatic status updates between In Shop and Available
- Driver Management: driver records, license expiry tracking, and safety score
- Fuel and Expense Tracking: per-vehicle fuel logs and expense records
- Alerts and Notifications: license expiry and maintenance due alerts surfaced on the dashboard
- Design System: a dual-mode dark and light color system built with CSS variables, used consistently across all modules

## Business Rules Enforced

- Vehicle registration numbers and driver license numbers must be unique
- Retired or in-shop vehicles are excluded from dispatch selection
- Drivers with expired licenses or suspended status cannot be assigned
- A vehicle or driver already on a trip cannot be double-booked
- Cargo weight cannot exceed a vehicle's maximum load capacity
- Dispatching, completing, or cancelling a trip automatically updates vehicle and driver status

## Role-Based Access

Fleet Manager: primary access to Vehicle Registry and Maintenance, view access to Dashboard and Reports
Dispatcher: primary access to Trip Dispatcher, view access to Vehicle and Driver lists
Safety Officer: primary access to Driver Management, view access to Trips and Maintenance
Financial Analyst: primary access to Fuel and Expense and Reports, view access to Dashboard

## Getting Started

### Backend

cd backend
npm install
npm install prisma@6 @prisma/client@6

Create a .env file with:
DATABASE_URL=your Postgres connection string
JWT_SECRET=your secret

Run:
node index.js

### Frontend

cd frontend
npm install

Create a .env file with:
VITE_API_URL=http://localhost:5000

Run:
npm run dev

## Folder Structure

hackathon-project/
  backend/
    prisma/schema.prisma
    src/routes/, src/controllers/, src/schemas/, src/middleware/, src/lib/
    src/app.js, index.js
  frontend/
    src/pages/, src/components/, src/api/, src/context/
    src/App.jsx, src/main.jsx, src/index.css
  docs/schema-notes.md

## Team

Built end-to-end by a team of four during a hackathon, with individual module ownership across authentication and dashboard, trip dispatch, vehicle and maintenance, and driver and fuel management.