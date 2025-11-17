# IMPLEMENTATION_ROADMAP.md

Step-by-step implementation plan to convert Sweet Solutions from mock data prototype to production-ready Electron app with SQLite.

---

## Overview

**Total Estimated Effort**: 5-6 weeks (one developer, full-time)

**Phase 1** (1 week): Database & Backend Refactor
**Phase 2** (1 week): Electron Setup & IPC Integration
**Phase 3** (1.5 weeks): Frontend Cleanup & Bug Fixes
**Phase 4** (1 week): Build & Testing
**Phase 5** (0.5 week): Documentation & First Release

---

## Phase 1: Database & Backend Refactor (1 week)

Replace MongoDB + mock data with SQLite. Backend becomes the source of truth.

### 1.1: Setup SQLite Database Layer
**Effort**: 2 days | **Blocker**: No | **Depends on**: Nothing

**Tasks**:
- [ ] Install dependencies: `better-sqlite3`, `path` (already in Node.js)
- [ ] Create `backend/src/database/db.js` - Database initialization and connection
- [ ] Create `backend/src/database/init.sql` - Table creation script
- [ ] Create `backend/src/database/seed.js` - Populate with mock data on first run
- [ ] Create `backend/src/utils/db-utils.js` - Helper functions (query, insert, update, delete)

**Key Files to Create**:
```
backend/src/database/
├── db.js              # Initialize SQLite, run migrations
├── init.sql           # CREATE TABLE statements
└── seed.js            # Populate demo data from mock-data.ts

backend/src/utils/
└── db-utils.js        # Query helpers
```

**Testing**: Verify db.db file creates in correct location, tables exist, seed data loads.

---

### 1.2: Refactor Backend Routes → SQLite
**Effort**: 3 days | **Blocker**: Yes (blocks Phase 2) | **Depends on**: 1.1

**Routes to Update**:
1. **Auth Routes** (`backend/src/routes/auth.js`):
   - `POST /api/auth/login` → Query User table, verify password
   - `GET /api/auth/me` → Query User table by ID from JWT
   - `POST /api/auth/logout` → No DB change needed

2. **Employee Routes** (`backend/src/routes/employees.js`):
   - `GET /api/employees` → SELECT * FROM Employee WHERE is_active = 1
   - `POST /api/employees` → INSERT into Employee
   - `PUT /api/employees/:id` → UPDATE Employee
   - `DELETE /api/employees/:id` → UPDATE Employee SET is_active = 0 (soft delete)

3. **Shift Routes** (`backend/src/routes/shifts.js`):
   - `GET /api/shifts` → SELECT from Shift with date filters
   - `POST /api/shifts` → INSERT into Shift
   - `PUT /api/shifts/:id` → UPDATE Shift
   - `DELETE /api/shifts/:id` → DELETE from Shift

4. **TimeOff Routes** (`backend/src/routes/requests.js`):
   - `GET /api/requests` → SELECT from TimeOffRequest with filters
   - `PUT /api/requests/:id/approve` → UPDATE status = 'approved'
   - `PUT /api/requests/:id/deny` → UPDATE status = 'denied'
   - `POST /api/requests` → INSERT into TimeOffRequest

5. **Payroll Routes** (`backend/src/routes/payroll.js`):
   - `GET /api/payroll` → SELECT from Payroll
   - `POST /api/payroll/generate` → Calculate hours from Shift, INSERT into Payroll
   - `PUT /api/payroll/:id/status` → UPDATE status
   - `GET /api/payroll/export` → Generate CSV from Payroll data

**Changes Required**:
- Replace `mockData.js` middleware with actual DB queries
- Remove Mongoose models (not using MongoDB)
- Rewrite validation to work with SQLite
- Update error messages to be more specific

**Testing**:
- Manually test each endpoint with Postman or curl
- Verify data persists after restart
- Test filters (date ranges, employee ID, status)

---

### 1.3: Remove MongoDB Dependencies
**Effort**: 1 day | **Blocker**: No | **Depends on**: 1.2

