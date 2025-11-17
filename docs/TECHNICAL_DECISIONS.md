# TECHNICAL_DECISIONS.md

Final technical decisions for Sweet Solutions MVP. These are locked in and represent the architecture we're building toward.

---

## 1. Deployment Model: Electron Desktop Application

**Decision**: Distribute as a standalone Electron executable (`.exe` on Windows, `.dmg` on Mac)

**Why**:
- Store owner downloads one file and clicks it to run
- No separate backend service to manage
- Offline-capable (database lives locally)
- Professional desktop app experience
- Data never leaves the store owner's computer

**What This Means**:
- Frontend (Next.js) bundled inside Electron
- Backend (Express.js) runs as a **child process** spawned by Electron
- SQLite database stored locally on their machine
- Both processes communicate via localhost (no internet required after download)

---

## 2. Database: SQLite (Local File Storage)

**Decision**: Replace MongoDB with SQLite + better-sqlite3 driver

**Why**:
- Single file database (easy to backup, copy, move)
- No server setup needed
- Perfect for single-location business software
- Store owner can backup by copying the `.db` file
- Configurable storage location (home folder, external drive, etc.)

**What This Means**:
- Database lives as `~/.sweet-solutions/app.db` (configurable by user)
- Schema migration from Mongoose models to SQLite
- All backend queries rewritten with SQLite syntax
- No connection pooling or authentication needed

---

## 3. Backend Integration: Express as Child Process

**Decision**: Express.js server runs as a child process spawned by Electron main process

**Why**:
- Single executable to distribute
- Simpler UX (one icon to click)
- Cleaner than multiple separate executables
- If backend crashes, Electron can restart it

**What This Means**:
```
User clicks app icon
  ↓
Electron launches (main process)
  ↓
Electron spawns Express child process (auto-detect free port)
  ↓
Electron opens React app pointing to http://localhost:[port]
  ↓
User sees UI, all data is local
```

**Port Strategy**:
- Try port 3001 first
- If in use, auto-detect next available port (3002, 3003, etc.)
- Frontend always knows which port Express is running on (via IPC)

---

## 4. First-Run Experience

**Decision**: Guided setup wizard on first launch

**When User Opens App First Time**:
1. App detects: "No database yet"
2. Shows welcome screen with:
   - **Choose Database Location**: Folder picker (defaults to `~/.sweet-solutions/`)
   - **Create Admin Account**: Email + password form
   - **Confirm & Initialize**: Creates database and default admin user
3. User lands on login screen
4. Logs in with credentials they just created
5. Dashboard loads, ready to use

**On Subsequent Launches**:
- Skips wizard, goes straight to login screen

---

## 5. User & Session Management

**Decision**: No additional security layers beyond login

**Why**:
- Store owner uses this on their own machine
- No shared login needed
- Simpler UX

