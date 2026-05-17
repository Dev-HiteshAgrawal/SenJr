# SenJr — Mentor/Student Matching Platform

SenJr is a platform designed to connect mentors and students, facilitating knowledge sharing and professional growth.

## 🚀 Tech Stack (Target)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Backend/Auth:** Supabase (Postgres, RLS, PKCE Auth)
- **UI:** React 19

## 🛠️ Current Status
The project is currently in the **migration phase** from a Vite/React boilerplate to the target Next.js/Supabase stack.

### Roadmap
1. **Phase 1: Project Re-scaffolding** (In Progress)
   - [x] Initialize TypeScript configuration
   - [x] Scaffold Next.js-like directory structure
   - [x] Initialize Supabase client placeholders
2. **Phase 2: Authentication & RLS** (Pending)
   - [ ] Implement Supabase Auth (PKCE flow)
   - [ ] Define Row Level Security (RLS) policies
3. **Phase 3: Core Features** (Pending)
   - [ ] Mentor/Student profile creation
   - [ ] Booking system with race condition handling
   - [ ] Secure API routes

## 📦 Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## 🛡️ Audit & Security
Security audits and bug tracking are maintained in `BUGS.md`.
System architecture mapping is documented in `SYSTEM_MAP.md`.
