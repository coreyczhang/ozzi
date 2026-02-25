# ozzi 🍱

> Real-time dining hall ratings for Northwestern students — built to reduce food waste and help Wildcats eat better.

**[Live Demo →](https://ozzi-corzha007-8912-corzha007-8912s-projects.vercel.app/)**

---

## What it is

ozzi is a mobile-first web app that lets Northwestern students rate dining hall food in seconds. Think Reddit upvotes meets Yelp reviews, designed for the 30-second window between getting your food and sitting down.

Ratings feed directly into a live analytics dashboard for Levi Restaurant Associates so they can see what's working, what isn't, and where food is going to waste.

---

## Features

**For students**
- **One-tap voting** — 👍/👎 right on the feed card, no clicks into a detail page
- **Inline reviews** — write a review without leaving the feed; expands in place below the card
- **Quick tags** — "🔥 Amazing!", "😑 Bland", "🧂 Too Salty", etc. for structured feedback
- **Live activity feed** — see what other Wildcats are rating in real time
- **Geolocation** — auto-detects which dining hall you're at and surfaces that menu first

**For Levi (dining services)**
- Approval % per hall and per item
- Top feedback tags with counts
- Written review feed pulled from all halls
- Waste reduction insights linking low-rated items to specific complaints

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite |
| Styling | Inline styles + Syne font |
| Deployment | Vercel |
| Auth (planned) | Northwestern SSO |
| Backend (planned) | Firebase Firestore |

---

## Running locally

```bash
git clone https://github.com/coreyczhang/ozzi.git
cd ozzi
npm install
npm run dev
```

Opens at `http://localhost:5173`.

---

## Deploying

```bash
npm run build && vercel --prod
```

---

## Roadmap

- [ ] Firebase backend with persistent ratings + reviews
- [ ] Northwestern SSO login
- [ ] Live menu sync from Levi's system
- [ ] Push notifications when a favorited item is available
- [ ] Native iOS/Android app (React Native)

---

## Built by

Corey Zhang · Northwestern University `26  
CS + Economics · McCormick / Weinberg
