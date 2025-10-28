# 🍦 Sweet Solutions REPO GUIDE FOR BEST GROUP EVER

Scheduling, payroll, and team coordination tooling for Howdy Homemade ice‑cream shops.  
This repository houses both the Next.js web client.

---

## 1. What You Need Before Cloning

- **Node.js 18.x or newer** (use `nvm install 18 && nvm use 18` if you manage multiple versions)
- **npm 9+** (ships with Node 18) – pnpm/yarn also work but all scripts below assume npm
- **MongoDB** (only required if you plan to run the real backend instead of the mock client data)

---

## 2. Clone & Install Dependencies

```bash
git https://github.com/justinreginaldtan/icecream-scheduler.git
cd sweet-solutions
npm install                   # installs root tooling + frontend/backend workspaces do it in root folder
```

---

## 3. Environment Variables

### Frontend (`frontend/.env.local`)
The UI currently runs against a fully mocked client, but set the API URL so you can swap to the real backend later:

```bash
cp frontend/env.example frontend/.env.local
```

Edit if needed:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (`backend/.env`)
Only required if you intend to boot the Express API plus MongoDB.

```bash
cp backend/env.example backend/.env
```

Adjust values:
```env
PORT=3001
DATABASE_URL=mongodb://localhost:27017/sweet-solutions
JWT_SECRET=change-me
FRONTEND_URL=http://localhost:3000
```

Start MongoDB locally (or point `DATABASE_URL` to Atlas/Compose/etc.) before launching the backend. We will replace this in the future for AWS stuff, i just added it for testing purposes.

---

## 4. Running the Apps

### All-in-one (recommended while developing)
Runs Next.js on `http://localhost:3000` and the Express server on `http://localhost:3001` in parallel.

```bash
npm run dev
```

The command uses `concurrently` to execute:
- `npm run dev:frontend` → `frontend` workspace
- `npm run dev:backend` → `backend` workspace

Stop the process with `Ctrl+C`. If ports are already in use, free them before restarting.

### Separate terminals (optional)
```bash
# Terminal A
npm run dev:frontend

# Terminal B
npm run dev:backend
```

### Production builds
```bash
npm run build        # builds frontend & backend
# then
npm run start        # serves backend; run `npm run start:frontend` from the frontend workspace for the static build
```

---

## 5. Mock Accounts & Login Flow

With the current mocked frontend auth (no running API required):

- **Manager**: `mari.lisa@example.com` / `demo123`
- **Employee**: `justin.tan@example.com` / `demo123`

Login persists user information to `localStorage`; use the new **Logout** button at the bottom of the sidebar (or the header dropdown) to clear state and return to `/login`.

---

## 6. Repo Layout

```
sweet-solutions/
├── frontend/            # Next.js 16 + Tailwind + shadcn UI client
│   ├── app/             # App Router routes ((auth), (dashboard), layout, globals)
│   ├── components/      # UI + layout + feature modules
│   ├── hooks/           # Custom React hooks (e.g., useToast)
│   └── lib/             # Auth context, mock API client, data, utilities
│
├── backend/             # Express.js API (optional while mock logic is in place)
│   └── src/             # Controllers, models, routes, middleware, config
│
├── package.json         # Root scripts (`dev`, `build`, `install:all`, etc.)
├── package-lock.json
└── docs/                # Architecture notes (`ARCHITECTURE.md`, tuning docs, etc.)
```

Useful root scripts (`package.json`):

| Script              | Description                                                |
|---------------------|------------------------------------------------------------|
| `npm run dev`       | Start frontend + backend together                          |
| `npm run dev:frontend` | Frontend only                                            |
| `npm run dev:backend`  | Backend only                                            |
| `npm run build`     | Build both workspaces                                      |
| `npm run install:all` | Convenience install (`npm install` + workspace installs) |

> ESLint scripts are defined inside the frontend package. The repo still keeps the legacy `.eslintrc` format; upgrading to ESLint 9’s flat config is on the backlog.

---

## 7. Optional: Running the Backend for Real Data

1. Ensure MongoDB is running locally (`mongod`) or available remotely.
2. Confirm `backend/.env` points to that instance.
3. From `backend/` run:
   ```bash
   npm run dev
   ```
4. Update `frontend/.env.local` if you changed the API host/port.
5. Restart the frontend (`npm run dev`) to pick up the new environment variables.

The frontend will automatically use live data whenever the API responds successfully; otherwise it falls back to the client-side mocks.

---

LETS COOK TEAM!!!