**Tasks**:
- [ ] Remove MongoDB connection code from `backend/src/server.js`
- [ ] Remove Mongoose models from `backend/src/models/` (no longer needed)
- [ ] Remove `seeders/` folder (we use `seed.js` now)
- [ ] Update `.env.example` to remove `DATABASE_URL`
- [ ] Remove `mongoose` and `bcryptjs` from package.json (keep bcryptjs for password hashing)
- [ ] Update `CLAUDE.md` and `ARCHITECTURE.md` to reflect SQLite

**Testing**: App still starts without MongoDB running

---

### 1.4: Add Database Configuration to Backend
**Effort**: 0.5 day | **Blocker**: No | **Depends on**: 1.1, 1.3

**Tasks**:
- [ ] Create `backend/src/config/paths.js` - Define database file location
  - Read from env var `DATABASE_PATH` (default: `~/.sweet-solutions/`)
  - Create directory if doesn't exist
  - Return full path to `app.db`
- [ ] Update `backend/src/database/db.js` to use configurable path
- [ ] Update `.env.example` with `DATABASE_PATH` (optional, defaults to home folder)

**Testing**: Verify database location is configurable via environment variable

---

**End of Phase 1 Checklist**:
- ✅ SQLite database initializes on startup
- ✅ All API routes query SQLite (not mock data)
- ✅ Data persists between app restarts
- ✅ Seed data populates on first run
- ✅ MongoDB completely removed
- ✅ Backend works standalone (no frontend needed)

---

## Phase 2: Electron Setup & IPC (1 week)

Create Electron wrapper, handle app startup, port detection, system tray.

### 2.1: Scaffold Electron Project
**Effort**: 1 day | **Blocker**: Yes | **Depends on**: Phase 1 complete

**Tasks**:
- [ ] Install `electron` dev dependency
- [ ] Install `electron-builder` for packaging
- [ ] Create `electron/main.ts` - Electron main process entry point
- [ ] Create `electron/preload.ts` - IPC security layer
- [ ] Create `electron/ipc-handlers/` folder structure:
  ```
  electron/ipc-handlers/
  ├── database.ts        # Database path, backup operations
  ├── app.ts             # App lifecycle, port info
  └── index.ts           # Register all handlers
  ```
- [ ] Update root `package.json` with Electron scripts

**Key Features in main.ts**:
1. Detect if database directory exists, create if needed
2. Spawn Express child process on app startup
3. Auto-detect free port (start at 3001, increment until free)
4. Create app window, point to frontend
5. Register IPC handlers
6. Handle app lifecycle (quit, close, etc.)

**IPC Channels to Create**:
- `electron:get-db-path` → Returns database file path
- `electron:get-server-port` → Returns Express port number
- `electron:backup-database` → Copy database to user-selected folder
- `electron:open-file-dialog` → Open folder picker for database location
- `electron:get-app-version` → Return app version
- `electron:open-external` → Open URL in browser

**Testing**:
- `npm run electron-dev` launches app window
- Database directory creates automatically
- Express starts on available port
- Frontend loads at http://localhost:[port]

---

### 2.2: Setup First-Run Wizard (Electron)
**Effort**: 1.5 days | **Blocker**: No | **Depends on**: 2.1

**Tasks**:
- [ ] Create `electron/ipc-handlers/setup.ts`:
  - `electron:setup-check` → Returns { isFirstRun: boolean }
  - `electron:setup-complete` → Marks setup as done
  - `electron:get-suggested-db-path` → Suggest `~/.sweet-solutions/`
  - `electron:validate-db-location` → Verify user-selected location exists/writable

- [ ] Create `frontend/app/(auth)/setup/page.tsx`:
  - Shows when first run detected
  - Step 1: Welcome + choose database location (folder picker)
  - Step 2: Create admin account (email, password, confirm)
  - Step 3: Confirm & initialize database
  - On completion: Redirect to login page

- [ ] Update `frontend/app/layout.tsx`:
  - Check first-run status
  - Redirect to `/setup` if first run
  - Otherwise show normal app

**Key Logic**:
```typescript
// On app load (frontend)
1. Ask Electron: "Is this first run?"
2. If yes: Redirect to /setup
3. If no: Show login screen

// Setup form submission
1. User chooses database location via folder picker
2. User creates admin account
3. Click "Initialize"
4. Frontend sends to backend: POST /api/setup/initialize
5. Backend: Creates User record, marks setup complete
6. Electron: Sets flag "setup complete"
7. Frontend: Redirects to login
```

