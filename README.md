# Doctar Backend

Node.js + Express + MongoDB API for the Doctar surgery website.

## Folder structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── bookingController.js  # Booking request handlers
├── models/
│   └── Booking.js         # Booking Mongoose schema
├── routes/
│   └── booking.js         # /api/bookings routes
├── server.js              # App entry point
├── .env                   # Secrets (not committed)
└── .env.example           # Env template
```

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGODB_URI
npm run dev            # auto-restart on changes
# or
npm start
```

Server runs on `http://localhost:3001`.

## Environment variables

Set these in `.env` locally and in the Render dashboard (Environment → Environment Variables) for deployment:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 3001) |
| `MONGODB_URI` | MongoDB connection string |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail + App Password for Nodemailer |
| `ADMIN_EMAIL` | Notification recipient |
| `CLOUDINARY_CLOUD_NAME` | `dfnkkpmf8` |
| `CLOUDINARY_API_KEY` | `744157697268941` |
| `CLOUDINARY_API_SECRET` | `your_secret_here` (keep secret — never commit) |

Image uploads (`POST /api/upload`) are streamed straight to Cloudinary (memory storage,
no local disk) and stored as WebP capped at 1200px wide in the `doctar-surgery` folder.

## API

| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | `/`                   | Health check           |
| POST   | `/api/bookings/book`  | Create a booking       |
| GET    | `/api/bookings/all`   | List all bookings      |

### Create a booking

```json
POST /api/bookings/book
{ "name": "Riya", "phone": "9876543210", "disease": "Knee Replacement" }
```
