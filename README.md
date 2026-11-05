# StudioSpace

A peer-to-peer marketplace where creators book photo studios, sound stages, podcast lounges, music suites, and art workshops by the hour.

**Live site:** https://studio-space-client-nu.vercel.app
**Server repo:** https://github.com/YOUR_USERNAME/studiospace-server
**API:** https://studiospace-server-mq2g.onrender.com

> The API runs on a free Render plan and can take up to a minute to wake after idle. If studios don't load at first, wait and refresh.

## Features

- Email/password and Google sign-in with Better Auth, plus a JWT stored in an HttpOnly cookie that the Express API verifies (401 when missing)
- Explore page with search, category chips, price range, and sorting, with skeleton loaders and empty states
- Studio details with a Swiper gallery, amenities, reviews, and host info
- Full studio CRUD: add, update, and delete with a confirmation modal, plus image upload through imgbb
- Booking system with Pending, Confirmed, Completed, and Cancelled statuses, and **double-booking prevention** that rejects overlaps with Confirmed bookings
- Host tools: confirm or decline requests, and mark sessions completed
- Saved studios wishlist and a downloadable PDF invoice for confirmed bookings
- Light and dark theme toggle that persists across reloads
- Private routes that stay logged in after a reload

## Tech Stack

- **Client:** Next.js (App Router), TypeScript, Tailwind CSS, DaisyUI, Swiper, Sonner
- **Auth:** Better Auth with the MongoDB adapter, and JWT (HttpOnly cookie)
- **Server:** Express.js, MongoDB (native driver)
- **Hosting:** Vercel (client), Render (server), MongoDB Atlas

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Host | HOST_EMAIL | HOST_PASSWORD |
| Guest | GUEST_EMAIL | GUEST_PASSWORD |

Google sign-in also works with any Google account.

## Local Setup

```bash
git clone https://github.com/YOUR_USERNAME/studiospace-client.git
cd studiospace-client
npm install
```

Create `.env.local`:

```dotenv
API_URL=http://localhost:5000
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=a_random_32_plus_character_string
BETTER_AUTH_URL=http://localhost:3000
JWT_SECRET=same_value_as_the_server
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

```bash
npm run dev
```

The server repo needs its own `.env` (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`), then `npm install`, `npm run seed`, and `npm run dev`.