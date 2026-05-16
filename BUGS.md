# BUGS.md — SenJr

---
BUG ID: BUG-001
TITLE: Missing alt text for hero image in App.jsx
SEVERITY: LOW
CATEGORY: Frontend
STATUS: FIXED

DESCRIPTION:
The main hero image in `src/App.jsx` has an empty `alt` attribute (`alt=""`), which is problematic for accessibility as it doesn't provide context to screen reader users for a primary visual element.

STEPS TO REPRODUCE:
1. Open `src/App.jsx`.
2. Locate the `<img>` tag with `src={heroImg}`.
3. Observe `alt=""`.

EXPECTED BEHAVIOR:
The image should have a descriptive alt tag (e.g., "SenJr hero illustration").

ACTUAL BEHAVIOR:
The alt tag is empty.

PROOF / EVIDENCE:
Line 14 of `src/App.jsx`: `<img src={heroImg} className="base" width="170" height="179" alt="" />`

ROOT CAUSE:
Default boilerplate code uses an empty alt string.

RECOMMENDED FIX:
Update the `alt` attribute to `alt="SenJr hero illustration"`.
---

---
BUG ID: BUG-002
TITLE: Boilerplate "Get started" text and links remain
SEVERITY: INFO
CATEGORY: Frontend
STATUS: OPEN

DESCRIPTION:
The application still displays the default "Get started" text and links to Vite/React documentation instead of SenJr-specific content.

STEPS TO REPRODUCE:
1. Run the application.
2. Observe the landing page content.

EXPECTED BEHAVIOR:
The landing page should contain SenJr-specific messaging and links.

ACTUAL BEHAVIOR:
It contains Vite + React boilerplate content.

PROOF / EVIDENCE:
Visible in `src/App.jsx` and the browser preview.

ROOT CAUSE:
Project is in initial commit state.

RECOMMENDED FIX:
Replace boilerplate text with project-specific content and roadmap links.
---

---
BUG ID: BUG-003
TITLE: Complete Absence of Core SaaS Infrastructure (Stack Mismatch)
SEVERITY: CRITICAL
CATEGORY: Infrastructure
STATUS: OPEN

DESCRIPTION:
The codebase does not match the requested technical stack. The user expects Next.js, TypeScript, and Supabase, but the repository currently only contains a basic Vite + React 19 (JS) boilerplate. All core features (Auth, RLS, Booking System, API routes) are missing.

STEPS TO REPRODUCE:
1. Inspect `package.json` (no Next.js, no Supabase client, no TypeScript).
2. Inspect project structure (no `app/` directory, no `.ts/tsx` files).
3. Attempt to find any Auth or Database logic.

EXPECTED BEHAVIOR:
A Next.js project with Supabase integration and TypeScript support.

ACTUAL BEHAVIOR:
A minimal Vite + React 19 (JS) boilerplate.

PROOF / EVIDENCE:
- `package.json` contains `"vite": "^8.0.12"` and `"react": "^19.2.6"`.
- No `@supabase/supabase-js` or `next` in dependencies.

ROOT CAUSE:
Repository is in an uninitialized/boilerplate state that doesn't align with the project requirements.

RECOMMENDED FIX:
Re-initialize the project using Next.js and TypeScript, and integrate the Supabase client and RLS policies.
---

---
BUG ID: BUG-004
TITLE: Missing Content Security Policy (CSP)
SEVERITY: MEDIUM
CATEGORY: Security
STATUS: OPEN

DESCRIPTION:
The application lacks a Content Security Policy (CSP) in `index.html`, increasing the risk of Cross-Site Scripting (XSS) and data injection attacks.

STEPS TO REPRODUCE:
1. Open `index.html`.
2. Observe the absence of a `<meta http-equiv="Content-Security-Policy" ...>` tag.

EXPECTED BEHAVIOR:
A strict CSP should be defined to restrict resource loading to trusted origins.

ACTUAL BEHAVIOR:
No CSP is defined.

PROOF / EVIDENCE:
`index.html` only contains basic metadata.

ROOT CAUSE:
Standard Vite boilerplate does not include a default CSP.

RECOMMENDED FIX:
Add a suitable `<meta http-equiv="Content-Security-Policy" content="...">` tag to `index.html`.
---

# SUMMARY OF AUDIT (PHASE 1-13)

## 📊 STATS
- **Total Bugs Found:** 4
- **Total Fixed:** 1 (BUG-001)
- **Total Pending:** 3 (BUG-002, BUG-003, BUG-004)

## 🛡️ RISK ASSESSMENT
- **Vulnerability Level:** CRITICAL
- **Reasoning:** The primary risk is the **Infrastructure Discrepancy (BUG-003)**. The current codebase is an empty Vite boilerplate, meaning zero implementation of the requested security features (Supabase RLS, Auth flows, etc.). While the boilerplate itself is clean (0 vulnerabilities), it provides none of the protection or functionality requested by the user.
- **Action Required:** The project must be re-scaffolded using Next.js, TypeScript, and Supabase to align with the core requirements. Fixed the minor accessibility issue (BUG-001) as a baseline improvement.
