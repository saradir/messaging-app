# NetTalker

A full-stack real-time chat app built with React, Node.js, and PostgreSQL.

🔗 **[Live Demo → nettalker.netlify.app](https://nettalker.netlify.app)**

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js & Express
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Real-time:** Socket.io
- **Authentication:** Session-based with encrypted cookies

## Features

- Real-time bi-directional messaging via Socket.io
- Persistent login sessions using `connect-pg-simple` and Prisma (survives server restarts)
- Schema migrations managed with Prisma
- CORS and secure cookie handling (SameSite/Secure) with environment-based config
- Unread message counts *(in progress)*

## Running Locally

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/nettalker.git
   ```

2. **Create `backend/.env`:**
   ```env
   DATABASE_URL="your_supabase_connection_string"
   COOKIE_SECRET="your_random_64_char_string"
   CORS_ORIGINS="http://localhost:5173"
   NODE_ENV="development"
   ```

3. **Install and set up:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ../backend && npx prisma db push
   ```

4. **Start both servers** with `npm run dev` in `/backend` and `/frontend`.

## Deployment

- **Backend:** Render, using Supabase's connection pooler (port 6543) for IPv4 compatibility
- **Frontend:** Netlify with a `_redirects` file for SPA routing

---

*Built as a portfolio project for [The Odin Project](https://www.theodinproject.com/).*