**Testing**:
- First run shows setup wizard
- Database creates in chosen location
- Admin account can login
- Second run skips wizard, goes to login

---

### 2.3: Port Detection & Backend Startup
**Effort**: 1 day | **Blocker**: Yes (for Electron) | **Depends on**: 2.1

**Tasks**:
- [ ] Create `electron/utils/port-finder.ts`:
  - Function `findFreePort(startPort = 3001)` → Returns first available port
  - Tries ports 3001, 3002, 3003... until one is free

- [ ] Update `electron/main.ts`:
  - On app startup, call `findFreePort()`
  - Spawn Express with `PORT=<detected_port>`
  - Wait for Express to be ready (check `/health` endpoint)
  - Only then open window
  - Pass port to frontend via IPC

- [ ] Update `frontend/lib/api/client.ts`:
  - On app load, call `electron:get-server-port`
  - Use returned port for API base URL
  - Don't hardcode 3001

**Testing**:
- If port 3001 in use, automatically uses 3002
- Frontend correctly connects to auto-detected port
- App launches without port conflicts

---

### 2.4: System Tray Integration
**Effort**: 1 day | **Blocker**: No | **Depends on**: 2.1

**Tasks**:
- [ ] Update `electron/main.ts`:
  - Create system tray icon
  - Show/hide window on tray click
  - Minimize button hides to tray (not close)
  - "Quit" in tray closes app
  - Tray menu options: Show, Quit

- [ ] Icon files:
  - `electron/assets/tray-icon.png` (for Windows/Linux, 256x256)
  - `electron/assets/tray-icon-template.png` (for Mac, inverted)

**Testing**:
- Minimize button hides app to tray
- Click tray icon brings app back
- Quit from tray closes app
- System tray looks professional

---

**End of Phase 2 Checklist**:
- ✅ Electron app launches
- ✅ Express backend starts as child process
- ✅ Port auto-detection works
- ✅ First-run setup wizard works
- ✅ Database location configurable
- ✅ Admin account created on setup
- ✅ System tray integration complete
- ✅ Frontend connects to auto-detected port via IPC

---

## Phase 3: Frontend Cleanup & Bug Fixes (1.5 weeks)

Remove mock data layer, fix broken features, verify all CRUD works with real backend.

### 3.1: Remove Mock Data from Frontend
**Effort**: 1 day | **Blocker**: Yes (blocks 3.2) | **Depends on**: Phase 1 complete

**Tasks**:
- [ ] Update `frontend/lib/api/client.ts`:
  - Remove `getMockData()` method entirely
  - Update `request()` to make actual HTTP calls (fetch API)
  - Add error handling for real API responses
  - Remove all mock employee/shift/payroll arrays

- [ ] Delete or archive:
  - `frontend/lib/data/mock-data.ts` (no longer needed)

- [ ] Update API client to:
  - Send real HTTP requests instead of returning mock synchronously
  - Handle real errors (404, 500, etc.)
  - Include JWT token in Authorization header
  - Handle real latency/timeouts

**Testing**:
- Verify each API endpoint works with real backend
- Error states display correctly
- Loading states show during real API calls

---

### 3.2: Fix Dashboard Page
**Effort**: 1.5 days | **Blocker**: No | **Depends on**: 3.1

**Current Issues**: All data is hardcoded

**Tasks**:
- [ ] Update `frontend/app/(dashboard)/page.tsx`:
  - Remove hardcoded values
  - Load current day's shifts from API (`GET /api/shifts?startDate=today`)
  - Load pending time-off requests (`GET /api/requests?status=pending`)
  - Load pending payroll (`GET /api/payroll?status=draft`)
  - Calculate "Today's Summary" from actual data:
    - Total hours scheduled today
    - Number of employees working today
    - Pending actions count
  - Add loading states and error handling
  - Add toast notifications for errors

**Key Components**:
- "Current Shifts" - Fetch from Shift table
- "Pending Actions" - Fetch from TimeOffRequest + Payroll tables
- "Recent Activity" - Get 5 most recent shift changes
- "Quick Actions" - Keep existing buttons, but ensure they work

