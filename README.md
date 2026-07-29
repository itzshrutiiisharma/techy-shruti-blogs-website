# Techy.Shruti Blogs — Backend

Express + TypeScript + MongoDB (Mongoose) API for the [techy-shruti-blogs](https://github.com/itzshrutiiisharma/techy-shruti-blogs) frontend.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values
   ```bash
   cp .env.example .env
   ```
   - `MONGODB_URI`: get this from MongoDB Atlas (Compass connect string) — free tier is fine.
   - `JWT_SECRET`: any long random string.
   - `CLIENT_URL`: your Next.js frontend URL (`http://localhost:3000` locally).

3. Seed the database (creates the admin login + default categories)
   ```bash
   npm run seed
   ```
   Default admin login (change in `.env` before seeding):
   - email: `admin@techyshruti.com`
   - password: `changeme123`

4. Run in dev mode
   ```bash
   npm run dev
   ```
   Server starts on `http://localhost:5000`. Health check: `GET /api/health`.

5. Build for production
   ```bash
   npm run build
   npm start
   ```

## API Overview

| Resource      | Public                              | Admin (cookie auth required)                          |
|---------------|--------------------------------------|---------------------------------------------------------|
| Auth          | `POST /api/auth/login`               | `GET /api/auth/me`, `POST /api/auth/logout`             |
| Blogs         | `GET /api/blogs`, `GET /api/blogs/:slug` | `POST/PUT/DELETE /api/blogs`, `GET /api/blogs/admin/all` |
| Comments      | `GET/POST /api/blogs/:slug/comments` | `GET /api/comments`, `PATCH /api/comments/:id/status`, `DELETE /api/comments/:id` |
| Likes         | `POST /api/blogs/:slug/like`         | `GET /api/likes`                                        |
| Categories    | `GET /api/categories`                | `POST/PUT/DELETE /api/categories`                       |
| Tags          | `GET /api/tags`                      | `POST/DELETE /api/tags`                                 |
| Newsletter    | `POST /api/newsletter`               | `GET/DELETE /api/newsletter`                             |
| Contact       | `POST /api/contact`                  | `GET/PATCH/DELETE /api/contact`                          |
| Dashboard     | —                                     | `GET /api/dashboard/stats`, `GET /api/dashboard/views-series` |

Auth uses an **httpOnly JWT cookie** (`techy_token`) — login sets it, protected routes read it automatically. On the frontend, pass `credentials: "include"` in every `fetch` call.

## Notes

- All async route handlers are wrapped in `asyncHandler` — this is what was silently missing in the old Prisma/Postgres setup and caused unhandled-rejection crashes. Every error now flows into the single `errorHandler` middleware and returns a clean JSON response instead of crashing the process.
- Body validation is done with `zod` before hitting any controller — bad requests get a `400` with a clear message instead of a raw Mongoose stack trace.
- Slugs for blogs are auto-generated from the title (with a numeric suffix on collision), so the frontend never needs to submit one.
