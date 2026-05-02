# Senjr Bug Reports - Security & Logic Audit

## [BUG-001] Privilege Escalation via User Creation
**Severity:** Critical
**Category:** Security
**Description:** Firestore security rules allowed any authenticated user to create their own profile in the `users` collection with any `role`, `xp`, `level`, or `banned` status.
**Reproduction Steps:**
1. Authenticate with Firebase.
2. Directly call `setDoc(doc(db, 'users', uid), { role: 'admin', xp: 999999, level: 'Tree', banned: false })`.
**Expected Behavior:** The `create` rule should only allow setting basic profile fields and enforce default values for sensitive fields.
**Actual Behavior:** Users could grant themselves admin rights or high XP.
**Proposed Fix:** Restrict `allow create` in `firestore.rules` to check `request.resource.data` for allowed roles and default values.
**Status:** Fixed

## [BUG-002] Unauthorized Session Creation
**Severity:** High
**Category:** Security
**Description:** Firestore rules for the `sessions` collection allowed any authenticated user to create a session for any studentId/mentorId pair, enabling impersonation or spam.
**Reproduction Steps:**
1. Authenticate as User A.
2. Create a session document where `studentId` is User B and `mentorId` is User C.
**Expected Behavior:** Only the student or mentor involved should be able to create a session document.
**Actual Behavior:** Any logged-in user could create sessions for others.
**Proposed Fix:** Add `request.resource.data.studentId == request.auth.uid || request.resource.data.mentorId == request.auth.uid` to the `create` rule for `sessions`.
**Status:** Fixed

## [BUG-003] Public Storage Access
**Severity:** Medium
**Category:** Security
**Description:** Firebase Storage rules allowed `read` access to `allPaths` for anyone, including unauthenticated users.
**Reproduction Steps:**
1. Access any file URL in the storage bucket without an auth token.
**Expected Behavior:** Only authenticated users should be able to read files (as per memory).
**Actual Behavior:** Files were publicly readable.
**Proposed Fix:** Change `allow read: if true;` to `allow read: if request.auth != null;` in `storage.rules`.
**Status:** Fixed

## [BUG-004] Redundant and Inconsistent LiveKit Token API
**Severity:** Low
**Category:** Logic / Maintenance
**Description:** The project has two implementations for LiveKit token generation: `api/livekit-token.js` and `server/handlers/livekitToken.js`. The `api/` version lacks the more robust error handling and consistency found in the `server/handlers/` version.
**Reproduction Steps:** Compare the two files.
**Expected Behavior:** Unified logic for API endpoints.
**Actual Behavior:** Duplicate logic with slight variations.
**Proposed Fix:** Refactor `api/livekit-token.js` to call the handler in `server/handlers/livekitToken.js`, similar to `ai-tutor.js`.
**Status:** Flagged

## [BUG-005] Missing Email Verification
**Severity:** Medium
**Category:** Security / UX
**Description:** The application allows full access immediately after signup without requiring email verification.
**Reproduction Steps:**
1. Sign up with a fake or unverified email.
2. Gain access to the dashboard.
**Expected Behavior:** Important actions should be restricted until the email is verified.
**Proposed Fix:** Implement email verification check in `ProtectedRoute.jsx` and send verification emails on signup.
**Status:** Flagged

## [BUG-006] Onboarding Bypass
**Severity:** Low
**Category:** Logic / UX
**Description:** Users can bypass the multi-step signup process by manually navigating to `/student-dashboard` or `/mentor-dashboard` after the first auth step.
**Reproduction Steps:**
1. Perform the initial email/password signup.
2. Before completing the profile form, manually enter `/student-dashboard` in the URL.
**Expected Behavior:** Users should be redirected back to the profile setup if it's incomplete.
**Proposed Fix:** Check for `profileSetupComplete` flag in `ProtectedRoute.jsx`.
**Status:** Flagged

## [BUG-007] Lack of Role Verification in MentorSetup
**Severity:** Medium
**Category:** Security / Logic
**Description:** `MentorSetup.jsx` allows any authenticated user to update their profile with mentor-specific fields without checking if their `role` is actually `mentor`.
**Reproduction Steps:**
1. Log in as a 'student'.
2. Navigate to `/mentor-setup` (if route is accessible).
3. Submit the form.
**Expected Behavior:** Only users with `role: 'mentor'` should be allowed to use this setup page.
**Actual Behavior:** Any user can trigger the update.
**Proposed Fix:** Add role check in `MentorSetup.jsx`.
**Status:** Flagged