**Testing**:
- Dashboard loads real data on page load
- Numbers update after creating shifts/requests
- Loading spinner appears during fetch
- Errors display as toasts

---

### 3.3: Fix Settings Page
**Effort**: 1.5 days | **Blocker**: No | **Depends on**: 2.2

**Current Issues**: Settings UI doesn't persist changes

**For MVP**: Implement only database location settings (no other settings need to persist)

**Tasks**:
- [ ] Simplify `frontend/app/(dashboard)/settings/page.tsx`:
  - Remove unimplemented settings
  - Add "Database Location" display (read-only, shows current path via IPC)
  - Add "Backup Database" button:
    - Opens folder picker
    - Calls `electron:backup-database` with folder path
    - Shows success toast
  - Add "App Version" (read from `electron:get-app-version`)
  - Add "About" section

- [ ] For future: Leave commented placeholders for:
  - Notification preferences
  - Overtime settings
  - Theme preferences

**Testing**:
- Settings page displays database location
- Backup button copies database file
- Version number displays correctly

---

### 3.4: Fix Reports Page (Placeholder)
**Effort**: 1 day | **Blocker**: No | **Depends on**: None (can do anytime)

**Current Issues**: Skeleton UI, no functionality

**For MVP**: Mark as "Coming Soon"

**Tasks**:
- [ ] Update `frontend/app/(dashboard)/reports/page.tsx`:
  - Keep existing UI skeleton
  - Add banner: "Reports feature coming soon"
  - Disable all buttons/interactions
  - Explain what reports will show:
    - Period Summary
    - Overtime Insights
    - Labor Cost by Role

**Testing**:
- Page displays without errors
- No broken links/buttons

---

### 3.5: Verify All CRUD Operations
**Effort**: 1.5 days | **Blocker**: No | **Depends on**: 3.1

**For Each Feature**: Create → Read → Update → Delete → Verify persistence

**Checklist**:

**Employees**:
- [ ] Create new employee → shows in list → persists after restart
- [ ] Edit employee → changes show in list
- [ ] Delete employee → removed from list
- [ ] Try to delete, refresh page → still deleted

