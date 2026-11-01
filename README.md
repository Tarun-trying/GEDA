# GreenSaathi 🌿 | Fullstack Architecture (Frontend + Backend)

> **Hackathon Problem Statement:** HC26-GEDA01: Green Energy & Sustainability  
> **Client / Authority:** Gujarat Energy Development Agency (GEDA) • Mission LiFE Initiative

GreenSaathi has been structured into a standard **Fullstack Project Layout** featuring an interactive **React + Vite Frontend** and a lightweight **Node.js / Express REST API Backend** equipped with a persistent file-backed database and realistic Gujarat dummy datasets.

---

## 📁 Project Layout Overview

```
New folder (2)/
├── frontend/                          # React + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/                # Header, Sidebar, StatCard, ChallengeCard, etc.
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Civic banner, stats, Recharts baseline, tips
│   │   │   ├── FootprintCalculator.jsx# Carbon accounting form with presets
│   │   │   ├── Challenges.jsx         # Mission LiFE gamified pledges & points
│   │   │   ├── SolarCalculator.jsx    # Rooftop solar sizing & payback estimator
│   │   │   └── CivicDatabase.jsx      # Bills table, district leaderboard, activity feed
│   │   ├── database/                  # Client-side fallback database & seed data
│   │   ├── utils/                     # emissions.js, solar.js, recommendations.js, api.js
│   │   ├── data/                      # config.js, challenges.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                           # Express.js REST API & Persistent Database
│   ├── src/
│   │   ├── database/
│   │   │   └── db.js                  # File-backed JSON DB engine with atomic writes
│   │   ├── data/
│   │   │   └── dummyData.js           # 12 bills, 8 districts, citizen activity logs
│   │   └── server.js                  # Express API server listening on port 5000
│   ├── data/
│   │   └── database.json              # Active persistent database file
│   └── package.json
│
├── package.json                       # Root workspace orchestrator
└── README.md
```

---

## 🚀 Running the Fullstack Application

You can run the frontend and backend together or independently:

### Option 1: Run Together (Standard)

1. **In Terminal 1 — Start the Backend Server:**
   ```bash
   npm run dev:backend
   # Backend live on http://localhost:5000
   ```

2. **In Terminal 2 — Start the Frontend Development Server:**
   ```bash
   npm run dev:frontend
   # Frontend live on http://localhost:3000
   ```

---

## 🗄️ Database & Dummy Datasets

The backend and frontend are pre-seeded with realistic Gujarat clean-energy data:

1. **Smart Meter Bills Collection (`bills`):**
   - 6+ pre-seeded monthly domestic power bills (May 2025 back through Dec 2024).
   - Covers Gujarat DISCOMs: **UGVCL**, **DGVCL**, **MGVCL**, **PGVCL**, and **Torrent Power**.
   - Fields: `billNumber`, `month`, `unitsKwh`, `billAmountInr`, `emissionsKg`, `status: Verified & Paid`.
   - Users can search, filter by DISCOM, and insert new bills directly from the UI or via API.

2. **Gujarat District Benchmarks Collection (`districts`):**
   - Ranks the 8 primary urban zones: **Gandhinagar (#1)**, **Surat (#2)**, **Ahmedabad (#3)**, **Rajkot (#4)**, **Vadodara (#5)**, **Mehsana (#6)**, **Bhavnagar (#7)**, **Jamnagar (#8)**.
   - Metrics: `lifeIndex` (score / 100), `rooftopSolarMw`, `co2OffsetTonnes`, `citizensEngaged`, `avgKwhPerHousehold`.

3. **Citizen Activity Log Collection (`activity`):**
   - Real-time stream of self-reported Mission LiFE interventions across Gujarat.

4. **Data Persistence & Recovery:**
   - Saved automatically to `backend/data/database.json`.
   - Includes **Export Full JSON Snapshot**, **Import JSON Payload**, and **Restore Gujarat Seed Data** buttons.

---

## 🌐 Backend REST API Reference (`http://localhost:5000`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server heartbeat & status |
| `GET` | `/api/bills` | Fetch bills (supports `?discom=UGVCL&search=May`) |
| `POST` | `/api/bills` | Insert a new smart meter billing record |
| `DELETE`| `/api/bills/:id` | Remove a billing record |
| `GET` | `/api/districts` | Fetch Gujarat 8-district benchmark rankings |
| `GET` | `/api/districts/:id`| Fetch specific district by ID |
| `GET` | `/api/challenges` | Predefined Mission LiFE challenges list |
| `POST` | `/api/challenges/:id/complete` | Complete a challenge and earn points |
| `GET` | `/api/activity` | Recent statewide citizen activity feed |
| `POST` | `/api/activity` | Log a new citizen action |
| `POST` | `/api/calculate/emissions` | Compute carbon emissions ($0.70 \text{ kg/kWh}$) |
| `POST` | `/api/calculate/solar` | Compute rooftop sizing, savings & payback |
| `GET` | `/api/db/stats` | Database records count and aggregate metrics |
| `POST` | `/api/db/reset` | Restore factory Gujarat seed dummy data |
| `GET` | `/api/db/export` | Download full database JSON |
| `POST` | `/api/db/import` | Overwrite database with custom JSON |
