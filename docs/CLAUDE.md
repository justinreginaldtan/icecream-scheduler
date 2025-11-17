# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Install all dependencies (root + frontend + backend workspaces)
npm install

# Run both frontend (Next.js) and backend (Express) concurrently
npm run dev

# Run frontend only (port 3000)
npm run dev:frontend

# Run backend only (port 3001)
npm run dev:backend
```

### Building
```bash
# Build both frontend and backend
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

### Code Quality
```bash
# Lint entire monorepo
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without changes
npm run format:check

# Type-check frontend (from frontend/ directory)
cd frontend && npm run type-check
```

### Testing
```bash
# Run backend tests (from backend/ directory)
cd backend && npm test
```

## Architecture Overview

### Monorepo Structure
This is a monorepo with two npm workspaces:
- **Frontend**: Next.js 16 App Router application (port 3000)
- **Backend**: Express.js REST API with MongoDB (port 3001)

### Frontend Architecture (Next.js 16)

**App Router Organization**:
- Uses route groups with parentheses for logical separation
- `app/(auth)/`: Public authentication routes (login, unauthorized)
- `app/(dashboard)/`: Protected dashboard routes (schedule, employees, requests, payroll, reports, settings)
- Root layout wraps app with providers: AuthProvider, SidebarProvider, Toaster

**Authentication Flow**:
- Context-based authentication (`lib/auth/auth-context.tsx`)
- User and token persisted to localStorage (`sweet-solutions-user`, `auth-token`)
- `useAuth()` hook provides: `user`, `login()`, `logout()`, `isLoading`
- Automatic redirect logic: unauthenticated → `/login`, authenticated accessing `/login` → `/`
- Two user roles: `manager` | `employee`

**Mock Data System**:
- **Critical**: The frontend has a built-in mock data layer in `lib/api/client.ts`
- `ApiClient` intercepts API calls and returns mock data from `lib/data/mock-data.ts`
- This allows the app to work without the backend running
- To switch to real backend: ensure `NEXT_PUBLIC_API_URL` env var is set and backend is running
- Mock data includes: employees, shifts, time-off requests, payroll records

**State Management**:
- Global state via React Context providers (auth, sidebar, theme)
- Page-level state with React hooks (useState, useEffect, useMemo)
- No Redux or external state management libraries
- Toast notifications via `useToast()` hook (sonner library)

**Component Organization**:
- `components/layout/`: app-layout, sidebar, header (main structural components)
- `components/ui/`: Shadcn-based UI primitives (button, card, dialog, etc.)
- `components/features/`: Feature-specific components (e.g., shift-modal)
- Custom hooks in `hooks/` directory

**Theme System**:
- Custom CSS variables for colors defined in root layout
- Multiple "flavor" themes: classic-cream, playful, modern
- Theme stored in localStorage and applied via CSS custom properties
- Theme context at `lib/theme/theme-context.tsx`

### Backend Architecture (Express.js + MongoDB)

**Server Setup** (`backend/src/server.js`):
- Middleware stack: helmet, CORS, rate limiting (100 req/15min), body parsing, compression, morgan logging
- Health check endpoint at `/health`
- All API routes mounted under `/api/*`
- Gracefully handles database connection failures (falls back to mock data mode)

**Routes Organization**:
- `/api/auth`: Login, logout, get current user
- `/api/employees`: Full CRUD for employees
- `/api/shifts`: Full CRUD + filtering for shifts
- `/api/requests`: Time-off requests with approve/deny actions
- `/api/payroll`: Payroll data retrieval and generation

**Authentication**:
- JWT tokens with 7-day expiration (configurable via `JWT_SECRET` env var)
- Auth middleware validates `Authorization: Bearer <token>` header
- Role-based access control: `requireRole(['manager'])` middleware for manager-only routes
- Passwords hashed with bcrypt (10 salt rounds)

**Database Models** (Mongoose):
- `User`: Email, password (hashed), name, role (manager/employee), isActive, lastLogin
- `Employee`: Name, email, phone, role, hourlyRate, hoursPerWeek, availability (array), hireDate
- `Shift`: Employee reference, date, startTime, endTime, role, status (scheduled/completed/cancelled/no-show)
- `TimeOffRequest`: Employee reference, date range, reason, status
- `Payroll`: Employee reference, period, hours, rate, total pay

**Middleware**:
- `auth.js`: JWT validation, attaches `req.user`
- `validation.js`: Request data validation (login, employee data)
- `mockData.js`: Fallback mock data when database unavailable

### Key Integration Points

**Frontend-Backend Connection**:
1. Frontend `ApiClient` makes requests to `NEXT_PUBLIC_API_URL` (default: `http://localhost:3001`)
2. Token stored in localStorage after login, sent as `Authorization: Bearer <token>` header
3. Backend validates JWT via auth middleware, returns user-specific data
4. CORS configured to accept requests from frontend URL

**Development Without Backend**:
- Frontend mock data mode allows full UI testing without backend
- Backend mock data mode allows API testing without MongoDB
- Both modes use aligned data structures for consistency

## Development Patterns

### Mock Accounts
Use these credentials when testing with mock data:
- **Manager**: `mari.lisa@example.com` / `demo123`
- **Employee**: `justin.tan@example.com` / `demo123`

### Environment Variables
**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend** (`backend/.env`):
```env
PORT=3001
DATABASE_URL=mongodb://localhost:27017/sweet-solutions
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Responsive Design
- Mobile breakpoint: 768px
- Sidebar auto-collapses on mobile
- Layout adjusts margin based on sidebar state (`useSidebar()` hook)

### Role-Based Features
- Frontend: Sidebar navigation filters by `user.role`
- Backend: Route-level middleware enforces manager-only access
- Component-level checks for role-specific UI elements

### Error Handling
- Frontend: try-catch around API calls, toast notifications for errors
- Backend: Global error handler middleware, specific HTTP status codes (401, 403, 404, 500)
- Graceful degradation: Database failures don't crash the app

## Technical Notes

### Technology Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI, Framer Motion
- **Backend**: Express.js, MongoDB, Mongoose, JWT, bcrypt
- **Tools**: ESLint, Prettier, Concurrently

### Node Version
- Requires Node.js 18 or newer (specified in backend package.json engines)

### Branch Workflow
- Main branch: `main`
- Feature branches: `name/task-description` (e.g., `justin/update-readme`)
- Create branches off `main`, merge via pull requests

### Deployment Plan
- **Frontend**: Vercel (recommended)
- **Backend**: AWS Lambda/API Gateway (planned)
- **Database**: MongoDB Atlas or AWS RDS (planned migration from local MongoDB)