**Shifts**:
- [ ] Create shift → shows in calendar → persists
- [ ] Edit shift (change time/employee) → updates on calendar
- [ ] Delete shift → removed from calendar
- [ ] Overlap detection works (can't create overlapping shifts)

**Time-Off Requests**:
- [ ] Create request → shows in list as "pending"
- [ ] Approve request → status changes to "approved" → persists
- [ ] Deny request → status changes to "denied" → persists
- [ ] Deny then re-request → works correctly

**Payroll**:
- [ ] Generate payroll for period → creates entries
- [ ] Export to CSV → file downloads with correct data
- [ ] Update payroll status → persists

**Authentication**:
- [ ] Login → creates session
- [ ] Logout → clears session
- [ ] Refresh page → still logged out
- [ ] Login again → works

**Testing Strategy**:
1. Perform CRUD operation
2. Refresh page (confirm data persists via GET)
3. Restart app (confirm data in SQLite database)
4. Verify error messages for invalid inputs

---

**End of Phase 3 Checklist**:
- ✅ Mock data layer completely removed
- ✅ All API calls are real HTTP requests
- ✅ Dashboard shows real data
- ✅ Settings page works with Electron IPC
- ✅ Reports page marked "Coming Soon"
- ✅ All CRUD operations verified
- ✅ No hardcoded data remains
- ✅ Loading states and error handling working

---

## Phase 4: Build & Testing (1 week)

Package app as executable, test on clean machines, fix any issues.

### 4.1: Configure Build System
**Effort**: 1.5 days | **Blocker**: Yes (blocks 4.2) | **Depends on**: Phase 3 complete

**Tasks**:
- [ ] Create `electron-builder.config.js` in root:
  - Configure output for Windows (.exe) and Mac (.dmg)
  - Specify app ID, version, publisher
  - Include all files (frontend dist, backend, node_modules)
  - Exclude development files

- [ ] Update root `package.json`:
  - `"build": "npm run build:frontend && npm run build:backend && npm run electron-build"`
  - `"electron-build": "electron-builder"`
  - `"electron-dev": "electron ."`

- [ ] Create `backend/dist/` in build output:
  - Verify all backend dependencies bundled
  - Check that `better-sqlite3` is properly compiled for platform

- [ ] Create `frontend/.next` (Next.js production build):
  - Package frontend as static files + server
  - Ensure Next.js production build doesn't require hot reload

**Testing**:
- `npm run build` completes without errors
- Builds output to `dist/` or `out/` folder
- Verify all files included in build

---

### 4.2: Create Installer/Packager
**Effort**: 1.5 days | **Blocker**: No | **Depends on**: 4.1

**Tasks**:
- [ ] Windows (.exe):
  - Use NSIS installer
  - Add to Start Menu
  - Create desktop shortcut
  - Set app to start from Start Menu

- [ ] Mac (.dmg):
  - Create disk image
  - Drag-to-install experience
  - Create Applications shortcut

- [ ] Linux (.AppImage):
  - Create AppImage format (optional, lower priority)

- [ ] Version numbering:
  - Update version in `package.json` before each build
  - Version appears in app About page

**Testing**:
- Download .exe on Windows, install, run
- Download .dmg on Mac, install, run
- Both installs create shortcuts/launchers
- App launches without errors

---

### 4.3: End-to-End Testing
**Effort**: 2 days | **Blocker**: No | **Depends on**: 4.2

**Test Scenarios**:

**Fresh Install**:
- [ ] Download and install app
- [ ] First run triggers setup wizard
- [ ] Choose database location
- [ ] Create admin account
- [ ] Can login
- [ ] Dashboard shows empty data (no shifts yet)

**Normal Usage** (after setup):
- [ ] Login
- [ ] Create employee
- [ ] Create shift for employee
- [ ] Create time-off request
- [ ] Approve request as manager
- [ ] Export payroll as CSV
- [ ] Logout
- [ ] Login again (data persists)

**Edge Cases**:
- [ ] Try login with wrong password
- [ ] Try to create shift with no employees
- [ ] Try to access employee route as regular employee (should be denied)
- [ ] Close app during operation (data should be safe)
- [ ] Database file move to external drive (should still work)

**Performance**:
- [ ] App startup time < 3 seconds
- [ ] Dashboard loads in < 1 second
- [ ] Creating shift < 500ms
- [ ] Employee list loads with 100+ employees smoothly

**Testing Setup**:
- Test on minimum specs:
  - Windows 10, 4GB RAM, no SSD (slowest scenario)
  - Mac OS 12, 8GB RAM
  - Linux Ubuntu 20 (optional)

---

### 4.4: Bug Fixes & Polish
**Effort**: 1 day | **Blocker**: No | **Depends on**: 4.3

**Common Issues to Check**:
- [ ] Ensure all error messages are user-friendly
- [ ] All buttons have hover states
- [ ] Loading spinners appear during async operations
- [ ] Toast notifications display correctly
- [ ] Keyboard shortcuts work (Tab, Enter, Escape)
- [ ] Mobile-responsiveness still works (future platform support)
- [ ] Accessibility: Tab navigation, screen reader compatibility

**Polish Tasks**:
- [ ] Verify app icon displays correctly (Windows + Mac)
- [ ] Verify "About" dialog shows correct version
- [ ] Ensure dark mode (if implemented) works
- [ ] Test with different database locations (C:\, D:\, External drive)

---

**End of Phase 4 Checklist**:
- ✅ Windows .exe builds and installs correctly
- ✅ Mac .dmg builds and installs correctly
- ✅ First-run setup works
- ✅ All CRUD operations work in production build
- ✅ Data persists between app restarts
- ✅ No console errors or warnings
- ✅ App performance acceptable
- ✅ All edge cases handled gracefully

---

## Phase 5: Documentation & Release (3 days)

Document everything, prepare for store owner use, create release.

### 5.1: Create User Documentation
**Effort**: 1 day | **Blocker**: No | **Depends on**: Phase 4 complete

**Documents to Create**:
- [ ] `USER_GUIDE.md`:
  - Installation instructions (Windows, Mac)
  - First-run setup walkthrough (with screenshots)
  - How to create employees
  - How to schedule shifts
  - How to request/approve time-off
  - How to run payroll and export
  - How to backup database
  - Troubleshooting (port conflicts, database errors, etc.)

- [ ] `TROUBLESHOOTING.md`:
  - "App won't start" → Solutions
  - "Database error" → Solutions
  - "Can't login" → Solutions
  - "How to reset/backup database" → Steps
  - "Report a bug" → Contact info

- [ ] `QUICK_START.md`:
  - 5-minute walkthrough
  - Create first employee
  - Create first shift
  - Login as employee and view shift

---

### 5.2: Release Preparation
**Effort**: 1 day | **Blocker**: No | **Depends on**: 5.1

**Tasks**:
- [ ] Create GitHub Release:
  - Tag: `v1.0.0`
  - Release notes: What's included, known issues, installation instructions
  - Upload `.exe` and `.dmg` files
  - Upload SHA-256 checksums (for security-conscious users)

- [ ] Create simple landing page (optional):
  - Download links
  - Features list
  - Screenshots
  - Support contact info

- [ ] Update project README:
  - Add "Installation" section
  - Add "Getting Started" section
  - Link to user guide

- [ ] Version management:
  - Ensure version in `package.json` is `1.0.0`
  - Version in `electron/main.ts` is `1.0.0`
  - Version displayed in About dialog

---

### 5.3: Final QA & Store Owner Handoff
**Effort**: 1 day | **Blocker**: No | **Depends on**: 5.2

**Pre-Release Checklist**:
- [ ] All team members can install and run on their machines
- [ ] Fresh install → setup wizard → login → dashboard works
- [ ] All documented features work as described
- [ ] No critical bugs
- [ ] App feels polished (UI, error messages, performance)

**Handoff Package**:
- [ ] Download links for `.exe` and `.dmg`
- [ ] Installation instructions (printed or PDF)
- [ ] Quick Start guide
- [ ] Support contact (email, phone, etc.)
- [ ] Backup instructions
- [ ] Known limitations / future features list

---

**End of Phase 5 Checklist**:
- ✅ User documentation complete
- ✅ App tested by multiple people
- ✅ Release files created and verified
- ✅ Store owner can download and use without support
- ✅ Documentation covers all features
- ✅ Troubleshooting guide created

---

## Post-MVP Future Work (Backlog)

**Phase 6 (Future)**: Features beyond MVP
- Real-time notifications (WebSocket)
- Shift swap feature
- Reports with charts (Period Summary, Overtime Insights, Labor Cost)
- Settings persistence (notification preferences, overtime rules)
- Multi-location support
- Mobile companion app
- Automated backups (cloud sync to AWS S3)
- Auto-updates (signed executables)

---

## Risk & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **SQLite query bugs** | Medium | High | Thorough testing phase, SQL reference docs |
| **Port conflict on startup** | Low | Medium | Auto-detect free port, clear error message |
| **Database corruption** | Low | High | Backup strategy, recovery option |
| **Electron build fails on new OS** | Medium | High | Test on target OS early (Phase 4) |
| **IPC communication fails** | Low | High | Add error handling, logging for debugging |
| **Frontend-backend version mismatch** | Low | Medium | Always build together, version lock |
| **Performance issues with data** | Low | Medium | Optimize queries with indexes in Phase 1.2 |

---

## Timeline Summary

```
Week 1: Phase 1 (Database & Backend) → Ready for integration testing
Week 2: Phase 2 (Electron & IPC) → Ready for frontend testing
Week 3: Phase 3 (Frontend cleanup) → Ready for end-to-end testing
Week 4: Phase 4 (Build & QA) → Ready for release
Week 5: Phase 5 (Documentation) → Released to store owner
```

---

## How to Track Progress

1. **Use this document** as your checklist
2. **Update status** as you complete each task:
   - `[ ]` = Not started
   - `[x]` = Completed
3. **Mark phase complete** when all tasks in section are done
4. **Update CHANGELOG.md** with major milestones

---

## Revision History

**Version 1.0** - November 2025
- Initial roadmap created based on technical decisions
- 5 phases, 5-6 week timeline
- All major tasks identified with effort estimates
