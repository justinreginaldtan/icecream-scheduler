# 🍦 Sweet Solutions REPO GUIDE FOR BEST GROUP EVER

Scheduling, payroll, and team coordination tooling for Howdy Homemade ice‑cream shop.  

---

## Table of Contents

- [Quick Setup Guide if you don't wanna read the whole thing](#quick-setup-guide-if-you-dont-wanna-read-the-whole-thing)
- [Full Setup Guide](#full-setup-guide)
- [Environment Variables](#3-environment-variables)
- [Running the Apps](#4-running-the-apps)
- [Mock Accounts & Login Flow](#5-mock-accounts--login-flow)
- [Repo Layout](#6-repo-layout)
- [Optional: Running the Backend for Real Data](#7-optional-running-the-backend-for-real-data)
- [Branch Workflow Cheat Sheet](#branch-workflow-cheat-sheet)

---

# Quick Setup Guide if you don't wanna read the whole thing

  ### TL;DR you can just run these commands b2b and should be good.

  ```bash
  # clone the repo
  git clone https://github.com/justinreginaldtan/icecream-scheduler.git
  cd sweet-solutions

  # install everything (root + frontend + backend workspaces)
  npm install

  # copy env files
  cp frontend/env.example frontend/.env.local
  cp backend/env.example backend/.env   # skip if you're only touching the frontend

  # start both apps (Next.js + mock backend)
  npm run dev

  Open http://localhost:3000 once the terminal says “Ready.”

  ```

# Full Setup Guide

## 1. What You Need Before Cloning

- **Node.js 18.x or newer** (use `nvm install 18 && nvm use 18` if you manage multiple versions)
- **npm 9+** (ships with Node 18) – pnpm/yarn also work but all scripts below assume npm
- **MongoDB** (only required if you plan to run the placeholder backend instead of the mock client data that i set up for testing)

---

## 2. Clone 

```bash
git clone https://github.com/justinreginaldtan/icecream-scheduler.git
cd sweet-solutions
npm install                   # do it in root folder
```

---

## 3. Environment Variables

### Frontend (`frontend/.env.local`)
The UI currently runs against a fully mocked client, but set the API URL so you can swap to the real backend later: You can do the following command below and just continue without worrying.

```bash
cp frontend/env.example frontend/.env.local
```

Edit if needed:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (`backend/.env`)
Only required if you intend to boot the Express API plus MongoDB, but not necessary tbh if you just wanna test UI. we're gonna replace everything with AWS stuff in the future.

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

### Option 1: All-in-one (recommended while developing)
Runs Next.js on `http://localhost:3000` and the Express server on `http://localhost:3001` in parallel.

```bash
npm run dev
```

The command uses `concurrently` to execute:
- `npm run dev:frontend` → `frontend` workspace
- `npm run dev:backend` → `backend` workspace

stop the process with `Ctrl+C`. If ports are already in use, free them before restarting.

### Option 2: Separate terminals
```bash
# Terminal A
npm run dev:frontend

# Terminal B
npm run dev:backend
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

> ESLint scripts are defined inside the frontend package. The repo still keeps the legacy `.eslintrc` format; upgrading to ESLint 9’s flat config is on the backlog. sorry guys i have a 2018 macbook pro and i cant use newer versions.

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

## Branch Workflow Cheat Sheet

  # 1. make sure main is clean and up to date
  git switch main                 # or: git checkout main
  git pull origin main

  # 2. create your own branch off main
  git switch -c your-name/task-short-description
  # example: git switch -c justin/update-readme

  Now edit your files. When you’re ready to save:

  # 3. stage and commit your work
  git add README.md                 # add the files you changed
  git commit -m "Update README with quick start guide"

  # 4. push your branch to GitHub
  git push origin your-name/task-short-description

  GitHub will show a banner like “Compare & pull request.” Click that, review the diff, and hit “Create pull
  request.” Once it looks good, press “Merge pull request.”

  After merging, clean up:

  # 5. pull the fresh main and delete your branch locally
  git switch main
  git pull origin main
  git branch -d your-name/task-short-description      # deletes the local branch
  git push origin --delete your-name/task-short-description  # optional: removes it from GitHub

LETS COOK TEAM!!!
