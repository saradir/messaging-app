# Nettalker
**A High-Performance Full-Stack Messaging Application**

Nettalker is a real-time communication platform designed for speed and reliability. Built with a focus on technical mastery and high-concept world-building aesthetics, it utilizes WebSockets for instantaneous data transfer and a robust PostgreSQL backbone for persistent session management.

## 🛠 Tech Stack

*   **Frontend:** React (Vite)
*   **Backend:** Node.js & Express
*   **Database:** PostgreSQL via Supabase
*   **ORM:** Prisma
*   **Real-time:** Socket.io
*   **Authentication:** Session-based with encrypted cookies

##  Key Features

*   **Real-Time Bi-Directional Messaging:** Low-latency communication powered by Socket.io.
*   **Smart Read Receipts:** Visual indicators for unread message counts (WIP) and message status, ensuring clear communication flow.
*   **Persistent Sessions:** Custom session middleware utilizing `connect-pg-simple` and Prisma to ensure users stay logged in across server restarts.
*   **Full-Stack Architecture:** A decoupled system with a dedicated Express API and a React client.
*   **Database Versioning:** Managed schema migrations using Prisma to ensure data integrity.
*   **Production-Ready Security:** Implementation of CORS policies, secure cookie handling (SameSite/Secure), and environment-driven configuration.
##  Quick Start

> **Note:** The production environment is live at [nettalker.netlify.app](https://nettalker.netlify.app). For local development, follow the steps below.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/nettalker.git](https://github.com/yourusername/nettalker.git)
    ```

2.  **Environment Setup:**
    Create a `.env` file in the `backend` directory:
    ```env
    DATABASE_URL="your_supabase_connection_string"
    COOKIE_SECRET="your_random_64_char_string"
    FRONTEND_URL="http://localhost:5173"
    NODE_ENV="development"
    ```

3.  **Install & Database Sync:**
    ```bash
    # Install dependencies for both halves
    cd backend && npm install
    cd ../frontend && npm install

    # Sync database schema
    cd ../backend
    npx prisma db push
    ```

4.  **Launch:**
    Run `npm run dev` in both the `/backend` and `/frontend` directories.

##  Deployment

*   **API/Backend:** Hosted on **Render** utilizing a Supabase connection pooler (Port 6543) for stable IPv4 outbound connectivity.
*   **Client/Frontend:** Hosted on **Netlify** with custom redirect handling for SPAs via a `_redirects` configuration.

---
