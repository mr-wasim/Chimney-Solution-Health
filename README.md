# Chimney Solutions — Next.js + Tailwind Starter

This repository is a starter implementation built to match the user's specification:
- Next.js (no TypeScript)
- Tailwind CSS for styling
- MongoDB for data storage
- Technician form that creates a report + QR code
- Public report page accessible by QR (unique per report)
- Admin area (basic CRM) with username `admin` and password `Chimeny@123`
- Warranty expiration logic and automatic score degradation visible on report page
- Vercel-ready

## Quick setup

1. Copy `.env.local.example` to `.env.local` and set your MongoDB URI and JWT secret.
2. `npm install`
3. `npm run dev`
4. Visit http://localhost:3000

## Important env vars

- `MONGODB_URI` — your MongoDB connection string.
- `JWT_SECRET` — a secret for admin sessions.
- `ADMIN_USER` — default: `admin`
- `ADMIN_PASS` — default: `Chimeny@123`

The sample MongoDB URI the user provided can be used in `.env.local`, but for security prefer creating a dedicated user.

## What is included

- `pages/technician.js` — technician form (creates a report)
- `pages/report/[id].js` — public report view (scans QR → opens this)
- `pages/admin/*` — admin login and dashboard (basic)
- `pages/api/*` — API routes for creating and fetching reports, auth
- `lib/mongodb.js` — connection helper for MongoDB
- Tailwind and CSS setup

This is a functional and extendable foundation. It focuses on the core requested features:
creating reports, unique QR per report, report view with animated circular progress,
warranty handling, score degradation (6 / 8 months rules), and admin CRUD skeleton.

After reviewing, you can ask me to:
- Expand the admin CRM with pagination and filters
- Add PDF export / warranty card image generation (html2canvas + jsPDF)
- Improve animations, icons, and production polish
