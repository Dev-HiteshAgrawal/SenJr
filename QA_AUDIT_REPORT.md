# SenJr QA Audit — Bug Log

---
BUG ID: 1
TITLE: Broken Object Level Authorization (BOLA) in Session Creation
SEVERITY: CRITICAL
CATEGORY: Authorization
STATUS: FIXED

DESCRIPTION:
The Firestore security rules for the `sessions` collection allow any authenticated user to create a session document without verifying that the `studentId` field matches the requester's UID. A malicious user can book sessions on behalf of other students, potentially depleting a mentor's availability or spamming users.

STEPS TO REPRODUCE:
1. Log in as User A.
2. Manually trigger a Firestore `addDoc` call to the `sessions` collection with `studentId` set to User B's UID.
3. Observe that the document is successfully created.

EXPECTED BEHAVIOR:
The security rules should enforce that `request.resource.data.studentId == request.auth.uid`.

ACTUAL BEHAVIOR:
Rule is `allow create: if isAuthenticated();`, which lacks the ownership check.

ROOT CAUSE:
Incomplete logic in `firestore.rules`.

RECOMMENDED FIX:
Update `firestore.rules`:
```js
match /sessions/{sessionId} {
  allow create: if isAuthenticated() && request.resource.data.studentId == request.auth.uid;
}
```
---

---
BUG ID: 2
TITLE: Missing field protection for 'miss_count' in User Profiles
SEVERITY: HIGH
CATEGORY: Security
STATUS: FIXED

DESCRIPTION:
The `update` rule for the `users` collection prevents updates to `role`, `xp`, `level`, and `banned`, but fails to include `miss_count`. This allows students who have missed sessions (approaching the ban threshold of 10) to manually reset their `miss_count` to 0 via the client-side SDK.

STEPS TO REPRODUCE:
1. As a student with `miss_count: 5`, use the console to run `db.collection('users').doc(uid).update({ miss_count: 0 })`.
2. Observe the value updates in Firestore.

EXPECTED BEHAVIOR:
`miss_count` should be a protected field, updatable only by admins or internal server-side logic.

ACTUAL BEHAVIOR:
`miss_count` is not in the `affectedKeys().hasAny([...])` list in `firestore.rules`.

ROOT CAUSE:
Omission of `miss_count` from the list of restricted fields in security rules.

RECOMMENDED FIX:
Add `miss_count` to the restricted list in `firestore.rules` and `src/lib/firestore.js`.
---

---
BUG ID: 3
TITLE: Critical Build Failure: Missing AI Tutor Exports
SEVERITY: CRITICAL
CATEGORY: Other
STATUS: FIXED

DESCRIPTION:
`src/pages/AITutorChat.jsx` attempted to import `fetchAiRuntimeConfig` and `generateTutorReply` from `src/lib/aiTutor.js`, but these functions were not exported (or didn't exist in the expected format), causing `npm run build` to fail.

ROOT CAUSE:
Logic mismatch between frontend components and the library file.

FIX APPLIED:
Implemented and exported `fetchAiRuntimeConfig` and `generateTutorReply` in `src/lib/aiTutor.js`, aligning them with the unified server-side handler format.
---

---
BUG ID: 4
TITLE: Performance Bottleneck: Missing Pagination in Mentor Discovery
SEVERITY: MEDIUM
CATEGORY: Performance
STATUS: OPEN

DESCRIPTION:
The `/find-mentors` page performs a full fetch of all users with the `mentor` role. As the platform grows, this will cause significant latency and high memory usage on the client.

STEPS TO REPRODUCE:
1. Navigate to `/find-mentors`.
2. Observe network tab fetching the entire mentor collection.

EXPECTED BEHAVIOR:
Results should be paginated using Firestore `limit()` and `startAfter()` cursors.

ACTUAL BEHAVIOR:
`getAllUsers(where('role', '==', 'mentor'))` is called, which has no limit.

RECOMMENDED FIX:
Implement cursor-based pagination in `src/lib/firestore.js` and update `FindMentors.jsx` to load data in batches.
---

---
BUG ID: 5
TITLE: Logic Duplication: Teaching Protocol Replicated in Client and Server
SEVERITY: LOW
CATEGORY: Logic
STATUS: OPEN

DESCRIPTION:
The `SENJR_PROTOCOL` and `TUTOR_PROMPTS` constants are duplicated in `src/lib/aiTutor.js` and `server/handlers/aiTutor.js`. This leads to inconsistent behavior if one is updated without the other.

EXPECTED BEHAVIOR:
A single source of truth for AI instructions.

RECOMMENDED FIX:
Move AI prompts to a shared configuration file or a Firestore document that both client and server can access.
---
