# SenJr Development Rules

Follow these rules for every change to this repository.

1. GitHub flow only
   - Push code only to `Dev-HiteshAgrawal/SenJr` on the `main` branch.
   - Do not rely on manual Netlify CLI deploys as the normal production path. Netlify should auto-deploy from GitHub.

2. Production domain
   - Production is hosted on Netlify (configure the primary domain in the Netlify UI).
   - Treat all `main` changes as production-facing.
   - Always run `npm run build` before pushing.
   - For UI/runtime changes, verify the deployed page renders and has no Vite overlay or console-breaking errors.

3. Data protection
   - The app uses the live Firebase project configured through Netlify (and local) environment variables.
   - Do not drop, mock, clear, rename, or arbitrarily modify production Firebase collections without explicit human permission.
   - Preserve existing user auth, mentor profiles, sessions, homework, badges, certificates, and reviews.

4. Secrets management
   - Never commit `.env`, `.env.local`, `.env.production`, `.netlify/state.json`, `node_modules`, `dist`, logs, or real API keys.
   - Client Firebase config must be read from `VITE_FIREBASE_*` variables.
   - Server-only AI and video API keys must use unprefixed names such as `NVIDIA_API_KEY`, `GEMINI_API_KEY`, and `DAILY_API_KEY` where applicable.
   - Do not put raw API keys in source files. Use `.env.example` only for placeholder names.

5. Netlify project settings
   - Framework: Vite (or “None” with custom settings)
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions` (see `netlify.toml`)
   - Environment variables: configure in the Netlify dashboard for Production, Deploy Previews, and branch deploys as needed. Mirror names from `.env.netlify`.
   - **Build vs runtime:** Vite embeds `VITE_*` at build time. Those variables must be available to **builds**, not only to function runtime, or the deployed SPA will miss Firebase/Gemini/LiveKit settings.
   - **Firebase Auth:** add each Netlify hostname (and custom domain) under Authentication → Authorized domains.
   - **Local `netlify build`:** the Netlify CLI needs a linked site (`netlify link`) or CI variables (`NETLIFY_SITE_ID`, etc.); otherwise it exits with “Could not find the project ID.” `npm run build` alone is the routine pre-push check; full function bundling is validated on Netlify’s build servers after push.
   - **Blank screen prevention:** Netlify sets `NETLIFY=true` during builds; the Vite config fails the build if required `VITE_FIREBASE_*` variables are missing from the build environment. The app also bootstraps with a visible error screen if the shell fails to load (instead of a white page).
