# SenJr Development Rules

Follow these rules for every change to this repository.

1. GitHub flow only
   - Push code only to `Dev-HiteshAgrawal/SenJr` on the `main` branch.
   - Do not rely on manual Vercel CLI deployments as the normal production path. Vercel should auto-deploy from GitHub.

2. Production domain
   - The intended production URL is `https://senjr.vercel.app`.
   - Treat all `main` changes as production-facing.
   - Always run `npm run build` before pushing.
   - For UI/runtime changes, verify the deployed page renders and has no Vite overlay or console-breaking errors.

3. Data protection
   - The app uses the live Firebase project configured through Vercel environment variables.
   - Do not drop, mock, clear, rename, or arbitrarily modify production Firebase collections without explicit human permission.
   - Preserve existing user auth, mentor profiles, sessions, homework, badges, certificates, and reviews.

4. Secrets management
   - Never commit `.env`, `.env.local`, `.env.production`, `.vercel`, `node_modules`, `dist`, logs, or real API keys.
   - Client Firebase config must be read from `VITE_FIREBASE_*` variables.
   - Server-only AI and video API keys must use unprefixed names such as `NVIDIA_API_KEY`, `GEMINI_API_KEY`, and `DAILY_API_KEY`.
   - Do not put raw API keys in source files. Use `.env.example` only for placeholder names.

5. Vercel project settings
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables must be configured in the Vercel dashboard for Production, Preview, and Development as needed.
