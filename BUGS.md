# Senjr Bug Reports

## [BUG-001] Insecure Session Creation
- **Severity**: Critical
- **Category**: Security / Unauthorized Access
- **Description**: The Firestore rules for the `sessions` collection allow any authenticated user to create a session document without verifying that they are either the student or the mentor involved. Specifically, it doesn't check if `request.resource.data.studentId == request.auth.uid`.
- **Reproduction**: Authenticate as User A, then perform a Firestore `addDoc` to the `sessions` collection with `studentId` set to User B's ID. The operation succeeds.

## [BUG-002] Privilege Escalation via User Profile Creation
- **Severity**: High
- **Category**: Security / Privilege Escalation
- **Description**: While `update` operations on the `users` collection are protected against modifying sensitive fields (`role`, `xp`, `level`, `banned`), the `create` operation only checks `isOwner(userId)`. This allows a new user to set their role to `admin` or give themselves maximum XP/level during their initial profile setup.
- **Reproduction**: Sign up a new user and call `setDoc` for `users/{userId}` with `{ role: 'admin', xp: 1000000, level: 'Tree' }`.

## [BUG-003] Insecure Homework Creation
- **Severity**: High
- **Category**: Security / Unauthorized Access
- **Description**: The `homework` create rule allows a student to create homework for any other student as long as they are authenticated. `request.resource.data.mentorId == request.auth.uid || request.resource.data.studentId == request.auth.uid`. If User A (student) creates homework with `studentId = User B` and `mentorId = User A`, it will be allowed. User B will see homework they didn't expect, and User A can potentially inject content.
- **Reproduction**: Authenticate as Student A. Create homework with `studentId = Student B` and `mentorId = Student A`. Operation succeeds.

## [BUG-004] Unauthorized Mentor/Student Profile Creation
- **Severity**: High
- **Category**: Security / Data Integrity
- **Description**: Rules for `mentors` and `students` collections allow any authenticated user to create a document with any ID as long as they set the `uid` field to their own UID. This allows a user to create multiple mentor/student profiles or overwrite existing ones if they guess the ID (if they are not using auto-id).
- **Reproduction**: Authenticate as User A. Create multiple documents in `mentors` with different IDs but `uid = User A`.

## [BUG-005] Overly Permissive Storage Read Rules
- **Severity**: Medium
- **Category**: Security / Privacy
- **Description**: `storage.rules` allows `read: if true` for all paths, making all uploaded files (including potential private homework or session recordings) publicly accessible to anyone with the URL, without authentication.
- **Reproduction**: Access any file URL in Firebase Storage without being logged in.

## [BUG-006] Incomplete Auth Flow - Missing Email Verification
- **Severity**: Low
- **Category**: Security / Auth
- **Description**: The current authentication flow does not enforce email verification. Users can sign up and immediately access all features without verifying their email address. This increases the risk of spam accounts and fake profiles.
- **Reproduction**: Sign up with a dummy email and observe that you are redirected to the dashboard immediately.
