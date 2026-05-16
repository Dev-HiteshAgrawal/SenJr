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
