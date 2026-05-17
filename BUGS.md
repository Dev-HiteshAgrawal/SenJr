# 🐛 BUG LOG — SenJr

---
BUG ID: BUG-001
TITLE: Permissive CORS in LiveKit Token Endpoint
SEVERITY: MEDIUM
CATEGORY: Security
STATUS: OPEN

DESCRIPTION:
The `api/livekit-token.js` endpoint uses `Access-Control-Allow-Origin: *`, which allows any website to request a LiveKit token if they know the room name and participant identity. This could lead to unauthorized access to video rooms or abuse of the LiveKit service.

STEPS TO REPRODUCE:
1. Inspect `api/livekit-token.js`.
2. Observe `res.setHeader('Access-Control-Allow-Origin', '*');`.

EXPECTED BEHAVIOR:
CORS should be restricted to the application's domain.

ACTUAL BEHAVIOR:
CORS allows all origins.

PROOF / EVIDENCE:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

ROOT CAUSE:
Hardcoded wildcard in CORS header.

RECOMMENDED FIX:
Restrict `Access-Control-Allow-Origin` to `process.env.ALLOWED_ORIGIN`.
---

---
BUG ID: BUG-002
TITLE: Broad Read Access to User Collection
SEVERITY: HIGH
CATEGORY: Authorization
STATUS: FIXED

DESCRIPTION:
In `firestore.rules`, the `users` collection allows any signed-in user to read any other user's document. This allows for bulk scraping of user data, including PII like emails and bio if not intended to be public.

STEPS TO REPRODUCE:
1. Inspect `firestore.rules`.
2. Observe `match /users/{userId} { allow read: if isSignedIn(); }`.

EXPECTED BEHAVIOR:
Users should only be able to read their own profiles, or public fields of other users (especially mentors).

ACTUAL BEHAVIOR:
Any authenticated user can read any document in the `users` collection.

PROOF / EVIDENCE:
```javascript
match /users/{userId} {
  allow read: if isSignedIn();
}
```

ROOT CAUSE:
Insecure security rule definition.

RECOMMENDED FIX:
Restrict read access to `isOwner(userId)` for sensitive fields or collections, and only allow public access to necessary mentor data.
---

---
BUG ID: BUG-003
TITLE: Lack of Rate Limiting on AI and Token Endpoints
SEVERITY: MEDIUM
CATEGORY: Performance
STATUS: OPEN

DESCRIPTION:
The serverless functions `api/gemini-chat.js` and `api/livekit-token.js` do not implement any rate limiting. An attacker could spam these endpoints, exhausting API quotas (Gemini) or increasing costs (LiveKit/Vercel).

STEPS TO REPRODUCE:
1. Analyze `api/gemini-chat.js` and `api/livekit-token.js`.
2. Observe absence of rate limiting logic.

EXPECTED BEHAVIOR:
Endpoints should have rate limiting to prevent abuse.

ACTUAL BEHAVIOR:
No rate limiting is present.

ROOT CAUSE:
Omission of rate limiting middleware or logic in serverless functions.

RECOMMENDED FIX:
Implement a rate-limiting mechanism using Redis (e.g., Upstash) or a simple memory-based cache if Vercel execution persists enough (though memory is not shared across lambdas).
---

---
BUG ID: BUG-004
TITLE: Privilege Escalation via User Profile Update
SEVERITY: CRITICAL
CATEGORY: Authorization
STATUS: FIXED

DESCRIPTION:
The Firestore security rules for the `users` collection allow any authenticated user to update their own document without any field-level restrictions. This allows a user to change their `role` to `admin` or `mentor`, or arbitrarily increase their `xp` and `level`.

STEPS TO REPRODUCE:
1. Log in as a regular student.
2. Open the browser console.
3. Execute a Firestore update command to change the `role` field to `admin` for the current user's document.
4. Refresh the page; the user now has admin privileges.

EXPECTED BEHAVIOR:
Sensitive fields like `role`, `xp`, and `level` should not be modifiable by the user directly. They should only be updated by server-side logic (e.g., Cloud Functions) or restricted via security rules (e.g., `!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'xp', 'level'])`).

ACTUAL BEHAVIOR:
Users have full write access to all fields in their own `users` document.

PROOF / EVIDENCE:
```javascript
match /users/{userId} {
  allow update: if isSignedIn() && (isOwner(userId) || isAdmin());
}
```

ROOT CAUSE:
Lack of field-level validation in Firestore security rules.

RECOMMENDED FIX:
Implement strict field-level validation in `firestore.rules` to prevent users from modifying sensitive fields.
---

---
BUG ID: BUG-005
TITLE: Lack of Input Sanitization in Community Posts
SEVERITY: HIGH
CATEGORY: Injection
STATUS: FIXED

DESCRIPTION:
Community posts are rendered using standard React interpolation, which protects against most XSS. However, the application lacks server-side sanitization of post content. While React escapes the output, an attacker could still inject content that could be problematic if rendered in other contexts (e.g., non-React views, emails, or if `dangerouslySetInnerHTML` is ever introduced). More importantly, there's no client-side or server-side length validation beyond what the DB allows, which could lead to "Data Bloat" attacks.

STEPS TO REPRODUCE:
1. Create a post with a very long string or malicious-looking HTML/Javascript.
2. Observe that it is saved and rendered exactly as input.

EXPECTED BEHAVIOR:
Inputs should be sanitized and length-limited both on the client and server.

ACTUAL BEHAVIOR:
No visible sanitization or strict length limits on post content.

PROOF / EVIDENCE:
In `Community.jsx`:
```javascript
<p className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-line">{post.content}</p>
```

ROOT CAUSE:
Reliance on default React escaping and lack of explicit sanitization.

RECOMMENDED FIX:
Implement server-side sanitization (e.g., using `dompurify` or similar) and enforce strict length limits in Firestore rules and API handlers.
---

---
BUG ID: BUG-006
TITLE: Business Logic Race Condition in Session Booking
SEVERITY: HIGH
CATEGORY: Business Logic
STATUS: IN PROGRESS

DESCRIPTION:
The application lacks atomic transactions when booking sessions. In `BookSession.jsx`, the UI allows users to select time slots, but there's no evidence of a "double-booking" check at the database level using transactions or batch writes that check for existing sessions at the same time for the same mentor. This could lead to multiple students booking the same mentor for the same time slot.

STEPS TO REPRODUCE:
1. Two students open the same mentor's booking page simultaneously.
2. Both select the same date and time slot.
3. Both click "Confirm Booking" at the same time.
4. If the logic just adds a new document to the `sessions` collection without an atomic check, both will be "scheduled".

EXPECTED BEHAVIOR:
The system should use a Firestore transaction to check if the slot is still available before committing the booking.

ACTUAL BEHAVIOR:
The booking flow (implied by `BookSession.jsx` and `Payment.jsx`) doesn't seem to implement atomic availability checks.

PROOF / EVIDENCE:
Absence of transaction logic in `firestore.js` for common booking operations and the UI-only check in `BookSession.jsx`.

ROOT CAUSE:
Lack of atomic transaction implementation for state-sensitive operations.

RECOMMENDED FIX:
Use Firestore transactions for creating sessions, ensuring the mentor's availability for the specific time slot is verified and locked during the write.
---
