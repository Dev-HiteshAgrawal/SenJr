# 🗺️ SYSTEM MAP — SenJr

## 🏗️ ARCHITECTURE OVERVIEW
- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Serverless Functions**: Vercel Functions (Node.js)
- **Deployment**: Vercel

## 📦 MODULES & COMPONENTS
- **Auth**: Login, Multi-step Signup (Student/Mentor), Role Selection
- **Dashboard**: Student Dashboard, Mentor Dashboard, Admin Panel
- **Features**:
  - **Mentorship**: Find Mentor, Book Session, Sessions Management
  - **Learning**: War Room, AI Tutor, AI Chat, Courses
  - **Social**: Community (Posts, Likes, Saves)
  - **Communication**: Video Call (LiveKit integration)
  - **Finance**: Payment (UPI), Mentor Earnings
- **Profile**: Student Profile, Mentor Profile, Availability Settings
- **Legal**: Help Center, Contact Us, Privacy Policy, Terms of Service

## 🔑 AUTHENTICATION & AUTHORIZATION
- **Provider**: Firebase Auth (Email/Password, Google, Apple)
- **RBAC**: Handled via `RoleRoute.jsx` and Firestore `users` collection `role` field.
- **Roles**: `student`, `mentor`, `admin`.

## 🗄️ DATABASE SCHEMA (Firestore)
- **`users`**: `{ uid, name, email, role, avatar, bio, xp, level, streak, badges, createdAt }`
- **`mentors`**: `{ uid, name, verified, doubleverified, expertise, pricing, availability, rating, totalSessions, earnings, documents, videoIntro }`
- **`students`**: `{ uid, name, education, goals, subjects, achievements, friends }`
- **`sessions`**: `{ id, mentorId, studentId, date, startTime, endTime, duration, price, status, paymentStatus }`
- **`posts`**: `{ id, authorId, content, likes, saves, createdAt }` (observed in `firestore.rules`)
- **`warRoomPackages`**: `{ id, title, examType, mentor, price, students, schedule, materials }`

## 🔌 THIRD-PARTY INTEGRATIONS
- **Firebase**: Database, Auth, Storage
- **Google Gemini AI**: Powering AI Tutor and AI Chat (`api/gemini-chat.js`)
- **LiveKit**: Powering Video Calls (`api/livekit-token.js`)
- **UPI**: Manual payment verification via screenshot upload.

## 🌐 API ROUTES (Vercel Functions)
- `POST /api/gemini-chat`: Interactive AI chat sessions.
- `POST /api/livekit-token`: Generates JWT tokens for LiveKit video rooms.

## ⚙️ ENVIRONMENT VARIABLES
- `VITE_FIREBASE_*`: Firebase configuration.
- `GEMINI_API_KEY`: API key for Google Gemini.
- `LIVEKIT_API_KEY` & `LIVEKIT_API_SECRET`: Credentials for LiveKit.
- `VITE_ADMIN_EMAIL`: Email address designated as admin.
- `VITE_OWNER_UPI`: UPI ID for platform payments.