**What This Means**:
- Single admin account per store
- Login persists in localStorage (app remembers you're logged in)
- Logout clears session
- No master password or pin protection
- No multi-user support for MVP

---

## 6. Auto-Updates

**Decision**: No auto-updates. This is a one-time download, standalone app.

**Why**:
- Store owner never contacts us again
- We're giving them a binary file, they own it forever
- Simpler app (no update checking, no cloud connectivity)

**What This Means**:
- Every new version is a separate download (store owner manually updates)
- Version info is hardcoded in app
- No "Check for Updates" button in UI

---

## 7. System Tray Integration

**Decision**: Yes, add system tray support

**Why**:
- Professional polish
- Store owner can minimize app without closing it
- Quick access from taskbar

**What This Means**:
- Minimize button hides app to system tray (icon in bottom-right on Mac/Windows)
- Clicking icon brings app back
- Close button actually closes the app

---

## 8. File Structure: Monorepo with Electron Layer

**Decision**: Keep existing monorepo structure, add Electron layer on top

```
sweet-solutions/
├── frontend/           # Next.js app (bundled by Electron)
├── backend/            # Express API (runs as child process)
├── electron/           # Electron main process + IPC handlers
│   ├── main.js         # Electron entry point
│   ├── preload.js      # IPC security layer
│   └── ipc-handlers/   # IPC event handlers
├── package.json        # Root (orchestrates build)
└── docs/               # Documentation (this folder)
```

---

## 9. Frontend-Backend Communication

**Decision**: Two channels:
1. **HTTP/REST**: Frontend makes normal HTTP requests to Express (localhost:3001 or auto-detected port)
2. **IPC**: Electron main ↔ frontend for app-level concerns (window events, port info, file system, etc.)

**Why**:
- Express API is self-contained and testable
- Electron IPC handles only necessary app concerns
- Clean separation of concerns

**What Happens**:
```
Frontend needs data
  ↓
Makes HTTP request to http://localhost:[port]/api/employees
  ↓
Express processes request
  ↓
Queries SQLite database
  ↓
Returns JSON response
  ↓
Frontend updates UI
```

---

## 10. Data Backup Strategy

**Decision**: Manual backups + one-click export

**For MVP**:
- Store owner can copy the `.db` file to backup it
- Add "Backup Database" button in settings (prompts folder picker, copies `.db` file)
- Add "Export All Data" button (exports shifts, employees, payroll as CSV)

**Future**: Automated daily backups to `backups/` folder

---

## 11. Build & Distribution

**Decision**: Single executable per OS (Windows, Mac, Linux)

**Tools**:
- `electron-builder`: Packages Electron app into `.exe` (Windows), `.dmg` (Mac), `.AppImage` (Linux)
- No code signing for MVP (store owner gets security warning on first run, but can ignore)

**What Store Owner Does**:
1. Downloads `sweet-solutions-1.0.0.exe`
2. Clicks to install
3. App launcher appears in Start Menu / Applications
4. Clicks to run, setup wizard appears
5. Never updates (unless manually downloads new version)

---

## 12. Error Handling & Recovery

**Decision**: Graceful degradation with clear error messages

**If Backend Crashes**:
- Electron detects Express died
- Automatically restarts Express
- User sees toast notification: "Connection restored"

**If Database Corrupted**:
- User gets error message: "Database error. Choose: (A) Reset Database (clears all data), (B) Report Issue"
- Can reset and start fresh

**If Port Already In Use**:
- Auto-detects next free port
- Works seamlessly (user doesn't need to know)

---

## 13. Feature Priority for MVP

**Fully Implemented & Required**:
- ✅ Authentication (manager login)
- ✅ Employee management (CRUD)
- ✅ Shift scheduling (create, view, edit, delete)
- ✅ Time-off requests (request, approve, deny)
- ✅ Payroll tracking (hours, rates, totals)
- ✅ CSV export (for payroll, reports)

**Not Needed for MVP**:
- ❌ Real-time notifications (future)
- ❌ Shift swap feature (future)
- ❌ Reports page (skeleton exists, but not functional)
- ❌ Settings persistence (future)
- ❌ Multi-location support (future)
- ❌ Mobile app (future)

**Currently Broken, Must Fix**:
- ❌ Dashboard hardcoded data (fix after DB migration)
- ❌ Reports page (leave as skeleton, mark "Coming Soon")
- ❌ Settings UI doesn't persist (fix after DB migration)

---

## 14. Development Workflow

**For Now** (building MVP):
1. `npm install` (installs all workspaces)
2. `npm run dev` (starts frontend + backend for testing)
3. Test with mock data or real backend
4. `npm run build` (builds everything)
5. `npm run electron-dev` (launches Electron with bundled app)

**For Store Owner** (after release):
1. Download `.exe` / `.dmg`
2. Install
3. Click to run
4. Setup wizard
5. Use app

---

## 15. TypeScript Usage

**Decision**: Use TypeScript for new code, keep existing JS

**Why**:
- Better developer experience
- Catches bugs early
- Frontend already uses TypeScript
- Backend can use TypeScript for new files

**What This Means**:
- Electron code: TypeScript (main.ts, ipc-handlers/*.ts)
- Backend SQLite layer: TypeScript (new files)
- Don't force refactor existing backend (too much work)

---

## Summary: The Mental Model

Think of Sweet Solutions as a **self-contained app store owner downloads once**:

1. **Single Executable**: Clicking the icon launches everything
2. **All Local**: Data stays on their machine, no cloud
3. **Simple Setup**: First-run wizard configures everything
4. **No Maintenance**: No updates, no configuration files, just works
5. **Data Ownership**: Store owner owns the `.db` file, can backup/move it anywhere

This is fundamentally different from a web app or cloud service. It's a **true desktop application**.

---

## Questions This Answers

- **"Will the store owner understand how to use this?"** Yes, single icon to click, everything else is self-explanatory.
- **"What if their computer crashes?"** Database file is backed up in multiple places (they can copy the .db file to external drive).
- **"What if our company disappears?"** They still have the app forever, it works offline.
- **"How do we handle updates?"** We don't (for MVP). They manually download new versions if they want.
- **"Does it need internet?"** No (except to download the initial `.exe` / `.dmg`).

---

## Revision History

**Version 1.0** - November 2025
- Initial technical decisions locked in
- Decision: Electron + SQLite + Express child process
- No auto-updates, one-time download model
