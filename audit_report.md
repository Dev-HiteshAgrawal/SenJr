# Senjr Security Audit & Bug Reports

## 1. Privilege Escalation via Initial Profile Creation
**Severity:** Critical
**Category:** Security
**Description:** Firestore rules allowed users to set any field (including `role`, `xp`, `level`) during the `create` operation, as only ownership was checked.
**Reproduction Steps:**
1. Authenticate as a new user.
2. Call `setDoc(doc(db, 'users', uid), { role: 'admin', xp: 100000 })`.
3. The user now has administrative privileges.
**Expected Behavior:** Users should only be able to create profiles with default 'student' or 'mentor' roles and 0 stats.
**Actual Behavior:** Users could set arbitrary stats and roles on creation.
**Proposed Fix:** Add validation to `allow create` in `firestore.rules` to enforce default values. (Fixed)

## 2. Insecure Global Storage Read Access
**Severity:** Critical
**Category:** Security
**Description:** `storage.rules` had `allow read: if true;`, exposing all uploaded documents (including mentor verification PDFs) to the public.
**Reproduction Steps:**
1. Upload a sensitive document to Firebase Storage.
2. Access the file URL without being logged in.
**Expected Behavior:** Read access should be restricted to authenticated users or owners.
**Actual Behavior:** Anyone with the URL could read any file.
**Proposed Fix:** Change `allow read` to require authentication and add specific owner/admin rules for sensitive folders. (Fixed)

## 3. Unauthenticated AI Token Consumption
**Severity:** High
**Category:** Security
**Description:** The `/api/ai-tutor` handler did not call `verifyAuth`, allowing unauthenticated requests to consume the project's Gemini/NVIDIA API quota.
**Reproduction Steps:**
1. Send a POST request to `/api/ai-tutor` without an Authorization header.
2. The server processes the request and returns an AI response.
**Expected Behavior:** Only authenticated Senjr users should be able to use the AI tutor.
**Actual Behavior:** API was publicly accessible.
**Proposed Fix:** Add `verifyAuth` check to `aiTutorHandler`. (Fixed)

## 4. Unauthorized Session Creation
**Severity:** High
**Category:** Security / Logic
**Description:** Firestore rules allowed any authenticated user to create a session document with any `mentorId` and `studentId`.
**Reproduction Steps:**
1. Log in as User A.
2. Create a session doc with `studentId: "UserB"`.
**Expected Behavior:** Users should only be able to create sessions where they are the `studentId`.
**Actual Behavior:** No validation on `studentId` during creation.
**Proposed Fix:** Add `request.resource.data.studentId == request.auth.uid` check in `firestore.rules`. (Fixed)

## 5. Arbitrary Mentor Rating Manipulation
**Severity:** Medium
**Category:** Security / Logic
**Description:** Users could create their own `mentors` collection document and set their own `rating` or `verificationStatus`.
**Reproduction Steps:**
1. Log in as a mentor.
2. Call `addDoc(collection(db, 'mentors'), { uid: myUid, rating: 5, verificationStatus: 'verified' })`.
**Expected Behavior:** Sensitive fields like `rating` and `verificationStatus` should only be modifiable by admins or system logic.
**Actual Behavior:** Users had full control over their mentor metadata on creation.
**Proposed Fix:** Restrict sensitive keys in `allow create` and `allow update` for the `mentors` collection. (Fixed)

## 6. Open Redirect in Login Flow
**Severity:** Medium
**Category:** Security
**Description:** `Login.jsx` uses `location.state?.from?.pathname` for redirection after login without validating that the path belongs to the Senjr domain.
**Reproduction Steps:**
1. Navigate to `/login` with a state containing an external or malicious path.
2. Log in.
**Expected Behavior:** Redirect should be validated or restricted to internal routes.
**Actual Behavior:** Redirects blindly to the provided path.
**Proposed Fix:** Implement a whitelist of allowed redirect paths or ensure it's a relative path. (Flagged)

## 7. Build Failure: Missing Exports in aiTutor.js
**Severity:** High
**Category:** Logic
**Description:** The `AITutorChat.jsx` page imported `fetchAiRuntimeConfig` and `generateTutorReply`, but these were not exported from `src/lib/aiTutor.js`.
**Reproduction Steps:**
1. Run `npm run build`.
**Expected Behavior:** Project should compile successfully.
**Actual Behavior:** Build failed due to missing exports.
**Proposed Fix:** Export the required functions from `src/lib/aiTutor.js`. (Fixed)

## 8. Duplicate Key in vercel.json
**Severity:** Low
**Category:** Logic / UI
**Description:** `vercel.json` contained two `headers` keys, which could lead to unpredictable security header behavior.
**Reproduction Steps:**
1. Inspect `vercel.json`.
**Expected Behavior:** Clean, valid JSON configuration.
**Actual Behavior:** Duplicate keys.
**Proposed Fix:** Consolidate `headers` into a single array. (Flagged)
