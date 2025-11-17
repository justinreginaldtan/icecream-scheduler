# Sweet Solutions - Architecture Overview

## 🏗️ Project Structure

This is a **monorepo** with two applications:

```
sweet-solutions/
├── frontend/       # Next.js web application
├── backend/        # Express.js API server
├── README.md       # Root documentation
└── ARCHITECTURE.md # This file
```

### Frontend (`frontend/`)
- **Framework**: Next.js 16 with App Router
- **UI**: Radix UI + Tailwind CSS
- **State**: React Context + Custom Hooks
- **Deployment**: Vercel (recommended)
- **Port**: 3000

### Backend (`backend/`)
- **Framework**: Express.js + Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Deployment**: AWS Lambda/API Gateway (recommended)
- **Port**: 3001

## 🔄 Data Flow

```
Frontend (Next.js) → API Client → Backend (Express) → Database (MongoDB)
       :3000                         :3001
```

## 🚀 Getting Started

### Development

**Option 1: Run both applications**
```bash
npm run dev
```

**Option 2: Run separately**
```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Installation

```bash
npm run install:all
```

This installs dependencies for both frontend and backend.

## 🎯 **AWS Deployment Plan**

### Phase 1: Frontend (Vercel)
```bash
# Deploy frontend
vercel --prod
```

### Phase 2: Backend (AWS)
```bash
# Deploy backend to AWS Lambda
serverless deploy
```

### Phase 3: Database (AWS)
- MongoDB Atlas or AWS RDS
- Update connection strings

## 👥 **Team Roles**

- **Frontend Developer**: `frontend/`
- **Backend Developer**: `backend/`
- **DevOps**: AWS deployment and configuration

## 📁 **Directory Structure**

### Frontend
```
frontend/
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Authentication routes
│   └── (dashboard)/  # Protected dashboard routes
├── components/       # React components
│   ├── common/       # Shared components
│   ├── features/     # Feature-specific components
│   ├── layout/       # Layout components
│   └── ui/           # UI primitives
├── lib/              # Utilities and helpers
│   ├── api/          # API client
│   ├── auth/         # Auth logic
│   └── utils/        # Utility functions
└── public/           # Static assets
```

### Backend
```
backend/
├── src/
│   ├── controllers/  # Route controllers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Express middleware
│   └── utils/        # Utility functions
└── tests/            # Test files
```

## 🔧 **Commands**

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both frontend and backend |
| `npm run dev:frontend` | Run frontend only |
| `npm run dev:backend` | Run backend only |
| `npm run build` | Build both apps |
| `npm run install:all` | Install all dependencies |

## 📊 **Features Implemented**

- ✅ User authentication (Manager/Employee roles)
- ✅ Employee management
- ✅ Shift scheduling
- ✅ Time-off requests
- ✅ Payroll tracking
- ✅ CSV export functionality
- ✅ Responsive design
- ✅ Real-time notifications

## 🎨 **Design System**

- **Brand Colors**: Cream, Coral, Teal, Pink
- **Typography**: Poppins font family
- **Components**: shadcn/ui with custom styling
- **Accessibility**: WCAG 2.1 compliant

## 🚀 **Deployment**

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (AWS)
```bash
cd backend
serverless deploy
```

---

**Note**: This is a **professional prototype** with production-ready architecture. The mock data can be easily replaced with live AWS services.
