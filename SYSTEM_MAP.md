# SYSTEM MAP — Senjr

## 🏗️ ARCHITECTURE OVERVIEW
- **Framework:** React 19
- **Build Tool:** Vite 8
- **Platform:** Single Page Application (SPA)
- **Language:** JavaScript (ESLint configured)

## 📁 MODULE MAP

### 🌐 Frontend
- `index.html`: Main entry point.
- `src/main.jsx`: React hydration and strict mode wrapper.
- `src/App.jsx`: Primary application component containing the current "Get started" landing page.
- `src/index.css`: Global variables, typography, and base layout.
- `src/App.css`: Component-specific styles for the landing page.

### 🖼️ Assets & Public
- `src/assets/`:
  - `hero.png`: Placeholder hero illustration.
  - `react.svg`: React framework logo.
  - `vite.svg`: Vite build tool logo.
- `public/`:
  - `favicon.svg`: Site favicon.
  - `icons.svg`: SVG sprite containing social and UI icons (bluesky, discord, documentation, github, social, x).

### ⚙️ Configuration
- `package.json`: Dependency management and scripts.
- `vite.config.js`: Vite build settings.
- `eslint.config.js`: Linting rules.
- `.gitignore`: Standard Git ignore list for Node projects.

## 🔌 INTEGRATIONS & SERVICES
- **External Links:** Links to Vite, React, GitHub, Discord, X, and Bluesky documentation/communities.
- **Third-party Services:** None currently implemented in the codebase (e.g., Supabase, LiveKit, Stripe are missing).

## ⚠️ STATE DISCREPANCY NOTE
As of May 2024, the codebase is in a **minimal boilerplate state**.
- **Critical Discrepancy:** The user requested a Next.js (App Router), TypeScript, and Supabase stack. The repository currently contains a Vite + React 19 (JavaScript) boilerplate.
- **Missing Infrastructure:** Supabase configuration, RLS policies, Auth flows (PKCE), Mentor/Student booking logic, API routes, and TypeScript typings are completely absent.
- **Current Status:** Initial boilerplate state (Vite template).
