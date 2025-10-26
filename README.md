# 🍦 Sweet Solutions

A modern SaaS platform for ice cream shop scheduling, payroll management, and employee coordination.

## 📁 Project Structure

This is a **monorepo** with two main applications:

```
sweet-solutions/
├── frontend/     # Next.js web application
├── backend/      # Express.js API server
└── README.md     # This file
```

### Frontend (`frontend/`)
- **Framework**: Next.js 16 with App Router
- **UI**: Radix UI + Tailwind CSS
- **Location**: `http://localhost:3000`

### Backend (`backend/`)
- **Framework**: Express.js + Node.js
- **Database**: MongoDB with Mongoose
- **Location**: `http://localhost:3001`

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or pnpm

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   
   Frontend (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
   
   Backend (`backend/.env`):
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/sweet-solutions
   JWT_SECRET=your-secret-key
   ```

### Development

**Option 1: Run both frontend and backend together**
```bash
npm run dev
```

**Option 2: Run them separately**

Frontend only:
```bash
npm run dev:frontend
```

Backend only:
```bash
npm run dev:backend
```

### Build for Production

```bash
npm run build
```

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## 🎨 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS with custom theme

## 👥 Team

- Frontend Developer: Work in `frontend/` directory
- Backend Developer: Work in `backend/` directory

## 📄 License

MIT
